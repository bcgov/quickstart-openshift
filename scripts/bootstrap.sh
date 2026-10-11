#!/usr/bin/env bash
# Fill GitHub Actions deploy secrets for this template.
# Prints the plan. Pass --apply to create what is missing.
# Does not print secret values.
set -euo pipefail

TOKEN_DURATION=87600h
SA_NAME=github-actions
BINDING_NAME=github-actions-edit

usage() {
  cat <<'EOF'
Usage: scripts/bootstrap.sh --dev-namespace NAME --test-namespace NAME --prod-namespace NAME [--apply]

Creates the test and prod GitHub environments with no required reviewers.
For each OpenShift namespace, creates the github-actions service account,
an edit rolebinding, and a token when the matching GitHub secret is unset.

Secret targets:
  dev namespace  -> repository secrets (pull requests)
  test namespace -> environment test
  prod namespace -> environment prod

Secrets written: oc_namespace, oc_token, db_password.
db_password is generated separately for each target.

The current oc login must be able to see all three namespaces.
The current gh login must be able to admin the repository of this checkout.

Without --apply, prints the plan and changes nothing.
An environment that already exists is not modified.
A secret that already exists is not replaced. Delete it first to set a new value.
EOF
}

die() {
  printf 'bootstrap: %s\n' "$*" >&2
  exit 1
}

need() {
  command -v "$1" >/dev/null 2>&1 || die "$1 is not installed"
}

require_value() {
  local flag=$1
  local value=${2:-}
  [[ -n "$value" && "$value" != --* ]] || die "${flag} requires a value"
}

valid_namespace() {
  local name=$1
  [[ "$name" =~ ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$ && ${#name} -le 63 ]] || die "invalid namespace: ${name}"
}

APPLY=0
DEV_NS=
TEST_NS=
PROD_NS=

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply)
      APPLY=1
      shift
      ;;
    --dev-namespace)
      require_value "$1" "${2:-}"
      DEV_NS=$2
      shift 2
      ;;
    --test-namespace)
      require_value "$1" "${2:-}"
      TEST_NS=$2
      shift 2
      ;;
    --prod-namespace)
      require_value "$1" "${2:-}"
      PROD_NS=$2
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1"
      ;;
  esac
done

[[ -n "$DEV_NS" && -n "$TEST_NS" && -n "$PROD_NS" ]] || {
  usage >&2
  die "namespace flags are required"
}
valid_namespace "$DEV_NS"
valid_namespace "$TEST_NS"
valid_namespace "$PROD_NS"
[[ "$DEV_NS" != "$TEST_NS" && "$DEV_NS" != "$PROD_NS" && "$TEST_NS" != "$PROD_NS" ]] || die "namespaces must be distinct"

need gh
need oc
need openssl

gh auth status >/dev/null || die "gh is not authenticated"
oc whoami >/dev/null || die "oc is not authenticated"

REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
[[ -n "$REPO" ]] || die "could not resolve the repository; run this from a checkout"

say() {
  printf '%s\n' "$*"
}

list_secrets() {
  local env_name=${1:-}
  if [[ -n "$env_name" ]]; then
    # A missing environment has no secrets. Listing them 404s, which would
    # abort a dry run before the environment is created.
    if ! environment_exists "$env_name"; then
      return 0
    fi
    gh secret list --repo "$REPO" --env "$env_name" --app actions --json name --jq '.[].name'
    return
  fi
  gh secret list --repo "$REPO" --app actions --json name --jq '.[].name'
}

has_secret() {
  local name=$1
  local env_name=${2:-}
  local where=$3
  local names
  if ! names=$(list_secrets "$env_name"); then
    die "could not list secrets for ${where}"
  fi
  printf '%s\n' "$names" | grep -Fxq "$name"
}

environment_exists() {
  local name=$1
  local err_file out
  err_file=$(mktemp)
  if out=$(gh api "repos/${REPO}/environments/${name}" --jq .name 2>"$err_file"); then
    rm -f "$err_file"
    [[ "$out" == "$name" ]] || die "unexpected response for environment ${name}"
    return 0
  fi
  if grep -q -e '404' -e 'Not Found' "$err_file"; then
    rm -f "$err_file"
    return 1
  fi
  rm -f "$err_file"
  die "could not read environment ${name}"
}

