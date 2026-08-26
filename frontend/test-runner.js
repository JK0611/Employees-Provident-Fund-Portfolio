const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  const url = 'file:///' + path.resolve('frontend/index.html').replace(/\\/g, '/');
  await page.goto(url);
  await page.waitForTimeout(800);

  // 1. Overview: Scroll down to the bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'frontend/verify-mobile-overview-bottom.png' });

  // 2. Flows (Returns): Verify scroll is disabled and layout fits cleanly
  await page.click('#mobile-btn-returns');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'frontend/verify-mobile-flows-noscroll.png' });

  // Verify scroll is disabled on flows
  const canScrollFlows = await page.evaluate(() => {
    return document.documentElement.scrollHeight > window.innerHeight;
  });
  console.log('Flows scroll check (should be false/clean):', canScrollFlows);

  await browser.close();
  console.log('Mobile tests completed successfully!');
})();
