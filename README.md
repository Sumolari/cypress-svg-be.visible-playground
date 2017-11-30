Just a demo to show how Cypress 1.1.2 with Electron fails to check visibility of a path inside an SVG and a temporal workaround.

# Requirements

This project assumes you have `yarn` installed. You can run everything but `npm test` without yarn.

# How to test

There are 6 npm scripts:

- `cypress-open`: opens Cypress GUI.
- `server`: starts a server to check `index.html` running on `PORT` env variable, defaulting to `3000`.
- `test`: requires `yarn`. Runs electron, chromium and chrome tests.
- `test-electron`: runs tests using `electron`.
- `test-chromium`: runs tests using `chromium`.
- `test-chrome`: runs tests using `chrome`.

# What's the problem?

```js
cy.get('.something').should('be.visible')
```

Is not reliable when used to check whether components of an SVG node are visible or not because old versions of Chromum [did not have a proper implementation of `getClientRects`](https://bugs.chromium.org/p/chromium/issues/detail?id=643044#c2), which was in turn used to compute the visibility of those elements.

# What's the workaround?

Adding a new assertion to `chai` which uses a different logic when the browser is an old version of Electron.

See [legacyVisible.js](https://github.com/Sumolari/cypress-svg-be.visible-playground/blob/master/cypress/support/legacyVisible.js) for its implementation. You can use it with:

```js
// Add this to your Cypress support file.
import { legacyVisible } from './legacyVisible'
chai.use(legacyVisible)

// Then you can use:
cy.get('.something').should('be.legacyVisible')
```

Note that `legacyVisible` will be equivalent to `visible` when running tests on non-legacy Electron versions.
