# quickstart-openshift

A Helm chart for Kubernetes deployment.

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.16.0](https://img.shields.io/badge/AppVersion-1.16.0-informational?style=flat-square) 

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| Om Mishra | <omprakash.2.mishra@gov.bc.ca> |  |
| Derek Roberts | <derek.roberts@gov.bc.ca> |  |

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| https://bcgov.github.io/helm-service | backend(component) | 0.2.3 |
| https://bcgov.github.io/helm-service | frontend(component) | 0.2.3 |
| https://bcgov.github.io/helm-service | backup(component) | 0.2.3 |
| https://charts.bitnami.com/bitnami | bitnami-pg(postgresql) | 13.2.23 |


<table>
	<thead>
		<th>Key</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</thead>
	<tbody>
		<tr>
			<td>backend.affinity</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[0].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
60
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[0].type</td>
			<td>string</td>
			<td><pre lang="json">
"Percent"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[0].value</td>
			<td>int</td>
			<td><pre lang="json">
10
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[1].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
60
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[1].type</td>
			<td>string</td>
			<td><pre lang="json">
"Pods"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[1].value</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.selectPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Min"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.stabilizationWindowSeconds</td>
			<td>int</td>
			<td><pre lang="json">
300
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[0].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[0].type</td>
			<td>string</td>
			<td><pre lang="json">
"Percent"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[0].value</td>
			<td>int</td>
			<td><pre lang="json">
100
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[1].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[1].type</td>
			<td>string</td>
			<td><pre lang="json">
"Pods"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[1].value</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.selectPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Max"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.stabilizationWindowSeconds</td>
			<td>int</td>
			<td><pre lang="json">
0
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.maxReplicas</td>
			<td>int</td>
			<td><pre lang="json">
7
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.minReplicas</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.targetCPUUtilizationPercentage</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[0].key</td>
			<td>string</td>
			<td><pre lang="json">
"password"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRES_PASSWORD"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[1].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseUser"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRES_USER"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[2].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseName"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRES_DATABASE"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromValues[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRES_HOST"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromValues[0].value</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Release.Name }}-{{.Values.global.databaseAlias}}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].image</td>
			<td>string</td>
			<td><pre lang="json">
"backend"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.httpGet.path</td>
			<td>string</td>
			<td><pre lang="json">
"/api"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.httpGet.port</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.httpGet.scheme</td>
			<td>string</td>
			<td><pre lang="json">
"HTTP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
15
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
5
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"backend"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].ports[0].containerPort</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].ports[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"http"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].ports[0].protocol</td>
			<td>string</td>
			<td><pre lang="json">
"TCP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.httpGet.path</td>
			<td>string</td>
			<td><pre lang="json">
"/api"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.httpGet.port</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.httpGet.scheme</td>
			<td>string</td>
			<td><pre lang="json">
"HTTP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
5
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].registry</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.registry }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].repository</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.repository }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"250m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"250Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"100m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"150Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].tag</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.tag }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.deployment.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.deploymentStrategy.type</td>
			<td>string</td>
			<td><pre lang="json">
"Recreate"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[0].key</td>
			<td>string</td>
			<td><pre lang="json">
"databasePassword"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_PASSWORD"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[1].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseJDBCURLNoCreds"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_URL"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[2].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseUser"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_USER"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_BASELINE_ON_MIGRATE"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[0].value</td>
			<td>string</td>
			<td><pre lang="json">
"true"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_DEFAULT_SCHEMA"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[1].value</td>
			<td>string</td>
			<td><pre lang="json">
"USERS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_CONNECT_RETRIES"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[2].value</td>
			<td>string</td>
			<td><pre lang="json">
"30"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].image</td>
			<td>string</td>
			<td><pre lang="json">
"migrations"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"database-migrations"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].registry</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.registry }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].repository</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.repository }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"500m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"250Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"200m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"150Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].tag</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.tag }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.nodeSelector</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.ports[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"http"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.ports[0].port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.ports[0].protocol</td>
			<td>string</td>
			<td><pre lang="json">
"TCP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.ports[0].targetPort</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.type</td>
			<td>string</td>
			<td><pre lang="json">
"ClusterIP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.tolerations</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"50Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"25Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.role</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[0]</td>
			<td>string</td>
			<td><pre lang="json">
"dev/api-1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[1]</td>
			<td>string</td>
			<td><pre lang="json">
"dev/api-2"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[2]</td>
			<td>string</td>
			<td><pre lang="json">
"test/api-1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[3]</td>
			<td>string</td>
			<td><pre lang="json">
"test/api-2"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[4]</td>
			<td>string</td>
			<td><pre lang="json">
"prod/api-1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[5]</td>
			<td>string</td>
			<td><pre lang="json">
"prod/api-2"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].command[0]</td>
			<td>string</td>
			<td><pre lang="json">
