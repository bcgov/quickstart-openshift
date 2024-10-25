{{/*
Expand the name of the chart.
*/}}
{{- define "crunchy-postgres.name" -}}
{{- default "crunchy" .Values.crunchy.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "crunchy-postgres.fullname" -}}
{{- if .Values.crunchy.fullnameOverride }}
{{- .Values.crunchy.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default "crunchy" .Values.crunchy.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "crunchy-postgres.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "crunchy-postgres.labels" -}}
helm.sh/chart: {{ include "crunchy-postgres.chart" . }}
{{ include "crunchy-postgres.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "crunchy-postgres.selectorLabels" -}}
app.kubernetes.io/name: {{ include "crunchy-postgres.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "crunchy-postgres.serviceAccountName" -}}
{{- if .Values.crunchy.serviceAccount.create }}
{{- default (include "crunchy-postgres.fullname" .) .Values.crunchy.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.crunchy.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "crunchy.s3" }}
{{- if .Values.crunchy.pgBackRest.s3.enabled}}
[global]
repo2-s3-key={{ .Values.crunchy.pgBackRest.s3.accessKey }}
repo2-s3-key-secret={{ .Values.crunchy.pgBackRest.s3.secretKey }}
{{ end }}
{{ end }}
