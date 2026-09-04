const fs = require('fs');
const path = require('path');

const LOGO_JSON_FILE = path.join(__dirname, '../frontend/logo.json');
const APP_JS_FILE = path.join(__dirname, '../frontend/app.js');
const SRC_LOGOS_FILE = path.join(__dirname, '../frontend/src/core/logos.js');

const newEntries = [
  { company: 'RKI', logo_url: 'https://s3-symbol-logo.tradingview.com/rhong-khen-international-berhad--big.svg' },
  { company: 'RHONG KHEN INTERNATIONAL BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/rhong-khen-international-berhad--big.svg' },
  { company: 'AWANBIRU TECHNOLOGY BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/awanbiru--big.svg' },
  { company: 'VELESTO ENERGY BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/velesto-energy-berhad-warrants-2017-2024--big.svg' },
  { company: 'BERMAZ AUTO BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/bermaz-auto-berhad--big.svg' },
  { company: 'ALLIANCE BANK MALAYSIA BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/alliance-bank-malaysia-berhad--big.svg' },
  { company: 'CAPITALAND MALAYSIA TRUST', logo_url: 'https://s3-symbol-logo.tradingview.com/capitamall-trust--big.svg' },
  { company: 'DUOPHARMA BIOTECH BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/duopharma-biotech-berhad--big.svg' },
  { company: 'AEON CO. (M) BHD', logo_url: 'https://s3-symbol-logo.tradingview.com/aeon-co-m-bhd--big.svg' },
  { company: 'POS MALAYSIA BHD', logo_url: 'https://s3-symbol-logo.tradingview.com/pos-malaysia-bhd--big.svg' },
  { company: 'WCT HOLDINGS BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/wct-holdings--big.svg' },
  { company: 'VANTRIS ENERGY BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/sapura-energy-berhad--big.svg' },
  { company: 'UEM SUNRISE BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-sunrise-berhad--big.svg' },
  { company: 'IOI PROPERTIES GROUP BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/ioi-properties-group-berhad--600.png' },
  { company: 'EDGENTA', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-edgenta-berhad--big.svg' },
  { company: 'UEM EDGENTA BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-edgenta-berhad--big.svg' },
  { company: 'SD GUTHRIE BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/sd-guthrie-berhad--big.svg' },
  { company: 'TALAMT', logo_url: 'https://s3-symbol-logo.tradingview.com/talam-transform-berhad--big.svg' },
  { company: 'TALAM TRANSFORM BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/talam-transform-berhad--big.svg' },
  { company: 'GUOCO', logo_url: 'https://s3-symbol-logo.tradingview.com/guocoland-malaysia-bhd--big.svg' },
  { company: 'GUOCOLAND (MALAYSIA) BHD', logo_url: 'https://s3-symbol-logo.tradingview.com/guocoland-malaysia-bhd--big.svg' },
  { company: 'YB', logo_url: 'https://s3-symbol-logo.tradingview.com/yb-ventures-berhad--big.svg' },
  { company: 'YB VENTURES BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/yb-ventures-berhad--big.svg' },
  { company: 'GLOTEC', logo_url: 'https://s3-symbol-logo.tradingview.com/globaltec-formation-bhd--big.svg' },
  { company: 'GLOBALTEC FORMATION BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/globaltec-formation-bhd--big.svg' },
  { company: 'PERDANA PETROLEUM BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/perdana-petroleum-bhd--big.svg' },
  { company: 'CREST BUILDER HOLDINGS BHD', logo_url: 'https://s3-symbol-logo.tradingview.com/crest-builder-holdings-bhd--big.svg' },
  { company: 'WASCO BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/wasco-berhad--big.svg' },
  { company: 'CELCOMDIGI BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg' }
];

// 1. Update logo.json
let logos = JSON.parse(fs.readFileSync(LOGO_JSON_FILE, 'utf8'));
const map = new Map();
logos.forEach(l => map.set(l.company.toUpperCase().trim(), l));

newEntries.forEach(e => {
  const k = e.company.toUpperCase().trim();
  if (!map.has(k)) {
    logos.push({ company: k, logo_url: e.logo_url });
    map.set(k, { company: k, logo_url: e.logo_url });
  }
});
fs.writeFileSync(LOGO_JSON_FILE, JSON.stringify(logos, null, 4));
console.log(`Updated logo.json with ${logos.length} items`);

// 2. Update frontend/src/core/logos.js
const logosJsContent = `export const BURSA_LOGOS = ${JSON.stringify(logos, null, 2)};\n`;
fs.writeFileSync(SRC_LOGOS_FILE, logosJsContent);
console.log(`Updated frontend/src/core/logos.js`);

// 3. Update BURSA_LOGOS in frontend/app.js
let appJs = fs.readFileSync(APP_JS_FILE, 'utf8');
const logoStart = appJs.indexOf('const BURSA_LOGOS = [');
const logoEnd = appJs.indexOf('];', logoStart) + 2;
if (logoStart !== -1 && logoEnd !== -1) {
  const replacement = `const BURSA_LOGOS = ${JSON.stringify(logos, null, 2)};`;
  appJs = appJs.slice(0, logoStart) + replacement + appJs.slice(logoEnd);
  fs.writeFileSync(APP_JS_FILE, appJs);
  console.log(`Updated BURSA_LOGOS in frontend/app.js`);
}
