/// <reference types="cypress" />
describe("User Table", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders the table", () => {
    cy.get(".MuiDataGrid-root").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).exist
    });
    cy.get("div.MuiDataGrid-columnHeader:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).to.eq('Employee ID');
    });
    cy.get("div.MuiDataGrid-columnHeader:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).to.eq('Employee Name');
    });
    cy.get("div.MuiDataGrid-columnHeader:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).to.eq('Employee Email');
    });
    cy.get(".MuiTablePagination-displayedRows").should("exist").should(($div) => {
      // access the native DOM element
      expect($div.get(0).innerText).to.contains('of 5');
    });
  });
});
