const fs = require('fs');
const path = require('path');
const { getMissingLogos } = require('./check_missing_logos');

const LOGO_JSON_FILE = path.join(__dirname, '..', 'frontend', 'logo.json');
const APP_JS_FILE = path.join(__dirname, '..', 'frontend', 'app.js');
const SRC_LOGOS_FILE = path.join(__dirname, '..', 'frontend', 'src', 'core', 'logos.js');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchTradingViewLogo(ticker) {
  const cleanTicker = ticker.trim().replace(/\-.*$/, ''); // strip warrants if needed
  const urlsToTry = [
    `https://www.tradingview.com/symbols/MYX-${ticker.trim()}/`,
  ];
  if (cleanTicker !== ticker.trim()) {
    urlsToTry.push(`https://www.tradingview.com/symbols/MYX-${cleanTicker}/`);
  }

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (res.status !== 200) continue;
      const html = await res.text();

      // Look for og:image from s3-symbol-logo.tradingview.com
      const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](https:\/\/s3-symbol-logo\.tradingview\.com\/[^"']+)["']/i);
      if (ogMatch && ogMatch[1]) {
        const logoUrl = ogMatch[1];
        // Ignore generic TradingView placeholder logos
        const urlPath = new URL(logoUrl).pathname;
        if (urlPath === '/tradingview.svg' || urlPath.startsWith('/tradingview--') || urlPath.includes('default') || urlPath.includes('fallback')) {
          continue;
        }

        // Try SVG version first
        const svgUrl = logoUrl.replace(/--600\.png$/, '--big.svg');
        try {
          const svgCheck = await fetch(svgUrl, { method: 'HEAD' });
          if (svgCheck.status === 200) {
            return svgUrl;
          }
        } catch (_) {}

        return logoUrl;
      }
    } catch (e) {
      console.warn(`[${ticker}] Error fetching ${url}: ${e.message}`);
    }
  }

  return null;
}

async function run() {
  console.log('--- Scanning for EPF companies missing logos ---');
  const audit = getMissingLogos();
  console.log(`Found ${audit.missingCount} companies missing logos.`);

  // Load existing logo.json
  let logoList = [];
  if (fs.existsSync(LOGO_JSON_FILE)) {
    try {
      logoList = JSON.parse(fs.readFileSync(LOGO_JSON_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading logo.json:', e.message);
    }
  }

  const existingMap = {};
  logoList.forEach(item => {
    if (item.company) {
      existingMap[item.company.toUpperCase().trim()] = item.logo_url;
    }
  });

  const newlyAdded = [];

  for (let i = 0; i < audit.missing.length; i++) {
    const item = audit.missing[i];
    const ticker = item.stock;
    console.log(`[${i + 1}/${audit.missing.length}] Checking TradingView for ${ticker} (${item.company})...`);

    const logoUrl = await fetchTradingViewLogo(ticker);
    if (logoUrl) {
      console.log(`   ✓ Found logo for ${ticker}: ${logoUrl}`);
      newlyAdded.push({
        stock: ticker,
        company: item.company,
        logoUrl: logoUrl
      });

      // Add ticker entry
      logoList.push({
        company: ticker.toUpperCase(),
        logo_url: logoUrl
      });
      existingMap[ticker.toUpperCase()] = logoUrl;

      // Add clean company name entry
      const cleanCompany = item.company.toUpperCase().replace(/\s+(BERHAD|BHD)\b/g, '').trim();
      if (!existingMap[cleanCompany]) {
        logoList.push({
          company: cleanCompany,
          logo_url: logoUrl
        });
        existingMap[cleanCompany] = logoUrl;
      }
    } else {
      console.log(`   ✕ No logo found on TradingView for ${ticker}`);
    }

    // Rate-limit courtesy delay
    await sleep(300);
  }

  console.log(`\n======================================================`);
  console.log(`TOTAL NEW LOGOS ACQUIRED: ${newlyAdded.length}`);
  console.log(`======================================================\n`);

  if (newlyAdded.length > 0) {
    // 1. Save updated logo.json
    fs.writeFileSync(LOGO_JSON_FILE, JSON.stringify(logoList, null, 4));
    console.log(`✓ Saved ${logoList.length} total entries to ${LOGO_JSON_FILE}`);

    // 2. Update BURSA_LOGOS in frontend/app.js
    if (fs.existsSync(APP_JS_FILE)) {
      let appJs = fs.readFileSync(APP_JS_FILE, 'utf8');
      const bursaLogosMatch = appJs.match(/const BURSA_LOGOS = \[([\s\S]*?)\];/);
      if (bursaLogosMatch) {
        const uniqueEntries = [];
        const seen = new Set();
        logoList.forEach(entry => {
          const key = entry.company.toUpperCase().trim();
          if (!seen.has(key)) {
            seen.add(key);
            uniqueEntries.push(`    { "company": "${key}", "logo_url": "${entry.logo_url}" }`);
          }
        });
        const newArrayContent = `const BURSA_LOGOS = [\n${uniqueEntries.join(',\n')}\n  ];`;
        appJs = appJs.replace(/const BURSA_LOGOS = \[[\s\S]*?\];/, newArrayContent);
        fs.writeFileSync(APP_JS_FILE, appJs);
        console.log(`✓ Updated BURSA_LOGOS in ${APP_JS_FILE} (${uniqueEntries.length} entries)`);
      }
    }

    // 3. Update BURSA_LOGOS in frontend/src/core/logos.js
    if (fs.existsSync(SRC_LOGOS_FILE)) {
      let srcLogos = fs.readFileSync(SRC_LOGOS_FILE, 'utf8');
      const bursaSrcMatch = srcLogos.match(/export const BURSA_LOGOS = \[([\s\S]*?)\];/);
      if (bursaSrcMatch) {
        const uniqueEntries = [];
        const seen = new Set();
        logoList.forEach(entry => {
          const key = entry.company.toUpperCase().trim();
          if (!seen.has(key)) {
            seen.add(key);
            uniqueEntries.push(`  { "company": "${key}", "logo_url": "${entry.logo_url}" }`);
          }
        });
        const newArrayContent = `export const BURSA_LOGOS = [\n${uniqueEntries.join(',\n')}\n];`;
        srcLogos = srcLogos.replace(/export const BURSA_LOGOS = \[[\s\S]*?\];/, newArrayContent);
        fs.writeFileSync(SRC_LOGOS_FILE, srcLogos);
        console.log(`✓ Updated BURSA_LOGOS in ${SRC_LOGOS_FILE} (${uniqueEntries.length} entries)`);
      }
    }
  }

  return newlyAdded;
}

if (require.main === module) {
  run().catch(err => {
    console.error('Fetch logos process failed:', err);
    process.exit(1);
  });
}

module.exports = { run, fetchTradingViewLogo };
