import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://nrfesampleapp-test-app.apps.silver.devops.gov.bc.ca',
    viewportWidth: 1280,
    viewportHeight: 720,
    experimentalWebKitSupport: true,
    env: {
      apiUrl: 'https://nrbestapi-test-service-api.apps.silver.devops.gov.bc.ca'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
