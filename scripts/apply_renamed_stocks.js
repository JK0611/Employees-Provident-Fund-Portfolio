const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../frontend/data.js');
let raw = fs.readFileSync(DATA_FILE, 'utf8');
const jsonStr = raw.replace(/^const EPF_DATA = /, '').replace(/;?\s*$/, '');
const epfData = JSON.parse(jsonStr);

// Comprehensive dictionary of Bursa Malaysia corporate renamings
const RENAMED_MAP = {
  'LATITUD': {
    stock: 'RKI',
    company: 'RHONG KHEN INTERNATIONAL BERHAD',
    code: '7006',
    sector: 'Consumer',
    domain: 'rhongkhen.com',
    price: 1.05
  },
  'LATITUDE TREE HOLDINGS BERHAD': {
    stock: 'RKI',
    company: 'RHONG KHEN INTERNATIONAL BERHAD',
    code: '7006',
    sector: 'Consumer',
    domain: 'rhongkhen.com',
    price: 1.05
  },
  'DIGI': {
    stock: 'CDB',
    company: 'CELCOMDIGI BERHAD',
    code: '6947',
    sector: 'Telecom',
    domain: 'celcomdigi.com'
  },
  'DIGI.COM BERHAD': {
    stock: 'CDB',
    company: 'CELCOMDIGI BERHAD',
    code: '6947',
    sector: 'Telecom',
    domain: 'celcomdigi.com'
  },
  'CELCOM': {
    stock: 'CDB',
    company: 'CELCOMDIGI BERHAD',
    code: '6947',
    sector: 'Telecom',
    domain: 'celcomdigi.com'
  },
  'CELCOM (MALAYSIA) BERHAD': {
    stock: 'CDB',
    company: 'CELCOMDIGI BERHAD',
    code: '6947',
    sector: 'Telecom',
    domain: 'celcomdigi.com'
  },
  'PRESBHD': {
    stock: 'AWANTEC',
    company: 'AWANBIRU TECHNOLOGY BERHAD',
    code: '5204',
    sector: 'Technology',
    domain: 'awantec.my',
    price: 0.17
  },
  'PRESTARIANG BERHAD': {
    stock: 'AWANTEC',
    company: 'AWANBIRU TECHNOLOGY BERHAD',
    code: '5204',
    sector: 'Technology',
    domain: 'awantec.my',
    price: 0.17
  },
  'UMWOG': {
    stock: 'VELESTO',
    company: 'VELESTO ENERGY BERHAD',
    code: '5243',
    sector: 'Industrial',
    domain: 'velesto.com',
    price: 0.165
  },
  'UMW OIL & GAS CORPORATION BERHAD': {
    stock: 'VELESTO',
    company: 'VELESTO ENERGY BERHAD',
    code: '5243',
    sector: 'Industrial',
    domain: 'velesto.com',
    price: 0.165
  },
  'BJAUTO': {
    stock: 'BAUTO',
    company: 'BERMAZ AUTO BERHAD',
    code: '5248',
    sector: 'Consumer',
    domain: 'bauto.com.my'
  },
  'BERJAYA AUTO BERHAD': {
    stock: 'BAUTO',
    company: 'BERMAZ AUTO BERHAD',
    code: '5248',
    sector: 'Consumer',
    domain: 'bauto.com.my'
  },
  'AFG': {
    stock: 'ABMB',
    company: 'ALLIANCE BANK MALAYSIA BERHAD',
    code: '2488',
    sector: 'Banking',
    domain: 'alliancebank.com.my'
  },
  'ALLIANCE FINANCIAL GROUP BERHAD': {
    stock: 'ABMB',
    company: 'ALLIANCE BANK MALAYSIA BERHAD',
    code: '2488',
    sector: 'Banking',
    domain: 'alliancebank.com.my'
  },
  'CMMT': {
    stock: 'CLMT',
    company: 'CAPITALAND MALAYSIA TRUST',
    code: '5180',
    sector: 'Property',
    domain: 'capitaland.com'
  },
  'CAPITALAND MALAYSIA MALL TRUST': {
    stock: 'CLMT',
    company: 'CAPITALAND MALAYSIA TRUST',
    code: '5180',
    sector: 'Property',
    domain: 'capitaland.com'
  },
  'DBIOTEC': {
    stock: 'DPHARMA',
    company: 'DUOPHARMA BIOTECH BERHAD',
    code: '7148',
    sector: 'Healthcare',
    domain: 'duopharmabiotech.com'
  },
  'CCMDBIO': {
    stock: 'DPHARMA',
    company: 'DUOPHARMA BIOTECH BERHAD',
    code: '7148',
    sector: 'Healthcare',
    domain: 'duopharmabiotech.com'
  },
  'CCM DUOPHARMA BIOTECH BERHAD': {
    stock: 'DPHARMA',
    company: 'DUOPHARMA BIOTECH BERHAD',
    code: '7148',
    sector: 'Healthcare',
    domain: 'duopharmabiotech.com'
  },
  'MQREIT': {
    stock: 'SENTRAL',
    company: 'SENTRAL REIT',
    code: '5123',
    sector: 'Property',
    domain: 'sentralreit.com'
  },
  'MRCB-QUILL REIT': {
    stock: 'SENTRAL',
    company: 'SENTRAL REIT',
    code: '5123',
    sector: 'Property',
    domain: 'sentralreit.com'
  },
  'JUSCO': {
    stock: 'AEON',
    company: 'AEON CO. (M) BHD',
    code: '6599',
    sector: 'Consumer',
    domain: 'aeonretail.com.my'
  },
  'JAYA JUSCO STORES BERHAD': {
    stock: 'AEON',
    company: 'AEON CO. (M) BHD',
    code: '6599',
    sector: 'Consumer',
    domain: 'aeonretail.com.my'
  },
  'POSHLDG': {
    stock: 'POS',
    company: 'POS MALAYSIA BHD',
    code: '4634',
    sector: 'Industrial',
    domain: 'pos.com.my',
    price: 0.295
  },
  'POS MALAYSIA & SERVICES HOLDINGS BERHAD': {
    stock: 'POS',
    company: 'POS MALAYSIA BHD',
    code: '4634',
    sector: 'Industrial',
    domain: 'pos.com.my',
    price: 0.295
  },
  'WCTLAND': {
    stock: 'WCT',
    company: 'WCT HOLDINGS BERHAD',
    code: '9679',
    sector: 'Industrial',
    domain: 'wct.com.my',
    price: 0.885
  },
  'WCT LAND BERHAD': {
    stock: 'WCT',
    company: 'WCT HOLDINGS BERHAD',
    code: '9679',
    sector: 'Industrial',
    domain: 'wct.com.my',
    price: 0.885
  },
  'SAPCRES': {
    stock: 'VANTNRG',
    company: 'VANTRIS ENERGY BERHAD',
    code: '5218',
    sector: 'Industrial',
    domain: 'sapuraenergy.com'
  },
  'SAPURACREST PETROLEUM BERHAD': {
    stock: 'VANTNRG',
    company: 'VANTRIS ENERGY BERHAD',
    code: '5218',
    sector: 'Industrial',
    domain: 'sapuraenergy.com'
  },
  'SKPETRO': {
    stock: 'VANTNRG',
    company: 'VANTRIS ENERGY BERHAD',
    code: '5218',
    sector: 'Industrial',
    domain: 'sapuraenergy.com'
  },
  'SAPURAKENCANA PETROLEUM BERHAD': {
    stock: 'VANTNRG',
    company: 'VANTRIS ENERGY BERHAD',
    code: '5218',
    sector: 'Industrial',
    domain: 'sapuraenergy.com'
  },
  'SENERGY': {
    stock: 'VANTNRG',
    company: 'VANTRIS ENERGY BERHAD',
    code: '5218',
    sector: 'Industrial',
    domain: 'sapuraenergy.com'
  },
  'SAPURA ENERGY BERHAD': {
    stock: 'VANTNRG',
    company: 'VANTRIS ENERGY BERHAD',
    code: '5218',
    sector: 'Industrial',
    domain: 'sapuraenergy.com'
  },
  'UEMLAND': {
    stock: 'UEMS',
    company: 'UEM SUNRISE BERHAD',
    code: '5148',
    sector: 'Property',
    domain: 'uemsunrise.com',
    price: 0.57
  },
  'UEM LAND HOLDINGS BERHAD': {
    stock: 'UEMS',
    company: 'UEM SUNRISE BERHAD',
    code: '5148',
    sector: 'Property',
    domain: 'uemsunrise.com',
    price: 0.57
  },
  'SUNRISE': {
    stock: 'UEMS',
    company: 'UEM SUNRISE BERHAD',
    code: '5148',
    sector: 'Property',
    domain: 'uemsunrise.com',
    price: 0.57
  },
  'SUNRISE BERHAD': {
    stock: 'UEMS',
    company: 'UEM SUNRISE BERHAD',
    code: '5148',
    sector: 'Property',
    domain: 'uemsunrise.com',
    price: 0.57
  },
  'IOIPB': {
    stock: 'IOIPG',
    company: 'IOI PROPERTIES GROUP BERHAD',
    code: '5249',
    sector: 'Property',
    domain: 'ioicitymall.com.my'
  },
  'IOIPROP': {
    stock: 'IOIPG',
    company: 'IOI PROPERTIES GROUP BERHAD',
    code: '5249',
    sector: 'Property',
    domain: 'ioicitymall.com.my'
  },
  'IOI PROPERTIES BERHAD': {
    stock: 'IOIPG',
    company: 'IOI PROPERTIES GROUP BERHAD',
    code: '5249',
    sector: 'Property',
    domain: 'ioicitymall.com.my'
  },
  'FABER': {
    stock: 'EDGENTA',
    company: 'UEM EDGENTA BERHAD',
    code: '1368',
    sector: 'Industrial',
    domain: 'uemedgenta.com',
    price: 0.69
  },
  'FABER GROUP BERHAD': {
    stock: 'EDGENTA',
    company: 'UEM EDGENTA BERHAD',
    code: '1368',
    sector: 'Industrial',
    domain: 'uemedgenta.com',
    price: 0.69
  },
  'SIMEPLT': {
    stock: 'SDG',
    company: 'SD GUTHRIE BERHAD',
    code: '5285',
    sector: 'Consumer',
    domain: 'sdgroup.com.my'
  },
  'SIME DARBY PLANTATION BERHAD': {
    stock: 'SDG',
    company: 'SD GUTHRIE BERHAD',
    code: '5285',
    sector: 'Consumer',
    domain: 'sdgroup.com.my'
  },
  'TALAM': {
    stock: 'TALAMT',
    company: 'TALAM TRANSFORM BERHAD',
    code: '2259',
    sector: 'Property',
    domain: 'ttransform.com.my',
    price: 0.08
  },
  'TALAM CORPORATION BERHAD': {
    stock: 'TALAMT',
    company: 'TALAM TRANSFORM BERHAD',
    code: '2259',
    sector: 'Property',
    domain: 'ttransform.com.my',
    price: 0.08
  },
  'HLPB': {
    stock: 'GUOCO',
    company: 'GUOCOLAND (MALAYSIA) BHD',
    code: '1503',
    sector: 'Property',
    domain: 'guocoland.com.my',
    price: 0.655
  },
  'HONG LEONG PROPERTIES BHD': {
    stock: 'GUOCO',
    company: 'GUOCOLAND (MALAYSIA) BHD',
    code: '1503',
    sector: 'Property',
    domain: 'guocoland.com.my',
    price: 0.655
  },
  'COMMERZ': {
    stock: 'CIMB',
    company: 'CIMB GROUP HOLDINGS BERHAD',
    code: '1023',
    sector: 'Banking',
    domain: 'cimbclicks.com.my'
  },
  'COMMERCE ASSET-HOLDING BERHAD': {
    stock: 'CIMB',
    company: 'CIMB GROUP HOLDINGS BERHAD',
    code: '1023',
    sector: 'Banking',
    domain: 'cimbclicks.com.my'
  },
  'PFB': {
    stock: 'PBBANK',
    company: 'PUBLIC BANK BERHAD',
    code: '1295',
    sector: 'Banking',
    domain: 'pbebank.com'
  },
  'PBFIN': {
    stock: 'PBBANK',
    company: 'PUBLIC BANK BERHAD',
    code: '1295',
    sector: 'Banking',
    domain: 'pbebank.com'
  },
  'PUBLIC FINANCE BERHAD': {
    stock: 'PBBANK',
    company: 'PUBLIC BANK BERHAD',
    code: '1295',
    sector: 'Banking',
    domain: 'pbebank.com'
  },
  'YILAI': {
    stock: 'YB',
    company: 'YB VENTURES BERHAD',
    code: '5048',
    sector: 'Industrial',
    domain: 'ybventures.com',
    price: 0.22
  },
  'YI-LAI BERHAD': {
    stock: 'YB',
    company: 'YB VENTURES BERHAD',
    code: '5048',
    sector: 'Industrial',
    domain: 'ybventures.com',
    price: 0.22
  },
  'AIC': {
    stock: 'GLOTEC',
    company: 'GLOBALTEC FORMATION BERHAD',
    code: '5220',
    sector: 'Industrial',
    domain: 'globaltec.com.my',
    price: 0.44
  },
  'AIC CORPORATION BERHAD': {
    stock: 'GLOTEC',
    company: 'GLOBALTEC FORMATION BERHAD',
    code: '5220',
    sector: 'Industrial',
    domain: 'globaltec.com.my',
    price: 0.44
  },
  'PETRA': {
    stock: 'PERDANA',
    company: 'PERDANA PETROLEUM BERHAD',
    code: '7108',
    sector: 'Industrial',
    domain: 'perdana.my',
    price: 0.14
  },
  'PETRA PERDANA BERHAD': {
    stock: 'PERDANA',
    company: 'PERDANA PETROLEUM BERHAD',
    code: '7108',
    sector: 'Industrial',
    domain: 'perdana.my',
    price: 0.14
  },
  'CREST': {
    stock: 'CRESBLD',
    company: 'CREST BUILDER HOLDINGS BHD',
    code: '8591',
    sector: 'Industrial',
    domain: 'crest.my',
    price: 0.43
  },
  'CREST BUILDER HOLDINGS BERHAD': {
    stock: 'CRESBLD',
    company: 'CREST BUILDER HOLDINGS BHD',
    code: '8591',
    sector: 'Industrial',
    domain: 'crest.my',
    price: 0.43
  },
  'TRACTOR': {
    stock: 'SIME',
    company: 'SIME DARBY BERHAD',
    code: '4197',
    sector: 'Consumer',
    domain: 'simedarby.com'
  },
  'TRACTORS MALAYSIA HOLDINGS BERHAD': {
    stock: 'SIME',
    company: 'SIME DARBY BERHAD',
    code: '4197',
    sector: 'Consumer',
    domain: 'simedarby.com'
  },
  'WASCO': {
    stock: 'WASCO',
    company: 'WASCO BERHAD',
    code: '5142',
    sector: 'Industrial',
    domain: 'wascoenergy.com'
  },
  'WAH SEONG CORPORATION BERHAD': {
    stock: 'WASCO',
    company: 'WASCO BERHAD',
    code: '5142',
    sector: 'Industrial',
    domain: 'wascoenergy.com'
  },
  'MANULFE': {
    stock: 'MANULFE',
    company: 'MANULIFE HOLDINGS BERHAD',
    code: '1058',
    sector: 'Banking',
    domain: 'manulife.com.my'
  },
  'MANULIFE (MALAYSIA) INSURANCE MALAYSIA BERHAD': {
    stock: 'MANULFE',
    company: 'MANULIFE HOLDINGS BERHAD',
    code: '1058',
    sector: 'Banking',
    domain: 'manulife.com.my'
  },
  'MNRB': {
    stock: 'MNRB',
    company: 'MNRB HOLDINGS BERHAD',
    code: '6459',
    sector: 'Banking',
    domain: 'mnrb.com.my'
  },
  'MALAYSIAN NATIONAL REINSURANCE BERHAD': {
    stock: 'MNRB',
    company: 'MNRB HOLDINGS BERHAD',
    code: '6459',
    sector: 'Banking',
    domain: 'mnrb.com.my'
  },
  'YNHPROP': {
    stock: 'YNHPROP',
    company: 'YNH PROPERTY BERHAD',
    code: '3158',
    sector: 'Property',
    domain: 'ynh.com.my'
  }
};

