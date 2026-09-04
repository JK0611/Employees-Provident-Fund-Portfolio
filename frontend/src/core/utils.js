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
  'UEM EDGENTA BERHAD': '1481',
  'BERNAS': '6866',
  'PADIBERAS NASIONAL BERHAD': '6866',
  'LITRAK': '6645',
  'LINGKARAN TRANS KOTA HOLDINGS BERHAD': '6645',
  'QSR': '9415',
  'QSR BRANDS BHD': '9415',
  'KULIM': '2003',
  'KULIM (MALAYSIA) BERHAD': '2003',
  'MEASAT': '3980',
  'MEASAT GLOBAL BERHAD': '3980',
  'HSL': '6238',
  'HOCK SENG LEE BERHAD': '6238',
  'WEIDA': '7228',
  'WEIDA (M) BHD': '7228',
  'CCB': '2925',
  'CYCLE & CARRIAGE BINTANG BERHAD': '2925',
  'KINSTEL': '5060',
  'KINSTEEL BHD': '5060',
  'PERWAJA': '5146',
  'PERWAJA HOLDINGS BERHAD': '5146',
  'IVORY': '5175',
  'IVORY PROPERTIES GROUP BERHAD': '5175',
  'YNHB': '3158',
  'YU NEH HUAT BHD': '3158',
  'YILAI': '5048',
  'YI-LAI BERHAD': '5048',
  'SCOMI': '7158',
  'SCOMI GROUP BERHAD': '7158',
  'ENG': '7033',
  'ENG TEKNOLOGI HOLDINGS BHD': '7033',
  'LONBISC': '7126',
  'LONDON BISCUITS BERHAD': '7126',
  'DEGEM': '7119',
  'DEGEM BERHAD': '7119',
  'XIANLNG': '7121',
  'XIAN LENG HOLDINGS BERHAD': '7121',
  'INTI': '2712',
  'INTI UNIVERSAL HOLDINGS BHD': '2712',
  'EQUINE': '1147',
  'EQUINE CAPITAL BERHAD': '1147',
  'HDBS': '6688',
  'HWANG-DBS (MALAYSIA) BERHAD': '6688',
  'PATIMAS': '7042',
  'PATIMAS COMPUTERS BERHAD': '7042',
  'COURTS': '8362',
  'COURTS MAMMOTH BERHAD': '8362',
  'ATIS': '5055',
  'ATIS CORPORATION BERHAD': '5055',
  'MUTIARA': '9555',
  'MUTIARA GOODYEAR DEVELOPMENT BERHAD': '9555',
  'MEGAN': '7101',
  'MEGAN MEDIA HOLDINGS BERHAD': '7101',
  'HALIM': '5029',
  'HALIM MAZMIN BERHAD': '5029',
  'MTDINFR': '8583',
  'MTD INFRAPERDANA BERHAD': '8583',
  'AKN': '7030',
  'AKN TECHNOLOGY BERHAD': '7030',
  'MWATA': '5047',
  'MALAYAWATA STEEL BERHAD': '5047',
  'OYL': '7017',
  'O.Y.L. INDUSTRIES BHD': '7017',
  'HAISAN': '7232',
  'HAISAN RESOURCES BERHAD': '7232',
  'TRANMIL': '7000',
  'TRANSMILE GROUP BERHAD': '7000',
  'TRACTOR': '2216',
  'TRACTORS MALAYSIA HOLDINGS BERHAD': '2216',
  'AIC': '9539',
  'AIC CORPORATION BERHAD': '9539',
  'LKT': '9792',
  'LKT INDUSTRIAL BERHAD': '9792',
  'TRI': '2585',
  'TECHNOLOGY RESOURCES INDUSTRIES BERHAD': '2585',
  'FFM': '2062',
  'FFM BERHAD': '2062',
  'JOHPORT': '5037',
  'JOHOR PORT BERHAD': '5037',
  'BREM': '8761',
  'BREM HOLDING BERHAD': '8761',
  'HIRO': '9873',
  'HIROTAKO HOLDINGS BHD': '9873',
  'FUJITSU': '8443',
  'FUJITSU SYSTEMS BUSINESS (M) BERHAD': '8443',
  'PHILEO': '2704',
  'PHILEO ALLIED BERHAD': '2704',
  'RPB': '8885',
  'RELIANCE PACIFIC BERHAD': '8885',
  'S.BANK': '3107',
  'SOUTHERN BANK BERHAD': '3107',
  'COMMERZ': '1023',
  'COMMERCE ASSET-HOLDING BERHAD': '1023',
  'PILECON': '2852',
  'PILECON ENGINEERING BERHAD': '2852',
  'THBIND': '5000',
  'THB INDUSTRIES BHD': '5000',
  'HLPB': '1503',
  'HONG LEONG PROPERTIES BHD': '1503',
  'PFB': '1295',
  'PBFIN': '1295',
  'PUBLIC FINANCE BERHAD': '1295'
};

export const STOCK_CODE_MAP = Object.assign({}, BASE_STOCK_CODES);

export function getStockCode(stock, company = '', explicitCode = '') {
  let code = (explicitCode || '').trim();
  if (code && /^\d+/.test(code)) return code;

  const sKey = (stock || '').toUpperCase().trim();
  const cKey = (company || '').toUpperCase().trim();

  if (STOCK_CODE_MAP[sKey]) return STOCK_CODE_MAP[sKey];
  if (STOCK_CODE_MAP[cKey]) return STOCK_CODE_MAP[cKey];

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

  return code || (stock || '').trim();
}

export function getKlseLink(stock, company = '', explicitCode = '') {
  const code = getStockCode(stock, company, explicitCode);
  const slug = slugify(company || stock);
  if (!code) return 'https://www.klsescreener.com/';
  return `https://www.klsescreener.com/v2/stocks/view/${encodeURIComponent(code)}${slug ? '/' + slug : ''}`;
}
