#!/bin/bash
# set -eux
# recipients="derek.roberts@gmail.com"
# subject="Test"
# from="derek.roberts@gov.bc.ca"
# /usr/sbin/sendmail -t "$recipients" <<EOF
# subject:$subject
# from:$from

# Example Message
# EOF


subject="mail subject"
body="Hello World"
from="derek.roberts@gmail.com"
to="derek.roberts@gmail.com"
echo -e "Subject:${subject}\n${body}" | sendmail -f "${from}" -t "${to}"
