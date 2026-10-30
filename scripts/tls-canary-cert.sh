#!/usr/bin/env bash
# Mint a short-lived personal test CA + leaf for a vanity host (issue #2928 canary).
# Output is shaped for route-tls: leaf.pem, key.pem, ca.pem. Nothing is uploaded.
# Usage: scripts/tls-canary-cert.sh [hostname] [days]
set -euo pipefail
HOST="${1:-quickstart.nrs.gov.bc.ca}"
DAYS="${2:-30}"
OUT="${OUT:-./tls-canary}"
mkdir -p "$OUT" && chmod 700 "$OUT" && cd "$OUT"

openssl req -x509 -newkey rsa:2048 -nodes -days "$((DAYS + 1))" \
  -keyout ca-key.pem -out ca.pem -subj "/CN=quickstart TLS canary CA (#2928)" \
  -addext "basicConstraints=critical,CA:TRUE" -addext "keyUsage=critical,keyCertSign,cRLSign"
openssl req -newkey rsa:2048 -nodes -keyout key.pem -out leaf.csr -subj "/CN=${HOST}"
openssl x509 -req -in leaf.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -days "$DAYS" \
  -out leaf.pem -extfile <(printf 'subjectAltName=DNS:%s\nextendedKeyUsage=serverAuth\nbasicConstraints=CA:FALSE\n' "$HOST")
rm -f leaf.csr ca.srl ca-key.pem   # CA key discarded: this CA can never sign again

openssl verify -CAfile ca.pem leaf.pem
openssl x509 -in leaf.pem -noout -subject -issuer -enddate -ext subjectAltName
echo "Wrote $(pwd)/{leaf.pem,key.pem,ca.pem}"
