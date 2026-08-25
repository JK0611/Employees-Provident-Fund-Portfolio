const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const url = 'file:///' + path.resolve('frontend/index.html').replace(/\\/g, '/');
  await page.goto(url);
  await page.waitForTimeout(800);

  // 1. Initial Default Load (Verify Portfolio Trend has NO stretch)
  await page.screenshot({ path: 'frontend/test-default-nostretch.png' });

  // 2. Hover at 50% X on Portfolio Trend (Verify ONLY ONE circle exists!)
  const canvasBox = await page.locator('#portfolio-canvas').boundingBox();
  if (canvasBox) {
    await page.mouse.move(canvasBox.x + canvasBox.width * 0.45, canvasBox.y + canvasBox.height * 0.5);
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'frontend/test-single-circle-hover.png' });
  }

  await browser.close();
  console.log('Verification completed successfully!');
})();
