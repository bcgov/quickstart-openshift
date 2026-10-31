# Spike #2928: self-signed vanity TLS on the PR deploy

**Test only, not for merge.** Intent: prove that a self-signed certificate on a
PR-scoped Route can serve the vanity host `quickstart.nrs.gov.bc.ca` from the PR
frontend in the dev namespace (`vars.OC_NAMESPACE`), without touching prod or
the `route-tls.yml` workflow.

## How it works

- `pr-open.yml` job `vanity` runs after `deploys` (only when deploys triggered)
  and gates `PR Results`.
- `scripts/tls-canary-cert.sh` mints a throwaway CA + leaf (7 days) for the
  vanity host; the CA key is deleted immediately, the private key is masked and
  never echoed.
- `bcgov/actions-openshift/route-tls` (v0.6.0) applies Route
  `quickstart-openshift-<PR>-vanity` → Service `quickstart-openshift-<PR>-frontend`
  with `dry_run: false`. It fails if another Route already claims the host.
- `pr-close.yml` job `vanity` deletes that Route when the PR closes (label
  cleanup does not match it).

## Verify

- `curl -vk https://quickstart.nrs.gov.bc.ca` reaches the PR frontend and shows
  the self-signed issuer `quickstart TLS canary CA (#2928)`.
- Without `-k`, the browser/curl warns (expected: untrusted CA).

## Caveats

- Requires DNS for the host to resolve to the Silver router; otherwise only
  `curl --resolve` testing works.
- Only one Route may hold the host; a second open PR (or prod route) will fail.
