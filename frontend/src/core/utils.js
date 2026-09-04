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
  'BSTEAD': '8133',
  'BOUSTEAD HOLDINGS BERHAD': '8133',
  'TALAM': '2259',
  'TALAM CORPORATION BERHAD': '2259',
  'LATITUD': '7006',
  'LATITUDE TREE HOLDINGS BERHAD': '7006',
  'PETRA': '5133',
  'PETRA ENERGY BHD': '5133',
  'PETRA PERDANA BERHAD': '5133',
  'FABER': '1481',
  'FABER GROUP BERHAD': '1481',
  'EDGENTA': '1481',
  'UEM EDGENTA BERHAD': '1481'
};

export const STOCK_CODE_MAP = Object.assign({}, BASE_STOCK_CODES);

export function getStockCode(stock, company = '', explicitCode = '') {
  let code = (explicitCode || '').trim();
  if (code && /^\d+/.test(code)) return code;

  const sKey = (stock || '').toUpperCase().trim();
  const cKey = (company || '').toUpperCase().trim();

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
  const slug = slugify(company || stock);
  return `https://www.klsescreener.com/v2/stocks/view/${encodeURIComponent(code)}${slug ? '/' + slug : ''}`;
}