"/bin/bash"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].command[1]</td>
			<td>string</td>
			<td><pre lang="json">
"-c"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].command[2]</td>
			<td>string</td>
			<td><pre lang="json">
"/backup.sh -1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[0].key</td>
			<td>string</td>
			<td><pre lang="json">
"password"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"DATABASE_PASSWORD"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[1].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseName"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRESQL_DATABASE"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[2].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseUser"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"DATABASE_USER"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"BACKUP_DIR"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[0].value</td>
			<td>string</td>
			<td><pre lang="json">
"/backups/"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"BACKUP_STRATEGY"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[1].value</td>
			<td>string</td>
			<td><pre lang="json">
"rolling"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"NUM_BACKUPS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[2].value</td>
			<td>string</td>
			<td><pre lang="json">
"5"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[3].name</td>
			<td>string</td>
			<td><pre lang="json">
"DAILY_BACKUPS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[3].value</td>
			<td>string</td>
			<td><pre lang="json">
"7"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[4].name</td>
			<td>string</td>
			<td><pre lang="json">
"WEEKLY_BACKUPS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[4].value</td>
			<td>string</td>
			<td><pre lang="json">
"4"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[5].name</td>
			<td>string</td>
			<td><pre lang="json">
"MONTHLY_BACKUPS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[5].value</td>
			<td>string</td>
			<td><pre lang="json">
"1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[6].name</td>
			<td>string</td>
			<td><pre lang="json">
"DATABASE_SERVICE_NAME"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[6].value</td>
			<td>string</td>
			<td><pre lang="json">
"{{.Release.Name}}-{{.Values.global.databaseAlias}}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[7].name</td>
			<td>string</td>
			<td><pre lang="json">
"DEFAULT_PORT"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[7].value</td>
			<td>string</td>
			<td><pre lang="json">
"5432"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].image</td>
			<td>string</td>
			<td><pre lang="json">
"backup-container"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].registry</td>
			<td>string</td>
			<td><pre lang="json">
"docker.io"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].repository</td>
			<td>string</td>
			<td><pre lang="json">
"bcgovimages"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"256Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"20m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].tag</td>
			<td>string</td>
			<td><pre lang="json">
"latest"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].volumeMounts[0].mountPath</td>
			<td>string</td>
			<td><pre lang="json">
