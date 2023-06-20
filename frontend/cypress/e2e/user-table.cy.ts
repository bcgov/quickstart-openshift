/// <reference types="cypress" />
describe("User Table", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders the table", () => {
    cy.get("h6.MuiTypography-root").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).to.eq('User List')
    });
    cy.get("th.MuiTableCell-root:nth-child(2) > span:nth-child(1) > button:nth-child(1) > div:nth-child(1) > div:nth-child(1)").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).to.eq('ID');
    });
    cy.get("th.MuiTableCell-root:nth-child(3) > span:nth-child(1) > button:nth-child(1)").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).to.eq('NAME');
    });
    cy.get("th.MuiTableCell-root:nth-child(4) > span:nth-child(1) > button:nth-child(1) > div:nth-child(1) > div:nth-child(1)").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).to.eq('EMAIL');
    });
    cy.get(".MuiTableBody-root").should("exist").should(($div) => {
      // access the native DOM element
      console.info($div.get(0))
      expect($div.get(0).childNodes.length).to.eq(5);
    });
  });
});
