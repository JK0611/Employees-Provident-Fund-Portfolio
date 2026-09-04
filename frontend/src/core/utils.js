/**
 * EPF Tracker — Core Utility Functions
 * High-performance formatting, color hashing, and link generators
 */

// Iconstack SVG Icon Repository for Zero-Latency Rendering
export const ICONSTACK = {
  trending_up: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>`,
  trending_down: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/></svg>`,
  account_balance: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>`,
  receipt_long: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>`,
  category: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M14 4h7v7h-7z"/><path d="M14 15h7v7h-7z"/></svg>`,
  calendar_month: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>`,
  arrow_upward: `<svg class="w-3 h-3 text-emerald-400 inline-block align-middle mr-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`,
  arrow_downward: `<svg class="w-3 h-3 text-rose-400 inline-block align-middle mr-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>`,
  layout_grid: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/><path d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"/></svg>`
};

export function formatCompact(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 1e12) return sign + (abs / 1e12).toFixed(2) + 'T';
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + 'K';
  return sign + abs.toLocaleString('en-US');
}

export function formatCurrency(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return 'RM 0.00';
  return 'RM ' + Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function stockColor(stock) {
  let hash = 0;
  for (let i = 0; i < stock.length; i++) {
    hash = stock.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [345, 10, 200, 220, 160, 280, 45, 310];
  const h = hues[Math.abs(hash) % hues.length];
  return `hsl(${h}, 70%, 45%)`;
}

export function parseDateStringToYYYYMMDD(dateStr) {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return null;
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function slugify(name) {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const BASE_STOCK_CODES = {
  'WPRTS': '5246',
  'WESTPORTS HOLDINGS BERHAD': '5246',
  'STRATUS': '0080',
  'STRATUS GLOBAL HOLDINGS BERHAD': '0080',
  'PANAMY': '3719',
  'PANASONIC MANUFACTURING MALAYSIA BERHAD': '3719',
  'TMK': '5340',
  'TMK CHEMICAL BHD': '5340',
  'SCOMNET': '0001',
  'SUPERCOMNET TECHNOLOGIES BERHAD': '0001',
  'UWC': '5292',
  'UWC BERHAD': '5292',
  'ECONBHD': '5253',
  'ECONPILE HOLDINGS BERHAD': '5253',
  'D&O': '7204',
  'D & O GREEN TECHNOLOGIES BERHAD': '7204',
  'AIRPORT': '5014',
  'MALAYSIA AIRPORTS HOLDINGS BERHAD': '5014',
  'MAHB': '5014',
  'DIGI': '6947',
  'DIGI.COM BERHAD': '6947',
  'CELCOM': '6947',
  'CELCOM (MALAYSIA) BERHAD': '6947',
  'CDB': '6947',
  'CELCOMDIGI BERHAD': '6947',
  'DBIOTEC': '7148',
  'CCMDBIO': '7148',
  'DUOPHARMA BIOTECH BHD': '7148',
  'CCM DUOPHARMA BIOTECH BERHAD': '7148',
  'DPHARMA': '7148',
  'DUOPHARMA BIOTECH BERHAD': '7148',
  'CMMT': '5180',
  'CAPITALAND MALAYSIA MALL TRUST': '5180',
  'CLMT': '5180',
  'CAPITALAND MALAYSIA TRUST': '5180',
  'UMWOG': '5243',
  'UMW OIL & GAS CORPORATION BERHAD': '5243',
  'VELESTO': '5243',
  'AFG': '2488',
  'ALLIANCE FINANCIAL GROUP BERHAD': '2488',
  'ABMB': '2488',
  'ALLIANCE BANK MALAYSIA BERHAD': '2488',
  'BJAUTO': '5248',
  'BERJAYA AUTO BERHAD': '5248',
  'BAUTO': '5248',
  'BERMAZ AUTO BERHAD': '5248',
  'PRESBHD': '5204',
  'PRESTARIANG BERHAD': '5204',
  'AWANTEC': '5204',
  'AWANBIRU TECHNOLOGY BERHAD': '5204',
  'IOIPB': '5249',
  'IOIPROP': '5249',
  'IOI PROPERTIES BERHAD': '5249',
  'IOIPG': '5249',
  'IOI PROPERTIES GROUP BERHAD': '5249',
  'UEMLAND': '5148',
  'UEM LAND HOLDINGS BERHAD': '5148',
  'SUNRISE': '5148',
  'SUNRISE BERHAD': '5148',
  'UEMS': '5148',
  'UEM SUNRISE BERHAD': '5148',
  'MQREIT': '5123',
  'MRCB-QUILL REIT': '5123',
  'SENTRAL': '5123',
  'SENTRAL REIT': '5123',
  'JUSCO': '5139',
  'JAYA JUSCO STORES BERHAD': '5139',
  'AEON': '5139',
  'AEON CO. (M) BHD': '5139',
  'POSHLDG': '4634',
  'POS MALAYSIA & SERVICES HOLDINGS BERHAD': '4634',
  'POS': '4634',
  'POS MALAYSIA BHD': '4634',
  'WCTLAND': '9679',
  'WCT LAND BERHAD': '9679',
  'WCT': '9679',
  'WCT HOLDINGS BERHAD': '9679',
  'SAPCRES': '5218',
  'SAPURACREST PETROLEUM BERHAD': '5218',
  'SENERGY': '5218',
  'SKPETRO': '5218',
  'SAPURA ENERGY BERHAD': '5218',
  'SAPURAKENCANA PETROLEUM BERHAD': '5218',
  'VANTNRG': '5218',
  'VANTRIS ENERGY BERHAD': '5218',
  'BSTEAD': '8133',
  'BOUSTEAD HOLDINGS BERHAD': '8133',
  'TALAM': '2259',
  'TALAM CORPORATION BERHAD': '2259',
  'TALAMT': '2259',
  'TALAM TRANSFORM BERHAD': '2259',
  'LATITUD': '7006',
  'LATITUDE TREE HOLDINGS BERHAD': '7006',
  'RKI': '7006',
  'RHONG KHEN INTERNATIONAL BERHAD': '7006',
  'PETRA': '7108',
  'PETRA PERDANA BERHAD': '7108',
  'PERDANA': '7108',
  'PERDANA PETROLEUM BERHAD': '7108',
  'FABER': '1368',
  'FABER GROUP BERHAD': '1368',
  'EDGENTA': '1368',
  'UEM EDGENTA BERHAD': '1368',
  'SDG': '5285',
  'SD GUTHRIE BERHAD': '5285',
  'SIMEPLT': '5285',
  'SIME DARBY PLANTATION BERHAD': '5285',
  'GUOCO': '1503',
  'GUOCOLAND (MALAYSIA) BHD': '1503',
  'HLPB': '1503',
  'HONG LEONG PROPERTIES BHD': '1503',
  'CIMB': '1023',
  'CIMB GROUP HOLDINGS BERHAD': '1023',
  'COMMERZ': '1023',
  'COMMERCE ASSET-HOLDING BERHAD': '1023',
  'PBBANK': '1295',
  'PUBLIC BANK BERHAD': '1295',
  'PFB': '1295',
  'PBFIN': '1295',
  'PUBLIC FINANCE BERHAD': '1295',
  'YB': '5048',
  'YB VENTURES BERHAD': '5048',
  'YILAI': '5048',
  'YI-LAI BERHAD': '5048',
  'GLOTEC': '5220',
  'GLOBALTEC FORMATION BERHAD': '5220',
  'AIC': '5220',
  'AIC CORPORATION BERHAD': '5220',
  'CRESBLD': '8591',
  'CREST BUILDER HOLDINGS BHD': '8591',
  'CREST': '8591',
  'CREST BUILDER HOLDINGS BERHAD': '8591',
  'WASCO': '5142',
  'WASCO BERHAD': '5142',
  'WSC': '5142',
  'WAH SEONG CORPORATION BERHAD': '5142',
  'YNHPROP': '3158',
  'YNH PROPERTY BERHAD': '3158',
  'YNHB': '3158',
  'MANULFE': '1058',
  'MANULIFE HOLDINGS BERHAD': '1058',
  'MNRB': '6459',
  'MNRB HOLDINGS BERHAD': '6459'
};

export const CANONICAL_RENAMED_PAIRS = [
  { stock: 'RKI', company: 'RHONG KHEN INTERNATIONAL BERHAD', formers: ['LATITUD', 'LATITUDE TREE HOLDINGS BERHAD'] },
  { stock: 'CDB', company: 'CELCOMDIGI BERHAD', formers: ['DIGI', 'DIGI.COM BERHAD', 'CELCOM', 'CELCOM (MALAYSIA) BERHAD'] },
  { stock: 'AWANTEC', company: 'AWANBIRU TECHNOLOGY BERHAD', formers: ['PRESBHD', 'PRESTARIANG BERHAD'] },
  { stock: 'VELESTO', company: 'VELESTO ENERGY BERHAD', formers: ['UMWOG', 'UMW OIL & GAS CORPORATION BERHAD'] },
  { stock: 'BAUTO', company: 'BERMAZ AUTO BERHAD', formers: ['BJAUTO', 'BERJAYA AUTO BERHAD'] },
  { stock: 'ABMB', company: 'ALLIANCE BANK MALAYSIA BERHAD', formers: ['AFG', 'ALLIANCE FINANCIAL GROUP BERHAD'] },
  { stock: 'CLMT', company: 'CAPITALAND MALAYSIA TRUST', formers: ['CMMT', 'CAPITALAND MALAYSIA MALL TRUST'] },
  { stock: 'DPHARMA', company: 'DUOPHARMA BIOTECH BERHAD', formers: ['DBIOTEC', 'CCMDBIO', 'CCM DUOPHARMA BIOTECH BERHAD'] },
  { stock: 'SENTRAL', company: 'SENTRAL REIT', formers: ['MQREIT', 'MRCB-QUILL REIT'] },
  { stock: 'AEON', company: 'AEON CO. (M) BHD', formers: ['JUSCO', 'JAYA JUSCO STORES BERHAD'] },
  { stock: 'POS', company: 'POS MALAYSIA BHD', formers: ['POSHLDG', 'POS MALAYSIA & SERVICES HOLDINGS BERHAD'] },
  { stock: 'WCT', company: 'WCT HOLDINGS BERHAD', formers: ['WCTLAND', 'WCT LAND BERHAD'] },
  { stock: 'VANTNRG', company: 'VANTRIS ENERGY BERHAD', formers: ['SAPCRES', 'SAPURACREST PETROLEUM BERHAD', 'SKPETRO', 'SAPURAKENCANA PETROLEUM BERHAD', 'SENERGY', 'SAPURA ENERGY BERHAD'] },
  { stock: 'UEMS', company: 'UEM SUNRISE BERHAD', formers: ['UEMLAND', 'UEM LAND HOLDINGS BERHAD', 'SUNRISE', 'SUNRISE BERHAD'] },
  { stock: 'IOIPG', company: 'IOI PROPERTIES GROUP BERHAD', formers: ['IOIPB', 'IOIPROP', 'IOI PROPERTIES BERHAD'] },
  { stock: 'EDGENTA', company: 'UEM EDGENTA BERHAD', formers: ['FABER', 'FABER GROUP BERHAD'] },
  { stock: 'SDG', company: 'SD GUTHRIE BERHAD', formers: ['SIMEPLT', 'SIME DARBY PLANTATION BERHAD'] },
  { stock: 'TALAMT', company: 'TALAM TRANSFORM BERHAD', formers: ['TALAM', 'TALAM CORPORATION BERHAD'] },
  { stock: 'GUOCO', company: 'GUOCOLAND (MALAYSIA) BHD', formers: ['HLPB', 'HONG LEONG PROPERTIES BHD'] },
  { stock: 'CIMB', company: 'CIMB GROUP HOLDINGS BERHAD', formers: ['COMMERZ', 'COMMERCE ASSET-HOLDING BERHAD'] },
  { stock: 'PBBANK', company: 'PUBLIC BANK BERHAD', formers: ['PFB', 'PBFIN', 'PUBLIC FINANCE BERHAD'] },
  { stock: 'YB', company: 'YB VENTURES BERHAD', formers: ['YILAI', 'YI-LAI BERHAD'] },
  { stock: 'GLOTEC', company: 'GLOBALTEC FORMATION BERHAD', formers: ['AIC', 'AIC CORPORATION BERHAD'] },
  { stock: 'PERDANA', company: 'PERDANA PETROLEUM BERHAD', formers: ['PETRA', 'PETRA PERDANA BERHAD'] },
  { stock: 'CRESBLD', company: 'CREST BUILDER HOLDINGS BHD', formers: ['CREST', 'CREST BUILDER HOLDINGS BERHAD'] },
  { stock: 'SIME', company: 'SIME DARBY BERHAD', formers: ['TRACTOR', 'TRACTORS MALAYSIA HOLDINGS BERHAD'] },
  { stock: 'WASCO', company: 'WASCO BERHAD', formers: ['WSC', 'WAH SEONG CORPORATION BERHAD'] }
];

export const RENAMED_STOCKS_MAP = {};
CANONICAL_RENAMED_PAIRS.forEach(pair => {
  const formerStr = pair.formers.join(' ');
  RENAMED_STOCKS_MAP[pair.stock.toUpperCase()] = { stock: pair.stock, company: pair.company, former: pair.formers[0], allFormers: formerStr };
  RENAMED_STOCKS_MAP[pair.company.toUpperCase()] = { stock: pair.stock, company: pair.company, former: pair.formers[0], allFormers: formerStr };
  pair.formers.forEach(f => {
    RENAMED_STOCKS_MAP[f.toUpperCase()] = { stock: pair.stock, company: pair.company, former: f, allFormers: formerStr };
  });
});

export function resolveRenamedStock(stock, company = '') {
  const sKey = (stock || '').toUpperCase().trim();
  const cKey = (company || '').toUpperCase().trim();
  const ren = RENAMED_STOCKS_MAP[sKey] || RENAMED_STOCKS_MAP[cKey];
  if (ren) {
    return {
      stock: ren.stock,
      company: ren.company,
      former: ren.former || (sKey !== ren.stock ? sKey : cKey),
      allFormers: ren.allFormers || ''
    };
  }
  return { stock: stock || '', company: company || '', former: '', allFormers: '' };
}

export const STOCK_CODE_MAP = Object.assign({}, BASE_STOCK_CODES);

export function getStockCode(stock, company = '', explicitCode = '') {
  let code = (explicitCode || '').trim();
  if (code && /^\d+/.test(code)) return code;

  const ren = resolveRenamedStock(stock, company);
  const sKey = (ren.stock || stock || '').toUpperCase().trim();
  const cKey = (ren.company || company || '').toUpperCase().trim();

  if (STOCK_CODE_MAP[sKey] && /^\d+/.test(STOCK_CODE_MAP[sKey])) return STOCK_CODE_MAP[sKey];
  if (STOCK_CODE_MAP[cKey] && /^\d+/.test(STOCK_CODE_MAP[cKey])) return STOCK_CODE_MAP[cKey];

  const raw = typeof window !== 'undefined' ? window.EPF_DATA : (typeof EPF_DATA !== 'undefined' ? EPF_DATA : null);
  if (raw && Array.isArray(raw.holdings)) {
    const match = raw.holdings.find(h =>
      (sKey && h.stock_name && h.stock_name.toUpperCase().trim() === sKey) ||
      (cKey && h.company_name && h.company_name.toUpperCase().trim() === cKey)
    );
    if (match && match.stock_code && /^\d+/.test(match.stock_code.trim())) {
      const found = match.stock_code.trim();
      if (sKey) STOCK_CODE_MAP[sKey] = found;
      if (cKey) STOCK_CODE_MAP[cKey] = found;
      return found;
    }
  }

  return '';
}

export function getKlseLink(stock, company = '', explicitCode = '') {
  const code = getStockCode(stock, company, explicitCode);
  if (!code || !/^\d+/.test(code)) return '';
  const ren = resolveRenamedStock(stock, company);
  const slug = slugify(ren.company || ren.stock || company || stock);
  return `https://www.klsescreener.com/v2/stocks/view/${encodeURIComponent(code)}${slug ? '/' + slug : ''}`;
}