"/backups/"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].volumeMounts[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"{{.Release.Name}}-backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.concurrencyPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Replace"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.failedJobsHistoryLimit</td>
			<td>int</td>
			<td><pre lang="json">
7
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.restartPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Never"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.schedule</td>
			<td>string</td>
			<td><pre lang="json">
"0 0 * * *"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.startingDeadlineSeconds</td>
			<td>int</td>
			<td><pre lang="json">
3600
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.successfulJobsHistoryLimit</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.volumes[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"{{.Release.Name}}-backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.volumes[0].persistentVolumeClaim.claimName</td>
			<td>string</td>
			<td><pre lang="json">
"{{.Release.Name}}-backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.pvc.accessModes</td>
			<td>string</td>
			<td><pre lang="json">
"ReadWriteOnce"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.pvc.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.pvc.size</td>
			<td>string</td>
			<td><pre lang="json">
"256Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.pvc.storageClassName</td>
			<td>string</td>
			<td><pre lang="json">
"netapp-file-standard"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.auth.database</td>
			<td>string</td>
			<td><pre lang="json">
"quickstart"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.auth.existingSecret</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Release.Name }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.auth.username</td>
			<td>string</td>
			<td><pre lang="json">
"quickstart"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.backup.cronjob.containerSecurityContext</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.backup.cronjob.podSecurityContext.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.backup.cronjob.storage.size</td>
			<td>string</td>
			<td><pre lang="json">
"200Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.backup.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.image.registry</td>
			<td>string</td>
			<td><pre lang="json">
"ghcr.io"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.image.repository</td>
			<td>string</td>
			<td><pre lang="json">
"bcgov/nr-containers/bitnami/postgresql"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.image.tag</td>
			<td>string</td>
			<td><pre lang="json">
"15.5.0"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.containerSecurityContext.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.initdb.scripts."postgis.sh"</td>
			<td>string</td>
			<td><pre lang="json">
"#!/bin/sh\nPGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -d postgres -c \"CREATE EXTENSION postgis;\"\n"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.persistence.accessModes[0]</td>
			<td>string</td>
			<td><pre lang="json">
"ReadWriteOnce"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.persistence.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.persistence.size</td>
			<td>string</td>
			<td><pre lang="json">
"100Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.persistence.storageClass</td>
			<td>string</td>
			<td><pre lang="json">
"netapp-file-standard"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.podSecurityContext.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"150m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"250Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"150Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.shmVolume.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.crunchyImage</td>
			<td>string</td>
			<td><pre lang="json">
"artifacts.developer.gov.bc.ca/bcgov-docker-local/crunchy-postgres-gis:ubi8-15.2-3.3-0"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.imagePullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Always"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.dataVolumeClaimSpec.storage</td>
			<td>string</td>
			<td><pre lang="json">
"120Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.dataVolumeClaimSpec.storageClassName</td>
			<td>string</td>
			<td><pre lang="json">
"netapp-block-standard"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"100m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"512Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.metadata.annotations."prometheus.io/port"</td>
			<td>string</td>
			<td><pre lang="json">
"9187"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.metadata.annotations."prometheus.io/scrape"</td>
			<td>string</td>
			<td><pre lang="json">
"true"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.name</td>
			<td>string</td>
			<td><pre lang="json">
"ha"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicaCertCopy.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicaCertCopy.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicaCertCopy.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicaCertCopy.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"32Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicas</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"25m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"256Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.max_slot_wal_keep_size</td>
			<td>string</td>
			<td><pre lang="json">
"128MB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.max_wal_size</td>
			<td>string</td>
			<td><pre lang="json">
"64MB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.min_wal_size</td>
			<td>string</td>
			<td><pre lang="json">
"32MB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.shared_buffers</td>
			<td>string</td>
			<td><pre lang="json">
"16MB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.wal_buffers</td>
			<td>string</td>
			<td><pre lang="json">
"64kB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.pg_hba</td>
			<td>string</td>
			<td><pre lang="json">
"host all all 0.0.0.0/0 md5"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.image</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repoHost.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repoHost.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repoHost.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repoHost.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.schedules.full</td>
			<td>string</td>
			<td><pre lang="json">
"0 8 * * *"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.schedules.incremental</td>
			<td>string</td>
			<td><pre lang="json">
"0 0,4,12,16,20 * * *"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.volume.accessModes</td>
			<td>string</td>
			<td><pre lang="json">
"ReadWriteOnce"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.volume.storage</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.volume.storageClassName</td>
			<td>string</td>
			<td><pre lang="json">
"netapp-file-backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.retention</td>
			<td>string</td>
			<td><pre lang="json">
"1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.retentionFullType</td>
			<td>string</td>
			<td><pre lang="json">
"count"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.sidecars.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.sidecars.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.sidecars.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.sidecars.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.image</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.postGISVersion</td>
			<td>string</td>
			<td><pre lang="json">
"3.3"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.postgresVersion</td>
			<td>int</td>
			<td><pre lang="json">
15
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.image</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.replicas</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[0].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
60
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[0].type</td>
			<td>string</td>
			<td><pre lang="json">
"Percent"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[0].value</td>
			<td>int</td>
			<td><pre lang="json">
10
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[1].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
60
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[1].type</td>
			<td>string</td>
			<td><pre lang="json">
"Pods"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[1].value</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.selectPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Min"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.stabilizationWindowSeconds</td>
			<td>int</td>
			<td><pre lang="json">
300
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[0].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[0].type</td>
			<td>string</td>
			<td><pre lang="json">
"Percent"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[0].value</td>
			<td>int</td>
			<td><pre lang="json">
100
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[1].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[1].type</td>
			<td>string</td>
			<td><pre lang="json">
"Pods"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[1].value</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.selectPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Max"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.stabilizationWindowSeconds</td>
			<td>int</td>
			<td><pre lang="json">
0
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.maxReplicas</td>
			<td>int</td>
			<td><pre lang="json">
7
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.minReplicas</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.targetCPUUtilizationPercentage</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.configmap</td>
			<td>object</td>
			<td><pre lang="json">
{
  "data": {
    "config.js": "const envConfig = (() =\u003e {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"{{ .Release.Name }}-{{ .Release.Namespace }}\"\n  };\n})();",
    "config.prod.js": "const envConfig = (() =\u003e {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"static\"\n  };\n})();"
  },
  "enabled": true
}
</pre>
</td>
			<td>the configmap specific to the component.</td>
		</tr>
		<tr>
			<td>frontend.configmap.data</td>
			<td>object</td>
			<td><pre lang="json">
{
  "config.js": "const envConfig = (() =\u003e {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"{{ .Release.Name }}-{{ .Release.Namespace }}\"\n  };\n})();",
  "config.prod.js": "const envConfig = (() =\u003e {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"static\"\n  };\n})();"
}
</pre>
</td>
			<td>dat contains key value pairs for the configmap. can contain multiple files. value can be piped as string.</td>
		</tr>
		<tr>
			<td>frontend.configmap.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>enable or disable the configmap.</td>
		</tr>
		<tr>
			<td>frontend.containers</td>
			<td>list</td>
			<td><pre lang="json">
[
  {
    "env": {
      "fromLocalConfigmap": [
        {
          "key": "config.js",
          "name": "frontend-configmap"
        },
        {
          "key": "config.prod.js",
          "name": "frontend-prod-configmap"
        }
      ],
      "fromValues": [
        {
          "name": "BACKEND_URL",
          "value": "http://{{ .Release.Name }}-backend"
        },
        {
          "name": "LOG_LEVEL",
          "value": "info"
        }
      ]
    },
    "image": "frontend",
    "livenessProbe": {
      "failureThreshold": 3,
      "httpGet": {
        "path": "/health",
        "port": 3001,
        "scheme": "HTTP"
      },
      "initialDelaySeconds": 15,
      "periodSeconds": 30,
      "successThreshold": 1,
      "timeoutSeconds": 5
    },
    "name": "frontend",
    "ports": [
      {
        "containerPort": 3000,
        "name": "http",
        "protocol": "TCP"
      },
      {
        "containerPort": 3001,
        "name": "http2",
        "protocol": "TCP"
      }
    ],
    "readinessProbe": {
      "failureThreshold": 30,
      "httpGet": {
        "path": "/health",
        "port": 3001,
        "scheme": "HTTP"
      },
      "initialDelaySeconds": 5,
      "periodSeconds": 2,
      "successThreshold": 1,
      "timeoutSeconds": 2
    },
    "registry": "{{ .Values.global.registry }}",
    "repository": "{{ .Values.global.repository }}",
    "resources": {
      "limits": {
        "cpu": "100m",
        "memory": "150Mi"
      },
      "requests": {
        "cpu": "30m",
        "memory": "50Mi"
      }
    },
    "securityContext": {
      "capabilities": {
        "add": [
          "NET_BIND_SERVICE"
        ]
      }
    },
    "tag": "{{ .Values.global.tag }}"
  }
]
</pre>
</td>
			<td>the containers specific to the component. one or many containers can be defined.</td>
		</tr>
		<tr>
			<td>frontend.deployment</td>
			<td>object</td>
			<td><pre lang="json">
{
  "enabled": true
}
</pre>
</td>
			<td>can be either a statefulSet or a deployment not both. TBD (StatefulSet)</td>
		</tr>
		<tr>
			<td>frontend.deploymentStrategy</td>
			<td>object</td>
			<td><pre lang="json">
{
  "type": "Recreate"
}
</pre>
</td>
			<td>the deployment strategy, can be "Recreate" or "RollingUpdate"</td>
		</tr>
		<tr>
			<td>frontend.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>enable or disable a component deployment.</td>
		</tr>
		<tr>
			<td>frontend.route.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.route.host</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Release.Name }}-frontend.{{ .Values.global.domain }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.route.targetPort</td>
			<td>string</td>
			<td><pre lang="json">
"http"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.ports[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"http"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.ports[0].port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.ports[0].protocol</td>
			<td>string</td>
			<td><pre lang="json">
"TCP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.ports[0].targetPort</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.type</td>
			<td>string</td>
			<td><pre lang="json">
"ClusterIP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.autoscaling</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.databaseAlias</td>
			<td>string</td>
			<td><pre lang="json">
"bitnami-pg"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.domain</td>
			<td>string</td>
			<td><pre lang="json">
"apps.silver.devops.gov.bc.ca"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.openshiftImageRegistry</td>
			<td>string</td>
			<td><pre lang="json">
"image-registry.openshift-image-registry.svc:5000"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.podAnnotations</td>
			<td>string</td>
			<td><pre lang="json">
"app.kubernetes.io/timestamp: {{now | toString }}\n"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.registry</td>
			<td>string</td>
			<td><pre lang="json">
"ghcr.io"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.repository</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.annotation."helm.sh/policy"</td>
			<td>string</td>
			<td><pre lang="json">
"keep"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.databaseName</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.databasePassword</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.databaseUser</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.tag</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
	</tbody>
</table>


## Values

<table>
	<thead>
		<th>Key</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</thead>
	<tbody>
		<tr>
			<td>backend.affinity</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[0].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
60
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[0].type</td>
			<td>string</td>
			<td><pre lang="json">
"Percent"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[0].value</td>
			<td>int</td>
			<td><pre lang="json">
10
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[1].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
60
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[1].type</td>
			<td>string</td>
			<td><pre lang="json">
"Pods"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.policies[1].value</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.selectPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Min"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleDown.stabilizationWindowSeconds</td>
			<td>int</td>
			<td><pre lang="json">
300
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[0].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[0].type</td>
			<td>string</td>
			<td><pre lang="json">
"Percent"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[0].value</td>
			<td>int</td>
			<td><pre lang="json">
100
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[1].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[1].type</td>
			<td>string</td>
			<td><pre lang="json">
"Pods"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.policies[1].value</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.selectPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Max"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.behavior.scaleUp.stabilizationWindowSeconds</td>
			<td>int</td>
			<td><pre lang="json">
0
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.maxReplicas</td>
			<td>int</td>
			<td><pre lang="json">
7
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.minReplicas</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.autoscaling.targetCPUUtilizationPercentage</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[0].key</td>
			<td>string</td>
			<td><pre lang="json">
"password"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRES_PASSWORD"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[1].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseUser"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRES_USER"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[2].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseName"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromGlobalSecret[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRES_DATABASE"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromValues[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRES_HOST"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].env.fromValues[0].value</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Release.Name }}-{{.Values.global.databaseAlias}}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].image</td>
			<td>string</td>
			<td><pre lang="json">
