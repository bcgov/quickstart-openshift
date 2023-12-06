# quickstart-openshift

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.16.0](https://img.shields.io/badge/AppVersion-1.16.0-informational?style=flat-square)

A Helm chart for Kubernetes deployment.

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| https://bcgov.github.io/helm-service | backend(component) | 0.2.3 |
| https://bcgov.github.io/helm-service | frontend(component) | 0.2.3 |
| https://bcgov.github.io/helm-service | backup(component) | 0.2.3 |
| https://charts.bitnami.com/bitnami | bitnami-pg(postgresql) | 13.2.23 |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| backend.affinity | object | `{}` |  |
| backend.autoscaling.behavior.scaleDown.policies[0].periodSeconds | int | `60` |  |
| backend.autoscaling.behavior.scaleDown.policies[0].type | string | `"Percent"` |  |
| backend.autoscaling.behavior.scaleDown.policies[0].value | int | `10` |  |
| backend.autoscaling.behavior.scaleDown.policies[1].periodSeconds | int | `60` |  |
| backend.autoscaling.behavior.scaleDown.policies[1].type | string | `"Pods"` |  |
| backend.autoscaling.behavior.scaleDown.policies[1].value | int | `2` |  |
| backend.autoscaling.behavior.scaleDown.selectPolicy | string | `"Min"` |  |
| backend.autoscaling.behavior.scaleDown.stabilizationWindowSeconds | int | `300` |  |
| backend.autoscaling.behavior.scaleUp.policies[0].periodSeconds | int | `30` |  |
| backend.autoscaling.behavior.scaleUp.policies[0].type | string | `"Percent"` |  |
| backend.autoscaling.behavior.scaleUp.policies[0].value | int | `100` |  |
| backend.autoscaling.behavior.scaleUp.policies[1].periodSeconds | int | `30` |  |
| backend.autoscaling.behavior.scaleUp.policies[1].type | string | `"Pods"` |  |
| backend.autoscaling.behavior.scaleUp.policies[1].value | int | `2` |  |
| backend.autoscaling.behavior.scaleUp.selectPolicy | string | `"Max"` |  |
| backend.autoscaling.behavior.scaleUp.stabilizationWindowSeconds | int | `0` |  |
| backend.autoscaling.enabled | bool | `true` |  |
| backend.autoscaling.maxReplicas | int | `7` |  |
| backend.autoscaling.minReplicas | int | `3` |  |
| backend.autoscaling.targetCPUUtilizationPercentage | int | `80` |  |
| backend.containers[0].env.fromGlobalSecret[0].key | string | `"password"` |  |
| backend.containers[0].env.fromGlobalSecret[0].name | string | `"POSTGRES_PASSWORD"` |  |
| backend.containers[0].env.fromGlobalSecret[1].key | string | `"databaseUser"` |  |
| backend.containers[0].env.fromGlobalSecret[1].name | string | `"POSTGRES_USER"` |  |
| backend.containers[0].env.fromGlobalSecret[2].key | string | `"databaseName"` |  |
| backend.containers[0].env.fromGlobalSecret[2].name | string | `"POSTGRES_DATABASE"` |  |
| backend.containers[0].env.fromValues[0].name | string | `"POSTGRES_HOST"` |  |
| backend.containers[0].env.fromValues[0].value | string | `"{{ .Release.Name }}-{{.Values.global.databaseAlias}}"` |  |
| backend.containers[0].image | string | `"backend"` |  |
| backend.containers[0].livenessProbe.failureThreshold | int | `3` |  |
| backend.containers[0].livenessProbe.httpGet.path | string | `"/api"` |  |
| backend.containers[0].livenessProbe.httpGet.port | int | `3000` |  |
| backend.containers[0].livenessProbe.httpGet.scheme | string | `"HTTP"` |  |
| backend.containers[0].livenessProbe.initialDelaySeconds | int | `15` |  |
| backend.containers[0].livenessProbe.periodSeconds | int | `30` |  |
| backend.containers[0].livenessProbe.successThreshold | int | `1` |  |
| backend.containers[0].livenessProbe.timeoutSeconds | int | `5` |  |
| backend.containers[0].name | string | `"backend"` |  |
| backend.containers[0].ports[0].containerPort | int | `3000` |  |
| backend.containers[0].ports[0].name | string | `"http"` |  |
| backend.containers[0].ports[0].protocol | string | `"TCP"` |  |
| backend.containers[0].readinessProbe.failureThreshold | int | `30` |  |
| backend.containers[0].readinessProbe.httpGet.path | string | `"/api"` |  |
| backend.containers[0].readinessProbe.httpGet.port | int | `3000` |  |
| backend.containers[0].readinessProbe.httpGet.scheme | string | `"HTTP"` |  |
| backend.containers[0].readinessProbe.initialDelaySeconds | int | `5` |  |
| backend.containers[0].readinessProbe.periodSeconds | int | `2` |  |
| backend.containers[0].readinessProbe.successThreshold | int | `1` |  |
| backend.containers[0].readinessProbe.timeoutSeconds | int | `2` |  |
| backend.containers[0].registry | string | `"{{ .Values.global.registry }}"` |  |
| backend.containers[0].repository | string | `"{{ .Values.global.repository }}"` |  |
| backend.containers[0].resources.limits.cpu | string | `"250m"` |  |
| backend.containers[0].resources.limits.memory | string | `"250Mi"` |  |
| backend.containers[0].resources.requests.cpu | string | `"100m"` |  |
| backend.containers[0].resources.requests.memory | string | `"150Mi"` |  |
| backend.containers[0].tag | string | `"{{ .Values.global.tag }}"` |  |
| backend.deployment.enabled | bool | `true` |  |
| backend.deploymentStrategy.type | string | `"Recreate"` |  |
| backend.enabled | bool | `true` |  |
| backend.initContainers[0].env.fromGlobalSecret[0].key | string | `"databasePassword"` |  |
| backend.initContainers[0].env.fromGlobalSecret[0].name | string | `"FLYWAY_PASSWORD"` |  |
| backend.initContainers[0].env.fromGlobalSecret[1].key | string | `"databaseJDBCURLNoCreds"` |  |
| backend.initContainers[0].env.fromGlobalSecret[1].name | string | `"FLYWAY_URL"` |  |
| backend.initContainers[0].env.fromGlobalSecret[2].key | string | `"databaseUser"` |  |
| backend.initContainers[0].env.fromGlobalSecret[2].name | string | `"FLYWAY_USER"` |  |
| backend.initContainers[0].env.fromValues[0].name | string | `"FLYWAY_BASELINE_ON_MIGRATE"` |  |
| backend.initContainers[0].env.fromValues[0].value | string | `"true"` |  |
| backend.initContainers[0].env.fromValues[1].name | string | `"FLYWAY_DEFAULT_SCHEMA"` |  |
| backend.initContainers[0].env.fromValues[1].value | string | `"USERS"` |  |
| backend.initContainers[0].env.fromValues[2].name | string | `"FLYWAY_CONNECT_RETRIES"` |  |
| backend.initContainers[0].env.fromValues[2].value | string | `"30"` |  |
| backend.initContainers[0].image | string | `"migrations"` |  |
| backend.initContainers[0].name | string | `"database-migrations"` |  |
| backend.initContainers[0].registry | string | `"{{ .Values.global.registry }}"` |  |
| backend.initContainers[0].repository | string | `"{{ .Values.global.repository }}"` |  |
| backend.initContainers[0].resources.limits.cpu | string | `"500m"` |  |
| backend.initContainers[0].resources.limits.memory | string | `"250Mi"` |  |
| backend.initContainers[0].resources.requests.cpu | string | `"200m"` |  |
| backend.initContainers[0].resources.requests.memory | string | `"150Mi"` |  |
| backend.initContainers[0].tag | string | `"{{ .Values.global.tag }}"` |  |
| backend.nodeSelector | object | `{}` |  |
| backend.service.enabled | bool | `true` |  |
| backend.service.ports[0].name | string | `"http"` |  |
| backend.service.ports[0].port | int | `80` |  |
| backend.service.ports[0].protocol | string | `"TCP"` |  |
| backend.service.ports[0].targetPort | int | `3000` |  |
| backend.service.type | string | `"ClusterIP"` |  |
| backend.tolerations | list | `[]` |  |
| backend.vault.enabled | bool | `false` |  |
| backend.vault.entrypoint | string | `nil` |  |
| backend.vault.resources.limits.cpu | string | `"50m"` |  |
| backend.vault.resources.limits.memory | string | `"50Mi"` |  |
| backend.vault.resources.requests.cpu | string | `"50m"` |  |
| backend.vault.resources.requests.memory | string | `"25Mi"` |  |
| backend.vault.role | string | `nil` |  |
| backend.vault.secretPaths[0] | string | `"dev/api-1"` |  |
| backend.vault.secretPaths[1] | string | `"dev/api-2"` |  |
| backend.vault.secretPaths[2] | string | `"test/api-1"` |  |
| backend.vault.secretPaths[3] | string | `"test/api-2"` |  |
| backend.vault.secretPaths[4] | string | `"prod/api-1"` |  |
| backend.vault.secretPaths[5] | string | `"prod/api-2"` |  |
| backup.containers[0].command[0] | string | `"/bin/bash"` |  |
| backup.containers[0].command[1] | string | `"-c"` |  |
| backup.containers[0].command[2] | string | `"/backup.sh -1"` |  |
| backup.containers[0].env.fromGlobalSecret[0].key | string | `"password"` |  |
| backup.containers[0].env.fromGlobalSecret[0].name | string | `"DATABASE_PASSWORD"` |  |
| backup.containers[0].env.fromGlobalSecret[1].key | string | `"databaseName"` |  |
| backup.containers[0].env.fromGlobalSecret[1].name | string | `"POSTGRESQL_DATABASE"` |  |
| backup.containers[0].env.fromGlobalSecret[2].key | string | `"databaseUser"` |  |
| backup.containers[0].env.fromGlobalSecret[2].name | string | `"DATABASE_USER"` |  |
| backup.containers[0].env.fromValues[0].name | string | `"BACKUP_DIR"` |  |
| backup.containers[0].env.fromValues[0].value | string | `"/backups/"` |  |
| backup.containers[0].env.fromValues[1].name | string | `"BACKUP_STRATEGY"` |  |
| backup.containers[0].env.fromValues[1].value | string | `"rolling"` |  |
| backup.containers[0].env.fromValues[2].name | string | `"NUM_BACKUPS"` |  |
| backup.containers[0].env.fromValues[2].value | string | `"5"` |  |
| backup.containers[0].env.fromValues[3].name | string | `"DAILY_BACKUPS"` |  |
| backup.containers[0].env.fromValues[3].value | string | `"7"` |  |
| backup.containers[0].env.fromValues[4].name | string | `"WEEKLY_BACKUPS"` |  |
| backup.containers[0].env.fromValues[4].value | string | `"4"` |  |
| backup.containers[0].env.fromValues[5].name | string | `"MONTHLY_BACKUPS"` |  |
| backup.containers[0].env.fromValues[5].value | string | `"1"` |  |
| backup.containers[0].env.fromValues[6].name | string | `"DATABASE_SERVICE_NAME"` |  |
| backup.containers[0].env.fromValues[6].value | string | `"{{.Release.Name}}-{{.Values.global.databaseAlias}}"` |  |
| backup.containers[0].env.fromValues[7].name | string | `"DEFAULT_PORT"` |  |
| backup.containers[0].env.fromValues[7].value | string | `"5432"` |  |
| backup.containers[0].image | string | `"backup-container"` |  |
| backup.containers[0].name | string | `"backup"` |  |
| backup.containers[0].registry | string | `"docker.io"` |  |
| backup.containers[0].repository | string | `"bcgovimages"` |  |
| backup.containers[0].resources.limits.cpu | string | `"50m"` |  |
| backup.containers[0].resources.limits.memory | string | `"256Mi"` |  |
| backup.containers[0].resources.requests.cpu | string | `"20m"` |  |
| backup.containers[0].resources.requests.memory | string | `"128Mi"` |  |
| backup.containers[0].tag | string | `"latest"` |  |
| backup.containers[0].volumeMounts[0].mountPath | string | `"/backups/"` |  |
| backup.containers[0].volumeMounts[0].name | string | `"{{.Release.Name}}-backup"` |  |
| backup.cronjob.concurrencyPolicy | string | `"Replace"` |  |
| backup.cronjob.enabled | bool | `true` |  |
| backup.cronjob.failedJobsHistoryLimit | int | `7` |  |
| backup.cronjob.restartPolicy | string | `"Never"` |  |
| backup.cronjob.schedule | string | `"0 0 * * *"` |  |
| backup.cronjob.startingDeadlineSeconds | int | `3600` |  |
| backup.cronjob.successfulJobsHistoryLimit | int | `30` |  |
| backup.cronjob.volumes[0].name | string | `"{{.Release.Name}}-backup"` |  |
| backup.cronjob.volumes[0].persistentVolumeClaim.claimName | string | `"{{.Release.Name}}-backup"` |  |
| backup.enabled | bool | `true` |  |
| backup.pvc.accessModes | string | `"ReadWriteOnce"` |  |
| backup.pvc.enabled | bool | `true` |  |
| backup.pvc.size | string | `"256Mi"` |  |
| backup.pvc.storageClassName | string | `"netapp-file-standard"` |  |
| bitnami-pg.auth.database | string | `"quickstart"` |  |
| bitnami-pg.auth.existingSecret | string | `"{{ .Release.Name }}"` |  |
| bitnami-pg.auth.username | string | `"quickstart"` |  |
| bitnami-pg.backup.cronjob.containerSecurityContext | object | `{}` |  |
| bitnami-pg.backup.cronjob.podSecurityContext.enabled | bool | `false` |  |
| bitnami-pg.backup.cronjob.storage.size | string | `"200Mi"` |  |
| bitnami-pg.backup.enabled | bool | `false` |  |
| bitnami-pg.enabled | bool | `true` |  |
| bitnami-pg.image.registry | string | `"ghcr.io"` |  |
| bitnami-pg.image.repository | string | `"bcgov/nr-containers/bitnami/postgresql"` |  |
| bitnami-pg.image.tag | string | `"15.5.0"` |  |
| bitnami-pg.primary.containerSecurityContext.enabled | bool | `false` |  |
| bitnami-pg.primary.initdb.scripts."postgis.sh" | string | `"#!/bin/sh\nPGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -d postgres -c \"CREATE EXTENSION postgis;\"\n"` |  |
| bitnami-pg.primary.persistence.accessModes[0] | string | `"ReadWriteOnce"` |  |
| bitnami-pg.primary.persistence.enabled | bool | `true` |  |
| bitnami-pg.primary.persistence.size | string | `"100Mi"` |  |
| bitnami-pg.primary.persistence.storageClass | string | `"netapp-file-standard"` |  |
| bitnami-pg.primary.podSecurityContext.enabled | bool | `false` |  |
| bitnami-pg.primary.resources.limits.cpu | string | `"150m"` |  |
| bitnami-pg.primary.resources.limits.memory | string | `"250Mi"` |  |
| bitnami-pg.primary.resources.requests.cpu | string | `"50m"` |  |
| bitnami-pg.primary.resources.requests.memory | string | `"150Mi"` |  |
| bitnami-pg.shmVolume.enabled | bool | `false` |  |
| crunchy.crunchyImage | string | `"artifacts.developer.gov.bc.ca/bcgov-docker-local/crunchy-postgres-gis:ubi8-15.2-3.3-0"` |  |
| crunchy.enabled | bool | `false` |  |
| crunchy.imagePullPolicy | string | `"Always"` |  |
| crunchy.instances.dataVolumeClaimSpec.storage | string | `"120Mi"` |  |
| crunchy.instances.dataVolumeClaimSpec.storageClassName | string | `"netapp-block-standard"` |  |
| crunchy.instances.limits.cpu | string | `"100m"` |  |
| crunchy.instances.limits.memory | string | `"512Mi"` |  |
| crunchy.instances.metadata.annotations."prometheus.io/port" | string | `"9187"` |  |
| crunchy.instances.metadata.annotations."prometheus.io/scrape" | string | `"true"` |  |
| crunchy.instances.name | string | `"ha"` |  |
| crunchy.instances.replicaCertCopy.limits.cpu | string | `"50m"` |  |
| crunchy.instances.replicaCertCopy.limits.memory | string | `"64Mi"` |  |
| crunchy.instances.replicaCertCopy.requests.cpu | string | `"1m"` |  |
| crunchy.instances.replicaCertCopy.requests.memory | string | `"32Mi"` |  |
| crunchy.instances.replicas | int | `1` |  |
| crunchy.instances.requests.cpu | string | `"25m"` |  |
| crunchy.instances.requests.memory | string | `"256Mi"` |  |
| crunchy.patroni.postgresql.parameters.max_slot_wal_keep_size | string | `"128MB"` |  |
| crunchy.patroni.postgresql.parameters.max_wal_size | string | `"64MB"` |  |
| crunchy.patroni.postgresql.parameters.min_wal_size | string | `"32MB"` |  |
| crunchy.patroni.postgresql.parameters.shared_buffers | string | `"16MB"` |  |
| crunchy.patroni.postgresql.parameters.wal_buffers | string | `"64kB"` |  |
| crunchy.patroni.postgresql.pg_hba | string | `"host all all 0.0.0.0/0 md5"` |  |
| crunchy.pgBackRest.enabled | bool | `false` |  |
| crunchy.pgBackRest.image | string | `nil` |  |
| crunchy.pgBackRest.repoHost.limits.cpu | string | `"50m"` |  |
| crunchy.pgBackRest.repoHost.limits.memory | string | `"128Mi"` |  |
| crunchy.pgBackRest.repoHost.requests.cpu | string | `"1m"` |  |
| crunchy.pgBackRest.repoHost.requests.memory | string | `"64Mi"` |  |
| crunchy.pgBackRest.repos.schedules.full | string | `"0 8 * * *"` |  |
| crunchy.pgBackRest.repos.schedules.incremental | string | `"0 0,4,12,16,20 * * *"` |  |
| crunchy.pgBackRest.repos.volume.accessModes | string | `"ReadWriteOnce"` |  |
| crunchy.pgBackRest.repos.volume.storage | string | `"64Mi"` |  |
| crunchy.pgBackRest.repos.volume.storageClassName | string | `"netapp-file-backup"` |  |
| crunchy.pgBackRest.retention | string | `"1"` |  |
| crunchy.pgBackRest.retentionFullType | string | `"count"` |  |
| crunchy.pgBackRest.sidecars.limits.cpu | string | `"50m"` |  |
| crunchy.pgBackRest.sidecars.limits.memory | string | `"128Mi"` |  |
| crunchy.pgBackRest.sidecars.requests.cpu | string | `"1m"` |  |
| crunchy.pgBackRest.sidecars.requests.memory | string | `"64Mi"` |  |
| crunchy.pgmonitor.enabled | bool | `false` |  |
| crunchy.pgmonitor.exporter.image | string | `nil` |  |
| crunchy.pgmonitor.exporter.limits.cpu | string | `"50m"` |  |
| crunchy.pgmonitor.exporter.limits.memory | string | `"128Mi"` |  |
| crunchy.pgmonitor.exporter.requests.cpu | string | `"1m"` |  |
| crunchy.pgmonitor.exporter.requests.memory | string | `"64Mi"` |  |
| crunchy.postGISVersion | string | `"3.3"` |  |
| crunchy.postgresVersion | int | `15` |  |
| crunchy.proxy.pgBouncer.image | string | `nil` |  |
| crunchy.proxy.pgBouncer.limits.cpu | string | `"50m"` |  |
| crunchy.proxy.pgBouncer.limits.memory | string | `"128Mi"` |  |
| crunchy.proxy.pgBouncer.replicas | int | `1` |  |
| crunchy.proxy.pgBouncer.requests.cpu | string | `"1m"` |  |
| crunchy.proxy.pgBouncer.requests.memory | string | `"64Mi"` |  |
| frontend.autoscaling.behavior.scaleDown.policies[0].periodSeconds | int | `60` |  |
| frontend.autoscaling.behavior.scaleDown.policies[0].type | string | `"Percent"` |  |
| frontend.autoscaling.behavior.scaleDown.policies[0].value | int | `10` |  |
| frontend.autoscaling.behavior.scaleDown.policies[1].periodSeconds | int | `60` |  |
| frontend.autoscaling.behavior.scaleDown.policies[1].type | string | `"Pods"` |  |
| frontend.autoscaling.behavior.scaleDown.policies[1].value | int | `2` |  |
| frontend.autoscaling.behavior.scaleDown.selectPolicy | string | `"Min"` |  |
| frontend.autoscaling.behavior.scaleDown.stabilizationWindowSeconds | int | `300` |  |
| frontend.autoscaling.behavior.scaleUp.policies[0].periodSeconds | int | `30` |  |
| frontend.autoscaling.behavior.scaleUp.policies[0].type | string | `"Percent"` |  |
| frontend.autoscaling.behavior.scaleUp.policies[0].value | int | `100` |  |
| frontend.autoscaling.behavior.scaleUp.policies[1].periodSeconds | int | `30` |  |
| frontend.autoscaling.behavior.scaleUp.policies[1].type | string | `"Pods"` |  |
| frontend.autoscaling.behavior.scaleUp.policies[1].value | int | `2` |  |
| frontend.autoscaling.behavior.scaleUp.selectPolicy | string | `"Max"` |  |
| frontend.autoscaling.behavior.scaleUp.stabilizationWindowSeconds | int | `0` |  |
| frontend.autoscaling.enabled | bool | `true` |  |
| frontend.autoscaling.maxReplicas | int | `7` |  |
| frontend.autoscaling.minReplicas | int | `3` |  |
| frontend.autoscaling.targetCPUUtilizationPercentage | int | `80` |  |
| frontend.configmap.data."config.js" | string | `"const envConfig = (() => {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"{{ .Release.Name }}-{{ .Release.Namespace }}\"\n  };\n})();"` |  |
| frontend.configmap.data."config.prod.js" | string | `"const envConfig = (() => {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"static\"\n  };\n})();"` |  |
| frontend.configmap.enabled | bool | `true` |  |
| frontend.containers[0].env.fromLocalConfigmap[0].key | string | `"config.js"` |  |
| frontend.containers[0].env.fromLocalConfigmap[0].name | string | `"frontend-configmap"` |  |
| frontend.containers[0].env.fromLocalConfigmap[1].key | string | `"config.prod.js"` |  |
| frontend.containers[0].env.fromLocalConfigmap[1].name | string | `"frontend-prod-configmap"` |  |
| frontend.containers[0].env.fromValues[0].name | string | `"BACKEND_URL"` |  |
| frontend.containers[0].env.fromValues[0].value | string | `"http://{{ .Release.Name }}-backend"` |  |
| frontend.containers[0].env.fromValues[1].name | string | `"LOG_LEVEL"` |  |
| frontend.containers[0].env.fromValues[1].value | string | `"info"` |  |
| frontend.containers[0].image | string | `"frontend"` |  |
| frontend.containers[0].livenessProbe.failureThreshold | int | `3` |  |
| frontend.containers[0].livenessProbe.httpGet.path | string | `"/health"` |  |
| frontend.containers[0].livenessProbe.httpGet.port | int | `3001` |  |
| frontend.containers[0].livenessProbe.httpGet.scheme | string | `"HTTP"` |  |
| frontend.containers[0].livenessProbe.initialDelaySeconds | int | `15` |  |
| frontend.containers[0].livenessProbe.periodSeconds | int | `30` |  |
| frontend.containers[0].livenessProbe.successThreshold | int | `1` |  |
| frontend.containers[0].livenessProbe.timeoutSeconds | int | `5` |  |
| frontend.containers[0].name | string | `"frontend"` |  |
| frontend.containers[0].ports[0].containerPort | int | `3000` |  |
| frontend.containers[0].ports[0].name | string | `"http"` |  |
| frontend.containers[0].ports[0].protocol | string | `"TCP"` |  |
| frontend.containers[0].ports[1].containerPort | int | `3001` |  |
| frontend.containers[0].ports[1].name | string | `"http2"` |  |
| frontend.containers[0].ports[1].protocol | string | `"TCP"` |  |
| frontend.containers[0].readinessProbe.failureThreshold | int | `30` |  |
| frontend.containers[0].readinessProbe.httpGet.path | string | `"/health"` |  |
| frontend.containers[0].readinessProbe.httpGet.port | int | `3001` |  |
| frontend.containers[0].readinessProbe.httpGet.scheme | string | `"HTTP"` |  |
| frontend.containers[0].readinessProbe.initialDelaySeconds | int | `5` |  |
| frontend.containers[0].readinessProbe.periodSeconds | int | `2` |  |
| frontend.containers[0].readinessProbe.successThreshold | int | `1` |  |
| frontend.containers[0].readinessProbe.timeoutSeconds | int | `2` |  |
| frontend.containers[0].registry | string | `"{{ .Values.global.registry }}"` |  |
| frontend.containers[0].repository | string | `"{{ .Values.global.repository }}"` |  |
| frontend.containers[0].resources.limits.cpu | string | `"100m"` |  |
| frontend.containers[0].resources.limits.memory | string | `"150Mi"` |  |
| frontend.containers[0].resources.requests.cpu | string | `"30m"` |  |
| frontend.containers[0].resources.requests.memory | string | `"50Mi"` |  |
| frontend.containers[0].securityContext.capabilities.add[0] | string | `"NET_BIND_SERVICE"` |  |
| frontend.containers[0].tag | string | `"{{ .Values.global.tag }}"` |  |
| frontend.deployment.enabled | bool | `true` |  |
| frontend.deploymentStrategy.type | string | `"Recreate"` |  |
| frontend.enabled | bool | `true` |  |
| frontend.route.enabled | bool | `true` |  |
| frontend.route.host | string | `"{{ .Release.Name }}-frontend.{{ .Values.global.domain }}"` |  |
| frontend.route.targetPort | string | `"http"` |  |
| frontend.service.enabled | bool | `true` |  |
| frontend.service.ports[0].name | string | `"http"` |  |
| frontend.service.ports[0].port | int | `80` |  |
| frontend.service.ports[0].protocol | string | `"TCP"` |  |
| frontend.service.ports[0].targetPort | int | `3000` |  |
| frontend.service.type | string | `"ClusterIP"` |  |
| global.autoscaling | bool | `true` |  |
| global.databaseAlias | string | `"bitnami-pg"` |  |
| global.domain | string | `"apps.silver.devops.gov.bc.ca"` |  |
| global.openshiftImageRegistry | string | `"image-registry.openshift-image-registry.svc:5000"` |  |
| global.podAnnotations | string | `"app.kubernetes.io/timestamp: {{now | toString }}\n"` |  |
| global.registry | string | `"ghcr.io"` |  |
| global.repository | string | `nil` |  |
| global.secrets.annotation."helm.sh/policy" | string | `"keep"` |  |
| global.secrets.databaseName | string | `nil` |  |
| global.secrets.databasePassword | string | `nil` |  |
| global.secrets.databaseUser | string | `nil` |  |
| global.secrets.enabled | bool | `true` |  |
| global.tag | string | `nil` |  |

