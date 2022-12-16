/*
 * IDIR: idir
 * BCeID Basic: bceid-basic
 * BCeID Business: bceid-business
 * BCeID Basic or Business: bceid-basic-and-business
 * GitHub: github
 * From https://github.com/bcgov/sso-keycloak/wiki/Recommend-Skipping-the-Keycloak-Login-Page-and-if-you-ABSOLUTELY-need-it
 */
enum LoginProviders {
  IDIR = 'idir',
  BCEID_BUSINESS = 'bceid-business'
}

export default LoginProviders;
