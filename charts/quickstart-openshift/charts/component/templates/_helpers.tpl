{{/*
Expand the name of the chart.
*/}}
{{- define "component.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "component.fullname" -}}
{{- $componentName := include "component.name" .  }}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $componentName | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "component.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "component.labels" -}}
helm.sh/chart: {{ include "component.chart" . }}
{{ include "component.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "component.selectorLabels" -}}
app.kubernetes.io/name: {{ include "component.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Pod Annotations
*/}}
{{- define "component.podAnnotations" -}}
{{- end }}


{{/*
Get Environment Variables
*/}}
{{- define "component.env" -}}
{{- default ("") .Values.configmap.env }}
{{- end }}

{{/*
Create default ConfigMap
*/}}
{{- define "component.configmap" -}}
{{ printf "%s%s" (.Values.configmap.script) (include "component.env" .) }}
{{- end}}



{{/*
Vault Sideloader Annotations
*/}}
{{- define "component.vaultAnnotations" -}}
{{- if and .Values.vault .Values.vault.enabled }}
# 1. Vault injector configuration goes here, inside the template.
vault.hashicorp.com/agent-inject: 'true'
vault.hashicorp.com/agent-inject-token: 'true'
vault.hashicorp.com/agent-pre-populate-only: 'true' # this makes sure the secret vault will only change during pod restart
vault.hashicorp.com/auth-path: auth/k8s-silver  # This was tricky.  Be sure to use k8s-silver, k8s-gold, or k8s-golddr
vault.hashicorp.com/namespace: platform-services
vault.hashicorp.com/role: {{.Values.vault.role}}  # licenseplate-nonprod or licenseplate-prod are your options
{{- if .Values.vault.resources }}
vault.hashicorp.com/agent-requests-cpu: {{.Values.vault.resources.requests.cpu }}
vault.hashicorp.com/agent-limits-cpu: {{.Values.vault.resources.limits.cpu }}
vault.hashicorp.com/agent-requests-mem: {{.Values.vault.resources.requests.memory }}
vault.hashicorp.com/agent-limits-mem: {{.Values.vault.resources.limits.memory }}
{{- end }}

# Configure how to retrieve and populate the secrets from Vault:
# - The name of the secret is any unique string after vault.hashicorp.com/agent-inject-secret-<name>
# - The value is the path in Vault where the secret is located.
{{- range $k := .Values.vault.secretPaths }}
vault.hashicorp.com/agent-inject-secret-{{$k}}:    {{$.Values.vault.role}}/{{$k}}
vault.hashicorp.com/agent-inject-template-{{$k}}: |
  {{ printf "%s" "{{" }}- with secret "{{$.Values.vault.role}}/{{$k}}"{{ printf "%s" "}}" }}
  {{ printf "%s" "{{" }}- range $k,$v := .Data.data{{ printf "%s" "}}"  }}
  export {{"{{"}}$k{{"}}"}}="{{"{{"}}$v{{"}}"}}"
  {{ printf "%s" "{{" }}- end{{ printf "%s" "}}" }}
  {{ printf "%s" "{{" }}- end{{ printf "%s" "}}" }}
{{- end }}
{{- end }}
{{- end }}
