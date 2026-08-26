const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  const url = 'file:///' + path.resolve('frontend/index.html').replace(/\\/g, '/');
  await page.goto(url);
  await page.waitForTimeout(800);

  // Check 1: Horizontal scroll check
  const horizScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth;
  });
  console.log('Horizontal overflow detected (should be false):', horizScroll);

  // Check 2: Scroll down to the maximum on Overview
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'frontend/verify-mobile-overview-final-scroll.png' });

  // Check 3: Flows tab compact size & no scroll
  await page.click('#mobile-btn-returns');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'frontend/verify-mobile-flows-compact-final.png' });

  const flowsScrollable = await page.evaluate(() => {
    return document.documentElement.scrollHeight > window.innerHeight;
  });
  console.log('Flows scrollable (should be false):', flowsScrollable);

  await browser.close();
  console.log('Tests finished successfully!');
})();