"backend"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.httpGet.path</td>
			<td>string</td>
			<td><pre lang="json">
"/api"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.httpGet.port</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.httpGet.scheme</td>
			<td>string</td>
			<td><pre lang="json">
"HTTP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
15
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].livenessProbe.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
5
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"backend"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].ports[0].containerPort</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].ports[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"http"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].ports[0].protocol</td>
			<td>string</td>
			<td><pre lang="json">
"TCP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.httpGet.path</td>
			<td>string</td>
			<td><pre lang="json">
"/api"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.httpGet.port</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.httpGet.scheme</td>
			<td>string</td>
			<td><pre lang="json">
"HTTP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
5
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].readinessProbe.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].registry</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.registry }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].repository</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.repository }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"250m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"250Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"100m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"150Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.containers[0].tag</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.tag }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.deployment.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.deploymentStrategy.type</td>
			<td>string</td>
			<td><pre lang="json">
"Recreate"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[0].key</td>
			<td>string</td>
			<td><pre lang="json">
"databasePassword"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_PASSWORD"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[1].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseJDBCURLNoCreds"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_URL"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[2].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseUser"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromGlobalSecret[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_USER"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_BASELINE_ON_MIGRATE"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[0].value</td>
			<td>string</td>
			<td><pre lang="json">
"true"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_DEFAULT_SCHEMA"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[1].value</td>
			<td>string</td>
			<td><pre lang="json">
"USERS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"FLYWAY_CONNECT_RETRIES"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].env.fromValues[2].value</td>
			<td>string</td>
			<td><pre lang="json">
"30"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].image</td>
			<td>string</td>
			<td><pre lang="json">
