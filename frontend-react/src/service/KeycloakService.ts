import keycloak from '../keycloak';
import KeycloakUser from '../types/KeycloakUser';

const initKeycloak = () => keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso`,
  pkceMethod: 'S256'
});

const { login } = keycloak;

const { logout } = keycloak;

const { createLoginUrl } = keycloak;

const getToken = () => keycloak.token;

const isLoggedIn = () => !!keycloak.token;

const updateToken = (successCallback: any) => {
  keycloak.updateToken(5)
    .then(successCallback)
    // eslint-disable-next-line no-console
    .catch(console.error);
};

const authMethod = (): string => {
  let method = '';
  if (isLoggedIn()) {
    method = keycloak.tokenParsed?.identity_provider;
  }
  return method;
};

const getRoles = (): string[] => {
  const roles: string[] = [];
  if (isLoggedIn() && Array.isArray(keycloak.tokenParsed?.client_roles)) {
    keycloak.tokenParsed?.client_roles.forEach((role: string) => {
      roles.push(role);
    });
  }
  return roles;
};

const getUser = (): KeycloakUser => {
  const displayName = keycloak.tokenParsed?.display_name;
  const lastName = keycloak.tokenParsed?.last_name;
  const firstName = keycloak.tokenParsed?.first_name;
  const idirUsername = keycloak.tokenParsed?.idir_username;
  const email = keycloak.tokenParsed?.email;
  const name = keycloak.tokenParsed?.name;
  const roles: string[] = getRoles();

  return {
    displayName,
    email,
    lastName,
    firstName,
    idirUsername,
    name,
    roles
  };
};

const KeycloakService = {
  initKeycloak,
  login,
  logout,
  createLoginUrl,
  isLoggedIn,
  getToken,
  updateToken,
  authMethod,
  getUser
};

export default KeycloakService;
