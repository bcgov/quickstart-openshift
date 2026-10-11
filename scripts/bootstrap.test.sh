#!/usr/bin/env bash
# ponytail: fake gh/oc only. A run against a real cluster is the upgrade path.
set -euo pipefail

root=$(cd "$(dirname "$0")/.." && pwd)
script=$root/scripts/bootstrap.sh
state=$(mktemp -d)
log=$state/log
mkdir -p "$state/bin"
trap 'rm -rf "$state"' EXIT

cat >"$state/bin/gh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "gh $*" >>"$BOOTSTRAP_FAKE_LOG"
cmd=$1
sub=${2:-}
env_from_args() {
  local prev="" arg
  for arg in "$@"; do
    if [[ "$prev" == "--env" ]]; then
      printf '%s' "$arg"
      return
    fi
    prev=$arg
  done
}
if [[ "$cmd" == "auth" ]]; then
  exit 0
fi
if [[ "$cmd" == "repo" ]]; then
  printf '%s\n' "example/app"
  exit 0
fi
if [[ "$cmd" == "api" ]]; then
  local_env=""
  for arg in "$@"; do
    if [[ "$arg" == repos/*/environments/* ]]; then
      local_env=${arg##*/}
    fi
  done
  if [[ "$*" == *"--input -"* ]]; then
    cat >"$BOOTSTRAP_FAKE_STATE/body-$local_env"
  fi
  if [[ "$*" == *"--method PUT"* ]]; then
    : >"$BOOTSTRAP_FAKE_STATE/env-$local_env"
    printf '%s\n' "$local_env"
    exit 0
  fi
  if [[ -f "$BOOTSTRAP_FAKE_STATE/env-$local_env" ]]; then
    printf '%s\n' "$local_env"
    exit 0
  fi
  printf '%s\n' "gh: Not Found (HTTP 404)" >&2
  exit 1
fi
if [[ "$cmd" == "secret" && "$sub" == "list" ]]; then
  where=$(env_from_args "$@")
  if [[ -n "$where" && ! -f "$BOOTSTRAP_FAKE_STATE/env-$where" ]]; then
    printf '%s\n' "gh: Not Found (HTTP 404)" >&2
    exit 1
  fi
  [[ -n "$where" ]] || where=repository
  if [[ -f "$BOOTSTRAP_FAKE_STATE/secrets-$where" ]]; then
    cat "$BOOTSTRAP_FAKE_STATE/secrets-$where"
  fi
  exit 0
fi
if [[ "$cmd" == "secret" && "$sub" == "set" ]]; then
  name=$3
  where=$(env_from_args "$@")
  if [[ -n "$where" && ! -f "$BOOTSTRAP_FAKE_STATE/env-$where" ]]; then
    printf '%s\n' "gh: Not Found (HTTP 404)" >&2
    exit 1
  fi
  [[ -n "$where" ]] || where=repository
  bytes=$(wc -c | awk '{print $1}')
  printf '%s\n' "stdin_bytes=${bytes} secret=${where}/${name}" >>"$BOOTSTRAP_FAKE_LOG"
  [[ "$bytes" -gt 0 ]]
  printf '%s\n' "$name" >>"$BOOTSTRAP_FAKE_STATE/secrets-$where"
  exit 0
fi
printf 'unexpected gh: %s\n' "$*" >&2
exit 1
EOF

cat >"$state/bin/oc" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "oc $*" >>"$BOOTSTRAP_FAKE_LOG"
ns_from_args() {
  local prev="" arg
  for arg in "$@"; do
    if [[ "$prev" == "-n" ]]; then
      printf '%s' "$arg"
      return
    fi
    prev=$arg
  done
}
cmd=$1
sub=${2:-}
if [[ "$cmd" == "whoami" ]]; then
  printf '%s\n' "tester"
  exit 0
fi
if [[ "$cmd" == "get" && "$sub" == "project" ]]; then
  case "$3" in
    abc-dev|abc-test|abc-prod) exit 0 ;;
    *) exit 1 ;;
  esac
fi
ns=$(ns_from_args "$@")
if [[ "$cmd" == "get" && "$sub" == "sa" ]]; then
  [[ -f "$BOOTSTRAP_FAKE_STATE/sa-$ns" ]]
  exit 0
fi
if [[ "$cmd" == "create" && "$sub" == "sa" ]]; then
  : >"$BOOTSTRAP_FAKE_STATE/sa-$ns"
  exit 0
fi
if [[ "$cmd" == "get" && "$sub" == "rolebinding" ]]; then
  [[ -f "$BOOTSTRAP_FAKE_STATE/rb-$ns" ]]
  exit 0
