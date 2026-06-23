/* ============================================
   EPFTracker — Application Logic
   ============================================ */

// KLSE Screener stock codes lookup map
const STOCK_CODES = {
  "99SMART": "5326",
  "ABMB": "2488",
  "AEON": "6599",
  "AHEALTH": "7090",
  "ALLIANZ": "1163",
  "AMBANK": "1015",
  "AME": "5293",
  "ATECH": "5302",
  "AXIATA": "6888",
  "AXREIT": "5106",
  "BAUTO": "5248",
  "BIMB": "5258",
  "BURSA": "1818",
  "CBD": "6947",
  "CDB": "6947",
  "CELCOMDIGI": "6947",
  "CIMB": "1023",
  "CLMT": "5180",
  "CTOS": "5301",
  "D&O": "7204",
  "DAYANG": "5141",
  "DIALOG": "7277",
  "DPHARMA": "7148",
  "DRBHCOM": "1619",
  "E&O": "3417",
  "ECONBHD": "5253",
  "F&N": "3689",
  "FFB": "5306",
  "FRONTKN": "0128",
  "GAMUDA": "5398",
  "GENP": "2291",
  "HLBANK": "5819",
  "HLFG": "1082",
  "IGBREIT": "5227",
  "IHH": "5225",
  "IJM": "3336",
  "INARI": "0166",
  "IOICORP": "1961",
  "IOIPG": "5249",
  "ITMAX": "5309",
  "JPG": "5323",
  "KGB": "0151",
  "KLCC": "5235SS",
  "KLK": "2445",
  "KOSSAN": "7153",
  "KPJ": "5878",
  "MALAKOF": "5264",
  "MAXIS": "6012",
  "MAYBANK": "1155",
  "MBSB": "1171",
  "MFCB": "3069",
  "MISC": "3816",
  "MPI": "3867",
  "MRDIY": "5296",
  "NESTLE": "4707",
  "ORKIM": "5348",
  "PADINI": "7052",
  "PANAMY": "3719",
  "PARADIGM": "5187",
  "PAVREIT": "5212",
  "PBBANK": "1295",
  "PCHEM": "5183",
  "PENTA": "7160",
  "PETDAG": "5681",
  "PETGAS": "6033",
  "PLINTAS": "5320",
  "PMETAL": "8869",
  "PPB": "4065",
  "RHB": "1066",
  "RHBBANK": "1066",
  "SAM": "9822",
  "SCGBHD": "0225",
  "SCOMNET": "0001",
  "SDG": "5285",
  "SDS": "0212",
  "SIME": "4197",
  "SIMEPROP": "5288",
  "SKPRES": "7155",
  "SMRT": "0117",
  "SPSETIA": "8664PC",
  "SUNMED": "5555",
  "SUNREIT": "5176",
  "SUNWAY": "5263",
  "TAKAFUL": "6139",
  "TENAGA": "5347",
  "TIMECOM": "5031",
  "TM": "4863",
  "UNISEM": "5005",
  "UOADEV": "5200",
  "UTDPLT": "2089",
  "UWC": "5292",
  "VELESTO": "5243",
  "VS": "6963",
  "WASCO": "5142",
  "WPRTS": "5246",
  "YTL": "5109",
  "YTLPOWR": "6742",
  "YTLPOWER": "6742"
};

// Generates correct KLSE Screener URLs with slugified company name
function getKlseLink(stockSymbol, companyName) {
  const code = STOCK_CODES[stockSymbol.toUpperCase().trim()] || '';
  const slug = (companyName || stockSymbol).toLowerCase().trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `https://www.klsescreener.com/v2/stocks/view/${code}/${slug}`;
}

// Chart color palette
const COLORS = [
  '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#a855f7', '#0ea5e9', '#eab308', '#f43f5e', '#10b981',
  '#d946ef', '#2dd4bf', '#fb923c', '#818cf8', '#a3e635'
];

// Generate a deterministic color for a stock symbol
function stockColor(symbol) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

// Dynamic tradingview logos cache
let tvLogoMap = {};

// Hardcoded fallback map from logo.json for instant synchronous load
const fallbackTvLogos = {
  '99SMART': 'https://s3-symbol-logo.tradingview.com/99-speed-mart-retail-berhad--big.svg',
  'ABMB': 'https://s3-symbol-logo.tradingview.com/alliance-bank-malaysia-berhad--big.svg',
  'AEON': 'https://s3-symbol-logo.tradingview.com/aeon-co-m-bhd--big.svg',
  'AHEALTH': 'https://apexhealthcare.com.my/wp-content/uploads/2023/06/APEX_WEB_LOGO1.png',
  'ALLIANZ': 'https://s3-symbol-logo.tradingview.com/allianz--big.svg',
  'AMBANK': 'https://s3-symbol-logo.tradingview.com/ammb-holdings-bhd--big.svg',
  'AME': 'https://s3-symbol-logo.tradingview.com/ame-real-estate-investment-trust--big.svg',
  'ATECH': 'https://s3-symbol-logo.tradingview.com/aurelius-technologies-berhad--big.svg',
  'AXIATA': 'https://s3-symbol-logo.tradingview.com/axiata-group-berhad--big.svg',
  'AXREIT': 'https://s3-symbol-logo.tradingview.com/axis-reits--big.svg',
  'BAUTO': 'https://s3-symbol-logo.tradingview.com/bermaz-auto-berhad--big.svg',
  'BIMB': 'https://s3-symbol-logo.tradingview.com/bank-islam-malaysia-berhad--big.svg',
  'BURSA': 'https://s3-symbol-logo.tradingview.com/bursa-malaysia-bhd--big.svg',
  'CBD': 'https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg',
  'CDB': 'https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg',
  'CELCOMDIGI': 'https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg',
  'CIMB': 'https://s3-symbol-logo.tradingview.com/cimb-group-holdings-berhad--big.svg',
  'CLMT': 'https://s3-symbol-logo.tradingview.com/capitamall-trust--big.svg',
  'CTOS': 'https://s3-symbol-logo.tradingview.com/ctos-digital--big.svg',
  'D&O': 'https://s3-symbol-logo.tradingview.com/d-and-o-green-technologies--big.svg',
  'DAYANG': 'https://s3-symbol-logo.tradingview.com/dayang-enterprise-bhd--big.svg',
  'DIALOG': 'https://s3-symbol-logo.tradingview.com/dialog-group--big.svg',
  'DIALOG GROUP': 'https://s3-symbol-logo.tradingview.com/dialog-group--big.svg',
  'DPHARMA': 'https://s3-symbol-logo.tradingview.com/duopharma-biotech-berhad--big.svg',
  'DRBHCOM': 'https://s3-symbol-logo.tradingview.com/drb-hicom-bhd--big.svg',
  'E&O': 'https://s3-symbol-logo.tradingview.com/eastern-and-oriental-bhd--big.svg',
  'ECONBHD': 'https://s3-symbol-logo.tradingview.com/econpile-bhd--big.svg',
  'F&N': 'https://s3-symbol-logo.tradingview.com/fraser-and-neave-holdings-bhd--big.svg',
  'FFB': 'https://s3-symbol-logo.tradingview.com/farm-fresh-berhad--big.svg',
  'FRONTKN': 'https://s3-symbol-logo.tradingview.com/frontken--big.svg',
  'GAMUDA': 'https://s3-symbol-logo.tradingview.com/gamuda-bhd--big.svg',
  'GENP': 'https://s3-symbol-logo.tradingview.com/genting-plantations-berhad--big.svg',
  'HLBANK': 'https://s3-symbol-logo.tradingview.com/hong-leong-bank-bhd--big.svg',
  'HLFG': 'https://s3-symbol-logo.tradingview.com/hong-leong-financial-group-bhd--big.svg',
  'IGBREIT': 'https://s3-symbol-logo.tradingview.com/igb-real-estate-inv-trust--big.svg',
  'IHH': 'https://s3-symbol-logo.tradingview.com/ihh--big.svg',
  'IJM': 'https://s3-symbol-logo.tradingview.com/ijm-corporation-bhd--big.svg',
  'INARI': 'https://s3-symbol-logo.tradingview.com/inari-amertron-berhad--big.svg',
  'IOICORP': 'https://s3-symbol-logo.tradingview.com/ioi-corporation-bhd--big.svg',
  'IOIPG': 'https://s3-symbol-logo.tradingview.com/ioi-properties-group-berhad--big.svg',
  'JPG': 'https://s3-symbol-logo.tradingview.com/johor-plantations-berhad--big.svg',
  'KLCC': 'https://s3-symbol-logo.tradingview.com/klcc-propandreits-stapled-sec--big.svg',
  'KLK': 'https://s3-symbol-logo.tradingview.com/kuala-lumpur-kepong-bhd--big.svg',
  'KOSSAN': 'https://s3-symbol-logo.tradingview.com/kossan-rubber-industries--big.svg',
  'KPJ': 'https://s3-symbol-logo.tradingview.com/kpj-healthcare-bhd--big.svg',
  'MALAKOF': 'https://s3-symbol-logo.tradingview.com/malakoff-corporation-berhad--big.svg',
  'MAXIS': 'https://s3-symbol-logo.tradingview.com/maxis-berhad--big.svg',
  'MAYBANK': 'https://s3-symbol-logo.tradingview.com/malayan-banking--big.svg',
  'MBSB': 'https://s3-symbol-logo.tradingview.com/malaysia-building-society-bhd--big.svg',
  'MFCB': 'https://s3-symbol-logo.tradingview.com/mega-first-corporation-bhd--big.svg',
  'MISC': 'https://s3-symbol-logo.tradingview.com/misc-bhd--big.svg',
  'MPI': 'https://s3-symbol-logo.tradingview.com/malaysian-pacific-industries--big.svg',
  'MRDIY': 'https://s3-symbol-logo.tradingview.com/mr-d-i-y-group-m-berhad--big.svg',
  'NESTLE': 'https://s3-symbol-logo.tradingview.com/nestle--big.svg',
  'ORKIM': 'https://s3-symbol-logo.tradingview.com/orkim-bhd--big.svg',
  'PADINI': 'https://s3-symbol-logo.tradingview.com/padini-holdings-bhd--big.svg',
  'PANAMY': 'https://s3-symbol-logo.tradingview.com/panasonic-manufacturing-msia--big.svg',
  'PARADIGM': 'https://s3-symbol-logo.tradingview.com/paradigm-real-estate-investment-trust--big.svg',
  'PAVREIT': 'https://s3-symbol-logo.tradingview.com/pavilion-real-estate-inv-trust--big.svg',
  'PBBANK': 'https://s3-symbol-logo.tradingview.com/public-bank--big.svg',
  'PCHEM': 'https://s3-symbol-logo.tradingview.com/petronas-chemicals-group-bhd--big.svg',
  'PENTA': 'https://s3-symbol-logo.tradingview.com/pentamaster--big.svg',
  'PETDAG': 'https://s3-symbol-logo.tradingview.com/petronas-dagangan-bhd--big.svg',
  'PETGAS': 'https://s3-symbol-logo.tradingview.com/petronas-gas-bhd--big.svg',
  'PLINTAS': 'https://s3-symbol-logo.tradingview.com/prolintas-infra-business-trust--big.svg',
  'PMETAL': 'https://s3-symbol-logo.tradingview.com/press-metal-aluminium--big.svg',
  'PPB': 'https://s3-symbol-logo.tradingview.com/ppb-group-bhd--big.svg',
  'RHB': 'https://s3-symbol-logo.tradingview.com/rhb-bank-berhad--big.svg',
  'RHBBANK': 'https://s3-symbol-logo.tradingview.com/rhb-bank-berhad--big.svg',
  'SAM': 'https://s3-symbol-logo.tradingview.com/sam-engineering-and-equipment--big.svg',
  'SCGBHD': 'https://s3-symbol-logo.tradingview.com/southern-cable-berhad--big.svg',
  'SCOMNET': 'https://s3-symbol-logo.tradingview.com/supercomnet-technologies--big.svg',
  'SDG': 'https://s3-symbol-logo.tradingview.com/sime-darby-plantation-berhad--big.svg',
  'SIME': 'https://s3-symbol-logo.tradingview.com/sime-darby-bhd--big.svg',
  'SIMEPROP': 'https://s3-symbol-logo.tradingview.com/sime-darby-property-berhad--big.svg',
  'SKPRES': 'https://s3-symbol-logo.tradingview.com/skp-resources-bhd--big.svg',
  'SPSETIA': 'https://s3-symbol-logo.tradingview.com/sp-setia--big.svg',
  'SUNMED': 'https://s3-symbol-logo.tradingview.com/sunway-healthcare-berhad--big.svg',
  'SUNREIT': 'https://s3-symbol-logo.tradingview.com/sunway-real-estate-invt-trust--big.svg',
  'SUNWAY': 'https://s3-symbol-logo.tradingview.com/sunway-berhad--big.svg',
  'TAKAFUL': 'https://s3-symbol-logo.tradingview.com/syarikat-takaful-malaysia-keluarga-berhad--big.svg',
  'TENAGA': 'https://s3-symbol-logo.tradingview.com/tenaga-nasional--big.svg',
  'TIMECOM': 'https://s3-symbol-logo.tradingview.com/time-dotcom-bhd--big.svg',
  'TM': 'https://s3-symbol-logo.tradingview.com/telekom-malaysia-bhd--big.svg',
  'UOADEV': 'https://s3-symbol-logo.tradingview.com/uoa-development-berhad--big.svg',
  'UTDPLT': 'https://s3-symbol-logo.tradingview.com/united-plantations-bhd--big.svg',
  'UWC': 'https://s3-symbol-logo.tradingview.com/uwc--big.svg',
  'WASCO': 'https://s3-symbol-logo.tradingview.com/wah-seong-bhd--big.svg',
  'WPRTS': 'https://s3-symbol-logo.tradingview.com/westports-holdings-berhad--big.svg',
  'YTL': 'https://s3-symbol-logo.tradingview.com/ytl-corporation-bhd--big.svg',
  'YTLPOWER': 'https://s3-symbol-logo.tradingview.com/ytl-power-international-bhd--big.svg'
};

