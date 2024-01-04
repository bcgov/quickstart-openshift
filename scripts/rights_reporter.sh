#!/bin/bash
set -euo pipefail

# This script reports on rights in OpenShift projects

# Get the current user's projects
PROJECTS=$(oc projects | grep -v "*" | grep -E "^ +.*-.*(.*)$")

# Upstream accounts to exclude
EXCLUDES="admin|legacy-access-github|ministry-viewer|openshift-pipelines-edit|platform-services-controlled-admin|platform-services-controlled-helper|admin-[0-9]*|edit-[0-9]*"

# Loop through the projects and report on rights
for p in $(echo "${PROJECTS}" | awk '{print $1}'); do
  echo -e "\n---\n\nProject: $p"
  echo -e "Name: $(echo "${PROJECTS}" | grep $p | awk -F" - " '{print $2}')\n"
  oc get rolebindings -n $p | sort | grep -Ev "^(${EXCLUDES}) " | grep -E "ClusterRole/(admin|edit|view)" || echo "Insufficient rights for $p"
done
