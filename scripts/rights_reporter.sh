#!/bin/bash
set -euo pipefail

# This script reports on rights in OpenShift projects
echo -e "OpenShift users for projects accessible to $(oc whoami)\n"

# Get the current user's projects
PROJECTS=$(oc projects | grep -v "*" | grep -E "^ +.*-.*(.*)$")
ROLES="admin edit view"

# Upstream accounts to exclude
EXCLUDES="admin|legacy-access-github|ministry-viewer|openshift-pipelines-edit|platform-services-controlled-admin|platform-services-controlled-helper|admin-[0-9]*|edit-[0-9]*"

# Loop through the projects and report on rights
for p in $(echo "${PROJECTS}" | awk '{print $1}'); do
  echo -e "---\n\nProject: $p"
  echo -e "Name: $(echo "${PROJECTS}" | grep $p | awk -F" - " '{print $2}')\n"

  oc get rolebindings -n $p > /dev/null || continue
  for role in ${ROLES}; do
    echo -e "${role}:"
    oc get rolebindings -n $p -o json | jq -r '.items[] | select(.subjects[].kind=="User", .roleRef.name=="${role}") | .subjects[].name' | sort | uniq | sed "s/^/  /g" || echo "Insufficient rights for $p"
    echo
  done
done
