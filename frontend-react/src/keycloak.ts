import Keycloak from 'keycloak-js';

const url = import.meta.env.VITE_KC_URL || '';
const realm = import.meta.env.VITE_KC_REALM || '';
const clientId = import.meta.env.VITE_KC_CLIENT_ID || '';

const keycloak = new Keycloak({
  url,
  realm,
  clientId
});

export default keycloak;
