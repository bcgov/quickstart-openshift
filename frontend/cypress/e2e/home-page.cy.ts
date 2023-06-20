/// <reference types="cypress" />
describe("Home page visit", () => {

  it("visit landing page", () => {
    cy.visit("/");
    cy.contains("Quickstart OpenShift");
  });
});
