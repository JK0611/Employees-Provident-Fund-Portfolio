const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const url = 'file:///' + path.resolve('frontend/index.html').replace(/\\/g, '/');
  await page.goto(url);
  await page.waitForTimeout(1000);

  // 1. Desktop Dashboard with Cursor Hover on Portfolio Trend
  const canvasBox = await page.locator('#portfolio-canvas').boundingBox();
  if (canvasBox) {
    await page.mouse.move(canvasBox.x + canvasBox.width * 0.65, canvasBox.y + canvasBox.height * 0.5);
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'frontend/fix-desktop-line-hover.png' });
  }

  // 2. Desktop Holdings (Verify Pie Charts on initial tab switch)
  await page.click('#tab-holdings');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'frontend/fix-desktop-pie-charts.png' });

  // 3. Switch to Mobile Device (390 x 844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);

  // 4. Mobile Dashboard (Verify Portfolio Line Graph is NOT cut off)
  await page.click('.mobile-tab-btn[data-tab="dashboard"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'frontend/fix-mobile-line-full.png' });

  // 5. Mobile Returns (Verify Net Capital Activity Bar Graph is NOT cut off)
  await page.click('.mobile-tab-btn[data-tab="returns"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'frontend/fix-mobile-bars-full.png' });

  await browser.close();
  console.log('All 4 fix verifications captured successfully!');
})();
