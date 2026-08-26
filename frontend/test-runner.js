const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const url = 'file:///' + path.resolve('frontend/index.html').replace(/\\/g, '/');
  await page.goto(url);
  await page.waitForTimeout(1000);

  const posthogLoaded = await page.evaluate(() => {
    return typeof window.posthog !== 'undefined' && typeof window.posthog.capture === 'function';
  });
  console.log('PostHog initialized successfully:', posthogLoaded);

  // Switch tabs
  await page.click('#mobile-btn-holdings');
  await page.waitForTimeout(300);
  await page.click('#mobile-btn-returns');
  await page.waitForTimeout(300);
  await page.click('#mobile-btn-transactions');
  await page.waitForTimeout(300);

  console.log('Page errors:', errors);
  await browser.close();
  console.log('Telemetry verification complete!');
})();
