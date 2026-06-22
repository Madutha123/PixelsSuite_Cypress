// cypress/e2e/03_image_resize.cy.js

describe('Image Resize', () => {

  // ─────────────────────────────────────────────────────────────────────
  // TC_01 – Resize Image without Preserving Aspect Ratio  |  Status: Pass
  // ─────────────────────────────────────────────────────────────────────
  it('TC_01 – Resize Image without Preserving Aspect Ratio', () => {
    cy.visit('/resize-image', { failOnStatusCode: false });

    // Upload image
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/uploads/images/image.png',
      { force: true }
    );

    // Wait for resize controls to appear
    cy.get('input[type="number"]', { timeout: 15000 }).should('be.visible');

    // Disable "Keep Aspect" checkbox if it is checked
    cy.get('input[type="checkbox"]').then(($cb) => {
      if ($cb.prop('checked')) {
        cy.wrap($cb).uncheck({ force: true });
      }
    });

    // Enter target width = 800, height = 400
    cy.get('input[type="number"]').first().clear().type('800');
    cy.get('input[type="number"]').eq(1).clear().type('400');

    // Click Download
    cy.contains('button', /download/i).click();

    // Verify no error message appeared → download triggered successfully
    cy.wait(2000);
    cy.get('body').should('not.contain.text', 'error');
  });


  // ─────────────────────────────────────────────────────────────────────
  // TC_03 – Resize Image Exceeding 20 MB  |  Status: Fail (known bug)
  // ─────────────────────────────────────────────────────────────────────
  it('TC_03 – Resize Image Exceeding Maximum File Size (20 MB)', () => {
    cy.visit('/resize-image', { failOnStatusCode: false });

    // Upload oversized image (~30 MB)
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/uploads/images/oversize.jpg',
      { force: true }
    );

    cy.wait(4000);

    // Ensure Keep Aspect is enabled
    cy.get('input[type="checkbox"]').then(($cb) => {
      if (!$cb.prop('checked')) {
        cy.wrap($cb).check({ force: true });
      }
    });

    // Enter width if controls appeared
    cy.get('body').then(($body) => {
      if ($body.find('input[type="number"]').length) {
        cy.get('input[type="number"]').first().clear().type('600');
      }
    });

    // Click Download if available
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Download")').length || $body.text().match(/download/i)) {
        cy.contains('button', /download/i).click({ force: true });
      }
    });

    cy.wait(3000);

    // EXPECTED: error message for oversized image
    // ACTUAL: no error is shown (this assertion will fail, confirming the bug)
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(
        text.includes('exceeds') ||
        text.includes('20 MB') ||
        text.includes('maximum') ||
        text.includes('too large'),
        'Expected error: "Image size exceeds the maximum allowed limit of 20 MB."'
      ).to.be.true;
    });
  });


  // ─────────────────────────────────────────────────────────────────────
  // TC_07 – Enlarge an Uploaded Image  |  Status: Pass
  // ─────────────────────────────────────────────────────────────────────
  it('TC_07 – Enlarge an Uploaded Image', () => {
    cy.visit('/image-enlarger', { failOnStatusCode: false });

    // Upload image
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/uploads/images/image2.jpg',
      { force: true }
    );

    cy.wait(3000);

    // Select magnification level – handles range slider, select, or buttons
    cy.get('body').then(($body) => {
      if ($body.find('input[type="range"]').length) {
        cy.get('input[type="range"]')
          .invoke('val', 2)
          .trigger('input', { force: true })
          .trigger('change', { force: true });
      } else if ($body.find('select').length) {
        cy.get('select').first().select('2', { force: true });
      } else if ($body.find('input[type="radio"]').length) {
        cy.get('input[type="radio"]').first().check({ force: true });
      }
    });

    // Click Download
    cy.contains('button', /download/i).click();

    cy.wait(2000);

    // Verify enlarged image downloaded with no errors
    cy.get('body').should('not.contain.text', 'error');
  });

});
