#!/bin/bash
set -euo pipefail

# This script reports on rights in OpenShift projects
echo -e "OpenShift users for projects accessible to $(oc whoami)"

# Projects available to the current user
PROJECTS=$(oc projects | sed "s/\*/ /g" | grep -E "^ +.*-.*(.*)$")

# Roles to report on, can be overridden with a quoted parameter
ROLES=${1:-"admin edit view"}

# Loop through the projects and report on rights
for p in $(echo "${PROJECTS}" | awk '{print $1}'); do
  echo -e "\n---\n\nProject: $p"
  echo -e "Name: $(echo "${PROJECTS}" | grep $p | awk -F" - " '{print $2}')"

  # Report on requested roles, where possible
  if oc get rolebindings -n $p &> /dev/null; then
    for role in ${ROLES}; do
      echo -e "\n${role}:"
      oc get rolebindings -n $p -o json \
        | jq -r '.items[] | select(.subjects[].kind=="User", .roleRef.name=="${role}") | .subjects[].name' \
        | sort | uniq | sed "s/^/  /g"
    done
  else
    echo -e "\nInsufficient rights"
  fi
done
echo -e "\n---\n"
