const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('Launching browser in mobile view...');
  const browser = await chromium.launch({ headless: true });
  
  // Set viewport to mobile dimension (iPhone 12 / 390x844)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();
  
  // Trap browser errors
  page.on('pageerror', err => {
    console.error('BROWSER ERROR:', err.message);
  });
  
  const screenshotDir = path.join(__dirname, '..', 'screenshots_debug');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); // Wait for canvas and styles to render
  
  console.log('Capturing Dashboard mobile screenshot...');
  await page.screenshot({ path: path.join(screenshotDir, 'mobile_dashboard.png') });

  console.log('Clicking Holdings tab button...');
  // Tap the bottom nav button for Holdings
  const holdingsBtn = await page.$('#tab-holdings');
  if (holdingsBtn) {
    await holdingsBtn.click();
    console.log('Clicked. Waiting for charts to redraw...');
    await page.waitForTimeout(2000); // Wait for pie canvas animations to run
    
    console.log('Capturing Holdings Tab stacked mobile view...');
    await page.screenshot({ path: path.join(screenshotDir, 'mobile_holdings_stacked.png') });
  } else {
    console.error('Holdings tab button was not found!');
  }

  await browser.close();
  console.log('Mobile verification completed successfully.');
}

run().catch(console.error);