// Clearbit official company domain mapping for high-quality corporate logos
function getLogoUrl(companyName, stockName) {
  const name = companyName ? companyName.toUpperCase().trim() : '';
  const ticker = stockName ? stockName.toUpperCase().trim() : '';

  // 1. Check TradingView Logo mappings from logo.json (cached or fallback)
  const map = { ...fallbackTvLogos, ...tvLogoMap };
  if (ticker && map[ticker]) return map[ticker];
  
  for (const [key, url] of Object.entries(map)) {
    const upperKey = key.toUpperCase().trim();
    if (ticker === upperKey) return url;
    
    // Check specific custom aliases
    if (upperKey === 'CBD' && (ticker === 'CDB' || ticker === 'CELCOMDIGI')) return url;
    if (upperKey === 'RHB' && (ticker === 'RHBBANK' || ticker === 'RHB')) return url;
    if (upperKey === 'DIALOG GROUP' && (ticker === 'DIALOG' || name.includes('DIALOG'))) return url;
    
    // Check substring matches
    if (ticker && (ticker.includes(upperKey) || upperKey.includes(ticker))) return url;
    if (name && (name.includes(upperKey) || upperKey.includes(name))) return url;
  }

  let domain = null;

  const symbolDomains = {
    'MAYBANK': 'maybank.com',
    'PBBANK': 'publicbank.com.my',
    'CIMB': 'cimb.com',
    'AXIATA': 'axiata.com',
    'RHBBANK': 'rhbgroup.com',
    'TENAGA': 'tnb.com.my',
    'YTL': 'ytl.com',
    'CELCOMDIGI': 'celcomdigi.com',
    'DIALOG': 'dialogasia.com',
    'GAMUDA': 'gamuda.com.my',
    'IHH': 'ihhhealthcare.com',
    'SIMEPROP': 'simedarbyproperty.com',
    'SIME': 'simedarby.com',
    'SDG': 'sdguthrie.com',
    'MAXIS': 'maxis.com.my',
    'MRDIY': 'mrdiy.com',
    'IOICORP': 'ioigroup.com',
    'PCHEM': 'petronaschemicals.com',
    'YTLPOWR': 'ytlpower.com.my',
    'MALAKOF': 'malakoff.com.my',
    'TM': 'tm.com.my',
    'PMETAL': 'pressmetal.com',
    'SUNWAY': 'sunway.com.my',
    'IJM': 'ijm.com',
    'MISC': 'misc.com.my',
    'SPSETIA': 'spsetia.com',
    '99SMART': '99speedmart.com.my',
    'INARI': 'inaricorp.com',
    'AMBANK': 'ambankgroup.com',
    'SUNREIT': 'sunwayreit.com',
    'PAVREIT': 'pavilionreit.com',
    'CTOS': 'ctosdigital.com',
    'AXREIT': 'axisreit.com.my',
    'IGBREIT': 'igbreit.com',
    'UOADEV': 'uoa.com.my',
    'IOIPG': 'ioiproperties.com.my',
    'BIMB': 'bankislam.com',
    'FFB': 'farmfresh.com.my',
    'TIMECOM': 'time.com.my',
    'FRONTKN': 'frontken.com',
    'PETGAS': 'petronasgas.com',
    'PPB': 'ppbgroup.com',
    'JPG': 'johorplantations.com',
    'WPRTS': 'westportsholdings.com',
    'KLK': 'klk.com.my',
    'HLBANK': 'hlb.com.my',
    'KLCC': 'klcc.com.my',
    'SKPRES': 'skpres.com',
    'E&O': 'easternandoriental.com',
    'ATECH': 'atechgroup.com.my',
    'TAKAFUL': 'takaful-malaysia.com.my',
    'DRBHCOM': 'drb-hicom.com',
    'DAYANG': 'desb.net',
    'ABMB': 'alliancebank.com.my',
    'KOSSAN': 'kossan.com.my',
    'GENP': 'gentingplantations.com',
    'PETDAG': 'mymesra.com.my',
    'BURSA': 'bursamalaysia.com',
    'MFCB': 'megafirst.com',
    'AEON': 'aeongroupmalaysia.com',
    'PADINI': 'padini.com',
    'SCGBHD': 'southerncable.com.my',
    'PLINTAS': 'prolintas.com.my',
    'HLFG': 'hlfg.com.my',
    'ECONBHD': 'econpile.com',
    'BAUTO': 'bauto.com.my',
    'SCOMNET': 'supercomnet.com.my',
    'ORKIM': 'orkim.com.my',
    'UWC': 'uwcberhad.com.my',
    'D&O': 'dogt.com.my',
    'F&N': 'fn.com.my',
    'WASCO': 'wascoenergy.com',
    'UTDPLT': 'unitedplantations.com',
    'SAM': 'sam-mfg.com.my',
    'AME': 'ame-elite.com',
    'NESTLE': 'nestle.com.my',
    'ALLIANZ': 'allianz.com.my',
    'PANAMY': 'panasonic.com.my'
  };

  const domains = {
    'MALAYAN BANKING BERHAD': 'maybank.com',
    'PUBLIC BANK BERHAD': 'publicbank.com.my',
    'CIMB GROUP HOLDINGS BERHAD': 'cimb.com',
    'AXIATA GROUP BERHAD': 'axiata.com',
    'RHB BANK BERHAD': 'rhbgroup.com',
    'TENAGA NASIONAL BHD': 'tnb.com.my',
    'YTL CORPORATION BERHAD': 'ytl.com',
    'CELCOMDIGI BERHAD': 'celcomdigi.com',
    'DIALOG GROUP BERHAD': 'dialogasia.com',
    'GAMUDA BERHAD': 'gamuda.com.my',
    'IHH HEALTHCARE BERHAD': 'ihhhealthcare.com',
    'SIME DARBY PROPERTY BERHAD': 'simedarbyproperty.com',
    'SIME DARBY BERHAD': 'simedarby.com',
    'SD GUTHRIE BERHAD': 'sdguthrie.com',
    'MAXIS BERHAD': 'maxis.com.my',
    'MR D.I.Y. GROUP (M) BERHAD': 'mrdiy.com',
    'IOI CORPORATION BERHAD': 'ioigroup.com',
    'PETRONAS CHEMICALS GROUP BERHAD': 'petronaschemicals.com',
    'YTL POWER INTERNATIONAL BHD': 'ytlpower.com.my',
    'MALAKOFF CORPORATION BERHAD': 'malakoff.com.my',
    'TELEKOM MALAYSIA BERHAD': 'tm.com.my',
    'PRESS METAL ALUMINIUM HOLDINGS BERHAD': 'pressmetal.com',
    'SUNWAY BERHAD': 'sunway.com.my',
    'IJM CORPORATION BERHAD': 'ijm.com',
    'MISC BERHAD': 'misc.com.my',
    'S P SETIA BERHAD': 'spsetia.com',
    '99 SPEED MART RETAIL HOLDINGS BERHAD': '99speedmart.com.my',
    'INARI AMERTRON BERHAD': 'inaricorp.com',
    'AMMB HOLDINGS BERHAD': 'ambankgroup.com',
    'SUNWAY REAL ESTATE INVESTMENT TRUST': 'sunwayreit.com',
    'PAVILION REAL ESTATE INVESTMENT TRUST': 'pavilionreit.com',
    'CTOS DIGITAL BERHAD': 'ctosdigital.com',
    'AXIS REAL ESTATE INVESTMENT TRUST': 'axisreit.com.my',
    'IGB REAL ESTATE INVESTMENT TRUST': 'igbreit.com',
    'UOA DEVELOPMENT BHD': 'uoa.com.my',
    'IOI PROPERTIES GROUP BERHAD': 'ioiproperties.com.my',
    'BANK ISLAM MALAYSIA BERHAD': 'bankislam.com',
    'FARM FRESH BERHAD': 'farmfresh.com.my',
    'TIME DOTCOM BERHAD': 'time.com.my',
    'FRONTKEN CORPORATION BERHAD': 'frontken.com',
    'PETRONAS GAS BERHAD': 'petronasgas.com',
    'PPB GROUP BERHAD': 'ppbgroup.com',
    'JOHOR PLANTATIONS GROUP BERHAD': 'johorplantations.com',
    'WESTPORTS HOLDINGS BERHAD': 'westportsholdings.com',
    'KUALA LUMPUR KEPONG BERHAD': 'klk.com.my',
    'HONG LEONG BANK BERHAD': 'hlb.com.my',
    'KLCC PROPERTY HOLDINGS BERHAD': 'klcc.com.my',
    'SKP RESOURCES BHD': 'skpres.com',
    'EASTERN & ORIENTAL BERHAD': 'easternandoriental.com',
    'AURELIUS TECHNOLOGIES BERHAD': 'atechgroup.com.my',
    'SYARIKAT TAKAFUL MALAYSIA KELUARGA BERHAD': 'takaful-malaysia.com.my',
    'DRB-HICOM BERHAD': 'drb-hicom.com',
    'DAYANG ENTERPRISE HOLDINGS BERHAD': 'desb.net',
    'ALLIANCE BANK MALAYSIA BERHAD': 'alliancebank.com.my',
    'KOSSAN RUBBER INDUSTRIES BHD.': 'kossan.com.my',
    'GENTING PLANTATIONS BERHAD': 'gentingplantations.com',
    'PETRONAS DAGANGAN BHD': 'mymesra.com.my',
    'BURSA MALAYSIA BERHAD': 'bursamalaysia.com',
    'MEGA FIRST CORPORATION BERHAD': 'megafirst.com',
    'AEON CO. (M) BHD': 'aeongroupmalaysia.com',
    'PADINI HOLDINGS BERHAD': 'padini.com',
    'SOUTHERN CABLE GROUP BERHAD': 'southerncable.com.my',
    'PROLINTAS INFRA BUSINESS TRUST': 'prolintas.com.my',
    'HONG LEONG FINANCIAL GROUP BERHAD': 'hlfg.com.my',
    'ECONPILE HOLDINGS BERHAD': 'econpile.com',
    'BERMAZ AUTO BERHAD': 'bauto.com.my',
    'SUPERCOMNET TECHNOLOGIES BERHAD': 'supercomnet.com.my',
    'ORKIM BERHAD': 'orkim.com.my',
    'UWC BERHAD': 'uwcberhad.com.my',
    'D & O GREEN TECHNOLOGIES BERHAD': 'dogt.com.my',
    'FRASER & NEAVE HOLDINGS BHD': 'fn.com.my',
    'WASCO BERHAD': 'wascoenergy.com',
    'UNITED PLANTATIONS BERHAD': 'unitedplantations.com',
    'SAM ENGINEERING & EQUIPMENT (M) BERHAD': 'sam-mfg.com.my',
    'AME ELITE CONSORTIUM BERHAD': 'ame-elite.com',
    'NESTLE (MALAYSIA) BERHAD': 'nestle.com.my',
    'ALLIANZ MALAYSIA BERHAD': 'allianz.com.my',
    'PANASONIC MANUFACTURING MALAYSIA BERHAD': 'panasonic.com.my'
  };

  domain = symbolDomains[ticker];
  if (!domain) {
    domain = domains[name];
  }

  if (!domain && typeof EPF_DATA !== 'undefined' && EPF_DATA.companyDomains) {
    if (stockName && EPF_DATA.companyDomains[stockName]) {
      domain = EPF_DATA.companyDomains[stockName];
    } else if (companyName && EPF_DATA.companyDomains[companyName]) {
      domain = EPF_DATA.companyDomains[companyName];
    }
  }

  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }
  
  // Fallback slug generation
  const clean = name
    .replace(/\b(BERHAD|BHD|CORPORATION|GROUP|HOLDINGS|CO|M)\b/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
  return `https://logo.clearbit.com/${clean}.com`;
}

