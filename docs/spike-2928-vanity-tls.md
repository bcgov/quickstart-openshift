# Spike: non-Entrust TLS on a vanity route (#2928)

Canary for `quickstart.nrs.gov.bc.ca`. The question: can a team put **its own** (non-Entrust) certificate on an OpenShift vanity route, and could that become self-serve?

## Findings so far (2026-10-30, read-only probes)

| Probe | Result |
| --- | --- |
| DNS `quickstart.nrs.gov.bc.ca` | A `142.34.194.118` (no CNAME, TTL 300). No CAA on the host, `nrs.gov.bc.ca`, or `gov.bc.ca`, so DNS policy *allows* any public CA. |
| `https://` today | Serves the default `*.apps.silver.devops.gov.bc.ca` Entrust wildcard, so no vanity route or cert is applied yet. |
| `http://…/.well-known/acme-challenge/x` | `500` from `Server: Pingora`. An edge proxy sits in front of the host, so HTTP-01 can't reach the app yet. |
| `route-tls` (actions-openshift v0.6.0) | CA-agnostic: it checks key match, expiry, chain order (`openssl verify`), and CN/SAN. A private CA chain passes (checked locally with `scripts/tls-canary-cert.sh`). |

## Options

1. **Let's Encrypt HTTP-01**: blocked until the vanity route exists and the edge forwards `/.well-known/acme-challenge/` on port 80. Retest after option 3 lands the route.
2. **Let's Encrypt / other ACME DNS-01**: needs write access to the `nrs.gov.bc.ca` zone, or a `_acme-challenge` CNAME delegated to a zone we control. That's an SD/DNS-team ask; a namespace can't do it.
3. **Personal test CA (this PR)**: proves the route + `route-tls` path with no outside dependencies. Browsers will warn (untrusted CA). That's expected, and it's the signal that *our* cert is live.
4. **`bcgov/cert-manager-proxy`**: experimental, DNS-01 only, and needs cluster-scoped cert-manager + approver-policy + a DNS webhook. A tenant namespace can't use it without platform admin. Revisit once the DNS question in option 2 is answered.

## How to run the canary (Derek, by hand)

```bash
scripts/tls-canary-cert.sh quickstart.nrs.gov.bc.ca 30      # writes ./tls-canary/{leaf,key,ca}.pem
gh secret set TLS_CANARY_CERTIFICATE    --env prod --repo bcgov/quickstart-openshift < tls-canary/leaf.pem
gh secret set TLS_CANARY_PRIVATE_KEY    --env prod --repo bcgov/quickstart-openshift < tls-canary/key.pem
gh secret set TLS_CANARY_CA_CERTIFICATE --env prod --repo bcgov/quickstart-openshift < tls-canary/ca.pem
rm -rf tls-canary
gh variable list --env prod --repo bcgov/quickstart-openshift | grep ROUTE_HOST   # must be quickstart.nrs.gov.bc.ca
gh workflow run route-tls.yml --repo bcgov/quickstart-openshift --ref feat/vanity-cert-canary -f cert_set=canary -f dry_run=true
gh workflow run route-tls.yml --repo bcgov/quickstart-openshift --ref feat/vanity-cert-canary -f cert_set=canary -f dry_run=false
echo | openssl s_client -connect quickstart.nrs.gov.bc.ca:443 -servername quickstart.nrs.gov.bc.ca 2>/dev/null | openssl x509 -noout -issuer -enddate
```

**Success:** the issuer is `CN=quickstart TLS canary CA (#2928)`. **Failure modes to record:** the dry run fails (a route-tls rule), the apply is refused (namespace RBAC or route admission), or the edge (`Pingora`) terminates TLS itself so the route cert is never served. After that, try HTTP-01 with `certbot certonly --manual` against the now-live route.

Rollback: re-run with `cert_set=entrust`, or `oc -n <prod-namespace> delete route quickstart-openshift-vanity-url`. route-tls archives the previous cert in a backup Secret.

## Notes for a reusable actions-openshift pattern

- `route-tls` already works with any CA. The only Entrust coupling is the wording in its input descriptions and hints.
- The missing piece is **issuance + renewal**, not install: a scheduled `acme-cert` step (lego/certbot, DNS-01 through a delegated `_acme-challenge` CNAME) that passes PEMs straight into `route-tls`. That avoids keeping 90-day PEMs as GitHub secrets.
- Pair it with `bcgov/nr-cert-monitor` / `cert-expiry.yml` to trigger renewal when fewer than 30 days remain.
- The in-cluster alternative is cert-manager (+ `cert-manager-proxy`), which needs the platform team to own it.
