describe('main page test', () => {
  let pageHeaders: {
    main: string,
    userForm: string,
    userFormCard: string,
    searchCard: string
  };

  beforeEach(() => {
    cy.visit('/');

    // Loading test data
    cy.fixture('titles').then((ttls) => {
      pageHeaders = ttls;
    });
  });

  it('main page is displayed and loads correctly', () => {
    cy.getByDataTest('home-title').should('have.text', pageHeaders.main);
    cy.getByDataTest('card-form__title').should('have.text', pageHeaders.userFormCard);
  });

  it('navigate to the user form page', () => {
    cy.getByDataTest('card-form__button').click();
    cy.getByDataTest('form-title').should('have.text', pageHeaders.userForm);
  });
});
