# Fails the build only once the SECURITY.md remediation SLA has lapsed, so a newly
# published advisory does not block unrelated pull requests before Renovate has had
# a chance to patch it.  Findings are still reported to the Security tab immediately.
package trivy

import rego.v1

default ignore := false

# Nanoseconds between advisory publication and the build starting to fail.
sla_ns := {
	"CRITICAL": 24 * 3600 * 1000000000,
	"HIGH": 7 * 24 * 3600 * 1000000000,
}

# Undefined for anything without a parseable PublishedDate (misconfigurations,
# secrets, dateless advisories), so those keep failing the build immediately.
ignore if {
	time.now_ns() - time.parse_rfc3339_ns(input.PublishedDate) < sla_ns[input.Severity]
}
