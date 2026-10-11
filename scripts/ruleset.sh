#!/usr/bin/env bash
# Create or update the default-branch ruleset described in README.md
# (Repository Configuration > Branch Protection Rules).
#
# Run it yourself, under your own login, with admin rights on the repo.
# Dry run by default: prints the planned change and changes nothing.
#
# Usage: scripts/ruleset.sh [--apply] [OWNER/REPO]
#   --apply     create or update the ruleset
#   OWNER/REPO  defaults to the repo of the current directory
#
# Safe to re-run: it only writes when something differs.  Rule types this
# script doesn't manage (e.g. Copilot review) and extra bypass actors are kept.
# Edit the settings below to suit your team.
set -euo pipefail

RULESET_NAME="main"
APPROVALS=1
REQUIRED_CHECKS='["Analysis Results", "PR Results", "Validate Results"]'
CODE_SCANNING_TOOLS='["CodeQL", "Trivy"]'

APPLY=false
REPO=""
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=true ;;
    -h|--help) sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*) echo "Unknown option: $arg" >&2; exit 1 ;;
    *) REPO="$arg" ;;
  esac
done
[ -n "$REPO" ] || REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"

# Desired ruleset; actor_id 5 is the Repository admin role, which may bypass
# only by merging a pull request, never by pushing directly
desired="$(jq -n \
  --arg name "$RULESET_NAME" \
  --argjson approvals "$APPROVALS" \
  --argjson checks "$REQUIRED_CHECKS" \
  --argjson tools "$CODE_SCANNING_TOOLS" '{
  name: $name,
  target: "branch",
  enforcement: "active",
  conditions: {ref_name: {include: ["~DEFAULT_BRANCH"], exclude: []}},
  bypass_actors: [{actor_id: 5, actor_type: "RepositoryRole", bypass_mode: "pull_request"}],
  rules: [
    {type: "deletion"},
    {type: "required_linear_history"},
    {type: "non_fast_forward"},
    {type: "pull_request", parameters: {
      required_approving_review_count: $approvals,
      required_review_thread_resolution: true,
      dismiss_stale_reviews_on_push: false,
      require_code_owner_review: false,
      require_last_push_approval: false}},
    {type: "required_status_checks", parameters: {
      strict_required_status_checks_policy: true,
      required_status_checks: ($checks | map({context: .}))}},
    {type: "code_scanning", parameters: {
      code_scanning_tools: ($tools | map({tool: ., security_alerts_threshold: "high_or_higher", alerts_threshold: "errors"}))}}
  ]}')"

# Comparable view of a ruleset: only the fields this script manages
NORMALIZE='
  def rule:
    if .type == "pull_request" then {type, parameters: (.parameters | {required_approving_review_count,
      required_review_thread_resolution, dismiss_stale_reviews_on_push, require_code_owner_review,
      require_last_push_approval})}
    elif .type == "required_status_checks" then {type, parameters: {
      strict_required_status_checks_policy: .parameters.strict_required_status_checks_policy,
      required_status_checks: ([.parameters.required_status_checks[].context] | sort)}}
    elif .type == "code_scanning" then {type, parameters: {
      code_scanning_tools: (.parameters.code_scanning_tools | map({tool, security_alerts_threshold, alerts_threshold}) | sort_by(.tool))}}
    else {type} end;
  {name, target, enforcement,
   conditions: {ref_name: {include: (.conditions.ref_name.include | sort), exclude: (.conditions.ref_name.exclude | sort)}},
   bypass_actors: ([.bypass_actors[]? | {actor_id, actor_type, bypass_mode}] | sort_by(.actor_type, .actor_id)),
   rules: ([.rules[]? | rule] | sort_by(.type))}'

id="$(gh api "repos/${REPO}/rulesets" --jq ".[] | select(.name == \"${RULESET_NAME}\" and .target == \"branch\") | .id" | head -n1)"

if [ -z "$id" ]; then
  echo "Ruleset '${RULESET_NAME}' not found on ${REPO}; planned ruleset:"
  jq . <<< "$desired"
  if [ "$APPLY" = true ]; then
    gh api -X POST "repos/${REPO}/rulesets" --input - <<< "$desired" > /dev/null
    echo "Created ruleset '${RULESET_NAME}'."
  else
    echo "Dry run: nothing changed.  Re-run with --apply to create it."
  fi
  exit 0
fi

current="$(gh api "repos/${REPO}/rulesets/${id}")"

# Keep rule types and bypass actors this script doesn't manage
planned="$(jq -n --argjson d "$desired" --argjson c "$current" '
  ($d.rules | map(.type)) as $managed
  | ($d.bypass_actors | map("\(.actor_type)/\(.actor_id)")) as $ours
  | $d
  | .rules += [$c.rules[]? | select(.type as $t | $managed | index($t) | not)]
  | .bypass_actors += [$c.bypass_actors[]? | select("\(.actor_type)/\(.actor_id)" as $k | $ours | index($k) | not)
                      | {actor_id, actor_type, bypass_mode}]')"

if diff_out="$(diff -u --label "current (${REPO})" --label planned \
  <(jq -S "$NORMALIZE" <<< "$current") <(jq -S "$NORMALIZE" <<< "$planned"))"; then
  echo "Ruleset '${RULESET_NAME}' on ${REPO} already matches.  No changes."
  exit 0
fi

echo "Ruleset '${RULESET_NAME}' (id ${id}) on ${REPO} differs:"
echo "$diff_out"
if [ "$APPLY" = true ]; then
  gh api -X PUT "repos/${REPO}/rulesets/${id}" --input - <<< "$planned" > /dev/null
  echo "Updated ruleset '${RULESET_NAME}'."
else
  echo "Dry run: nothing changed.  Re-run with --apply to update it."
fi