// ============================================
// Tab System
// ============================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Reset all tab buttons classes
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('bg-surface-container-highest', 'text-on-surface', 'font-semibold');
      b.classList.add('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface-container-low');
    });
    
    // 2. Set active button class
    btn.classList.add('bg-surface-container-highest', 'text-on-surface', 'font-semibold');
    btn.classList.remove('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface-container-low');
    
    // 3. Hide all panels
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.add('hidden');
      p.classList.remove('active');
    });
    
    // 4. Show target panel
    const panel = document.getElementById(`panel-${btn.dataset.tab}`);
    if (panel) {
      panel.classList.remove('hidden');
      panel.classList.add('active');
    }

    // 5. Redraw charts that were hidden (canvas needs visible dimensions)
    if (btn.dataset.tab === 'returns') {
      requestAnimationFrame(() => {
        drawBarChart('returns-canvas', getReturnsData(currentReturnsView));
      });
    } else if (btn.dataset.tab === 'holdings') {
      requestAnimationFrame(() => {
        const pieData = getPieData(currentPieMode);
        drawPieChart('pie-canvas', pieData, currentPieMode, !pieChartDrawn);
        pieChartDrawn = true;
      });
    } else if (btn.dataset.tab === 'dashboard') {
      requestAnimationFrame(() => {
        drawLineChart('portfolio-canvas', getPortfolioTimeSeries(currentRange), '#8b5cf6', !lineChartDrawn);
        lineChartDrawn = true;
      });
    }
  });
});

// ============================================
// Holdings Tab
// ============================================

// Compute portfolio totals
const totalSecurities = EPF_DATA.holdings.reduce((s, h) => s + h.total_securities, 0);
const totalMarketValue = EPF_DATA.holdings.reduce((s, h) => s + (h.market_value || 0), 0);

// Pre-calculate portfolio percentage for each holding
EPF_DATA.holdings.forEach(h => {
  h.percent_portfolio = totalMarketValue > 0 ? ((h.market_value || 0) / totalMarketValue) * 100 : 0;
  h.percent_company = h.direct_percent; // alias for sorting
  h.shares = h.total_securities; // alias for sorting
});

// Setup sector filter
const sectors = [...new Set(EPF_DATA.holdings.map(h => h.sector))].sort();
const sectorFilter = document.getElementById('holdings-sector-filter');
if (sectorFilter) {
  sectors.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    sectorFilter.appendChild(opt);
  });
  sectorFilter.addEventListener('change', renderHoldingsTable);
}

// Setup holdings search
const holdingsSearch = document.getElementById('holdings-search');
const holdingsSearchClear = document.getElementById('holdings-search-clear');
if (holdingsSearch && holdingsSearchClear) {
  holdingsSearch.addEventListener('input', () => {
    holdingsSearchClear.style.display = holdingsSearch.value ? 'flex' : 'none';
    renderHoldingsTable();
  });
  holdingsSearchClear.addEventListener('click', () => {
    holdingsSearch.value = '';
    holdingsSearchClear.style.display = 'none';
    renderHoldingsTable();
  });
}

// Setup sorting
let holdingsSortCol = 'market_value';
let holdingsSortAsc = false;

document.querySelectorAll('#holdings-table th.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.sort;
    if (holdingsSortCol === col) {
      holdingsSortAsc = !holdingsSortAsc; // Toggle direction
    } else {
      holdingsSortCol = col;
      holdingsSortAsc = true; // Default to ascending on first click
    }
    
    // Update UI headers
    document.querySelectorAll('#holdings-table th.sortable').forEach(h => {
      h.classList.remove('active', 'desc');
    });
    
    if (holdingsSortAsc) {
      th.classList.add('active');
    }
    
    renderHoldingsTable();
  });
});

