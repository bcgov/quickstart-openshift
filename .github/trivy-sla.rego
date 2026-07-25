# Fails main and scheduled runs only once the SECURITY.md remediation SLA has lapsed,
# so a newly published advisory is reported without turning the repository red before
# Renovate has had a chance to patch it.
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
