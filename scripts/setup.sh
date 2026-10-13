#!/usr/bin/env bash
# Runs setup-github.sh, setup-openshift.sh and setup-environments.sh in order,
# passing each the options it takes.  Without --apply it previews: every
# script checks the setup and the combined result exits non-zero if anything
# differs.  With --apply it stops at the first script that fails.
#
# Usage: scripts/setup.sh [--plate abc123] [--reviewers alice,org/team] [--repo OWNER/NAME] [--apply]
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APPLY=() PLATE=() REVIEWERS=() REPO=()
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=(--apply) ;;
    --plate) PLATE=(--plate "${2:-}"); shift ;;
    --reviewers) REVIEWERS=(--reviewers "${2:-}"); shift ;;
    --repo) REPO=(--repo "${2:-}"); shift ;;
    -h|--help) sed -n '2,7p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
  shift
done

failed=0
run() {
  local script="$1"; shift
  echo "== ${script}"
  if ! "${DIR}/${script}" "$@"; then
    [ ${#APPLY[@]} -eq 0 ] || { echo "${script} failed; stopping." >&2; exit 1; }
    failed=$((failed + 1))
  fi
  echo
}
run setup-github.sh "${REPO[@]}" "${APPLY[@]}"
run setup-openshift.sh "${PLATE[@]}" "${APPLY[@]}"
run setup-environments.sh "${PLATE[@]}" "${REVIEWERS[@]}" "${REPO[@]}" "${APPLY[@]}"

if [ "$failed" -eq 0 ]; then
  echo "All set: every script passed."
else
  echo "${failed} of 3 scripts reported changes or errors; see above."
  exit 1
fi
