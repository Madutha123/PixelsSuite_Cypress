# PixelsSuite Cypress E2E Automation Testing Suite

This repository contains an automated end-to-end (E2E) testing suite developed using **Cypress** to test and validate various web tools on [PixelsSuite](https://www.pixelssuite.com). The project was built as part of a Software Quality Assurance (SQA) assignment to verify core functionalities and check robustness under boundary and error conditions.

---

## 🌐 Target Website
* **URL:** [https://www.pixelssuite.com](https://www.pixelssuite.com)
* **Description:** A web-based suite of image and document processing tools (Resize, Crop, Compress, Format Conversion, PDF Editing, etc.).

---

## 🛠️ Tech Stack & Dependencies
* **Testing Framework:** Cypress (`^15.14.0`)
* **File Upload Support:** `cypress-file-upload` (`^5.0.8`)
* **Reporting Library:** `mochawesome` with merging capabilities (`mochawesome-merge`, `mochawesome-report-generator`)

---

## 📋 Test Directory & Test Case Coverage

The automated tests are mapped inside the `cypress/e2e/` directory:

### 1. Image Resize (`cypress/e2e/03_image_resize.cy.js`)
* **TC_01 – Resize Image without Preserving Aspect Ratio**  
  * **Goal:** Verify that a user can successfully resize an uploaded image by manually specifying custom width and height.
  * **Result:** `🟢 PASS`
* **TC_03 – Resize Image Exceeding Maximum File Size (20 MB)**  
  * **Goal:** Verify system response and error validation when attempting to resize an oversized file (~30 MB).
  * **Result:** `🔴 FAIL` (Known Bug: Validation fails to prompt an error message; the download attempts to trigger regardless).
* **TC_07 – Enlarge an Uploaded Image**  
  * **Goal:** Verify that magnifying and downloading an image works correctly.
  * **Result:** `🟢 PASS`

### 2. Image Crop (`cypress/e2e/04_image_crop.cy.js`)
* **TC_09 – Upload and Crop an Image to PNG Format**  
  * **Goal:** Test successful image cropping on a canvas with coordinate inputs.
  * **Result:** `🟢 PASS`
* **TC_12 – Upload and Crop an Image in an Unsupported Format**  
  * **Goal:** Validate error reporting when an unsupported format (e.g., PDF) is uploaded to the image cropper.
  * **Result:** `🔴 FAIL` (Known Bug: No unsupported format validation warning is displayed to the user).

### 3. Work-in-Progress Specs (Placeholders)
The following files are mapped out for future test implementations:
* `01_document_converter.cy.js`
* `02_pdf_editor.cy.js`
* `05_image_compress.cy.js`
* `06_image_converter.cy.js`

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd PixelsSuite_Cypress
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```

---

## 🏃 Running the Tests

### 1. Cypress Test Runner (Interactive GUI Mode)
To launch the Cypress interactive window:
```bash
npm run cy:open
```

### 2. Headless Mode (CLI Execution)
To run all tests in the background:
```bash
npm run cy:run
```

To run a specific test suite (e.g., Image Resize):
```bash
npx cypress run --spec "cypress/e2e/03_image_resize.cy.js"
```

---

## 📊 Test Reporting (Mochawesome)

Test reports are automatically generated after running the tests in headless mode.
* **Report Location:** `cypress/reports/`
* Open any generated `.html` report in your browser to view a detailed, visual breakdown of the test results, assertions, execution time, and screenshots of failed tests.

---

## 📸 Artifacts
* **Failed Screenshots:** Located in `cypress/screenshots/`
* **Test Runs Video Recordings:** Located in `cypress/videos/`