function renderHoldingsTable() {
  const tbody = document.getElementById('holdings-tbody');
  
  // 1. Filter
  const filterVal = sectorFilter ? sectorFilter.value : 'all';
  const holdingsSearchVal = holdingsSearch ? holdingsSearch.value.toLowerCase().trim() : '';

  let data = EPF_DATA.holdings.filter(h => {
    const matchSector = filterVal === 'all' || h.sector === filterVal;
    const matchSearch = !holdingsSearchVal || h.company_name.toLowerCase().includes(holdingsSearchVal) || h.stock_name.toLowerCase().includes(holdingsSearchVal);
    return matchSector && matchSearch;
  });
  
  // 2. Sort
  if (holdingsSortCol) {
    data.sort((a, b) => {
      const valA = a[holdingsSortCol] || 0;
      const valB = b[holdingsSortCol] || 0;
      return holdingsSortAsc ? valA - valB : valB - valA;
    });
  }

  document.getElementById('holdings-count').textContent = data.length;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="align-center" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matching holdings found</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((h, i) => {
    const logoUrl = getLogoUrl(h.company_name, h.stock_name);
    let domain = '';
    if (EPF_DATA.companyDomains && EPF_DATA.companyDomains[h.stock_name]) {
      domain = EPF_DATA.companyDomains[h.stock_name];
    } else {
      const match = logoUrl ? logoUrl.match(/logo\.clearbit\.com\/(.+)$/) : null;
      if (match) domain = match[1];
    }

    const priceText = h.price ? `RM ${h.price.toFixed(2)}` : 'RM 0.00';
    const valueText = h.market_value ? `RM ${h.market_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'RM 0.00';

    return `<tr>
      <td>${i + 1}</td>
      <td>
        <a href="${getKlseLink(h.stock_name, h.company_name)}" target="_blank" class="stock-symbol-link" title="View ${h.stock_name} on KLSE Screener">
          <div class="stock-symbol">
            ${logoUrl ? `
              <img src="${logoUrl}" 
                   class="stock-icon-img" 
                   onerror="if (this.src.indexOf('clearbit') !== -1 && '${domain}') { this.src = 'https://www.google.com/s2/favicons?sz=128&domain=${domain}'; } else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }" 
                   alt="${h.stock_name}">
            ` : ''}
            <div class="stock-icon fallback-icon" style="background:${stockColor(h.stock_name)}; ${logoUrl ? 'display:none;' : ''}">${h.stock_name.slice(0, 2)}</div>
            <span class="stock-name">${h.stock_name}</span>
          </div>
        </a>
      </td>
      <td>${h.company_name}</td>
      <td>${h.sector}</td>
      <td class="align-right font-medium">${priceText}</td>
      <td class="align-right">${h.total_securities.toLocaleString()}</td>
      <td class="align-right font-semibold text-primary-fixed-dim">${valueText}</td>
      <td class="align-right">${h.direct_percent.toFixed(3)}%</td>
      <td class="align-right font-medium">${h.percent_portfolio.toFixed(3)}%</td>
    </tr>`;
  }).join('');
}

// ============================================
// Portfolio Value Line Chart (Canvas)
// ============================================

function getPortfolioTimeSeries(range) {
  // Parse dates and sort chronologically
  const dates = Object.keys(EPF_DATA.txByDate).map(d => ({
    label: d,
    date: new Date(d),
    ...EPF_DATA.txByDate[d]
  })).sort((a, b) => a.date - b.date);

  // Filter by range
  const now = dates[dates.length - 1]?.date || new Date();
  let cutoff;
  switch (range) {
    case '1D': cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 1); break;
    case '1W': cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 7); break;
    case '1M': cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 1); break;
    case '3M': cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 3); break;
    case '6M': cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 6); break;
    case 'YTD': cutoff = new Date(now.getFullYear(), 0, 1); break;
    case '1Y': cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 1); break;
    default: cutoff = new Date(0);
  }

  const filtered = dates.filter(d => d.date >= cutoff);

  // Build cumulative series
  let cum = 0;
  return filtered.map(d => {
    cum += d.net;
    return { label: d.label, value: cum, count: d.count };
  });
}

let lineChartAnimId = null;

function drawLineChart(canvasId, data, color = '#8b5cf6', animateChart = true) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 30, left: 60 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);

  if (data.length < 2) {
    ctx.fillStyle = '#555570';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Not enough data for this range', w / 2, h / 2);
    return;
  }

  const values = data.map(d => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  if (lineChartAnimId) cancelAnimationFrame(lineChartAnimId);

  let startTime = null;
  const DURATION = 1000; // 1 second animation

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    
    // Easing function (easeOutQuart)
    const easeProgress = 1 - Math.pow(1 - progress, 4);

    ctx.clearRect(0, 0, w, h);

    // Y-axis labels
    ctx.fillStyle = '#555570';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = minV + (range * i / 4);
      const y = pad.top + plotH - (plotH * i / 4);
      ctx.fillText(formatCompact(val), pad.left - 8, y + 3);
      // Grid line
      ctx.strokeStyle = 'rgba(37, 37, 58, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
    }

    // X-axis labels
    ctx.fillStyle = '#555570';
    ctx.textAlign = 'center';
    const isMobile = window.innerWidth < 768;
    const maxLabels = isMobile ? 3 : 6;
    const labelStep = Math.max(1, Math.floor(data.length / maxLabels));
    for (let i = 0; i < data.length; i += labelStep) {
      const x = pad.left + (plotW * i / (data.length - 1));
      const parts = data[i].label.split(' ');
      ctx.fillText(`${parts[0]} ${parts[1]}`, x, h - 5);
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
    gradient.addColorStop(0, color + '30');
    gradient.addColorStop(1, color + '00');

    // Calculate how many points to draw based on progress
    const maxDrawIndex = (data.length - 1) * easeProgress;
    
    // Fill area
    const fillPath = new Path2D();
    data.forEach((d, i) => {
      if (i > Math.ceil(maxDrawIndex)) return;
      
      let x = pad.left + (plotW * i / (data.length - 1));
      let y = pad.top + plotH - ((d.value - minV) / range * plotH);
      
      // Interpolate the last point for smooth animation
      if (i === Math.ceil(maxDrawIndex) && i > 0 && maxDrawIndex % 1 !== 0) {
        const prev = data[i-1];
        const prevX = pad.left + (plotW * (i-1) / (data.length - 1));
        const prevY = pad.top + plotH - ((prev.value - minV) / range * plotH);
        const fraction = maxDrawIndex % 1;
        x = prevX + (x - prevX) * fraction;
        y = prevY + (y - prevY) * fraction;
      }
      
      if (i === 0) fillPath.moveTo(x, y);
      else fillPath.lineTo(x, y);
    });
    
    // Complete the fill path down to the x-axis
    const lastDrawnIdx = Math.min(Math.ceil(maxDrawIndex), data.length - 1);
    let finalX = pad.left + (plotW * lastDrawnIdx / (data.length - 1));
    if (maxDrawIndex % 1 !== 0 && lastDrawnIdx > 0) {
        const prev = data[lastDrawnIdx-1];
        const prevX = pad.left + (plotW * (lastDrawnIdx-1) / (data.length - 1));
        const fraction = maxDrawIndex % 1;
        finalX = prevX + (finalX - prevX) * fraction;
    }
    
    fillPath.lineTo(finalX, pad.top + plotH);
    fillPath.lineTo(pad.left, pad.top + plotH);
    fillPath.closePath();
    
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fill(fillPath);
    ctx.restore();

    // Stroke line
    ctx.beginPath();
    data.forEach((d, i) => {
      if (i > Math.ceil(maxDrawIndex)) return;
      
      let x = pad.left + (plotW * i / (data.length - 1));
      let y = pad.top + plotH - ((d.value - minV) / range * plotH);
      
      if (i === Math.ceil(maxDrawIndex) && i > 0 && maxDrawIndex % 1 !== 0) {
        const prev = data[i-1];
        const prevX = pad.left + (plotW * (i-1) / (data.length - 1));
        const prevY = pad.top + plotH - ((prev.value - minV) / range * plotH);
        const fraction = maxDrawIndex % 1;
        x = prevX + (x - prevX) * fraction;
        y = prevY + (y - prevY) * fraction;
      }
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots on the moving end point
    if (easeProgress > 0) {
        const lastIdx = Math.min(Math.ceil(maxDrawIndex), data.length - 1);
        let currX = pad.left + (plotW * lastIdx / (data.length - 1));
        let currY = pad.top + plotH - ((data[lastIdx].value - minV) / range * plotH);
        
        if (maxDrawIndex % 1 !== 0 && lastIdx > 0) {
            const prev = data[lastIdx-1];
            const prevX = pad.left + (plotW * (lastIdx-1) / (data.length - 1));
            const prevY = pad.top + plotH - ((prev.value - minV) / range * plotH);
            const fraction = maxDrawIndex % 1;
            currX = prevX + (currX - prevX) * fraction;
            currY = prevY + (currY - prevY) * fraction;
        }

        ctx.beginPath();
        ctx.arc(currX, currY, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(currX, currY, 8, 0, Math.PI * 2);
        ctx.fillStyle = color + '30';
        ctx.fill();
    }

    if (progress < 1) {
      lineChartAnimId = requestAnimationFrame(animate);
    } else {
      // Animation complete, save state for hover interactions
      lineChartMeta = { data, pad, plotW, plotH, minV, range, rect };
      if (window._lineSaveCanvas) window._lineSaveCanvas();
    }
  }

  // Start animation
  if (!animateChart) {
    startTime = performance.now();
    animate(startTime + DURATION);
  } else {
    lineChartAnimId = requestAnimationFrame(animate);
  }
}

// ============================================
// Pie Chart (Canvas)
// ============================================

function getPieData(mode) {
  const map = {};
  EPF_DATA.holdings.forEach(h => {
    const key = mode === 'sector' ? h.sector : h.stock_name;
    map[key] = (map[key] || 0) + (h.market_value || 0);
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0);
  const TOP_N = 10;
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const othersValue = rest.reduce((s, [, v]) => s + v, 0);

  const result = top.map(([label, value], i) => ({
    label,
    value,
    pct: ((value / total) * 100).toFixed(1),
    color: COLORS[i % COLORS.length]
  }));

  if (othersValue > 0) {
    result.push({
      label: `Others (${rest.length})`,
      value: othersValue,
      pct: ((othersValue / total) * 100).toFixed(1),
      color: '#555570'
    });
  }

  return result;
}

let currentPieModeForDraw = 'company';
let pieChartAnimId = null;
function drawPieChart(canvasId, data, mode, animateChart = true) {
  currentPieModeForDraw = mode || 'company';
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const container = canvas.parentElement;
  const size = Math.min(container.clientWidth, container.clientHeight);
  if (size <= 0) return;

  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - 10;
  const innerRadius = radius * 0.45;
  const total = data.reduce((s, d) => s + d.value, 0);

  if (pieChartAnimId) cancelAnimationFrame(pieChartAnimId);

  let startTime = null;
  const DURATION = 1000; // 1 second animation

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    
    // Easing function (easeOutCubic)
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const maxRevealAngle = -Math.PI / 2 + (Math.PI * 2 * easeProgress);

    ctx.clearRect(0, 0, size, size);

    let startAngle = -Math.PI / 2;
    data.forEach(d => {
      if (startAngle >= maxRevealAngle) return; // Beyond current animation progress

      const sliceAngle = (d.value / total) * 2 * Math.PI;
      const trueEndAngle = startAngle + sliceAngle;
      const endAngle = Math.min(trueEndAngle, maxRevealAngle);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();

      // Slight gap
      ctx.strokeStyle = '#16161f';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = trueEndAngle;
    });

    // Inner circle (donut)
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#16161f';
    ctx.fill();

    // Center text - fade in
    ctx.globalAlpha = easeProgress;
    ctx.fillStyle = '#eaeaf0';
    ctx.font = '600 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const totalItems = mode === 'sector'
      ? Object.keys(Object.fromEntries(EPF_DATA.holdings.map(h => [h.sector, 1]))).length
      : EPF_DATA.holdings.length;
    // +1 to cy helps perfectly center Inter font visually
    ctx.fillText(totalItems + (mode === 'sector' ? ' sectors' : ' stocks'), cx, cy + 1);
    ctx.globalAlpha = 1.0;

    if (progress < 1) {
      pieChartAnimId = requestAnimationFrame(animate);
    } else {
      // Store metadata for hover
      pieChartMeta = { data, cx, cy, radius, innerRadius, total };
    }
  }

  // Start animation
  if (!animateChart) {
    startTime = performance.now();
    animate(startTime + DURATION);
  } else {
    pieChartAnimId = requestAnimationFrame(animate);
  }
}

function renderPieLegend(data) {
  const el = document.getElementById('pie-legend');
  el.innerHTML = data.map(d => `
    <div class="pie-legend-item">
      <span class="pie-legend-dot" style="background:${d.color}"></span>
      <span>${d.label} <span style="color:var(--text-muted)">${d.pct}%</span></span>
    </div>
  `).join('');
}

// ============================================
// Returns Tab — Bar Chart
// ============================================

function getReturnsData(view) {
  const dates = Object.keys(EPF_DATA.txByDate).map(d => ({
    label: d,
    date: new Date(d),
    ...EPF_DATA.txByDate[d]
  })).sort((a, b) => a.date - b.date);

  return dates.map(d => ({
    label: d.label,
    value: view === 'net' ? d.net : view === 'acquired' ? d.acquired : -d.disposed,
    count: d.count
  }));
}

function drawBarChart(canvasId, data, color = '#8b5cf6') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 30, left: 70 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);

  if (data.length === 0) return;

  const values = data.map(d => d.value);
  const maxV = Math.max(...values, 0);
  const minV = Math.min(...values, 0);
  const range = maxV - minV || 1;

  // Zero line position
  const zeroY = pad.top + plotH - ((0 - minV) / range * plotH);

  // Grid + Y axis
  ctx.fillStyle = '#555570';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = minV + (range * i / 4);
    const y = pad.top + plotH - (plotH * i / 4);
    ctx.fillText(formatCompact(val), pad.left - 8, y + 3);
    ctx.strokeStyle = 'rgba(37, 37, 58, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
  }

  // Zero line
  ctx.strokeStyle = 'rgba(136, 136, 160, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pad.left, zeroY);
  ctx.lineTo(w - pad.right, zeroY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Bars
  const barW = Math.max(2, (plotW / data.length) - 2);
  data.forEach((d, i) => {
    const x = pad.left + (plotW * i / data.length) + 1;
    const barH = (Math.abs(d.value) / range) * plotH;
    const y = d.value >= 0 ? zeroY - barH : zeroY;

    ctx.fillStyle = d.value >= 0 ? '#22c55e' : '#ef4444';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    // Rounded top
    const r = Math.min(2, barW / 2);
    ctx.roundRect(x, y, barW, barH, [r, r, 0, 0]);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // X-axis labels
  ctx.fillStyle = '#555570';
  ctx.textAlign = 'center';
  const isMobile = window.innerWidth < 768;
  const maxLabels = isMobile ? 4 : 8;
  const step = Math.max(1, Math.floor(data.length / maxLabels));
  for (let i = 0; i < data.length; i += step) {
    const x = pad.left + (plotW * i / data.length) + barW / 2;
    const parts = data[i].label.split(' ');
    ctx.fillText(`${parts[0]} ${parts[1]}`, x, h - 5);
  }

  // Store metadata for hover
  barChartMeta = { data, pad, plotW, plotH, minV, range, barW };
  // Save canvas bitmap for hover overlay
  if (window._barSaveCanvas) window._barSaveCanvas();
}

function renderReturnsSummary() {
  const dates = Object.values(EPF_DATA.txByDate);
  const totalAcquired = dates.reduce((s, d) => s + d.acquired, 0);
  const totalDisposed = dates.reduce((s, d) => s + d.disposed, 0);
  const totalNet = totalAcquired - totalDisposed;
  const totalTx = dates.reduce((s, d) => s + d.count, 0);

  document.getElementById('returns-summary').innerHTML = `
    <div class="summary-card">
      <div class="summary-card-label">Total Acquired</div>
      <div class="summary-card-value positive">${formatCompact(totalAcquired)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Total Disposed</div>
      <div class="summary-card-value negative">${formatCompact(totalDisposed)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Net Activity</div>
      <div class="summary-card-value ${totalNet >= 0 ? 'positive' : 'negative'}">${formatCompact(totalNet)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Total Announcements</div>
      <div class="summary-card-value">${totalTx.toLocaleString()}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Unique Stocks</div>
      <div class="summary-card-value">${EPF_DATA.uniqueStocks}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Trading Days</div>
      <div class="summary-card-value">${Object.keys(EPF_DATA.txByDate).length}</div>
    </div>
  `;
}

// ============================================
// Transactions Tab
// ============================================

const TX_PER_PAGE = 50;
let txPage = 1;
let filteredTx = [];

function flattenTransactions() {
  const list = [];
  EPF_DATA.transactions.forEach(tx => {
    let acquired = 0;
    let disposed = 0;
    tx.transactions.forEach(t => {
      if (t.type === 'Acquired') acquired += t.amount;
      else if (t.type === 'Disposed' || t.type === 'Divestment') disposed += t.amount;
    });

    let type = 'Acquired';
    let amount = 0;
    if (acquired > disposed) {
      type = 'Acquired';
      amount = acquired - disposed;
    } else if (disposed > acquired) {
      type = tx.transactions.some(t => t.type === 'Divestment') ? 'Divestment' : 'Disposed';
      amount = disposed - acquired;
    } else {
      type = tx.transactions[0]?.type || 'Acquired';
      amount = 0;
    }

    list.push({
      date: tx.date,
      stock: tx.stock,
      company: tx.company,
      url: tx.url,
      type: type,
      amount: amount,
      percent: tx.percent,
      total: tx.total,
      rawTransactions: tx.transactions,
      isNet: tx.transactions.length > 1
    });
  });
  // Sort by date descending, with ann_id descending as a secondary key for matching Bursa Malaysia order
  list.sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    const idA = parseInt(a.url.match(/ann_id=(\d+)/)?.[1] || 0, 10);
    const idB = parseInt(b.url.match(/ann_id=(\d+)/)?.[1] || 0, 10);
    return idB - idA;
  });
  return list;
}

const allFlatTx = flattenTransactions();

function filterTransactions() {
  const typeFilter = document.getElementById('tx-filter-type').value;
  const search = document.getElementById('tx-search').value.toLowerCase().trim();
  
  const txSearchClear = document.getElementById('tx-search-clear');
  if (txSearchClear) {
    txSearchClear.style.display = search ? 'flex' : 'none';
  }

  const dateStart = document.getElementById('tx-date-start').value;
  const dateEnd = document.getElementById('tx-date-end').value;
  const amountMin = document.getElementById('tx-amount-min').value;
  const amountMax = document.getElementById('tx-amount-max').value;
  const pctMin = document.getElementById('tx-percent-min').value;
  const pctMax = document.getElementById('tx-percent-max').value;

  // Highlight active filters
  const toggleHeader = (id, isActive) => {
    const popup = document.getElementById(id);
    if (popup) {
      const th = popup.closest('th');
      if (th) {
        if (isActive) th.classList.add('filter-active');
        else th.classList.remove('filter-active');
      }
    }
  };
  
  toggleHeader('date-popup', dateStart || dateEnd);
  toggleHeader('type-popup', typeFilter !== 'all');
  toggleHeader('amount-popup', amountMin !== '' || amountMax !== '');
  toggleHeader('pct-popup', pctMin !== '' || pctMax !== '');

  // Sync min/max bounds for the date pickers
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  document.getElementById('tx-date-end').min = dateStart;
  document.getElementById('tx-date-start').max = dateEnd || todayStr;
  document.getElementById('tx-date-end').max = todayStr;

  let startT = -Infinity;
  if (dateStart) {
    const [y, m, d] = dateStart.split('-');
    startT = new Date(y, m - 1, d).getTime();
  }
  
  let endT = Infinity;
  if (dateEnd) {
    const [y, m, d] = dateEnd.split('-');
    endT = new Date(y, m - 1, d).getTime() + 86400000; // +1 day for inclusive end
  }

  filteredTx = allFlatTx.filter(tx => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (search && !tx.company.toLowerCase().includes(search) && !tx.stock.toLowerCase().includes(search)) return false;
    
    // tx.date is like "07 May 2026", new Date() parses it in local time midnight
    const tTime = new Date(tx.date).getTime();
    if (tTime < startT || tTime >= endT) return false;

    if (amountMin !== '' && tx.amount < parseFloat(amountMin)) return false;
    if (amountMax !== '' && tx.amount > parseFloat(amountMax)) return false;

    if (pctMin !== '' && tx.percent < parseFloat(pctMin)) return false;
    if (pctMax !== '' && tx.percent > parseFloat(pctMax)) return false;

    return true;
  });

  txPage = 1;
  renderTransactionsTable();
}

function renderTransactionsTable() {
  const tbody = document.getElementById('tx-tbody');

  if (filteredTx.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="align-center" style="text-align: center; padding: 2rem; color: var(--text-muted);">No transactions found matching the filters</td></tr>`;
    document.getElementById('tx-count').textContent = '0';
    renderPagination();
    return;
  }

  const start = (txPage - 1) * TX_PER_PAGE;
  const pageData = filteredTx.slice(start, start + TX_PER_PAGE);

  document.getElementById('tx-count').textContent = filteredTx.length.toLocaleString();

  tbody.innerHTML = pageData.map((tx, i) => {
    const logoUrl = getLogoUrl(tx.company, tx.stock);
    let domain = '';
    if (EPF_DATA.companyDomains && EPF_DATA.companyDomains[tx.stock]) {
      domain = EPF_DATA.companyDomains[tx.stock];
    } else {
      const match = logoUrl ? logoUrl.match(/logo\.clearbit\.com\/(.+)$/) : null;
      if (match) domain = match[1];
    }

    return `<tr>
      <td>${start + i + 1}</td>
      <td>
        ${tx.date}
      </td>
      <td>
        <a href="${getKlseLink(tx.stock, tx.company)}" target="_blank" class="stock-symbol-link" title="View ${tx.stock} on KLSE Screener">
          <div class="stock-symbol">
            ${logoUrl ? `
              <img src="${logoUrl}" 
                   class="stock-icon-img" 
                   onerror="if (this.src.indexOf('clearbit') !== -1 && '${domain}') { this.src = 'https://www.google.com/s2/favicons?sz=128&domain=${domain}'; } else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }" 
                   alt="${tx.stock}">
            ` : ''}
            <div class="stock-icon fallback-icon" style="background:${stockColor(tx.stock)}; ${logoUrl ? 'display:none;' : ''}">${tx.stock.slice(0, 2)}</div>
            <span class="stock-name">${tx.stock}</span>
          </div>
        </a>
      </td>
      <td>${tx.company}</td>
      <td>
        <span class="tx-type ${tx.type.toLowerCase()}" 
              onclick="openTxModal(${start + i})"
              style="cursor:pointer; display:inline-flex; align-items:center; gap:0.25rem; transition:transform var(--transition);"
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'"
              title="Click to view all transactions">
          ${tx.type}${tx.isNet ? ' (Net)' : ''}
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.75;"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </td>
      <td class="align-right">${tx.amount.toLocaleString()}</td>
      <td class="align-right">${tx.percent}%</td>
      <td class="align-right">${tx.total.toLocaleString()}</td>
    </tr>`;
  }).join('');

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredTx.length / TX_PER_PAGE);
  const pag = document.getElementById('tx-pagination');

  if (totalPages <= 1) {
    pag.innerHTML = '';
    return;
  }

  let html = `<button class="page-btn" ${txPage === 1 ? 'disabled' : ''} onclick="goToPage(${txPage - 1})">‹</button>`;

  // Show pages around current
  const range = 2;
  const start = Math.max(1, txPage - range);
  const end = Math.min(totalPages, txPage + range);

  if (start > 1) {
    html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
    if (start > 2) html += `<span style="color:var(--text-muted);padding:0 0.3rem;">…</span>`;
  }

  for (let p = start; p <= end; p++) {
    html += `<button class="page-btn ${p === txPage ? 'active' : ''}" onclick="goToPage(${p})">${p}</button>`;
  }

  if (end < totalPages) {
    if (end < totalPages - 1) html += `<span style="color:var(--text-muted);padding:0 0.3rem;">…</span>`;
    html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  html += `<button class="page-btn" ${txPage === totalPages ? 'disabled' : ''} onclick="goToPage(${txPage + 1})">›</button>`;

  pag.innerHTML = html;
}

window.goToPage = function (page) {
  txPage = page;
  renderTransactionsTable();
  document.getElementById('tx-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ============================================
// Utility
// ============================================

function formatCompact(val) {
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + 'K';
  return sign + val.toLocaleString();
}

// ============================================
// Tooltip System
// ============================================

const tooltip = document.getElementById('chart-tooltip');

function showTooltip(e, html) {
  tooltip.innerHTML = html;
  tooltip.classList.add('visible');

  const tt = tooltip.getBoundingClientRect();
  let x = e.clientX + 14;
  let y = e.clientY - 14;

  // Keep within viewport
  if (x + tt.width > window.innerWidth - 8) x = e.clientX - tt.width - 14;
  if (y + tt.height > window.innerHeight - 8) y = e.clientY - tt.height - 14;
  if (y < 8) y = 8;

  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

function hideTooltip() {
  tooltip.classList.remove('visible');
}

// Store chart metadata for hover detection
let lineChartMeta = null;
let barChartMeta = null;
let pieChartMeta = null;
let isHoverRedraw = false;

// --- Line Chart Tooltip ---
function setupLineChartHover() {
  const canvas = document.getElementById('portfolio-canvas');
  let savedImage = null;

  function saveCanvas() {
    const ctx = canvas.getContext('2d');
    savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function restoreCanvas() {
    if (!savedImage) return;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(savedImage, 0, 0);
  }

  // Register save function globally so drawLineChart can call it
  window._lineSaveCanvas = saveCanvas;

  canvas.addEventListener('mousemove', (e) => {
    if (!lineChartMeta || lineChartMeta.data.length < 2) return;
    const { data, pad, plotW, plotH, minV, range } = lineChartMeta;

    const canvasRect = canvas.getBoundingClientRect();
    const mx = e.clientX - canvasRect.left;

    const relX = mx - pad.left;
    if (relX < 0 || relX > plotW) { restoreCanvas(); hideTooltip(); return; }

    const idx = Math.round((relX / plotW) * (data.length - 1));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];

    // Restore clean chart then draw overlay
    restoreCanvas();

    const ctx = canvas.getContext('2d');
    ctx.save();

    const px = pad.left + (plotW * clampedIdx / (data.length - 1));
    const py = pad.top + plotH - ((d.value - minV) / range * plotH);

    // Vertical crosshair
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(px, pad.top);
    ctx.lineTo(px, pad.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight dot
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
    ctx.fill();
    ctx.restore();

    const valClass = d.value >= 0 ? 'tt-positive' : 'tt-negative';
    showTooltip(e, `
      <div class="tt-label">${d.label}</div>
      <div class="tt-value ${valClass}">${formatCompact(d.value)} shares</div>
      <div style="color:var(--text-muted);font-size:0.7rem;margin-top:2px">${d.count} announcements</div>
    `);
  });

  canvas.addEventListener('mouseleave', () => {
    restoreCanvas();
    hideTooltip();
  });

  // Initial save after first draw
  requestAnimationFrame(() => saveCanvas());
}

// --- Pie Chart Tooltip ---
function setupPieChartHover() {
  const canvas = document.getElementById('pie-canvas');

  canvas.addEventListener('mousemove', (e) => {
    if (!pieChartMeta) return;
    const { data, cx, cy, radius, innerRadius, total } = pieChartMeta;

    const canvasRect = canvas.getBoundingClientRect();
    // Account for CSS vs canvas coordinate scaling
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    const mx = (e.clientX - canvasRect.left) * scaleX / (window.devicePixelRatio || 1);
    const my = (e.clientY - canvasRect.top) * scaleY / (window.devicePixelRatio || 1);

    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < innerRadius || dist > radius) {
      hideTooltip();
      canvas.style.cursor = 'default';
      return;
    }

    let angle = Math.atan2(dy, dx);
    angle = angle + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;

    let cumAngle = 0;
    let hoveredSlice = null;
    for (const d of data) {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      if (angle >= cumAngle && angle < cumAngle + sliceAngle) {
        hoveredSlice = d;
        break;
      }
      cumAngle += sliceAngle;
    }

    if (hoveredSlice) {
      canvas.style.cursor = 'pointer';
      showTooltip(e, `
        <div class="tt-row">
          <span class="tt-dot" style="background:${hoveredSlice.color}"></span>
          <span style="font-weight:600">${hoveredSlice.label}</span>
        </div>
        <div class="tt-value" style="margin-top:2px">${hoveredSlice.value.toLocaleString()} shares</div>
        <div style="color:var(--text-muted);font-size:0.7rem">${hoveredSlice.pct}% of portfolio</div>
      `);
    } else {
      hideTooltip();
      canvas.style.cursor = 'default';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hideTooltip();
    canvas.style.cursor = 'default';
  });
}

// Helper to parse date strings like "21 May 2026" or "25 March 2026" into ISO "YYYY-MM-DD"
function parseDateStringToYYYYMMDD(dateStr) {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return null;
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// --- Bar Chart Tooltip ---
function setupBarChartHover() {
  const canvas = document.getElementById('returns-canvas');
  let savedImage = null;

  function saveCanvas() {
    const ctx = canvas.getContext('2d');
    savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function restoreCanvas() {
    if (!savedImage) return;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(savedImage, 0, 0);
  }

  canvas.addEventListener('mousemove', (e) => {
    if (!barChartMeta || barChartMeta.data.length === 0) return;
    const { data, pad, plotW, plotH, minV, range, barW } = barChartMeta;

    const canvasRect = canvas.getBoundingClientRect();
    const mx = e.clientX - canvasRect.left;

    const relX = mx - pad.left;
    if (relX < 0 || relX > plotW) {
      restoreCanvas();
      hideTooltip();
      canvas.style.cursor = 'default';
      return;
    }

    const idx = Math.floor(relX / (plotW / data.length));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];

    canvas.style.cursor = 'pointer';

    const valClass = d.value >= 0 ? 'tt-positive' : 'tt-negative';
    const valSign = d.value >= 0 ? '+' : '';
    showTooltip(e, `
      <div class="tt-label">${d.label}</div>
      <div class="tt-value ${valClass}">${valSign}${formatCompact(d.value)} shares</div>
      <div style="color:var(--text-muted);font-size:0.7rem;margin-top:2px">${d.count} announcements</div>
    `);

    // Highlight the hovered bar
    restoreCanvas();
    const ctx = canvas.getContext('2d');
    ctx.save();
    const zeroY = pad.top + plotH - ((0 - minV) / range * plotH);
    const barX = pad.left + (plotW * clampedIdx / data.length) + 1;
    const barH = (Math.abs(d.value) / range) * plotH;
    const barY = d.value >= 0 ? zeroY - barH : zeroY;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    const r = Math.min(2, barW / 2);
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, [r, r, 0, 0]);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  });

  canvas.addEventListener('mouseleave', () => {
    restoreCanvas();
    hideTooltip();
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', (e) => {
    if (!barChartMeta || barChartMeta.data.length === 0) return;
    const { data, pad, plotW } = barChartMeta;

    const canvasRect = canvas.getBoundingClientRect();
    const mx = e.clientX - canvasRect.left;

    const relX = mx - pad.left;
    if (relX < 0 || relX > plotW) return;

    const idx = Math.floor(relX / (plotW / data.length));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];

    const yyyymmdd = parseDateStringToYYYYMMDD(d.label);
    if (yyyymmdd) {
      document.getElementById('tx-date-start').value = yyyymmdd;
      document.getElementById('tx-date-end').value = yyyymmdd;
      filterTransactions();
      
      // Programmatically switch to Transactions tab
      const tabBtn = document.getElementById('tab-transactions');
      if (tabBtn) tabBtn.click();
    }
  });

  // We need to re-save canvas bitmap whenever bar chart redraws
  // This is handled by calling saveCanvas after drawBarChart
  window._barSaveCanvas = saveCanvas;
}

// ============================================
// Event Bindings & Initial Render
// ============================================

let lineChartDrawn = false;
let pieChartDrawn = false;
let barChartDrawn = false;

// Time range toggle for portfolio chart
let currentRange = '1M';
document.getElementById('time-toggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.chart-toggle');
  if (!btn) return;
  document.querySelectorAll('#time-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentRange = btn.dataset.range;
  const series = getPortfolioTimeSeries(currentRange);
  drawLineChart('portfolio-canvas', series, '#8b5cf6', true);
  const lastVal = series.length > 0 ? series[series.length - 1].value : 0;
  document.getElementById('portfolio-value-display').textContent = formatCompact(lastVal) + ' shares (net)';
});

// Pie chart toggle
let currentPieMode = 'company';
document.getElementById('pie-toggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.chart-toggle');
  if (!btn) return;
  document.querySelectorAll('#pie-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentPieMode = btn.dataset.mode;
  const pieData = getPieData(currentPieMode);
  drawPieChart('pie-canvas', pieData, currentPieMode, true);
  renderPieLegend(pieData);
});

// Returns toggle
let currentReturnsView = 'net';
document.getElementById('returns-toggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.chart-toggle');
  if (!btn) return;
  document.querySelectorAll('#returns-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentReturnsView = btn.dataset.view;
  drawBarChart('returns-canvas', getReturnsData(currentReturnsView));
});

// Transaction filters
document.getElementById('tx-filter-type').addEventListener('change', filterTransactions);
document.getElementById('tx-search').addEventListener('input', filterTransactions);

const txSearch = document.getElementById('tx-search');
const txSearchClear = document.getElementById('tx-search-clear');
if (txSearch && txSearchClear) {
  txSearchClear.addEventListener('click', () => {
    txSearch.value = '';
    txSearchClear.style.display = 'none';
    filterTransactions();
  });
}

document.getElementById('tx-date-start').addEventListener('change', filterTransactions);
document.getElementById('tx-date-end').addEventListener('change', filterTransactions);
document.getElementById('tx-amount-min').addEventListener('input', filterTransactions);
document.getElementById('tx-amount-max').addEventListener('input', filterTransactions);
document.getElementById('tx-percent-min').addEventListener('input', filterTransactions);
document.getElementById('tx-percent-max').addEventListener('input', filterTransactions);

// Initial render
function init() {
  // Calculate and populate Bento Metrics
  const totalSecurities = EPF_DATA.holdings.reduce((s, h) => s + h.total_securities, 0);
  const totalMarketValue = EPF_DATA.holdings.reduce((s, h) => s + (h.market_value || 0), 0);
  document.getElementById('dashboard-total-value').textContent = 'RM ' + totalMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  // Top Sector Allocation
  const sectorMap = {};
  EPF_DATA.holdings.forEach(h => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + (h.market_value || 0);
  });
  const sortedSectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
  if (sortedSectors.length > 0) {
    const topSector = sortedSectors[0];
    const pct = totalMarketValue > 0 ? ((topSector[1] / totalMarketValue) * 100).toFixed(1) : '0.0';
    document.getElementById('bento-sector-name').textContent = topSector[0];
    document.getElementById('bento-sector-val').textContent = 'RM ' + formatCompact(topSector[1]);
    document.getElementById('bento-sector-pct').textContent = pct + '%';
    document.getElementById('bento-sector-progress').style.width = pct + '%';

    // RENDER TOP SECTOR OVERLAPPING LOGOS
    const sectorHoldings = EPF_DATA.holdings.filter(h => h.sector === topSector[0]);
    sectorHoldings.sort((a, b) => (b.market_value || 0) - (a.market_value || 0));
    const top3 = sectorHoldings.slice(0, 3);
    const sectorLogosEl = document.getElementById('bento-sector-logos');
    if (sectorLogosEl) {
      sectorLogosEl.innerHTML = top3.map((h, index) => {
        const logoUrl = getLogoUrl(h.company_name, h.stock_name);
        const zIndex = 30 - (index * 10);
        const domain = logoUrl ? logoUrl.match(/logo\.clearbit\.com\/(.+)$/)?.[1] || '' : '';
        return `
          <div class="relative w-8 h-8 rounded-full border border-[#25253a] bg-[#1a1a26] overflow-hidden flex items-center justify-center shadow-md shrink-0" style="z-index: ${zIndex}">
            ${logoUrl ? `
              <img src="${logoUrl}" 
                   class="w-full h-full object-cover" 
                   onerror="if (this.src.indexOf('clearbit') !== -1 && '${domain}') { this.src = 'https://www.google.com/s2/favicons?sz=128&domain=${domain}'; } else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }" 
                   alt="${h.stock_name}">
            ` : ''}
            <div class="w-full h-full text-[9px] font-bold text-white flex items-center justify-center" style="background:${stockColor(h.stock_name)}; ${logoUrl ? 'display:none;' : ''}">${h.stock_name.slice(0, 2)}</div>
          </div>
        `;
      }).join('');
    }
  }
  
  // Top Holding
  const sortedHoldings = [...EPF_DATA.holdings].sort((a, b) => (b.market_value || 0) - (a.market_value || 0));
  if (sortedHoldings.length > 0) {
    const topHolding = sortedHoldings[0];
    document.getElementById('bento-holding-symbol').textContent = topHolding.stock_name;
    document.getElementById('bento-holding-name').textContent = topHolding.company_name;
    document.getElementById('bento-holding-val').textContent = 'RM ' + (topHolding.market_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('bento-holding-pct').innerHTML = `<span class="material-symbols-outlined text-[12px] mr-0.5">arrow_upward</span>${topHolding.direct_percent.toFixed(3)}% in company`;

    // RENDER TOP HOLDING LOGO DYNAMICALLY
    const holdingLogoContainer = document.getElementById('bento-holding-logo-container');
    if (holdingLogoContainer) {
      const logoUrl = getLogoUrl(topHolding.company_name, topHolding.stock_name);
      const domain = logoUrl ? logoUrl.match(/logo\.clearbit\.com\/(.+)$/)?.[1] || '' : '';
      holdingLogoContainer.innerHTML = `
        ${logoUrl ? `
          <img src="${logoUrl}" 
               class="w-full h-full object-cover" 
               onerror="if (this.src.indexOf('clearbit') !== -1 && '${domain}') { this.src = 'https://www.google.com/s2/favicons?sz=128&domain=${domain}'; } else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }" 
               alt="${topHolding.stock_name}">
        ` : ''}
        <div class="w-full h-full text-[10px] font-bold text-white flex items-center justify-center" style="background:${stockColor(topHolding.stock_name)}; ${logoUrl ? 'display:none;' : ''}">${topHolding.stock_name.slice(0, 2)}</div>
      `;
    }
  }
  
  // Active Positions
  document.getElementById('bento-active-count').textContent = EPF_DATA.holdings.length + ' positions';
  document.getElementById('bento-unique-count').textContent = `${EPF_DATA.uniqueStocks} unique stocks across ${sortedSectors.length} sectors`;

  // Recent Announcements Feed
  const latestTx = allFlatTx.slice(0, 8);
  const activityFeed = document.getElementById('bento-activity-feed');
  if (activityFeed) {
    activityFeed.innerHTML = latestTx.map(tx => {
      const logoUrl = getLogoUrl(tx.company, tx.stock);
      const domain = logoUrl ? logoUrl.match(/logo\.clearbit\.com\/(.+)$/)?.[1] || '' : '';
      const isBuy = tx.type === 'Acquired';
      const actionIcon = isBuy ? 'shopping_cart' : tx.type === 'Dividend' ? 'payments' : 'sell';
      const iconColor = isBuy ? 'text-primary' : tx.type === 'Dividend' ? 'text-tertiary' : 'text-error';
      return `
        <div class="flex gap-3 items-start p-2 rounded-lg hover:bg-surface-container-low transition-colors duration-150 cursor-pointer" onclick="openTxModal(${allFlatTx.indexOf(tx)})">
          <div class="h-8 w-8 rounded-full border border-[#25253a] bg-[#1a1a26] overflow-hidden flex items-center justify-center mt-0.5 shrink-0 shadow-sm relative">
            ${logoUrl ? `
              <img src="${logoUrl}" 
                   class="w-full h-full object-cover" 
                   onerror="if (this.src.indexOf('clearbit') !== -1 && '${domain}') { this.src = 'https://www.google.com/s2/favicons?sz=128&domain=${domain}'; } else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }" 
                   alt="${tx.stock}">
            ` : ''}
            <div class="w-full h-full text-[10px] font-bold text-white flex items-center justify-center" style="background:${stockColor(tx.stock)}; ${logoUrl ? 'display:none;' : ''}">${tx.stock.slice(0, 2)}</div>
            <!-- Small indicator badge for action type on bottom right -->
            <span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#16161f] border border-[#25253a] flex items-center justify-center text-[8px] ${iconColor}">
              <span class="material-symbols-outlined text-[9px]">${actionIcon}</span>
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline gap-2">
              <span class="font-semibold text-xs text-on-surface truncate">${tx.type} ${tx.stock}</span>
              <span class="text-[9px] text-outline shrink-0">${tx.date}</span>
            </div>
            <div class="text-[11px] text-on-surface-variant truncate mt-0.5">
              ${tx.company} — ${tx.amount.toLocaleString()} units
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Hook global search
  const globalSearch = document.getElementById('global-search-input');
  if (globalSearch) {
    globalSearch.addEventListener('input', () => {
      const val = globalSearch.value;
      
      // Copy to holdings search
      const hs = document.getElementById('holdings-search');
      if (hs) {
        hs.value = val;
        const hsc = document.getElementById('holdings-search-clear');
        if (hsc) hsc.style.display = val ? 'flex' : 'none';
        renderHoldingsTable();
      }
      
      // Copy to transactions search
      const ts = document.getElementById('tx-search');
      if (ts) {
        ts.value = val;
        const tsc = document.getElementById('tx-search-clear');
        if (tsc) tsc.style.display = val ? 'flex' : 'none';
        filterTransactions();
      }
    });
  }

  // Set up Bento card clicks (tab jumps & smart filters)
  const bentoActiveCard = document.getElementById('bento-active-card');
  if (bentoActiveCard) {
    bentoActiveCard.addEventListener('click', () => {
      const tabHoldings = document.getElementById('tab-holdings');
      if (tabHoldings) tabHoldings.click();
    });
  }

  const bentoSectorCard = document.getElementById('bento-sector-card');
  if (bentoSectorCard) {
    bentoSectorCard.addEventListener('click', () => {
      const topSectorName = document.getElementById('bento-sector-name').textContent;
      const sectorFilter = document.getElementById('holdings-sector-filter');
      if (sectorFilter && topSectorName !== 'Loading...') {
        sectorFilter.value = topSectorName;
        renderHoldingsTable();
      }
      const tabHoldings = document.getElementById('tab-holdings');
      if (tabHoldings) tabHoldings.click();
    });
  }

  const bentoHoldingCard = document.getElementById('bento-holding-card');
  if (bentoHoldingCard) {
    bentoHoldingCard.addEventListener('click', () => {
      const topHoldingSymbol = document.getElementById('bento-holding-symbol').textContent;
      const searchInput = document.getElementById('holdings-search');
      if (searchInput && topHoldingSymbol !== 'Loading...') {
        searchInput.value = topHoldingSymbol;
        const searchClear = document.getElementById('holdings-search-clear');
        if (searchClear) searchClear.style.display = 'flex';
        renderHoldingsTable();
      }
      const tabHoldings = document.getElementById('tab-holdings');
      if (tabHoldings) tabHoldings.click();
    });
  }

  // Holdings
  renderHoldingsTable();

  // Portfolio chart
  const series = getPortfolioTimeSeries(currentRange);
  drawLineChart('portfolio-canvas', series);
  lineChartDrawn = true;
  const lastVal = series.length > 0 ? series[series.length - 1].value : 0;
  document.getElementById('portfolio-value-display').textContent = formatCompact(lastVal) + ' shares (net)';

  // Pie chart
  const pieData = getPieData(currentPieMode);
  drawPieChart('pie-canvas', pieData, currentPieMode);
  pieChartDrawn = true;
  renderPieLegend(pieData);

  // Returns
  drawBarChart('returns-canvas', getReturnsData(currentReturnsView));
  renderReturnsSummary();

  // Transactions
  filteredTx = allFlatTx;
  if (allFlatTx && allFlatTx.length > 0) {
    const latestDate = allFlatTx[0].date;
    const lastUpdateEl = document.getElementById('tx-last-update');
    if (lastUpdateEl) {
      lastUpdateEl.textContent = `Last update: ${latestDate}`;
    }
  }
  
  // Set date limits up to today (2026-05-21) on initial load
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  
  document.getElementById('tx-date-start').max = todayStr;
  document.getElementById('tx-date-end').max = todayStr;

  renderTransactionsTable();

  // Setup hover tooltips
  setupLineChartHover();
  setupPieChartHover();
  setupBarChartHover();
}

// ============================================
// Filter Popups Logic
// ============================================
window.togglePopup = function(event, element, popupId) {
  event.stopPropagation();
  const popup = document.getElementById(popupId);
  const isShowing = popup.classList.contains('show');
  
  // Close all other popups
  document.querySelectorAll('.filter-popup.show').forEach(p => p.classList.remove('show'));
  
  if (!isShowing) {
    popup.classList.add('show');
    // Set active state on the icon for styling
    document.querySelectorAll('.col-filter-icon.active').forEach(icon => icon.classList.remove('active'));
    element.classList.add('active');
  } else {
    element.classList.remove('active');
  }
};

window.clearFilter = function(type) {
  if (type === 'date') {
    document.getElementById('tx-date-start').value = '';
    document.getElementById('tx-date-end').value = '';
  } else if (type === 'type') {
    document.getElementById('tx-filter-type').value = 'all';
  } else if (type === 'amount') {
    document.getElementById('tx-amount-min').value = '';
    document.getElementById('tx-amount-max').value = '';
  } else if (type === 'pct') {
    document.getElementById('tx-percent-min').value = '';
    document.getElementById('tx-percent-max').value = '';
  }
  
  // Close all popups and remove active state from icons
  document.querySelectorAll('.filter-popup.show').forEach(p => p.classList.remove('show'));
  document.querySelectorAll('.col-filter-icon.active').forEach(icon => icon.classList.remove('active'));
  
  filterTransactions();
};

document.addEventListener('click', (event) => {
  // If click is inside a popup, do nothing
  if (event.target.closest('.filter-popup')) return;
  
  // Otherwise close all popups and remove active state from icons
  document.querySelectorAll('.filter-popup.show').forEach(p => p.classList.remove('show'));
  document.querySelectorAll('.col-filter-icon.active').forEach(icon => icon.classList.remove('active'));
});

// Handle resize
let resizeTimeout;
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === lastWidth) return; // Prevent address-bar scroll toggles from restarting animation!
  lastWidth = window.innerWidth;
  
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    drawLineChart('portfolio-canvas', getPortfolioTimeSeries(currentRange), '#8b5cf6', false);
    const pieData = getPieData(currentPieMode);
    drawPieChart('pie-canvas', pieData, currentPieMode, false);
    drawBarChart('returns-canvas', getReturnsData(currentReturnsView));
  }, 200);
});

// Fetch logo.json dynamically to keep mapped logos up to date
fetch('logo.json')
  .then(res => {
    if (res.ok) return res.json();
    throw new Error('Failed to load logo.json');
  })
  .then(list => {
    list.forEach(item => {
      const key = item.company.toUpperCase().trim();
      tvLogoMap[key] = item.logo_url;
    });
    // Re-render once loaded to show new logos
    renderHoldingsTable();
    renderTransactionsTable();
  })
  .catch(err => {
    console.warn("Using fallback TradingView logos:", err.message);
  });

// ============================================
// Transaction Details Modal
// ============================================
window.openTxModal = function(index) {
  const tx = filteredTx[index];
  if (!tx) return;

  document.getElementById('modal-title').textContent = tx.company;
  
  const netBadge = tx.isNet ? `<span class="tx-type ${tx.type.toLowerCase()}" style="margin-left: 0.5rem; vertical-align: middle;">Net ${tx.type}</span>` : `<span class="tx-type ${tx.type.toLowerCase()}" style="margin-left: 0.5rem; vertical-align: middle;">${tx.type}</span>`;
  
  let txRows = '';
  tx.rawTransactions.forEach(t => {
    txRows += `
      <tr>
        <td><span class="tx-type ${t.type.toLowerCase()}">${t.type}</span></td>
        <td class="align-right">${t.amount.toLocaleString()}</td>
      </tr>
    `;
  });

  const bodyHtml = `
    <div class="modal-meta-grid">
      <div class="modal-meta-item">
        <span class="modal-meta-label">Stock Symbol</span>
        <span class="modal-meta-value">${tx.stock}</span>
      </div>
      <div class="modal-meta-item">
        <span class="modal-meta-label">Date Announced</span>
        <span class="modal-meta-value">${tx.date}</span>
      </div>
      <div class="modal-meta-item">
        <span class="modal-meta-label">Direct Shareholding %</span>
        <span class="modal-meta-value">${tx.percent}%</span>
      </div>
      <div class="modal-meta-item">
        <span class="modal-meta-label">Total Shares After Change</span>
        <span class="modal-meta-value">${tx.total.toLocaleString()}</span>
      </div>
    </div>
    
    <div>
      <h4 class="modal-tx-list-title">Filing Transactions ${netBadge}</h4>
      <table class="modal-tx-table">
        <thead>
          <tr>
            <th>Type</th>
            <th class="align-right">No. of Securities</th>
          </tr>
        </thead>
        <tbody>
          ${txRows}
        </tbody>
      </table>
    </div>

    ${tx.url ? `
      <a href="${tx.url}" target="_blank" class="modal-link-btn">
        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        View Official Announcement
      </a>
    ` : ''}
  `;

  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('tx-modal').classList.add('show');
};

window.closeTxModal = function() {
  document.getElementById('tx-modal').classList.remove('show');
};

// Close modal when clicking overlay background
document.getElementById('tx-modal').addEventListener('click', (e) => {
  if (e.target.id === 'tx-modal') {
    closeTxModal();
  }
});

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTxModal();
  }
});

init();
