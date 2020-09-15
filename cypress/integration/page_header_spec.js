// @flow strict
describe('Page Headers', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Loads the installation page', () => {
    cy.get('.docSearch-content h1')
      .invoke('text')
      .invoke('trim')
      .should('equal', 'Installation');
  });

  it('navigates to the development page', () => {
    cy.contains('a', 'Development').click();
    cy.url().should('match', /Development/);
    cy.get('.docSearch-content h1')
      .invoke('text')
      .invoke('trim')
      .should('equal', 'Development');
    cy.url().should('include', Cypress.config('baseUrl'));
  });
});
