#!/usr/bin/env bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <path_to_certificate.pem> <path_to_private_key.key>"
  echo "Example: $0 ./fom.nrs.gov.bc.ca.pem ./fom.nrs.gov.bc.ca.key"
  exit 1
fi

CERT_FILE="$1"
KEY_FILE="$2"

if [ ! -f "$CERT_FILE" ]; then
  echo "ERROR: Certificate file '$CERT_FILE' not found!"
  exit 1
fi

if [ ! -f "$KEY_FILE" ]; then
  echo "ERROR: Private key file '$KEY_FILE' not found!"
  exit 1
fi

echo "Validating mathematically bound RSA key pair..."

# Extract the modulus from both files
CERT_MOD=$(openssl x509 -noout -modulus -in "$CERT_FILE" 2>/dev/null | cut -d'=' -f2)
KEY_MOD=$(openssl rsa -noout -modulus -in "$KEY_FILE" 2>/dev/null | cut -d'=' -f2)

if [ -z "$CERT_MOD" ]; then
  echo "ERROR: Could not parse modulus from certificate '$CERT_FILE'. Is it a valid PEM file?"
  exit 1
fi

if [ -z "$KEY_MOD" ]; then
  echo "ERROR: Could not parse modulus from private key '$KEY_FILE'. Is it a valid RSA private key?"
  exit 1
fi

if [ "$CERT_MOD" == "$KEY_MOD" ]; then
  echo "SUCCESS: The certificate and private key mathematically match. You are safe to deploy."
  exit 0
else
  echo "ERROR: Cryptographic mismatch! The certificate and private key DO NOT mathematically match."
  exit 1
fi
