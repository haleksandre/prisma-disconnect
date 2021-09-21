/// <reference types="cypress" />
// / <reference types="nexus-typegen" />

declare namespace Cypress {
  interface Chainable {
    graphql<T = any>(
      query: string,
      variables?: Record<string, unknown>
    ): Chainable<Response<T>>;

    setup(trailing?: boolean): Chainable<Response<any>>;

    teardown(): Chainable<Response<any>>;
  }
}
