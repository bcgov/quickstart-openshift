const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('process');

(async () => {
  const targetUrl = process.argv[2];
  if (!targetUrl) {
    console.error('Usage: node scan.js <url>');
    process.exit(1);
  }

  console.log(`Scanning ${targetUrl}...`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    bypassCSP: true
  });
  const page = await context.newPage();

  try {
    await page.goto(targetUrl, { waitUntil: 'load' });

    const results = await new AxeBuilder({ page }).analyze();

    const outputPath = 'a11y-results.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log(`Found ${results.violations.length} violations`);
    console.log(`Results saved to ${outputPath}`);

    // Summary for GitHub Actions output
    const summary = {
      url: targetUrl,
      violations: results.violations.length,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length
    };
    console.log('Summary:', JSON.stringify(summary));

    await browser.close();

    // Exit non-zero if there are any violations
    if (results.violations.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    await browser.close();
    console.error('Scanning error:', error);
    process.exit(1);
  }
})();
