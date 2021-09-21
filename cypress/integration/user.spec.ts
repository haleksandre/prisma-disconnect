describe("users", () => {
  beforeEach(() => {
    cy.setup();
  });

  afterEach(() => {
    cy.teardown();
  });

  for (let i = 1; i <= 40; i++) {
    it(`returns all users ${i}`, () => {
      cy.graphql(
        `
          query Users {
            users {
              email
            }
          }
        `
      ).then(({ status, body }) => {
        const { users } = body.data;

        expect(status).to.equals(200);
        expect(users).to.have.length(0);
      });
    });
  }
});
