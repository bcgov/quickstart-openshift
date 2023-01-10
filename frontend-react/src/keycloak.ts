import Keycloak from 'keycloak-js';

interface IConfig {
  VITE_KC_URL: string;
  VITE_KC_REALM: string;
  VITE_KC_CLIENT_ID: string;
}

declare global {
  interface Window {
    config?: IConfig;
  }
}

console.log(`window.config?.VITE_KC_URL=${window.config?.VITE_KC_URL}`);
console.log(`window.config?.VITE_KC_REALM=${window.config?.VITE_KC_REALM}`);
console.log(`window.config?.VITE_KC_CLIENT_ID=${window.config?.VITE_KC_CLIENT_ID}`);

const url = window.config?.VITE_KC_URL || '';
const realm = window.config?.VITE_KC_REALM || '';
const clientId = window.config?.VITE_KC_CLIENT_ID || '';

const keycloak = new Keycloak({
  url,
  realm,
  clientId
});

export default keycloak;
