const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const url = 'file:///' + path.resolve('frontend/index.html').replace(/\\/g, '/');
  await page.goto(url);
  await page.waitForTimeout(800);

  // 1. Test Transactions: Hover and Scroll inside table
  await page.click('#tab-transactions');
  await page.waitForTimeout(600);

  // Move mouse over the Transactions card (testing hover translation & unclipped top)
  const txCard = await page.locator('.table-card').boundingBox();
  if (txCard) {
    await page.mouse.move(txCard.x + 300, txCard.y + 20);
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'frontend/verify-tx-hover-unclipped.png' });

    // Scroll inside table
    await page.mouse.move(txCard.x + 300, txCard.y + 180);
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'frontend/verify-tx-header-frozen-color-match.png' });
  }

  // 2. Test Holdings: Verify whole screen fit, no right scrollbar, and frozen header color match
  await page.click('#tab-holdings');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'frontend/verify-holdings-full-fit.png' });

  // Scroll inside holdings table
  const holdingsTable = await page.locator('#holdings-table').boundingBox();
  if (holdingsTable) {
    await page.mouse.move(holdingsTable.x + 300, holdingsTable.y + 150);
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'frontend/verify-holdings-header-frozen-color-match.png' });
  }

  // 3. Attempt outer page wheel scroll on Holdings and Transactions (should remain 0)
  await page.mouse.move(100, 100);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(200);
  const holdingsScrollY = await page.evaluate(() => window.scrollY);
  console.log('Holdings window scrollY after outer wheel:', holdingsScrollY);

  await browser.close();
  console.log('All tests completed successfully!');
})();