"migrations"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"database-migrations"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].registry</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.registry }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].repository</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.repository }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"500m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"250Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"200m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"150Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.initContainers[0].tag</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Values.global.tag }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.nodeSelector</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.ports[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"http"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.ports[0].port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.ports[0].protocol</td>
			<td>string</td>
			<td><pre lang="json">
"TCP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.ports[0].targetPort</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.service.type</td>
			<td>string</td>
			<td><pre lang="json">
"ClusterIP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.tolerations</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"50Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"25Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.role</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[0]</td>
			<td>string</td>
			<td><pre lang="json">
"dev/api-1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[1]</td>
			<td>string</td>
			<td><pre lang="json">
"dev/api-2"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[2]</td>
			<td>string</td>
			<td><pre lang="json">
"test/api-1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[3]</td>
			<td>string</td>
			<td><pre lang="json">
"test/api-2"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[4]</td>
			<td>string</td>
			<td><pre lang="json">
"prod/api-1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backend.vault.secretPaths[5]</td>
			<td>string</td>
			<td><pre lang="json">
"prod/api-2"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].command[0]</td>
			<td>string</td>
			<td><pre lang="json">
"/bin/bash"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].command[1]</td>
			<td>string</td>
			<td><pre lang="json">
"-c"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].command[2]</td>
			<td>string</td>
			<td><pre lang="json">
"/backup.sh -1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[0].key</td>
			<td>string</td>
			<td><pre lang="json">
"password"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"DATABASE_PASSWORD"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[1].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseName"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"POSTGRESQL_DATABASE"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[2].key</td>
			<td>string</td>
			<td><pre lang="json">
