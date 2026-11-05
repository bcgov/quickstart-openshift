#!/usr/bin/env bash
# Spike #2928 / bcgov/actions-openshift#153: Let's Encrypt HTTP-01 from inside the namespace.
# Needs a logged-in `oc` (run via oc-runner). Runs lego in a short-lived Pod, exposes it on
#   http://<host>/.well-known/acme-challenge/  via a path-based Route, then copies PEMs out.
# Output (for route-tls): $OUT/leaf.pem, $OUT/key.pem, $OUT/ca.pem. Always cleans up.
# Usage: NAME=<prefix> OUT=<dir> scripts/acme-http01-canary.sh <host> <email> [acme_server]
set -euo pipefail
HOST="${1:?host}"
EMAIL="${2:?email}"
SERVER="${3:-https://acme-staging-v02.api.letsencrypt.org/directory}"
NAME="${NAME:?NAME prefix}-acme"
OUT="${OUT:?OUT dir}"
LEGO_IMAGE="${LEGO_IMAGE:-docker.io/goacme/lego:v4.21.0}"
mkdir -p "$OUT" && chmod 700 "$OUT"

cleanup() {
  oc delete pod,service,route,networkpolicy -l "acme-canary=${NAME}" --ignore-not-found --wait=false || true
}
trap cleanup EXIT
cleanup

oc apply -f - <<YAML
apiVersion: v1
kind: List
items:
  - apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata: { name: ${NAME}, labels: { acme-canary: ${NAME} } }
    spec:
      podSelector: { matchLabels: { acme-canary: ${NAME} } }
      ingress:
        - from:
            - namespaceSelector: { matchLabels: { network.openshift.io/policy-group: ingress } }
      policyTypes: [Ingress]
  - apiVersion: v1
    kind: Pod
    metadata: { name: ${NAME}, labels: { acme-canary: ${NAME} } }
    spec:
      restartPolicy: Never
      activeDeadlineSeconds: 900
      containers:
        - name: lego
          image: ${LEGO_IMAGE}
          workingDir: /tmp
          command: ["/bin/sh", "-c"]
          args:
            - >-
              sleep 20 &&
              /lego --accept-tos --email "${EMAIL}" --server "${SERVER}"
              --path /tmp/lego --domains "${HOST}" --http --http.port :8080 run
              && echo ACME_OK && sleep 600
              || { echo ACME_FAILED; sleep 120; exit 1; }
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { cpu: 10m, memory: 32Mi }
            limits: { memory: 128Mi }
  - apiVersion: v1
    kind: Service
    metadata: { name: ${NAME}, labels: { acme-canary: ${NAME} } }
    spec:
      selector: { acme-canary: ${NAME} }
      ports: [{ port: 8080, targetPort: 8080 }]
  - apiVersion: route.openshift.io/v1
    kind: Route
    metadata: { name: ${NAME}, labels: { acme-canary: ${NAME} } }
    spec:
      host: ${HOST}
      path: /.well-known/acme-challenge
      to: { kind: Service, name: ${NAME} }
      port: { targetPort: 8080 }
YAML

# Route admission (fails fast if another namespace owns the host)
sleep 5
oc get route "${NAME}" -o jsonpath='{range .status.ingress[*]}{.routerName}: {.conditions[0].type}={.conditions[0].status} {.conditions[0].reason}{"\n"}{end}'
oc wait --for=condition=Ready "pod/${NAME}" --timeout=180s

for _ in $(seq 1 60); do
  LOGS="$(oc logs "${NAME}" 2>/dev/null || true)"
  grep -q ACME_OK <<<"$LOGS" && break
  if grep -q ACME_FAILED <<<"$LOGS"; then echo "$LOGS"; echo "::error::ACME HTTP-01 failed (see lego log above)"; exit 1; fi
  sleep 5
done
echo "$(oc logs "${NAME}")" | grep -v -i "private" || true
grep -q ACME_OK <<<"$(oc logs "${NAME}")" || { echo "::error::ACME timed out"; exit 1; }

oc exec "${NAME}" -- cat "/tmp/lego/certificates/${HOST}.key" > "$OUT/key.pem"
oc exec "${NAME}" -- cat "/tmp/lego/certificates/${HOST}.crt" > "$OUT/bundle.pem"
oc exec "${NAME}" -- cat "/tmp/lego/certificates/${HOST}.issuer.crt" > "$OUT/ca.pem"
# Leaf = first cert in the bundle
awk '/BEGIN CERTIFICATE/{n++} n==1' "$OUT/bundle.pem" > "$OUT/leaf.pem"
rm -f "$OUT/bundle.pem"
openssl x509 -in "$OUT/leaf.pem" -noout -subject -issuer -enddate -ext subjectAltName
echo "Wrote $OUT/{leaf.pem,key.pem,ca.pem}"
