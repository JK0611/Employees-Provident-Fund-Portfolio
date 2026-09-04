const fs = require('fs');
const path = require('path');

const LOGO_JSON_FILE = path.join(__dirname, '../frontend/logo.json');
const APP_JS_FILE = path.join(__dirname, '../frontend/app.js');
const SRC_LOGOS_FILE = path.join(__dirname, '../frontend/src/core/logos.js');

const newMappings = [
  { company: 'DIGI', logo_url: 'https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg' },
  { company: 'DIGI.COM BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg' },
  { company: 'CELCOM', logo_url: 'https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg' },
  { company: 'CELCOM (MALAYSIA) BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg' },
  { company: 'DBIOTEC', logo_url: 'https://s3-symbol-logo.tradingview.com/duopharma-biotech-berhad--big.svg' },
  { company: 'CCMDBIO', logo_url: 'https://s3-symbol-logo.tradingview.com/duopharma-biotech-berhad--big.svg' },
  { company: 'DUOPHARMA BIOTECH BHD', logo_url: 'https://s3-symbol-logo.tradingview.com/duopharma-biotech-berhad--big.svg' },
  { company: 'CCM DUOPHARMA BIOTECH BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/duopharma-biotech-berhad--big.svg' },
  { company: 'DPHARMA', logo_url: 'https://s3-symbol-logo.tradingview.com/duopharma-biotech-berhad--big.svg' },
  { company: 'CMMT', logo_url: 'https://s3-symbol-logo.tradingview.com/capitamall-trust--big.svg' },
  { company: 'CAPITALAND MALAYSIA MALL TRUST', logo_url: 'https://s3-symbol-logo.tradingview.com/capitamall-trust--big.svg' },
  { company: 'CLMT', logo_url: 'https://s3-symbol-logo.tradingview.com/capitamall-trust--big.svg' },
  { company: 'UMWOG', logo_url: 'https://s3-symbol-logo.tradingview.com/velesto-energy-berhad-warrants-2017-2024--big.svg' },
  { company: 'UMW OIL & GAS CORPORATION BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/velesto-energy-berhad-warrants-2017-2024--big.svg' },
  { company: 'VELESTO', logo_url: 'https://s3-symbol-logo.tradingview.com/velesto-energy-berhad-warrants-2017-2024--big.svg' },
  { company: 'AFG', logo_url: 'https://s3-symbol-logo.tradingview.com/alliance-bank-malaysia-berhad--big.svg' },
  { company: 'ALLIANCE FINANCIAL GROUP BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/alliance-bank-malaysia-berhad--big.svg' },
  { company: 'ABMB', logo_url: 'https://s3-symbol-logo.tradingview.com/alliance-bank-malaysia-berhad--big.svg' },
  { company: 'BJAUTO', logo_url: 'https://s3-symbol-logo.tradingview.com/bermaz-auto-berhad--big.svg' },
  { company: 'BERJAYA AUTO BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/bermaz-auto-berhad--big.svg' },
  { company: 'BAUTO', logo_url: 'https://s3-symbol-logo.tradingview.com/bermaz-auto-berhad--big.svg' },
  { company: 'PRESBHD', logo_url: 'https://s3-symbol-logo.tradingview.com/awanbiru--big.svg' },
  { company: 'PRESTARIANG BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/awanbiru--big.svg' },
  { company: 'AWANTEC', logo_url: 'https://s3-symbol-logo.tradingview.com/awanbiru--big.svg' },
  { company: 'IOIPB', logo_url: 'https://s3-symbol-logo.tradingview.com/ioi-properties-group-berhad--600.png' },
  { company: 'IOIPROP', logo_url: 'https://s3-symbol-logo.tradingview.com/ioi-properties-group-berhad--600.png' },
  { company: 'IOI PROPERTIES BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/ioi-properties-group-berhad--600.png' },
  { company: 'IOIPG', logo_url: 'https://s3-symbol-logo.tradingview.com/ioi-properties-group-berhad--600.png' },
  { company: 'UEMLAND', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-sunrise-berhad--big.svg' },
  { company: 'UEM LAND HOLDINGS BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-sunrise-berhad--big.svg' },
  { company: 'UEMS', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-sunrise-berhad--big.svg' },
  { company: 'MQREIT', logo_url: 'https://s3-symbol-logo.tradingview.com/sentral-reit--big.svg' },
  { company: 'MRCB-QUILL REIT', logo_url: 'https://s3-symbol-logo.tradingview.com/sentral-reit--big.svg' },
  { company: 'SENTRAL', logo_url: 'https://s3-symbol-logo.tradingview.com/sentral-reit--big.svg' },
  { company: 'JUSCO', logo_url: 'https://s3-symbol-logo.tradingview.com/aeon-co-m-bhd--big.svg' },
  { company: 'JAYA JUSCO STORES BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/aeon-co-m-bhd--big.svg' },
  { company: 'AEON', logo_url: 'https://s3-symbol-logo.tradingview.com/aeon-co-m-bhd--big.svg' },
  { company: 'POSHLDG', logo_url: 'https://s3-symbol-logo.tradingview.com/pos-malaysia-bhd--big.svg' },
  { company: 'POS MALAYSIA & SERVICES HOLDINGS BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/pos-malaysia-bhd--big.svg' },
  { company: 'POS', logo_url: 'https://s3-symbol-logo.tradingview.com/pos-malaysia-bhd--big.svg' },
  { company: 'WCTLAND', logo_url: 'https://s3-symbol-logo.tradingview.com/wct-holdings--big.svg' },
  { company: 'WCT LAND BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/wct-holdings--big.svg' },
  { company: 'WCT', logo_url: 'https://s3-symbol-logo.tradingview.com/wct-holdings--big.svg' },
  { company: 'SAPCRES', logo_url: 'https://s3-symbol-logo.tradingview.com/sapura-resources-bhd--big.svg' },
  { company: 'SAPURACREST PETROLEUM BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/sapura-resources-bhd--big.svg' },
  { company: 'SAPRES', logo_url: 'https://s3-symbol-logo.tradingview.com/sapura-resources-bhd--big.svg' },
  { company: 'AIRPORT', logo_url: 'https://s3-symbol-logo.tradingview.com/malaysia-airports-holdings-bhd--big.svg' },
  { company: 'MALAYSIA AIRPORTS HOLDINGS BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/malaysia-airports-holdings-bhd--big.svg' },
  { company: 'MAHB', logo_url: 'https://s3-symbol-logo.tradingview.com/malaysia-airports-holdings-bhd--big.svg' },
  { company: 'BSTEAD', logo_url: 'https://s3-symbol-logo.tradingview.com/boustead-holdings-bhd--big.svg' },
  { company: 'BOUSTEAD HOLDINGS BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/boustead-holdings-bhd--big.svg' },
  { company: 'TALAM', logo_url: 'https://s3-symbol-logo.tradingview.com/talam-transform-berhad--big.svg' },
  { company: 'TALAM CORPORATION BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/talam-transform-berhad--big.svg' },
  { company: 'SENERGY', logo_url: 'https://s3-symbol-logo.tradingview.com/sapura-energy-berhad--big.svg' },
  { company: 'SKPETRO', logo_url: 'https://s3-symbol-logo.tradingview.com/sapura-energy-berhad--big.svg' },
  { company: 'SAPURA ENERGY BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/sapura-energy-berhad--big.svg' },
  { company: 'SAPURAKENCANA PETROLEUM BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/sapura-energy-berhad--big.svg' },
  { company: 'LATITUD', logo_url: 'https://s3-symbol-logo.tradingview.com/rhong-khen-international-berhad--big.svg' },
  { company: 'LATITUDE TREE HOLDINGS BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/rhong-khen-international-berhad--big.svg' },
  { company: 'PETRA', logo_url: 'https://s3-symbol-logo.tradingview.com/petra-energy-bhd--big.svg' },
  { company: 'PETRA PERDANA BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/petra-energy-bhd--big.svg' },
  { company: 'SUNRISE', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-sunrise-berhad--big.svg' },
  { company: 'SUNRISE BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-sunrise-berhad--big.svg' },
  { company: 'FABER', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-edgenta-berhad--big.svg' },
  { company: 'FABER GROUP BERHAD', logo_url: 'https://s3-symbol-logo.tradingview.com/uem-edgenta-berhad--big.svg' }
];

let logoList = JSON.parse(fs.readFileSync(LOGO_JSON_FILE, 'utf8'));
const map = {};
logoList.forEach(item => {
  if (item.company) map[item.company.toUpperCase().trim()] = item;
});

let addedCount = 0;
newMappings.forEach(item => {
  const k = item.company.toUpperCase().trim();
  if (!map[k]) {
    logoList.push({ company: k, logo_url: item.logo_url });
    map[k] = true;
    addedCount++;
  }
});

fs.writeFileSync(LOGO_JSON_FILE, JSON.stringify(logoList, null, 4));
console.log(`Saved logo.json with ${logoList.length} entries (+${addedCount} new mappings)`);

// Update app.js
let appJs = fs.readFileSync(APP_JS_FILE, 'utf8');
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
console.log(`Updated app.js (${uniqueEntries.length} entries)`);

// Update src/core/logos.js
let srcLogos = fs.readFileSync(SRC_LOGOS_FILE, 'utf8');
const srcEntries = [];
const seenSrc = new Set();
logoList.forEach(entry => {
  const key = entry.company.toUpperCase().trim();
  if (!seenSrc.has(key)) {
    seenSrc.add(key);
    srcEntries.push(`  { "company": "${key}", "logo_url": "${entry.logo_url}" }`);
  }
});
const newSrcArrayContent = `export const BURSA_LOGOS = [\n${srcEntries.join(',\n')}\n];`;
srcLogos = srcLogos.replace(/export const BURSA_LOGOS = \[[\s\S]*?\];/, newSrcArrayContent);
fs.writeFileSync(SRC_LOGOS_FILE, srcLogos);
console.log(`Updated logos.js (${srcEntries.length} entries)`);