fi
if [[ "$cmd" == "create" && "$sub" == "rolebinding" ]]; then
  : >"$BOOTSTRAP_FAKE_STATE/rb-$ns"
  exit 0
fi
if [[ "$cmd" == "create" && "$sub" == "token" ]]; then
  printf '%s\n' "TOKEN-VALUE-${ns}"
  exit 0
fi
printf 'unexpected oc: %s\n' "$*" >&2
exit 1
EOF

chmod +x "$state/bin/gh" "$state/bin/oc" "$script"

export BOOTSTRAP_FAKE_LOG=$log
export BOOTSTRAP_FAKE_STATE=$state
export PATH="$state/bin:$PATH"

fail() {
  printf 'fail: %s\n' "$*" >&2
  exit 1
}

assert_fail() {
  local output
  if output=$("$@" 2>&1); then
    fail "expected failure: $*"
  fi
  [[ -n "$output" ]] || fail "expected an error message: $*"
}

assert_fail "$script"
assert_fail "$script" --dev-namespace abc-dev --test-namespace abc-dev --prod-namespace abc-prod
assert_fail "$script" --dev-namespace 'Bad_Name' --test-namespace abc-test --prod-namespace abc-prod
assert_fail "$script" --dev-namespace --apply --test-namespace abc-test --prod-namespace abc-prod
assert_fail "$script" --dev-namespace gone-ns --test-namespace abc-test --prod-namespace abc-prod

: >"$log"
dry=$( "$script" --dev-namespace abc-dev --test-namespace abc-test --prod-namespace abc-prod )
printf '%s\n' "$dry" | grep -Fq "create GitHub environment test with no required reviewers"
printf '%s\n' "$dry" | grep -Fq "create serviceaccount abc-prod/${SA_NAME:-github-actions}"
printf '%s\n' "$dry" | grep -Fq "create token abc-dev/github-actions duration 87600h"
printf '%s\n' "$dry" | grep -Fq "set secret repository/oc_namespace"
printf '%s\n' "$dry" | grep -Fq "set secret test/db_password"
printf '%s\n' "$dry" | grep -Fq "generate secret prod/db_password"
if grep -Eq 'secret set|--method PUT|oc create' "$log"; then
  fail "dry-run mutated resources"
fi
if printf '%s\n' "$dry" | grep -Fq "TOKEN-VALUE"; then
  fail "dry-run printed a token"
fi

: >"$log"
applied=$( "$script" --apply --dev-namespace abc-dev --test-namespace abc-test --prod-namespace abc-prod )
printf '%s\n' "$applied" | grep -Fq "create GitHub environment prod with no required reviewers"
grep -Fq "gh api --method PUT repos/example/app/environments/test --input - --jq .name" "$log"
grep -Fq "gh api --method PUT repos/example/app/environments/prod --input - --jq .name" "$log"
grep -Fq "oc create sa github-actions -n abc-dev" "$log"
grep -Fq "oc create rolebinding github-actions-edit --clusterrole=edit --serviceaccount=abc-test:github-actions -n abc-test" "$log"
grep -Fq "oc create token github-actions --duration=87600h -n abc-prod" "$log"
grep -Fq "stdin_bytes=" "$log"
grep -Fq "secret=repository/oc_token" "$log"
grep -Fq "secret=test/oc_namespace" "$log"
grep -Fq "secret=prod/db_password" "$log"
if printf '%s\n' "$applied" | grep -Fq "TOKEN-VALUE"; then
  fail "apply printed a token"
fi
grep -q '"reviewers":\[\]' "$state/body-test"
grep -q '"deployment_branch_policy":null' "$state/body-prod"
while IFS= read -r line; do
  if [[ "$line" == stdin_bytes=* ]]; then
    bytes=${line#stdin_bytes=}
    bytes=${bytes%% *}
    [[ "$bytes" -gt 0 ]] || fail "empty secret body"
  fi
done <"$log"

: >"$log"
again=$( "$script" --apply --dev-namespace abc-dev --test-namespace abc-test --prod-namespace abc-prod )
printf '%s\n' "$again" | grep -Fq "keep GitHub environment test"
printf '%s\n' "$again" | grep -Fq "keep serviceaccount abc-dev/github-actions"
printf '%s\n' "$again" | grep -Fq "keep secret prod/db_password"
if grep -Eq 'secret set|--method PUT|oc create' "$log"; then
  fail "second apply mutated resources"
fi

printf '%s\n' "ok"
