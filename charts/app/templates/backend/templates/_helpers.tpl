{{/*
Expand the name of the chart.
*/}}
{{- define "backend.name" -}}
{{- printf "backend" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "backend.fullname" -}}
{{- $componentName := include "backend.name" .  }}
{{- if .Values.backend.fullnameOverride }}
{{- .Values.backend.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $componentName | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "backend.labels" -}}
{{ include "backend.selectorLabels" . }}
{{- if .Values.global.tag }}
app.kubernetes.io/image-version: {{ .Values.global.tag | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/short-name: {{ include "backend.name" . }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "backend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


{{/*
Vault Sideloader Annotations
*/}}
{{- define "backend.vaultAnnotations" -}}
{{- if and .Values.backend.vault .Values.backend.vault.enabled }}
# 1. Vault injector configuration goes here, inside the template.
vault.hashicorp.com/agent-inject: 'true'
vault.hashicorp.com/agent-inject-token: 'true'
vault.hashicorp.com/agent-pre-populate-only: 'true' # this makes sure the secret vault will only change during pod restart
vault.hashicorp.com/auth-path: auth/k8s-silver  # This was tricky.  Be sure to use k8s-silver, k8s-gold, or k8s-golddr
vault.hashicorp.com/namespace: platform-services
vault.hashicorp.com/role: {{tpl .Values.backend.vault.role .}}  # licenseplate-nonprod or licenseplate-prod are your options
{{- if .Values.backend.vault.resources }}
vault.hashicorp.com/agent-requests-cpu: {{.Values.backend.vault.resources.requests.cpu }}
vault.hashicorp.com/agent-limits-cpu: {{.Values.backend.vault.resources.limits.cpu }}
vault.hashicorp.com/agent-requests-mem: {{.Values.backend.vault.resources.requests.memory }}
vault.hashicorp.com/agent-limits-mem: {{.Values.backend.vault.resources.limits.memory }}
{{- end }}

# Configure how to retrieve and populate the secrets from Vault:
# - The name of the secret is any unique string after vault.hashicorp.com/agent-inject-secret-<name>
# - The value is the path in Vault where the secret is located.
{{- range $k := .Values.backend.vault.secretPaths }}
vault.hashicorp.com/agent-inject-secret-{{tpl $k $}}:    {{tpl $.Values.backend.vault.role $}}/{{tpl $k $}}
vault.hashicorp.com/agent-inject-template-{{tpl $k $}}: |
  {{ printf "%s" "{{" }}- with secret "{{tpl $.Values.backend.vault.role $}}/{{tpl $k $}}"{{ printf "%s" "}}" }}
  {{ printf "%s" "{{" }}- range $k,$v := .Data.data{{ printf "%s" "}}"  }}
  export {{"{{"}}$k{{"}}"}}="{{"{{"}}$v{{"}}"}}"
  {{ printf "%s" "{{" }}- end{{ printf "%s" "}}" }}
  {{ printf "%s" "{{" }}- end{{ printf "%s" "}}" }}
{{- end }}
{{- end }}
{{- end }}
