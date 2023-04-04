#!/bin/bash
set -eux
recipients="derek.roberts@gmail.com"
subject="Test"
from="derek.roberts@gov.bc.ca"
/usr/sbin/sendmail -t "$recipients" <<EOF
subject:$subject
from:$from

Example Message
EOF
