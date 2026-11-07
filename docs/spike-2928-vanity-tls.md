# Spike #2928: roll-our-own vanity TLS (ACME HTTP-01) on the PR deploy

**Test only, not for merge.** Intent: prove we can get a public ACME certificate
for `quickstart.nrs.gov.bc.ca` from inside a GitHub Actions job, with no Service
Desk ticket and no Entrust order, then apply it with
`bcgov/actions-openshift/route-tls`. The reusable action will land in
[bcgov/actions-openshift#153](https://github.com/bcgov/actions-openshift/issues/153).

Step 1 (done, earlier commits): a self-signed cert proved the Route path works;
browsers reject the CA, so we need a public ACME CA.

## How it works (plain version)

Let's Encrypt asks "prove you own this name" by fetching
`http://quickstart.nrs.gov.bc.ca/.well-known/acme-challenge/<token>`.
For a few minutes we answer that URL from our own namespace, then tear it down.

1. `pr-open.yml` job `vanity` runs after `deploys`.
2. `bcgov/actions-openshift/acme-http01`, pinned to the head of
   [bcgov/actions-openshift#155](https://github.com/bcgov/actions-openshift/pull/155),
   creates a lego Pod, Service, NetworkPolicy and a plain-HTTP, **path-based**
   Route, gets the certificate, then deletes everything it created.
3. `route-tls` (v0.6.0) applies Route `quickstart-openshift-<PR>-vanity` →
   frontend with those PEMs.
4. `pr-close.yml` deletes the vanity Route and any objects labelled
   `app.kubernetes.io/managed-by=acme-http01`.

## Result

Proven on 2026-11-07: `acme-http01` issued a production Let's Encrypt certificate
and `route-tls` applied it, so `curl https://quickstart.nrs.gov.bc.ca` verifies
without `-k`. It expires 2027-02-05 and nothing renews it yet. The `vanity` job is
now off so later pushes can't replace it; closing this PR deletes the Route.

## Staging vs prod

- The canary uses **Let's Encrypt staging**
  (`https://acme-staging-v02.api.letsencrypt.org/directory`): generous rate
  limits, but the issuer is a fake root ("(STAGING) ..."), so browsers still warn.
- Prod = set `acme_server: production` on the action.
  Only after staging is green; prod rate limits are 5 duplicate certs/week.

## Verify

- Job log shows `ACME_OK` and the `openssl x509` line with a `(STAGING)` issuer.
- `curl -vk https://quickstart.nrs.gov.bc.ca` → issuer `(STAGING) ...`
  (without `-k` curl fails: expected for staging).

## Renewal story (why this scales as validity shrinks)

Same job on a schedule (or on an `nr-cert-monitor` warning): new challenge,
new PEMs, `route-tls` apply. No humans, no DNS change, as long as the host's
DNS already points at Silver. Limits: one hostname per cert; wildcards
(`*.nrs.gov.bc.ca`) need DNS-01 and therefore DNS write access once.

## What could block it

- Silver/ingress refusing plain HTTP on the path route, or the host already
  claimed by a Route in another namespace (shows in the Route status line).
- Egress from the namespace to `acme-staging-v02.api.letsencrypt.org`.
- Docker Hub pull limits for `goacme/lego`.
