#!/usr/bin/env bash
# GitHub environments, secrets and variables for the deploy workflows:
#   repository (pull requests): OC_NAMESPACE=<plate>-dev, OC_TOKEN, DB_PASSWORD; variable OC_SERVER
#   test: OC_NAMESPACE=<plate>-test, OC_TOKEN, DB_PASSWORD
#   prod: OC_NAMESPACE=<plate>-prod, OC_TOKEN, DB_PASSWORD; required reviewers from --reviewers
# OC_TOKEN is piped from the `github-actions-token` Secret made by setup-openshift.sh
# straight into `gh secret set`; secret values are never printed or saved.
# DB_PASSWORD is generated, different for each environment.
#
# Uses your own `gh` (repo admin) and `oc` logins.  Preview by default; --apply
# makes the changes.  Safe to re-run: secrets that are already set are never
# overwritten (GitHub can't show them), so a database keeps its password.
#
# Usage: scripts/setup-environments.sh [--plate abc123] [--reviewers user,org/team] [--repo OWNER/NAME] [--apply]
set -euo pipefail

APPLY=false
PLATE=""
REVIEWERS=""
REPO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=true ;;
    --plate) PLATE="${2:-}"; shift ;;
    --reviewers) REVIEWERS="${2:-}"; shift ;;
    --repo) REPO="${2:-}"; shift ;;
    -h|--help) sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done
[ -n "$PLATE" ] || read -rp "Licence plate (e.g. abc123): " PLATE
[[ "$PLATE" =~ ^[a-z0-9]+$ ]] || { echo "Invalid licence plate: '${PLATE}'" >&2; exit 1; }
[ -n "$REPO" ] || REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
if [ "$(gh api "repos/${REPO}" --jq .permissions.admin)" != true ]; then
  echo "You need admin rights on ${REPO} to manage environments and secrets; ask a repo admin to run this." >&2
  exit 1
fi
if ! oc whoami >/dev/null 2>&1; then
  echo "Not logged in to OpenShift; run the login command from the console first." >&2
  exit 1
fi
SERVER="$(oc whoami --show-server)"
echo "Repository: ${REPO}, OpenShift: ${SERVER}"

# status <item> <ok|change> [details]
status() {
  if [ "$2" = ok ]; then echo "  $1: ok${3:+ ($3)}"
  elif [ "$APPLY" = true ]; then echo "  $1: changed${3:+ ($3)}"
  else echo "  $1: would change${3:+ ($3)}"; fi
}

has_secret() { # <scope> <name>
  local args=(); [ "$1" = repo ] || args=(--env "$1")
  gh secret list -R "$REPO" "${args[@]}" --json name --jq '.[].name' 2>/dev/null | grep -qx "$2"
}
namespace() { if [ "$1" = repo ]; then echo "${PLATE}-dev"; else echo "${PLATE}-$1"; fi; }

# Tokens come from setup-openshift.sh; check before changing anything
for scope in repo test prod; do
  ns="$(namespace "$scope")"
  if ! has_secret "$scope" OC_TOKEN && ! oc get secret github-actions-token -n "$ns" >/dev/null 2>&1; then
    echo "No github-actions-token Secret in ${ns} (or no access to it); run scripts/setup-openshift.sh --apply first." >&2
    exit 1
  fi
done

# 1. Environments, with PROD reviewers when given
reviewer_ids() {
  local r
  for r in ${REVIEWERS//,/ }; do
    if [[ "$r" == */* ]]; then
      gh api "orgs/${r%%/*}/teams/${r#*/}" --jq '{type: "Team", id}'
    else
      gh api "users/${r}" --jq '{type: "User", id}'
    fi
  done | jq -sc 'sort_by(.type, .id)'
}
wanted="$( [ -z "$REVIEWERS" ] || reviewer_ids )"
for env in test prod; do
  if ! current="$(gh api "repos/${REPO}/environments/${env}" 2>/dev/null)"; then
    body='{}'
    [ "$env" = prod ] && [ -n "$wanted" ] && body="$(jq -nc --argjson r "$wanted" '{reviewers: $r}')"
    status "environment ${env}" change "create$([ "$body" = '{}' ] || echo ", reviewers ${REVIEWERS}")"
    [ "$APPLY" = false ] || gh api -X PUT "repos/${REPO}/environments/${env}" --input - <<< "$body" >/dev/null
  elif [ "$env" = prod ] && [ -n "$wanted" ]; then
    have="$(jq -c '[.protection_rules[] | select(.type == "required_reviewers") | .reviewers[]
      | {type, id: .reviewer.id}] | sort_by(.type, .id)' <<< "$current")"
    if [ "$have" = "$wanted" ]; then
      status "environment prod reviewers" ok
    else
      status "environment prod reviewers" change "set to ${REVIEWERS}"
      # Keep the existing wait timer and deployment branch policy
      body="$(jq -c --argjson r "$wanted" '{reviewers: $r, deployment_branch_policy,
        wait_timer: ([.protection_rules[] | select(.type == "wait_timer") | .wait_timer][0] // 0)}' <<< "$current")"
      [ "$APPLY" = false ] || gh api -X PUT "repos/${REPO}/environments/prod" --input - <<< "$body" >/dev/null
    fi
  else
    status "environment ${env}" ok
  fi
done
[ -n "$REVIEWERS" ] || echo "  environment prod reviewers: skipped (no --reviewers given; PROD deploys won't wait for approval)"

# 2. Secrets (only when missing) and the OC_SERVER variable
#
# Secret values are never printed, kept in variables or written to disk: each
# one is piped from its source (oc, openssl) straight into `gh secret set` on
# stdin, which stops on any failure (pipefail).  Previews name the secret only.  Don't add `set -x` here.
# secret <scope: repo|test|prod> <name> <namespace>
secret() {
  local scope="$1" name="$2" ns="$3" args=()
  [ "$scope" = repo ] || args=(--env "$scope")
  if has_secret "$scope" "$name"; then
    echo "  ${name} for ${scope}: ok (already set)"
    return
  fi
  if [ "$APPLY" = false ]; then
    echo "  ${name} for ${scope}: would set"
    return
  fi
  # Count the token's bytes only, so an empty one fails before anything is set
  if [ "$name" = OC_TOKEN ] && [ "$(oc get secret github-actions-token -n "$ns" -o jsonpath='{.data.token}' | wc -c)" -eq 0 ]; then
    echo "  ${name} for ${scope}: the token Secret in ${ns} has no token yet; re-run shortly" >&2
    exit 1
  fi
  case "$name" in
    OC_NAMESPACE) printf '%s' "$ns" ;;
    OC_TOKEN) oc get secret github-actions-token -n "$ns" -o jsonpath='{.data.token}' | base64 -d ;;
    DB_PASSWORD) openssl rand -hex 16 ;;
  esac | gh secret set "$name" -R "$REPO" "${args[@]}" >/dev/null
  echo "  ${name} for ${scope}: set"
}
for scope in repo test prod; do
  ns="$(namespace "$scope")"
  for name in OC_NAMESPACE OC_TOKEN DB_PASSWORD; do secret "$scope" "$name" "$ns"; done
done
have="$(gh variable get OC_SERVER -R "$REPO" 2>/dev/null || true)"
if [ "$have" = "$SERVER" ]; then
  status "OC_SERVER variable for repo" ok
else
  status "OC_SERVER variable for repo" change "${have:-unset} -> ${SERVER}"
  [ "$APPLY" = false ] || gh variable set OC_SERVER -R "$REPO" --body "$SERVER" >/dev/null
fi
[ "$APPLY" = true ] || echo "Preview only; re-run with --apply to make these changes."
