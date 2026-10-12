#!/usr/bin/env bash
# GitHub repository setup: main-branch ruleset, pull request settings and
# private vulnerability reporting, as described in README.md.  The ruleset
# blocks deletion and force-push, and requires a pull request (1 approval,
# resolved threads, squash only), the PR / Analysis / Validate Results checks
# (up to date with main) and CodeQL code scanning at high or higher.  Trivy
# results are reported but deliberately not a merge gate; it fails too often.
#
# Run it with your own `gh` login and admin rights on the repo.  Without --apply
# it checks the setup and exits non-zero if anything differs; --apply makes the
# changes.  Safe to re-run: it only changes what differs, and leaves rules and
# settings it doesn't manage alone.
#
# Usage: scripts/setup-github.sh [--repo OWNER/NAME] [--apply]
set -euo pipefail

# Required checks: the summary job of each workflow that runs on every PR
REQUIRED_CHECKS='["PR Results", "Analysis Results", "Validate Results"]'
CODE_SCANNING_TOOLS='["CodeQL"]'
SETTINGS='{"allow_merge_commit": false, "allow_squash_merge": true, "allow_rebase_merge": false,
  "squash_merge_commit_title": "PR_TITLE",
  "allow_update_branch": true, "allow_auto_merge": true, "delete_branch_on_merge": true}'

APPLY=false
REPO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=true ;;
    --repo) REPO="${2:-}"; shift ;;
    -h|--help) sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
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

CHANGES=0
# status <item> <ok|change> [details]; counts each change
status() {
  if [ "$2" = ok ]; then echo "  $1: ok${3:+ ($3)}"; return; fi
  CHANGES=$((CHANGES + 1))
  if [ "$APPLY" = true ]; then echo "  $1: changed${3:+ ($3)}"
  else echo "  $1: would change${3:+ ($3)}"; fi
}
# Verdict; a preview exits 1 when anything needs changing, so it works as a check
summary() {
  if [ "$APPLY" = true ]; then echo "Done: ${CHANGES} changed."
  elif [ "$CHANGES" -eq 0 ]; then echo "All set: nothing to change."
  else echo "${CHANGES} to change; re-run with --apply to make these changes."; exit 1; fi
}

# 1. Ruleset on the default branch; actor_id 5 (Repository admin) may bypass
#    only by merging a pull request
desired="$(jq -n --argjson checks "$REQUIRED_CHECKS" --argjson tools "$CODE_SCANNING_TOOLS" '{
  name: "main", target: "branch", enforcement: "active",
  conditions: {ref_name: {include: ["~DEFAULT_BRANCH"], exclude: []}},
  bypass_actors: [{actor_id: 5, actor_type: "RepositoryRole", bypass_mode: "pull_request"}],
  rules: [{type: "deletion"}, {type: "non_fast_forward"},
    {type: "pull_request", parameters: {required_approving_review_count: 1, required_review_thread_resolution: true,
      dismiss_stale_reviews_on_push: false, require_code_owner_review: false, require_last_push_approval: false,
      allowed_merge_methods: ["squash"]}},
    {type: "required_status_checks", parameters: {strict_required_status_checks_policy: true,
      required_status_checks: ($checks | map({context: ., integration_id: 15368}))}},
    {type: "code_scanning", parameters: {code_scanning_tools:
      ($tools | map({tool: ., security_alerts_threshold: "high_or_higher", alerts_threshold: "errors"}))}}]}')"
# integration_id 15368 is GitHub Actions, so only workflow jobs satisfy the checks
# Only the fields managed here, in a comparable order
NORMALIZE='def rule: if .type == "pull_request" then {type, parameters: (.parameters | {required_approving_review_count,
      required_review_thread_resolution, dismiss_stale_reviews_on_push, require_code_owner_review, require_last_push_approval,
      allowed_merge_methods: (.allowed_merge_methods // [] | sort)})}
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
  # Keep rule types, rule parameters and bypass actors not managed here
  planned="$(jq -n --argjson d "$desired" --argjson c "$current" '($d.rules | map(.type)) as $m
    | ([$c.rules[]? | {(.type): (.parameters // {})}] | add // {}) as $cp | $d
    | .rules |= map(if .parameters then .parameters = ($cp[.type] // {}) + .parameters else . end)
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
summary