// 1. Process holdings
let renamedHoldingsCount = 0;
const newHoldingsMap = new Map();

epfData.holdings.forEach(h => {
  const sUpper = (h.stock_name || '').toUpperCase().trim();
  const cUpper = (h.company_name || '').toUpperCase().trim();
  const ren = RENAMED_MAP[sUpper] || RENAMED_MAP[cUpper];

  if (ren) {
    renamedHoldingsCount++;
    // Use renamed stock name and company name
    const finalStock = ren.stock;
    const finalCompany = ren.company;
    const finalCode = ren.code || h.stock_code;
    const finalSector = ren.sector || h.sector;
    const finalDomain = ren.domain || h.domain;
    const finalPrice = (h.price && h.price > 0) ? h.price : (ren.price || 0);
    const finalMarketVal = finalPrice > 0 ? (h.total_securities * finalPrice) : 0;

    // Check if newHoldingsMap already has this renamed stock
    if (newHoldingsMap.has(finalStock)) {
      const existing = newHoldingsMap.get(finalStock);
      // Keep whichever has a more recent date or higher price/market_value
      if (existing.price === 0 && finalPrice > 0) {
        newHoldingsMap.set(finalStock, {
          ...existing,
          stock_name: finalStock,
          company_name: finalCompany,
          stock_code: finalCode,
          sector: finalSector,
          domain: finalDomain,
          price: finalPrice,
          market_value: finalMarketVal
        });
      }
      // If existing is already active and this old one has date from 2000, do not overwrite with outdated shares
    } else {
      newHoldingsMap.set(finalStock, {
        ...h,
        stock_name: finalStock,
        company_name: finalCompany,
        stock_code: finalCode,
        sector: finalSector,
        domain: finalDomain,
        price: finalPrice,
        market_value: finalMarketVal
      });
    }
  } else {
    newHoldingsMap.set(h.stock_name, h);
  }
});

epfData.holdings = Array.from(newHoldingsMap.values());
// Sort holdings by market value descending
epfData.holdings.sort((a, b) => (b.market_value || 0) - (a.market_value || 0));

// 2. Process transactions
let renamedTxCount = 0;
epfData.transactions.forEach(tx => {
  const sUpper = (tx.stock || '').toUpperCase().trim();
  const cUpper = (tx.company || '').toUpperCase().trim();
  const ren = RENAMED_MAP[sUpper] || RENAMED_MAP[cUpper];
  if (ren) {
    tx.stock = ren.stock;
    tx.company = ren.company;
    renamedTxCount++;
  }
});

// Save updated data.js
fs.writeFileSync(DATA_FILE, 'const EPF_DATA = ' + JSON.stringify(epfData) + ';\n');
console.log(`Updated data.js!`);
console.log(`Holdings count: ${epfData.holdings.length}`);
console.log(`Renamed holdings: ${renamedHoldingsCount}, Renamed transactions: ${renamedTxCount}`);

const rkiHolding = epfData.holdings.find(h => h.stock_name === 'RKI');
console.log('RKI in holdings:', rkiHolding);