"databaseUser"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromGlobalSecret[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"DATABASE_USER"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"BACKUP_DIR"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[0].value</td>
			<td>string</td>
			<td><pre lang="json">
"/backups/"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[1].name</td>
			<td>string</td>
			<td><pre lang="json">
"BACKUP_STRATEGY"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[1].value</td>
			<td>string</td>
			<td><pre lang="json">
"rolling"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[2].name</td>
			<td>string</td>
			<td><pre lang="json">
"NUM_BACKUPS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[2].value</td>
			<td>string</td>
			<td><pre lang="json">
"5"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[3].name</td>
			<td>string</td>
			<td><pre lang="json">
"DAILY_BACKUPS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[3].value</td>
			<td>string</td>
			<td><pre lang="json">
"7"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[4].name</td>
			<td>string</td>
			<td><pre lang="json">
"WEEKLY_BACKUPS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[4].value</td>
			<td>string</td>
			<td><pre lang="json">
"4"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[5].name</td>
			<td>string</td>
			<td><pre lang="json">
"MONTHLY_BACKUPS"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[5].value</td>
			<td>string</td>
			<td><pre lang="json">
"1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[6].name</td>
			<td>string</td>
			<td><pre lang="json">
"DATABASE_SERVICE_NAME"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[6].value</td>
			<td>string</td>
			<td><pre lang="json">
"{{.Release.Name}}-{{.Values.global.databaseAlias}}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[7].name</td>
			<td>string</td>
			<td><pre lang="json">
"DEFAULT_PORT"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].env.fromValues[7].value</td>
			<td>string</td>
			<td><pre lang="json">
"5432"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].image</td>
			<td>string</td>
			<td><pre lang="json">
"backup-container"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].registry</td>
			<td>string</td>
			<td><pre lang="json">
"docker.io"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].repository</td>
			<td>string</td>
			<td><pre lang="json">
"bcgovimages"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"256Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"20m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].tag</td>
			<td>string</td>
			<td><pre lang="json">
"latest"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].volumeMounts[0].mountPath</td>
			<td>string</td>
			<td><pre lang="json">
