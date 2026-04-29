const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const process = require('process');

(async () => {
  const targetUrl = process.argv[2];
  if (!targetUrl) {
    console.error('::error::Usage: node scan.js <url>');
    process.exit(1);
  }

  console.log(`Starting accessibility scan against: ${targetUrl}`);
  console.log('Using Playwright to bypass Content Security Policy (CSP)...');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    bypassCSP: true, // Critical for bypassing strict CSPs in deployed apps
    ignoreHTTPSErrors: true // Handle wildcard dev certificates
  });
  const page = await context.newPage();

  try {
    const response = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    if (!response || !response.ok()) {
      console.warn(`::warning::Page returned status ${response ? response.status() : 'unknown'}`);
    }

    console.log('Page loaded. Running axe-core analysis...');
    
    // Run the scan
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']) // Standard compliance
      .analyze();

    // 1. Write the full raw artifact for debugging
    const outputPath = 'a11y-results.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nFull scan results saved to ${outputPath}`);

    // 2. Define what impacts block the PR
    const blockingImpacts = ['serious', 'critical'];
    const blockingViolations = results.violations.filter(v => blockingImpacts.includes(v.impact));
    const warningViolations = results.violations.filter(v => !blockingImpacts.includes(v.impact));

    // 3. Output rich console logs and GitHub Annotations
    console.log('\n========================================================');
    console.log('                 ACCESSIBILITY REPORT                   ');
    console.log('========================================================');
    console.log(`Total Violations: ${results.violations.length}`);
    console.log(`Blocking (Serious/Critical): ${blockingViolations.length}`);
    console.log(`Warnings (Minor/Moderate): ${warningViolations.length}`);
    console.log(`Passes: ${results.passes.length}`);
    console.log('========================================================\n');

    // Print details for every violation so devs don't have to download the JSON
    for (const violation of results.violations) {
      const isBlocking = blockingImpacts.includes(violation.impact);
      const prefix = isBlocking ? '::error::' : '::warning::';
      
      console.log(`${prefix}[${violation.impact.toUpperCase()}] ${violation.id}: ${violation.help}`);
      console.log(`  Fix: ${violation.helpUrl}`);
      
      // Print the specific HTML elements that failed
      for (const node of violation.nodes) {
        console.log(`  - Element: ${node.html}`);
        console.log(`    Issue: ${node.failureSummary}`);
      }
      console.log('');
    }

    await browser.close();

    // 4. Fail the workflow if blocking violations exist
    if (blockingViolations.length > 0) {
      console.error(`::error::Accessibility scan failed! Found ${blockingViolations.length} blocking violations.`);
      process.exit(1);
    } else {
      console.log('✅ Accessibility scan passed! No blocking violations found.');
      process.exit(0);
    }

  } catch (error) {
    await browser.close();
    console.error(`::error::Scanning error encountered: ${error.message}`);
    process.exit(1);
  }
})();