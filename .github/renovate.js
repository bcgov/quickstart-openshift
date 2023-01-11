{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "packageRules": [
    {
      "matchManagers": [
        "npm"
      ],
      "matchUpdateTypes": [
        "minor",
        "patch",
        "lockFileMaintenance"
      ],
      "groupName": "npm all non-major dependencies",
      "groupSlug": "npm all-minor-patch"
    },
    {
      "matchManagers": [
        "github-actions"
      ],
      "matchUpdateTypes": [
        "minor",
        "patch"
      ],
      "groupName": "github actions all non-major dependencies",
      "groupSlug": "github actions all-minor-patch"
    },
    {
      "matchManagers": [
        "dockerfile",
        "docker-compose"
      ],
      "enabled": false
    }
  ],
  "lockFileMaintenance": {
    "enabled": true
  },
  "autodiscover": true,
  "rebaseWhen": "behind-base-branch"
}
