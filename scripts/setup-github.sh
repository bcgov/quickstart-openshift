#!/usr/bin/env bash
# GitHub repository setup: main-branch ruleset, pull request settings and
# private vulnerability reporting, as described in README.md.
#
# Run it with your own `gh` login and admin rights on the repo.  Preview by
# default; --apply makes the changes.  Safe to re-run: it only changes what
# differs, and leaves rules and settings it doesn't manage alone.
#
# Usage: scripts/setup-github.sh [--repo OWNER/NAME] [--apply]
set -euo pipefail

# Required checks: the summary job of each workflow that runs on every PR
REQUIRED_CHECKS='["PR Results", "Analysis Results", "Validate Results"]'
CODE_SCANNING_TOOLS='["CodeQL", "Trivy"]'
SETTINGS='{"allow_merge_commit": false, "allow_squash_merge": true, "allow_rebase_merge": false,
  "squash_merge_commit_title": "PR_TITLE",
  "allow_update_branch": true, "allow_auto_merge": false, "delete_branch_on_merge": true}'

APPLY=false
REPO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=true ;;
    --repo) REPO="${2:-}"; shift ;;
    -h|--help) sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done
[ -n "$REPO" ] || REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
if [ "$(gh api "repos/${REPO}" --jq .permissions.admin)" != true ]; then
  echo "You need admin rights on ${REPO} to change its settings; ask a repo admin to run this." >&2
  exit 1
fi
echo "Repository: ${REPO}"

# status <item> <ok|change> [details]
status() {
  if [ "$2" = ok ]; then echo "  $1: ok"
  elif [ "$APPLY" = true ]; then echo "  $1: changed${3:+ ($3)}"
  else echo "  $1: would change${3:+ ($3)}"; fi
}

# 1. Ruleset on the default branch; actor_id 5 (Repository admin) may bypass
#    only by merging a pull request
desired="$(jq -n --argjson checks "$REQUIRED_CHECKS" --argjson tools "$CODE_SCANNING_TOOLS" '{
  name: "main", target: "branch", enforcement: "active",
  conditions: {ref_name: {include: ["~DEFAULT_BRANCH"], exclude: []}},
  bypass_actors: [{actor_id: 5, actor_type: "RepositoryRole", bypass_mode: "pull_request"}],
  rules: [{type: "deletion"}, {type: "required_linear_history"}, {type: "non_fast_forward"},
    {type: "pull_request", parameters: {required_approving_review_count: 1, required_review_thread_resolution: true,
      dismiss_stale_reviews_on_push: false, require_code_owner_review: false, require_last_push_approval: false}},
    {type: "required_status_checks", parameters: {strict_required_status_checks_policy: true,
      required_status_checks: ($checks | map({context: .}))}},
    {type: "code_scanning", parameters: {code_scanning_tools:
      ($tools | map({tool: ., security_alerts_threshold: "high_or_higher", alerts_threshold: "errors"}))}}]}')"
# Only the fields managed here, in a comparable order
NORMALIZE='def rule: if .type == "pull_request" then {type, parameters: (.parameters | {required_approving_review_count,
      required_review_thread_resolution, dismiss_stale_reviews_on_push, require_code_owner_review, require_last_push_approval})}
    elif .type == "required_status_checks" then {type, parameters: {strict: .parameters.strict_required_status_checks_policy,
      checks: ([.parameters.required_status_checks[].context] | sort)}}
    elif .type == "code_scanning" then {type, tools: (.parameters.code_scanning_tools | map({tool, security_alerts_threshold, alerts_threshold}) | sort_by(.tool))}
    else {type} end;
  {enforcement, include: .conditions.ref_name.include, bypass: ([.bypass_actors[]? | {actor_id, actor_type, bypass_mode}] | sort_by(.actor_id)),
   rules: ([.rules[]? | rule] | sort_by(.type))}'
id="$(gh api "repos/${REPO}/rulesets" --jq '.[] | select(.name == "main" and .target == "branch") | .id' | head -n1)"
if [ -z "$id" ]; then
  status ruleset change "create 'main'"
  [ "$APPLY" = false ] || gh api -X POST "repos/${REPO}/rulesets" --input - <<< "$desired" >/dev/null
else
  current="$(gh api "repos/${REPO}/rulesets/${id}")"
  # Keep rule types and bypass actors not managed here
  planned="$(jq -n --argjson d "$desired" --argjson c "$current" '($d.rules | map(.type)) as $m | $d
    | .rules += [$c.rules[]? | select(.type as $t | $m | index($t) | not)]
    | .bypass_actors += [$c.bypass_actors[]? | select(.actor_id != 5) | {actor_id, actor_type, bypass_mode}]')"
  changes="$(jq -rn --argjson c "$(jq "$NORMALIZE" <<< "$current")" --argjson p "$(jq "$NORMALIZE" <<< "$planned")" '
    ($c.rules | map({(.type): .}) | add // {}) as $cr | ($p.rules | map({(.type): .}) | add // {}) as $pr
    | [($p | del(.rules) | to_entries[] | select($c[.key] != .value) | .key),
       ($pr | to_entries[] | select($cr[.key] == null) | "add \(.key)"),
       ($pr | to_entries[] | select($cr[.key] != null and $cr[.key] != .value) | "change \(.key)")] | join(", ")')"
  if [ -z "$changes" ]; then
    status ruleset ok
  else
    status ruleset change "$changes"
    [ "$APPLY" = false ] || gh api -X PUT "repos/${REPO}/rulesets/${id}" --input - <<< "$planned" >/dev/null
  fi
fi

# 2. Pull request settings
changes="$(gh api "repos/${REPO}" | jq -r --argjson s "$SETTINGS" \
  '. as $c | $s | to_entries | map(select($c[.key] != .value) | "\(.key): \($c[.key]) -> \(.value)") | join(", ")')"
if [ -z "$changes" ]; then
  status "pull request settings" ok
else
  status "pull request settings" change "$changes"
  [ "$APPLY" = false ] || gh api -X PATCH "repos/${REPO}" --input - <<< "$SETTINGS" >/dev/null
fi

# 3. Private vulnerability reporting (SECURITY.md points reporters to it)
if [ "$(gh api "repos/${REPO}/private-vulnerability-reporting" --jq .enabled)" = true ]; then
  status "private vulnerability reporting" ok
else
  status "private vulnerability reporting" change "enable"
  [ "$APPLY" = false ] || gh api -X PUT "repos/${REPO}/private-vulnerability-reporting" >/dev/null
fi
[ "$APPLY" = true ] || echo "Preview only; re-run with --apply to make these changes."
