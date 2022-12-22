/*
 * IDIR: idir
 * Azure IDIR: azureidir
 * Basic BCeID: bceidbasic
 * Business BCeID: bceidbusiness
 * Basic or Business BCeID: bceidboth
 * GitHub BC Gov: githubbcgov
 * GitHub Public: githubpublic
 * From https://github.com/bcgov/sso-keycloak/wiki/Using-Your-SSO-Client#do-skip-the-keycloak-login-page
 */
enum LoginProviders {
  IDIR = 'idir',
  AZURE_IDIR = 'azureidir',
  BASIC_BCEID = 'bceidbasic',
  BUSINESS_BCEID = 'bceidbusiness',
  BASIC_OR_BUSINESS_BCEID = 'bceidboth',
  GITHUB_BCGOV = 'githubbcgov',
  GITHUB_PUBLIC = 'githubpublic',
}

export default LoginProviders;
