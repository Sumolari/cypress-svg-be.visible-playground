describe('SVG nodes visibility', function() {
  it('.should() - assert that SVG circle is visible', function() {
    cy.visit('index.html')
      .get('.svg-container').should('be.visible')
      // This one is expected to fail in Electron
      .get('.svg-circle').should('be.visible')
  })
  it('.should() - assert that SVG circle is legacy visible', function() {
    cy.visit('index.html')
      .get('.svg-container').should('be.legacyVisible')
      // This one is expected to work in Electron, too
      .get('.svg-circle').should('be.legacyVisible')
  })
})