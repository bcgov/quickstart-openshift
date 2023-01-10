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

let url = window.config?.VITE_KC_URL || '';
let realm = window.config?.VITE_KC_REALM || '';
let clientId = window.config?.VITE_KC_CLIENT_ID || '';

if (!url) {
  url = import.meta.env.VITE_KC_URL;
}
if (!realm) {
  realm = import.meta.env.VITE_KC_REALM;
}
if (!clientId) {
  clientId = import.meta.env.VITE_KC_CLIENT_ID;
}

if (!url || !realm || !clientId) {
  console.warn('One or more required environment variables are not set! (VITE_KC_URL, VITE_KC_REALM, VITE_KC_CLIENT_ID)');
}

const keycloak = new Keycloak({
  url,
  realm,
  clientId
});

export default keycloak;
