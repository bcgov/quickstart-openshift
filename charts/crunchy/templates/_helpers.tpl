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

{{/*
Calculate the shared buffer to be 20% of allocated memory
https://vladmihalcea.com/postgresql-performance-tuning-settings/
*/}}

{{- define "shared.buffers"}}
{{- $memory := .Values.crunchy.instances.limits.memory -}}
{{- $unit := regexFind "([a-zA-Z]+)" $memory -}}
{{- $memoryValue := regexReplaceAll "([a-zA-Z]+)" $memory "" | int -}}
{{- $percentValue := (mulf $memoryValue 0.2) | int -}}
{{- printf "%d%s" $percentValue $unit -}}
{{- end }}

{{/*
Calculate the effective cache size to be 50% of allocated memory
 this value is closer to the official recommendation of setting it to a value between 50% and 75% of the available RAM.
*/}}

{{- define "effective.cache.size"}}
{{- $memory := .Values.crunchy.instances.limits.memory -}}
{{- $unit := regexFind "([a-zA-Z]+)" $memory -}}
{{- $memoryValue := regexReplaceAll "([a-zA-Z]+)" $memory "" | int -}}
{{- $percentValue := (mulf $memoryValue 0.5) | int -}}
{{- printf "%d%s" $percentValue $unit -}}
{{- end }}

{{/*
Another setting used for maintenance operations is wal_buffers, which allows storing in memory the WAL (Write-Ahead Log or Redo Log) segments before writing them to disk. By default, PostgreSQL uses a value that’s 1/32 of the shared_buffer setting. Therefore, my local PostgreSQL uses a value of 4 MB for the wal_buffers setting.
*/}}

{{- define "wal.buffers"}}
{{- $sharedBuffers := include "shared.buffers" . -}}
{{- $unit := regexFind "([a-zA-Z]+)" $sharedBuffers -}}
{{- $memoryValue := regexReplaceAll "([a-zA-Z]+)" $sharedBuffers "" | int -}}
{{- $percentValue := (mulf $memoryValue 0.03) | int -}}
{{- printf "%d%s" $percentValue $unit -}}
{{- end }}

{{/*
Calculate pg bouncer max connections to DB, 20% of overall.
*/}}

{{- define "pgbouncer.max.db.connections"}}
{{- $connections := .Values.crunchy.patroni.postgresql.parameters.max_connections -}}
{{- $pgBouncerMaxCon := (mulf $connections 0.1) | int -}}
{{- printf "%d" $pgBouncerMaxCon -}}
{{- end }}
