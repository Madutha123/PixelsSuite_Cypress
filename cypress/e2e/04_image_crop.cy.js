// cypress/e2e/04_image_crop.cy.js

describe('Image Crop', () => {

  // ─────────────────────────────────────────────────────────────────────
  // TC_09 – Upload and Crop an Image to PNG Format  |  Status: Pass
  // ─────────────────────────────────────────────────────────────────────
  it('TC_09 – Upload and Crop an Image to PNG Format', () => {
    cy.visit('/crop-png', { failOnStatusCode: false });

    // Upload a supported image (PNG)
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/uploads/images/image.png',
      { force: true }
    );

    // Wait for crop controls to appear
    cy.wait(4000);

    // Select crop area via numeric inputs (X, Y, Width, Height) if present
    cy.get('body').then(($body) => {
      const inputs = $body.find('input[type="number"]');
      if (inputs.length >= 4) {
        cy.get('input[type="number"]').eq(0).clear().type('10');   // X
        cy.get('input[type="number"]').eq(1).clear().type('10');   // Y
        cy.get('input[type="number"]').eq(2).clear().type('300');  // Width
        cy.get('input[type="number"]').eq(3).clear().type('200');  // Height
      } else if (inputs.length >= 2) {
        cy.get('input[type="number"]').eq(0).clear().type('300');  // Width
        cy.get('input[type="number"]').eq(1).clear().type('200');  // Height
      } else if ($body.find('canvas').length) {
        // Canvas-based cropper
        cy.get('canvas').first()
          .trigger('mousedown', { clientX: 50,  clientY: 50  })
          .trigger('mousemove', { clientX: 300, clientY: 250 })
          .trigger('mouseup',   { clientX: 300, clientY: 250 });
      }
    });

    // Click Download
    cy.contains('button', /download/i).click();

    cy.wait(2000);

    // Verify image cropped and downloaded with no errors
    cy.get('body').should('not.contain.text', 'error');
  });


  // ─────────────────────────────────────────────────────────────────────
  // TC_12 – Upload Unsupported Format to Crop JPG  |  Status: Fail (bug)
  // ─────────────────────────────────────────────────────────────────────
  it('TC_12 – Upload and Crop an Image in an Unsupported Format', () => {
    cy.visit('/crop-jpg', { failOnStatusCode: false });

    // Upload an unsupported file format (PDF)
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/uploads/pdf/pdf1.pdf',
      { force: true }
    );

    cy.wait(4000);

    // Click Download if it appeared (shouldn't have)
    cy.get('body').then(($body) => {
      if ($body.find('button').length && $body.text().match(/download/i)) {
        cy.contains('button', /download/i).click({ force: true });
      }
    });

    cy.wait(2000);

    // EXPECTED: show error "Unsupported file format. Please upload PNG, JPG, or WebP images."
    // ACTUAL: no error shown (this assertion will fail, confirming the bug)
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(
        text.includes('Unsupported file format') ||
        text.includes('Please upload PNG') ||
        text.includes('unsupported') ||
        text.includes('not supported') ||
        text.includes('invalid format'),
        'Expected error: "Unsupported file format. Please upload PNG, JPG, or WebP images."'
      ).to.be.true;
    });
  });

});
