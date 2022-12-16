/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-testid attribute.
     *
     * @param selector {string} - The data-testid attribute of the object to be selected
     * @example
     * cy.getByDataTest('main')
     */
    getByDataTest(selector: string): Chainable<JQuery<HTMLElement>>

    /**
     * Custom command to delete a user using the API.
     *
     * @param firstname {string} - The user first name
     * @param lastname {string} - The user last name
     * @example
     * cy.deleteUser('Jhon', 'Doe')
     */
    deleteUser(firstname: string, lastname: string): void

    /**
     * Custom command to create a user using the API.
     *
     * @param firstname {string} - The user first name
     * @param lastname {string} - The user last name
     * @example
     * cy.createUser('Jhon', 'Doe')
     */
    createUser(firstname: string, lastname: string): void
  }
}
