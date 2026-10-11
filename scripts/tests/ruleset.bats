#!/usr/bin/env bats
# scripts/ruleset.sh against a stubbed gh: no network, no repo changes

setup() {
  SCRIPT="${BATS_TEST_DIRNAME}/../ruleset.sh"
  STUB="${BATS_TEST_TMPDIR}/bin"
  mkdir -p "$STUB"
  export GH_LOG="${BATS_TEST_TMPDIR}/gh.log"
  export LIST="${BATS_TEST_TMPDIR}/list.json"
  export DETAIL="${BATS_TEST_TMPDIR}/detail.json"
  : > "$GH_LOG"
  echo '[]' > "$LIST"
  # Fake gh: logs each call, answers GETs from the fixture files
  cat > "${STUB}/gh" <<'STUB'
#!/usr/bin/env bash
echo "$*" >> "$GH_LOG"
case "$*" in
  "repo view"*) echo "bcgov/example" ;;
  "api -X POST"*|"api -X PUT"*) cat > "${GH_LOG}.body"; echo '{}' ;;
  *"/rulesets --jq"*) jq -r "${*: -1}" "$LIST" ;;
  *"/rulesets/"*) cat "$DETAIL" ;;
  *) echo "unexpected gh call: $*" >&2; exit 1 ;;
esac
STUB
  chmod +x "${STUB}/gh"
  export PATH="${STUB}:${PATH}"
}

no_writes() {
  if grep -qE -- '-X (POST|PUT)' "$GH_LOG"; then
    echo "unexpected write: $(cat "$GH_LOG")"
    return 1
  fi
}

# The ruleset this script plans, plus a Copilot rule it doesn't manage
matching_ruleset() {
  echo '[{"id": 42, "name": "main", "target": "branch"}]' > "$LIST"
  cat > "$DETAIL" <<'JSON'
{"id": 42, "name": "main", "target": "branch", "enforcement": "active",
 "conditions": {"ref_name": {"include": ["~DEFAULT_BRANCH"], "exclude": []}},
 "bypass_actors": [{"actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "pull_request"}],
 "rules": [
  {"type": "copilot_code_review", "parameters": {"review_on_push": false}},
  {"type": "non_fast_forward"}, {"type": "deletion"}, {"type": "required_linear_history"},
  {"type": "pull_request", "parameters": {"required_approving_review_count": 1,
   "required_review_thread_resolution": true, "dismiss_stale_reviews_on_push": false,
   "require_code_owner_review": false, "require_last_push_approval": false,
   "allowed_merge_methods": ["squash"]}},
  {"type": "required_status_checks", "parameters": {"strict_required_status_checks_policy": true,
   "required_status_checks": [{"context": "Validate Results", "integration_id": 15368},
    {"context": "Analysis Results", "integration_id": 15368}, {"context": "PR Results", "integration_id": 15368}]}},
  {"type": "code_scanning", "parameters": {"code_scanning_tools": [
   {"tool": "Trivy", "security_alerts_threshold": "high_or_higher", "alerts_threshold": "errors"},
   {"tool": "CodeQL", "security_alerts_threshold": "high_or_higher", "alerts_threshold": "errors"}]}}
 ]}
JSON
}

@test "dry run with no ruleset plans a create and writes nothing" {
  run "$SCRIPT" bcgov/example
  [ "$status" -eq 0 ]
  [[ "$output" == *"not found on bcgov/example"* ]]
  [[ "$output" == *"Dry run: nothing changed"* ]]
  no_writes
}

@test "--apply with no ruleset creates it" {
  run "$SCRIPT" --apply bcgov/example
  [ "$status" -eq 0 ]
  [[ "$output" == *"Created ruleset 'main'."* ]]
  grep -q -- '-X POST repos/bcgov/example/rulesets' "$GH_LOG"
  jq -e '.name == "main" and (.rules | length) == 6' "${GH_LOG}.body"
}

@test "a matching ruleset reports no changes, even with --apply" {
  matching_ruleset
  run "$SCRIPT" --apply bcgov/example
  [ "$status" -eq 0 ]
  [[ "$output" == *"already matches.  No changes."* ]]
  no_writes
}

@test "a differing ruleset shows the diff and changes nothing on a dry run" {
  matching_ruleset
  jq '.rules |= map(select(.type != "deletion"))' "$DETAIL" > "${DETAIL}.tmp" && mv "${DETAIL}.tmp" "$DETAIL"
  run "$SCRIPT" bcgov/example
  [ "$status" -eq 0 ]
  [[ "$output" == *'+      "type": "deletion"'* ]]
  [[ "$output" == *"Dry run: nothing changed"* ]]
  no_writes
}

@test "--apply updates a differing ruleset and keeps unmanaged rules" {
  matching_ruleset
  jq '.rules |= map(if .type == "pull_request" then .parameters.required_approving_review_count = 0 else . end)' \
    "$DETAIL" > "${DETAIL}.tmp" && mv "${DETAIL}.tmp" "$DETAIL"
  run "$SCRIPT" --apply bcgov/example
  [ "$status" -eq 0 ]
  [[ "$output" == *"Updated ruleset 'main'."* ]]
  grep -q -- '-X PUT repos/bcgov/example/rulesets/42' "$GH_LOG"
  jq -e '.rules | map(.type) | index("copilot_code_review")' "${GH_LOG}.body"
  jq -e '.rules[] | select(.type == "pull_request") | .parameters.required_approving_review_count == 1' "${GH_LOG}.body"
}

@test "unknown options fail" {
  run "$SCRIPT" --force
  [ "$status" -eq 1 ]
  [[ "$output" == *"Unknown option: --force"* ]]
}