"/backups/"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.containers[0].volumeMounts[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"{{.Release.Name}}-backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.concurrencyPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Replace"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.failedJobsHistoryLimit</td>
			<td>int</td>
			<td><pre lang="json">
7
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.restartPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Never"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.schedule</td>
			<td>string</td>
			<td><pre lang="json">
"0 0 * * *"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.startingDeadlineSeconds</td>
			<td>int</td>
			<td><pre lang="json">
3600
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.successfulJobsHistoryLimit</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.volumes[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"{{.Release.Name}}-backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.cronjob.volumes[0].persistentVolumeClaim.claimName</td>
			<td>string</td>
			<td><pre lang="json">
"{{.Release.Name}}-backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.pvc.accessModes</td>
			<td>string</td>
			<td><pre lang="json">
"ReadWriteOnce"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.pvc.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.pvc.size</td>
			<td>string</td>
			<td><pre lang="json">
"256Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>backup.pvc.storageClassName</td>
			<td>string</td>
			<td><pre lang="json">
"netapp-file-standard"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.auth.database</td>
			<td>string</td>
			<td><pre lang="json">
"quickstart"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.auth.existingSecret</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Release.Name }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.auth.username</td>
			<td>string</td>
			<td><pre lang="json">
"quickstart"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.backup.cronjob.containerSecurityContext</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.backup.cronjob.podSecurityContext.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.backup.cronjob.storage.size</td>
			<td>string</td>
			<td><pre lang="json">
"200Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.backup.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.image.registry</td>
			<td>string</td>
			<td><pre lang="json">
"ghcr.io"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.image.repository</td>
			<td>string</td>
			<td><pre lang="json">
"bcgov/nr-containers/bitnami/postgresql"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.image.tag</td>
			<td>string</td>
			<td><pre lang="json">
"15.5.0"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.containerSecurityContext.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.initdb.scripts."postgis.sh"</td>
			<td>string</td>
			<td><pre lang="json">
"#!/bin/sh\nPGPASSWORD=$POSTGRES_PASSWORD psql -U postgres -d postgres -c \"CREATE EXTENSION postgis;\"\n"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.persistence.accessModes[0]</td>
			<td>string</td>
			<td><pre lang="json">
"ReadWriteOnce"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.persistence.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.persistence.size</td>
			<td>string</td>
			<td><pre lang="json">
"100Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.persistence.storageClass</td>
			<td>string</td>
			<td><pre lang="json">
"netapp-file-standard"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.podSecurityContext.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"150m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"250Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.primary.resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"150Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>bitnami-pg.shmVolume.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.crunchyImage</td>
			<td>string</td>
			<td><pre lang="json">
"artifacts.developer.gov.bc.ca/bcgov-docker-local/crunchy-postgres-gis:ubi8-15.2-3.3-0"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.imagePullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Always"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.dataVolumeClaimSpec.storage</td>
			<td>string</td>
			<td><pre lang="json">
"120Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.dataVolumeClaimSpec.storageClassName</td>
			<td>string</td>
			<td><pre lang="json">
"netapp-block-standard"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"100m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"512Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.metadata.annotations."prometheus.io/port"</td>
			<td>string</td>
			<td><pre lang="json">
"9187"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.metadata.annotations."prometheus.io/scrape"</td>
			<td>string</td>
			<td><pre lang="json">
"true"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.name</td>
			<td>string</td>
			<td><pre lang="json">
"ha"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicaCertCopy.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicaCertCopy.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicaCertCopy.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicaCertCopy.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"32Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.replicas</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"25m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.instances.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"256Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.max_slot_wal_keep_size</td>
			<td>string</td>
			<td><pre lang="json">
"128MB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.max_wal_size</td>
			<td>string</td>
			<td><pre lang="json">
"64MB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.min_wal_size</td>
			<td>string</td>
			<td><pre lang="json">
"32MB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.shared_buffers</td>
			<td>string</td>
			<td><pre lang="json">
"16MB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.parameters.wal_buffers</td>
			<td>string</td>
			<td><pre lang="json">
"64kB"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.patroni.postgresql.pg_hba</td>
			<td>string</td>
			<td><pre lang="json">
"host all all 0.0.0.0/0 md5"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.image</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repoHost.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repoHost.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repoHost.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repoHost.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.schedules.full</td>
			<td>string</td>
			<td><pre lang="json">
"0 8 * * *"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.schedules.incremental</td>
			<td>string</td>
			<td><pre lang="json">
"0 0,4,12,16,20 * * *"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.volume.accessModes</td>
			<td>string</td>
			<td><pre lang="json">
"ReadWriteOnce"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.volume.storage</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.repos.volume.storageClassName</td>
			<td>string</td>
			<td><pre lang="json">
"netapp-file-backup"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.retention</td>
			<td>string</td>
			<td><pre lang="json">
"1"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.retentionFullType</td>
			<td>string</td>
			<td><pre lang="json">
"count"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.sidecars.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.sidecars.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.sidecars.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgBackRest.sidecars.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.image</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.pgmonitor.exporter.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.postGISVersion</td>
			<td>string</td>
			<td><pre lang="json">
"3.3"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.postgresVersion</td>
			<td>int</td>
			<td><pre lang="json">
15
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.image</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"50m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"128Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.replicas</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"1m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>crunchy.proxy.pgBouncer.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"64Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[0].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
60
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[0].type</td>
			<td>string</td>
			<td><pre lang="json">
"Percent"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[0].value</td>
			<td>int</td>
			<td><pre lang="json">
10
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[1].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
60
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[1].type</td>
			<td>string</td>
			<td><pre lang="json">
"Pods"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.policies[1].value</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.selectPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Min"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleDown.stabilizationWindowSeconds</td>
			<td>int</td>
			<td><pre lang="json">
300
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[0].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[0].type</td>
			<td>string</td>
			<td><pre lang="json">
"Percent"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[0].value</td>
			<td>int</td>
			<td><pre lang="json">
100
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[1].periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[1].type</td>
			<td>string</td>
			<td><pre lang="json">
"Pods"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.policies[1].value</td>
			<td>int</td>
			<td><pre lang="json">
2
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.selectPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Max"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.behavior.scaleUp.stabilizationWindowSeconds</td>
			<td>int</td>
			<td><pre lang="json">
0
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.maxReplicas</td>
			<td>int</td>
			<td><pre lang="json">
7
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.minReplicas</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.autoscaling.targetCPUUtilizationPercentage</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.configmap</td>
			<td>object</td>
			<td><pre lang="json">
{
  "data": {
    "config.js": "const envConfig = (() =\u003e {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"{{ .Release.Name }}-{{ .Release.Namespace }}\"\n  };\n})();",
    "config.prod.js": "const envConfig = (() =\u003e {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"static\"\n  };\n})();"
  },
  "enabled": true
}
</pre>
</td>
			<td>the configmap specific to the component.</td>
		</tr>
		<tr>
			<td>frontend.configmap.data</td>
			<td>object</td>
			<td><pre lang="json">
{
  "config.js": "const envConfig = (() =\u003e {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"{{ .Release.Name }}-{{ .Release.Namespace }}\"\n  };\n})();",
  "config.prod.js": "const envConfig = (() =\u003e {\n  return {\n    \"VITE_DEPLOY_ENVIRONMENT\":\"static\"\n  };\n})();"
}
</pre>
</td>
			<td>dat contains key value pairs for the configmap. can contain multiple files. value can be piped as string.</td>
		</tr>
		<tr>
			<td>frontend.configmap.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>enable or disable the configmap.</td>
		</tr>
		<tr>
			<td>frontend.containers</td>
			<td>list</td>
			<td><pre lang="json">
[
  {
    "env": {
      "fromLocalConfigmap": [
        {
          "key": "config.js",
          "name": "frontend-configmap"
        },
        {
          "key": "config.prod.js",
          "name": "frontend-prod-configmap"
        }
      ],
      "fromValues": [
        {
          "name": "BACKEND_URL",
          "value": "http://{{ .Release.Name }}-backend"
        },
        {
          "name": "LOG_LEVEL",
          "value": "info"
        }
      ]
    },
    "image": "frontend",
    "livenessProbe": {
      "failureThreshold": 3,
      "httpGet": {
        "path": "/health",
        "port": 3001,
        "scheme": "HTTP"
      },
      "initialDelaySeconds": 15,
      "periodSeconds": 30,
      "successThreshold": 1,
      "timeoutSeconds": 5
    },
    "name": "frontend",
    "ports": [
      {
        "containerPort": 3000,
        "name": "http",
        "protocol": "TCP"
      },
      {
        "containerPort": 3001,
        "name": "http2",
        "protocol": "TCP"
      }
    ],
    "readinessProbe": {
      "failureThreshold": 30,
      "httpGet": {
        "path": "/health",
        "port": 3001,
        "scheme": "HTTP"
      },
      "initialDelaySeconds": 5,
      "periodSeconds": 2,
      "successThreshold": 1,
      "timeoutSeconds": 2
    },
    "registry": "{{ .Values.global.registry }}",
    "repository": "{{ .Values.global.repository }}",
    "resources": {
      "limits": {
        "cpu": "100m",
        "memory": "150Mi"
      },
      "requests": {
        "cpu": "30m",
        "memory": "50Mi"
      }
    },
    "securityContext": {
      "capabilities": {
        "add": [
          "NET_BIND_SERVICE"
        ]
      }
    },
    "tag": "{{ .Values.global.tag }}"
  }
]
</pre>
</td>
			<td>the containers specific to the component. one or many containers can be defined.</td>
		</tr>
		<tr>
			<td>frontend.deployment</td>
			<td>object</td>
			<td><pre lang="json">
{
  "enabled": true
}
</pre>
</td>
			<td>can be either a statefulSet or a deployment not both. TBD (StatefulSet)</td>
		</tr>
		<tr>
			<td>frontend.deploymentStrategy</td>
			<td>object</td>
			<td><pre lang="json">
{
  "type": "Recreate"
}
</pre>
</td>
			<td>the deployment strategy, can be "Recreate" or "RollingUpdate"</td>
		</tr>
		<tr>
			<td>frontend.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>enable or disable a component deployment.</td>
		</tr>
		<tr>
			<td>frontend.route.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.route.host</td>
			<td>string</td>
			<td><pre lang="json">
"{{ .Release.Name }}-frontend.{{ .Values.global.domain }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.route.targetPort</td>
			<td>string</td>
			<td><pre lang="json">
"http"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.ports[0].name</td>
			<td>string</td>
			<td><pre lang="json">
"http"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.ports[0].port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.ports[0].protocol</td>
			<td>string</td>
			<td><pre lang="json">
"TCP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.ports[0].targetPort</td>
			<td>int</td>
			<td><pre lang="json">
3000
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>frontend.service.type</td>
			<td>string</td>
			<td><pre lang="json">
"ClusterIP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.autoscaling</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.databaseAlias</td>
			<td>string</td>
			<td><pre lang="json">
"bitnami-pg"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.domain</td>
			<td>string</td>
			<td><pre lang="json">
"apps.silver.devops.gov.bc.ca"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.openshiftImageRegistry</td>
			<td>string</td>
			<td><pre lang="json">
"image-registry.openshift-image-registry.svc:5000"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.podAnnotations</td>
			<td>string</td>
			<td><pre lang="json">
"app.kubernetes.io/timestamp: {{now | toString }}\n"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.registry</td>
			<td>string</td>
			<td><pre lang="json">
"ghcr.io"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.repository</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.annotation."helm.sh/policy"</td>
			<td>string</td>
			<td><pre lang="json">
"keep"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.databaseName</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.databasePassword</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.databaseUser</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.secrets.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.tag</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
	</tbody>
</table>