ensure_environment() {
  local name=$1
  local created
  if environment_exists "$name"; then
    say "keep GitHub environment ${name}"
    return
  fi
  say "create GitHub environment ${name} with no required reviewers"
  [[ "$APPLY" -eq 1 ]] || return 0
  if ! created=$(printf '%s' '{"wait_timer":0,"prevent_self_review":false,"reviewers":[],"deployment_branch_policy":null}' | gh api --method PUT "repos/${REPO}/environments/${name}" --input - --jq .name); then
    die "could not create GitHub environment ${name}"
  fi
  [[ "$created" == "$name" ]] || die "could not create GitHub environment ${name}"
}

resource_missing() {
  if "$@" >/dev/null 2>&1; then
    return 1
  fi
  return 0
}

ensure_serviceaccount() {
  local ns=$1
  if resource_missing oc get sa "$SA_NAME" -n "$ns"; then
    say "create serviceaccount ${ns}/${SA_NAME}"
    if [[ "$APPLY" -eq 1 ]]; then
      oc create sa "$SA_NAME" -n "$ns" >/dev/null
    fi
    return
  fi
  say "keep serviceaccount ${ns}/${SA_NAME}"
}

ensure_binding() {
  local ns=$1
  if resource_missing oc get rolebinding "$BINDING_NAME" -n "$ns"; then
    say "create rolebinding ${ns}/${BINDING_NAME}"
    if [[ "$APPLY" -eq 1 ]]; then
      oc create rolebinding "$BINDING_NAME" \
        --clusterrole=edit \
        --serviceaccount="${ns}:${SA_NAME}" \
        -n "$ns" >/dev/null
    fi
    return
  fi
  say "keep rolebinding ${ns}/${BINDING_NAME}"
}

set_secret() {
  local where=$1
  local name=$2
  local value=$3
  local env_name=${4:-}
  say "set secret ${where}/${name}"
  [[ "$APPLY" -eq 1 ]] || return 0
  [[ -n "$value" ]] || die "refusing to set an empty ${name}"
  if [[ -n "$env_name" ]]; then
    printf '%s' "$value" | gh secret set "$name" --repo "$REPO" --env "$env_name" --app actions >/dev/null
    return
  fi
  printf '%s' "$value" | gh secret set "$name" --repo "$REPO" --app actions >/dev/null
}

generate_password() {
  local password hash
  password=$(openssl rand -base64 24 | tr -d '\n')
  [[ ${#password} -ge 12 ]] || die "generated db_password is too short"
  hash=$(printf '%s' "$password" | openssl dgst -sha256 | awk '{print $NF}')
  if [[ -n "${PASSWORD_HASHES:-}" && "$PASSWORD_HASHES" == *"$hash"* ]]; then
    die "generated db_password values were not distinct"
  fi
  PASSWORD_HASHES="${PASSWORD_HASHES:-}${hash}"$'\n'
  GENERATED_PASSWORD=$password
}

provision() {
  local where=$1
  local ns=$2
  local env_name=$3
  if ! oc get project "$ns" >/dev/null 2>&1; then
    die "oc cannot see project ${ns}"
  fi
  ensure_serviceaccount "$ns"
  ensure_binding "$ns"

  local token=""
  if has_secret oc_token "$env_name" "$where"; then
    say "keep secret ${where}/oc_token"
  else
    say "create token ${ns}/${SA_NAME} duration ${TOKEN_DURATION}"
    if [[ "$APPLY" -eq 1 ]]; then
      token=$(oc create token "$SA_NAME" --duration="$TOKEN_DURATION" -n "$ns")
      [[ -n "$token" ]] || die "oc create token returned an empty token for ${ns}"
    fi
    set_secret "$where" oc_token "$token" "$env_name"
  fi

  if has_secret oc_namespace "$env_name" "$where"; then
    say "keep secret ${where}/oc_namespace"
  else
    set_secret "$where" oc_namespace "$ns" "$env_name"
  fi

  if has_secret db_password "$env_name" "$where"; then
    say "keep secret ${where}/db_password"
  else
    say "generate secret ${where}/db_password"
    if [[ "$APPLY" -eq 1 ]]; then
      generate_password
      set_secret "$where" db_password "$GENERATED_PASSWORD" "$env_name"
      unset GENERATED_PASSWORD
    else
      set_secret "$where" db_password "" "$env_name"
    fi
  fi
}

PASSWORD_HASHES=""

ensure_environment test
ensure_environment prod
provision repository "$DEV_NS" ""
provision test "$TEST_NS" test
provision prod "$PROD_NS" prod
