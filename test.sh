#!/bin/bash
set -eux
# recipients="derek.roberts@gmail.com"
# subject="Test"
# from="derek.roberts@gov.bc.ca"
# /usr/sbin/sendmail -t "$recipients" <<EOF
# subject:$subject
# from:$from

# Example Message
# EOF


# subject="mail subject"
# body="Hello World"
# from="derek.roberts@gov.bc.ca"
# to="derek.roberts@gov.bc.ca"
# echo -e "Subject:${subject}\n${body}" | sendmail -f "${from}" -t "${to}"


# curl --url 'smtps://apps.smtp.gov.bc.ca:25' --ssl-reqd \
#   --mail-from 'derek.roberts@gmail.com' --mail-rcpt 'derek.roberts@gmail.com' \
#   --upload-file mail.txt --user 'derek.roberts@gmail.com:your-accout-password'

curl --url 'smtps://apps.smtp.extest.gov.bc.ca:25' --ssl-reqd \
  --mail-from 'derek.roberts@gmail.com' --mail-rcpt 'derek.roberts@gmail.com' \
  --upload-file mail.txt --user 'derek.roberts@gmail.com:your-accout-password'
