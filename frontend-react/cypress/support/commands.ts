// @ts-check
/// <reference path="../global.d.ts" />

Cypress.Commands.add('getByDataTest', (selector) => cy.get(`[data-testid=${selector}]`));

Cypress.Commands.add('deleteUser', (firstname, lastname) => {
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/users/${firstname}/${lastname}`,
    failOnStatusCode: false
  }).then((response) => {
    cy.log(`${response.status}`);
    cy.log(response.body);
  });
});

Cypress.Commands.add('createUser', (firstname, lastname) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/users`,
    failOnStatusCode: false,
    body: {
      firstName: firstname,
      lastName: lastname
    }
  }).then((response) => {
    cy.log(`${response.status}`);
    cy.log(response.body);
  });
});
