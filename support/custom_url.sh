#!/bin/sh
set -euo nounset

# Custom Domain Helper
#
# Usage: ./custom_url.sh [optional: DOMAIN]

# Sorry, internal! - https://apps.nrs.gov.bc.ca/int/confluence/display/DEVGUILD/Generating+a+CSR
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent


### Get inputs

# Vanity URL (DOMAIN)
if [[ -z "${1:-}" ]]; then
  echo "Enter the fully qualified domain name (FQDN) name for the certificate:"
  read DOMAIN
else
  DOMAIN="${1}"
fi
echo -e "\nDomain: ${DOMAIN}"

# Default subject
SUBJECT="/C=CA/ST=British Columbia/L=Victoria/O=Government of the Province of British Columbia/CN=${DOMAIN}"
echo -e "\nSubject: $SUBJECT"

# Accept or create a new subject
echo "Accept subject? (y/n)"
read ACCEPT
if [[ "${ACCEPT^}" != "Y" ]]; then
  echo "Subject: " && read SUBJECT
fi

# Generate the key and csr
openssl req -new -newkey rsa:2048 -nodes -keyout ${DOMAIN}.key -out ${DOMAIN}.csr -subj "${SUBJECT}"
echo -e "The following have been created:"
ls -l ${DOMAIN}.{csr,key}

echo ""
echo "BC Gov Natural Resources Only!  ---"
echo ""
echo "Create a JIRA issue:"
echo ""
echo "- Project: Service Desk (SD)"
echo "- Issue Type: Service Request"
echo "- Title: SSL Certificate Request for ${DOMAIN}"
echo "- Summary: SSL Certificate Request for ${DOMAIN}"
echo "- Component/s: Other - N/A - Not Applicable"
echo "- Assignee: NRIDS Infrastructure and Middle Tier WLRS:EX"
echo "- Teams Involved: Tier 3 - Infrastructure"
echo "- Description: "
echo "  Please create an SSL certificate for: ${DOMAIN}"
echo ""
echo "  iStore billing codes ---"
echo "  - Client:"
echo "  - Responsibility:"
echo "  - Service Line:"
echo "  - Project:"
echo "  - Expense Authority:"
echo ""
echo "- Attach the newly generated CSR file only"

# Open JIRA - optional
echo -e "\nWould you like to be redirected to Natural Resources JIRA? (y/n)"
read ACCEPT
if [[ "${ACCEPT^}" == "Y" ]]; then
  xdg-open 'https://apps.nrs.gov.bc.ca/int/jira/secure/CreateIssue!default.jspa'
fi
