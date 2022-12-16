/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  coverageReporters: [
    'text',
    'cobertura',
    'lcov'
  ]
};

process.env = Object.assign(process.env, {
  REACT_APP_KC_URL: 'https://dev.any-keycloak-server.com/auth',
  REACT_APP_KC_REALM: 'default',
  REACT_APP_KC_CLIENT_ID: 'test-client-id'
});
