/**
 * EPF Tracker — Universal High-Performance Bundle
 * Works seamlessly via both direct double-click (file://) and web server (http://)
 * Modular Architecture with Set A (Desktop) and Set B (Mobile) full physical separation
 */

(function () {
  'use strict';

  // ----------------------------------------------------
  // 1. CORE UTILITIES & ICONSTACK SVGS
  // ----------------------------------------------------
  const ICONSTACK = {
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

  function formatCompact(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (abs >= 1e12) return sign + (abs / 1e12).toFixed(2) + 'T';
    if (abs >= 1e9) return sign + (abs / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + 'K';
    return sign + abs.toLocaleString('en-US');
  }

  function formatCurrency(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return 'RM 0.00';
    return 'RM ' + Number(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function stockColor(stock) {
    let hash = 0;
    for (let i = 0; i < stock.length; i++) {
      hash = stock.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hues = [345, 10, 200, 220, 160, 280, 45, 310];
    const h = hues[Math.abs(hash) % hues.length];
    return `hsl(${h}, 70%, 45%)`;
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return str == null ? '' : String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getKlseLink(stock, company = '') {
    let query = (stock || '').trim();
    if (query.length <= 2 && company) {
      query = company.split(' ')[0] || query;
    }
    return `https://www.klsescreener.com/v2/stocks/view/${encodeURIComponent(query)}`;
  }

  // ----------------------------------------------------
  // 2. EMBEDDED BURSA LOGO REGISTRY
  // ----------------------------------------------------
  const BURSA_LOGOS = [
    { "company": "MBSB", "logo_url": "https://s3-symbol-logo.tradingview.com/malaysia-building-society-bhd--big.svg" },
    { "company": "PBBANK", "logo_url": "https://s3-symbol-logo.tradingview.com/public-bank--big.svg" },
    { "company": "CIMB", "logo_url": "https://s3-symbol-logo.tradingview.com/cimb-group-holdings-berhad--big.svg" },
    { "company": "AXIATA", "logo_url": "https://s3-symbol-logo.tradingview.com/axiata-group-berhad--big.svg" },
    { "company": "RHB", "logo_url": "https://s3-symbol-logo.tradingview.com/rhb-bank-berhad--big.svg" },
    { "company": "RHBBANK", "logo_url": "https://s3-symbol-logo.tradingview.com/rhb-bank-berhad--big.svg" },
    { "company": "MAYBANK", "logo_url": "https://s3-symbol-logo.tradingview.com/malayan-banking--big.svg" },
    { "company": "TENAGA", "logo_url": "https://s3-symbol-logo.tradingview.com/tenaga-nasional--big.svg" },
    { "company": "YTL", "logo_url": "https://s3-symbol-logo.tradingview.com/ytl-corporation-bhd--big.svg" },
    { "company": "CBD", "logo_url": "https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg" },
    { "company": "CDB", "logo_url": "https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg" },
    { "company": "CELCOMDIGI", "logo_url": "https://s3-symbol-logo.tradingview.com/digi-com-bhd--big.svg" },
    { "company": "GAMUDA", "logo_url": "https://s3-symbol-logo.tradingview.com/gamuda-bhd--big.svg" },
    { "company": "DIALOG GROUP", "logo_url": "https://s3-symbol-logo.tradingview.com/dialog-group--big.svg" },
    { "company": "IHH", "logo_url": "https://s3-symbol-logo.tradingview.com/ihh--big.svg" },
    { "company": "SIMEPROP", "logo_url": "https://s3-symbol-logo.tradingview.com/sime-darby-property-berhad--big.svg" },
    { "company": "SIME", "logo_url": "https://s3-symbol-logo.tradingview.com/sime-darby-bhd--big.svg" },
    { "company": "SDG", "logo_url": "https://s3-symbol-logo.tradingview.com/sime-darby-plantation-berhad--big.svg" },
    { "company": "MAXIS", "logo_url": "https://s3-symbol-logo.tradingview.com/maxis-berhad--big.svg" },
    { "company": "MRDIY", "logo_url": "https://s3-symbol-logo.tradingview.com/mr-d-i-y-group-m-berhad--big.svg" },
    { "company": "IOICORP", "logo_url": "https://s3-symbol-logo.tradingview.com/ioi-corporation-bhd--big.svg" },
    { "company": "YTLPOWER", "logo_url": "https://s3-symbol-logo.tradingview.com/ytl-power-international-bhd--big.svg" },
    { "company": "PCHEM", "logo_url": "https://s3-symbol-logo.tradingview.com/petronas-chemicals-group-bhd--big.svg" },
    { "company": "MALAKOF", "logo_url": "https://s3-symbol-logo.tradingview.com/malakoff-corporation-berhad--big.svg" },
    { "company": "TM", "logo_url": "https://s3-symbol-logo.tradingview.com/telekom-malaysia-bhd--big.svg" },
    { "company": "KPJ", "logo_url": "https://s3-symbol-logo.tradingview.com/kpj-healthcare-bhd--big.svg" },
    { "company": "PMETAL", "logo_url": "https://s3-symbol-logo.tradingview.com/press-metal-aluminium--big.svg" },
    { "company": "SUNWAY", "logo_url": "https://s3-symbol-logo.tradingview.com/sunway-berhad--big.svg" },
    { "company": "IJM", "logo_url": "https://s3-symbol-logo.tradingview.com/ijm-corporation-bhd--big.svg" },
    { "company": "AHEALTH", "logo_url": "https://apexhealthcare.com.my/wp-content/uploads/2023/06/APEX_WEB_LOGO1.png" },
    { "company": "SPSETIA", "logo_url": "https://s3-symbol-logo.tradingview.com/sp-setia--big.svg" },
    { "company": "MISC", "logo_url": "https://s3-symbol-logo.tradingview.com/misc-bhd--big.svg" },
    { "company": "SUNMED", "logo_url": "https://s3-symbol-logo.tradingview.com/sunway-healthcare-berhad--big.svg" },
    { "company": "CLMT", "logo_url": "https://s3-symbol-logo.tradingview.com/capitamall-trust--big.svg" },
    { "company": "99SMART", "logo_url": "https://s3-symbol-logo.tradingview.com/99-speed-mart-retail-berhad--big.svg" },
    { "company": "INARI", "logo_url": "https://s3-symbol-logo.tradingview.com/inari-amertron-berhad--big.svg" },
    { "company": "AMBANK", "logo_url": "https://s3-symbol-logo.tradingview.com/ammb-holdings-bhd--big.svg" },
    { "company": "SUNREIT", "logo_url": "https://s3-symbol-logo.tradingview.com/sunway-real-estate-invt-trust--big.svg" },
    { "company": "PAVREIT", "logo_url": "https://s3-symbol-logo.tradingview.com/pavilion-real-estate-inv-trust--big.svg" },
    { "company": "CTOS", "logo_url": "https://s3-symbol-logo.tradingview.com/ctos-digital--big.svg" },
    { "company": "AXREIT", "logo_url": "https://s3-symbol-logo.tradingview.com/axis-reits--big.svg" },
    { "company": "IGBREIT", "logo_url": "https://s3-symbol-logo.tradingview.com/igb-real-estate-inv-trust--big.svg" },
    { "company": "UOADEV", "logo_url": "https://s3-symbol-logo.tradingview.com/uoa-development-berhad--big.svg" },
    { "company": "BIMB", "logo_url": "https://s3-symbol-logo.tradingview.com/bank-islam-malaysia-berhad--big.svg" },
    { "company": "IOIPG", "logo_url": "https://s3-symbol-logo.tradingview.com/ioi-properties-group-berhad--big.svg" },
    { "company": "FFB", "logo_url": "https://s3-symbol-logo.tradingview.com/farm-fresh-berhad--big.svg" },
    { "company": "FRONTKN", "logo_url": "https://s3-symbol-logo.tradingview.com/frontken--big.svg" },
    { "company": "TIMECOM", "logo_url": "https://s3-symbol-logo.tradingview.com/time-dotcom-bhd--big.svg" },
    { "company": "PETGAS", "logo_url": "https://s3-symbol-logo.tradingview.com/petronas-gas-bhd--big.svg" },
    { "company": "PPB", "logo_url": "https://s3-symbol-logo.tradingview.com/ppb-group-bhd--big.svg" },
    { "company": "JPG", "logo_url": "https://s3-symbol-logo.tradingview.com/johor-plantations-berhad--big.svg" },
    { "company": "WPRTS", "logo_url": "https://s3-symbol-logo.tradingview.com/westports-holdings-berhad--big.svg" },
    { "company": "KLK", "logo_url": "https://s3-symbol-logo.tradingview.com/kuala-lumpur-kepong-bhd--big.svg" },
    { "company": "KLCC", "logo_url": "https://s3-symbol-logo.tradingview.com/klcc-propandreits-stapled-sec--big.svg" },
    { "company": "HLBANK", "logo_url": "https://s3-symbol-logo.tradingview.com/hong-leong-bank-bhd--big.svg" },
    { "company": "SKPRES", "logo_url": "https://s3-symbol-logo.tradingview.com/skp-resources-bhd--big.svg" },
    { "company": "E&O", "logo_url": "https://s3-symbol-logo.tradingview.com/eastern-and-oriental-bhd--big.svg" },
    { "company": "ATECH", "logo_url": "https://s3-symbol-logo.tradingview.com/aurelius-technologies-berhad--big.svg" },
    { "company": "TAKAFUL", "logo_url": "https://s3-symbol-logo.tradingview.com/syarikat-takaful-malaysia-keluarga-berhad--big.svg" },
    { "company": "DRBHCOM", "logo_url": "https://s3-symbol-logo.tradingview.com/drb-hicom-bhd--big.svg" },
    { "company": "DAYANG", "logo_url": "https://s3-symbol-logo.tradingview.com/dayang-enterprise-bhd--big.svg" },
    { "company": "ABMB", "logo_url": "https://s3-symbol-logo.tradingview.com/alliance-bank-malaysia-berhad--big.svg" },
    { "company": "KOSSAN", "logo_url": "https://s3-symbol-logo.tradingview.com/kossan-rubber-industries--big.svg" },
    { "company": "GENP", "logo_url": "https://s3-symbol-logo.tradingview.com/genting-plantations-berhad--big.svg" },
    { "company": "PARADIGM", "logo_url": "https://s3-symbol-logo.tradingview.com/paradigm-real-estate-investment-trust--big.svg" },
    { "company": "PETDAG", "logo_url": "https://s3-symbol-logo.tradingview.com/petronas-dagangan-bhd--big.svg" },
    { "company": "BURSA", "logo_url": "https://s3-symbol-logo.tradingview.com/bursa-malaysia-bhd--big.svg" },
    { "company": "MFCB", "logo_url": "https://s3-symbol-logo.tradingview.com/mega-first-corporation-bhd--big.svg" },
    { "company": "PENTA", "logo_url": "https://s3-symbol-logo.tradingview.com/pentamaster--big.svg" },
    { "company": "AEON", "logo_url": "https://s3-symbol-logo.tradingview.com/aeon-co-m-bhd--big.svg" },
    { "company": "PADINI", "logo_url": "https://s3-symbol-logo.tradingview.com/padini-holdings-bhd--big.svg" },
    { "company": "SCGBHD", "logo_url": "https://s3-symbol-logo.tradingview.com/southern-cable-berhad--big.svg" },
    { "company": "PLINTAS", "logo_url": "https://s3-symbol-logo.tradingview.com/prolintas-infra-business-trust--big.svg" },
    { "company": "DPHARMA", "logo_url": "https://s3-symbol-logo.tradingview.com/duopharma-biotech-berhad--big.svg" },
    { "company": "HLFG", "logo_url": "https://s3-symbol-logo.tradingview.com/hong-leong-financial-group-bhd--big.svg" },
    { "company": "ECONBHD", "logo_url": "https://s3-symbol-logo.tradingview.com/econpile-bhd--big.svg" },
    { "company": "BAUTO", "logo_url": "https://s3-symbol-logo.tradingview.com/bermaz-auto-berhad--big.svg" },
    { "company": "SCOMNET", "logo_url": "https://s3-symbol-logo.tradingview.com/supercomnet-technologies--big.svg" },
    { "company": "ORKIM", "logo_url": "https://s3-symbol-logo.tradingview.com/orkim-bhd--big.svg" },
    { "company": "UWC", "logo_url": "https://s3-symbol-logo.tradingview.com/uwc--big.svg" },
    { "company": "D&O", "logo_url": "https://s3-symbol-logo.tradingview.com/d-and-o-green-technologies--big.svg" },
    { "company": "F&N", "logo_url": "https://s3-symbol-logo.tradingview.com/fraser-and-neave-holdings-bhd--big.svg" },
    { "company": "WASCO", "logo_url": "https://s3-symbol-logo.tradingview.com/wah-seong-bhd--big.svg" },
    { "company": "UTDPLT", "logo_url": "https://s3-symbol-logo.tradingview.com/united-plantations-bhd--big.svg" },
    { "company": "SAM", "logo_url": "https://s3-symbol-logo.tradingview.com/sam-engineering-and-equipment--big.svg" },
    { "company": "AME", "logo_url": "https://s3-symbol-logo.tradingview.com/ame-real-estate-investment-trust--big.svg" },
    { "company": "NESTLE", "logo_url": "https://s3-symbol-logo.tradingview.com/nestle--big.svg" },
    { "company": "MPI", "logo_url": "https://s3-symbol-logo.tradingview.com/malaysian-pacific-industries--big.svg" },
    { "company": "ALLIANZ", "logo_url": "https://s3-symbol-logo.tradingview.com/allianz--big.svg" },
    { "company": "PANAMY", "logo_url": "https://s3-symbol-logo.tradingview.com/panasonic-manufacturing-msia--big.svg" }
  ];

  const logoMap = {};
  BURSA_LOGOS.forEach(item => {
    logoMap[item.company.toUpperCase().trim()] = item.logo_url;
  });

  function getLogoUrl(company, stock) {
    const normComp = (company || '').toUpperCase().trim();
    if (logoMap[normComp]) return logoMap[normComp];
    const firstWord = normComp.split(' ')[0];
    if (logoMap[firstWord]) return logoMap[firstWord];
    const stockKey = (stock || '').toUpperCase().trim();
    if (logoMap[stockKey]) return logoMap[stockKey];
    return '';
  }

  function renderStockLogo(stock, company, size = 32) {
    const logoUrl = getLogoUrl(company, stock);
    const domain = logoUrl ? logoUrl.match(/logo\.clearbit\.com\/(.+)$/)?.[1] || '' : '';
    if (logoUrl) {
      return `<img src="${logoUrl}" 
                   class="stock-icon-img" 
                   style="width:${size}px; height:${size}px; min-width:${size}px; max-width:${size}px; border-radius:9999px; object-fit:cover; display:inline-block; flex-shrink:0;" 
                   onerror="if (this.src.indexOf('clearbit') !== -1 && '${domain}') { this.src = 'https://www.google.com/s2/favicons?sz=128&domain=${domain}'; } else { this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(stock)}&background=1e1b4b&color=a5b4fc&bold=true&size=128'; }" 
                   alt="${stock}">`;
    }
    return `<div class="stock-icon fallback-icon" style="width:${size}px; height:${size}px; min-width:${size}px; max-width:${size}px; background:${stockColor(stock)}; border-radius:9999px; display:inline-flex; align-items:center; justify-content:center; font-size:${Math.round(size * 0.35)}px; font-weight:700; color:#fff; flex-shrink:0;">${stock.slice(0, 2)}</div>`;
  }

  // ----------------------------------------------------
  // 3. REACTIVE STATE STORE
  // ----------------------------------------------------
  class Store {
    constructor() {
      this.state = {
        activeTab: 'dashboard',
        portfolioRange: '1M',
        returnsRange: '1M',
        returnsView: 'net',
        isMobile: window.innerWidth < 768,
        holdingsSearch: '',
        holdingsSector: 'all',
        txSearch: '',
        txType: 'all',
        txPage: 1
      };
      this.listeners = new Set();
    }

    getState() { return this.state; }

    setState(partial) {
      const prev = { ...this.state };
      this.state = { ...this.state, ...partial };
      this.listeners.forEach(fn => fn(this.state, prev));
    }

    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }
  }

  const store = new Store();

  // ----------------------------------------------------
  // 4. DATA CALCULATIONS & AGGREGATIONS
  // ----------------------------------------------------
  function getRawData() {
    return (typeof EPF_DATA !== 'undefined') ? EPF_DATA : (window.EPF_DATA || { holdings: [], transactions: [], txByDate: {} });
  }

  function flattenTransactions(rawData = getRawData()) {
    if (!rawData || !rawData.transactions) return [];
    const list = [];
    rawData.transactions.forEach(tx => {
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

    list.sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      const idA = parseInt(a.url.match(/ann_id=(\d+)/)?.[1] || 0, 10);
      const idB = parseInt(b.url.match(/ann_id=(\d+)/)?.[1] || 0, 10);
      return idB - idA;
    });
    return list;
  }

  function getPortfolioTimeSeries(range = '1M', rawData = getRawData()) {
    if (!rawData || !rawData.txByDate) return [];
    const dates = Object.keys(rawData.txByDate).map(d => ({
      label: d,
      date: new Date(d),
      ...rawData.txByDate[d]
    })).sort((a, b) => a.date - b.date);

    const now = dates[dates.length - 1]?.date || new Date();
    let cutoff;
    switch (range) {
      case '1M': cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 1); break;
      case '3M': cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 3); break;
      case '1Y': cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 1); break;
      default: cutoff = new Date(0);
    }

    const filtered = dates.filter(d => d.date >= cutoff);
    let cumulative = 0;
    return filtered.map(d => {
      cumulative += d.net;
      return { label: d.label, value: cumulative, date: d.date };
    });
  }

  function getReturnsData(view = 'net', range = '1M', rawData = getRawData()) {
    if (!rawData || !rawData.txByDate) return [];
    const dates = Object.keys(rawData.txByDate).map(d => ({
      label: d,
      date: new Date(d),
      ...rawData.txByDate[d]
    })).sort((a, b) => a.date - b.date);

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
    return filtered.map(d => ({
      label: d.label,
      value: view === 'net' ? d.net : view === 'acquired' ? d.acquired : -d.disposed,
      count: d.count
    }));
  }

  // ----------------------------------------------------
  // 5. CANVAS CHARTS ENGINE & HOVER PROBES
  // ----------------------------------------------------
  let lineAnimId = null;
  let lineChartMeta = {};

  function drawLineChart(canvasId, data, color = null, animateChart = true) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth || 300;
    const h = parent.clientHeight || 250;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = window.innerWidth < 768;
    const dynamicColor = color || (getComputedStyle(document.documentElement).getPropertyValue('--chart-primary').trim() || '#f43f5e');
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-subtle').trim() || 'rgba(255, 255, 255, 0.06)';

    const pad = {
      top: 18,
      right: isMobile ? 12 : 24,
      bottom: isMobile ? 24 : 28,
      left: isMobile ? 48 : 64
    };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    if (lineAnimId) cancelAnimationFrame(lineAnimId);
    ctx.clearRect(0, 0, w, h);

    if (!data || data.length < 2) {
      ctx.fillStyle = textColor;
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Insufficient data for this range', w / 2, h / 2);
      return;
    }

    const values = data.map(d => d.value);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const range = maxV - minV || 1;

    let startTime = null;
    const DURATION = animateChart ? 600 : 0;

    function render(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = DURATION > 0 ? Math.min(elapsed / DURATION, 1) : 1;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const maxDrawIndex = (data.length - 1) * easeProgress;

      ctx.clearRect(0, 0, w, h);

      // Grid + Y labels
      ctx.fillStyle = textColor;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const val = minV + (range * i / 4);
        const y = pad.top + plotH - (plotH * i / 4);
        ctx.fillText(formatCompact(val), pad.left - 8, y + 3);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
      }

      // Line Path
      ctx.save();
      ctx.beginPath();
      data.forEach((d, i) => {
        if (i > Math.ceil(maxDrawIndex)) return;
        let x = pad.left + (plotW * i / (data.length - 1));
        let y = pad.top + plotH - ((d.value - minV) / range * plotH);

        if (i === Math.ceil(maxDrawIndex) && i > 0 && maxDrawIndex % 1 !== 0) {
          const prev = data[i - 1];
          const prevX = pad.left + (plotW * (i - 1) / (data.length - 1));
          const prevY = pad.top + plotH - ((prev.value - minV) / range * plotH);
          const fraction = maxDrawIndex % 1;
          x = prevX + (x - prevX) * fraction;
          y = prevY + (y - prevY) * fraction;
        }

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.shadowColor = dynamicColor;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = dynamicColor;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Area Gradient Fill
      ctx.save();
      ctx.beginPath();
      let lastX = pad.left;
      let lastY = pad.top + plotH;

      data.forEach((d, i) => {
        if (i > Math.ceil(maxDrawIndex)) return;
        let x = pad.left + (plotW * i / (data.length - 1));
        let y = pad.top + plotH - ((d.value - minV) / range * plotH);

        if (i === Math.ceil(maxDrawIndex) && i > 0 && maxDrawIndex % 1 !== 0) {
          const prev = data[i - 1];
          const prevX = pad.left + (plotW * (i - 1) / (data.length - 1));
          const prevY = pad.top + plotH - ((prev.value - minV) / range * plotH);
          const fraction = maxDrawIndex % 1;
          x = prevX + (x - prevX) * fraction;
          y = prevY + (y - prevY) * fraction;
        }

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        lastX = x;
        lastY = y;
      });

      ctx.lineTo(lastX, pad.top + plotH);
      ctx.lineTo(pad.left, pad.top + plotH);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
      grad.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
      grad.addColorStop(1, 'rgba(244, 63, 94, 0.00)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // X Labels
      ctx.fillStyle = textColor;
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      const maxLabels = isMobile ? 3 : 6;
      const step = Math.ceil((data.length - 1) / (maxLabels - 1));

      for (let i = 0; i < data.length; i += step) {
        const x = pad.left + (plotW * i / (data.length - 1));
        const label = data[i].label;
        const parts = label.split(' ');
        const displayLabel = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : label;
        ctx.fillText(displayLabel, x, h - 6);
      }

      // 1. Capture clean canvas (WITHOUT HEAD CIRCLE) for hover restore
      const cleanImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 2. Draw Head Node (The Single Circle at the end of the line)
      if (data.length > 0) {
        const lastIdx = Math.min(Math.ceil(maxDrawIndex), data.length - 1);
        const currX = pad.left + (plotW * lastIdx / (data.length - 1));
        const currY = pad.top + plotH - ((data[lastIdx].value - minV) / range * plotH);

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = dynamicColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(currX, currY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = dynamicColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Capture full canvas (WITH HEAD CIRCLE) for mouseleave restore
      const fullImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (progress < 1) {
        lineAnimId = requestAnimationFrame(render);
      } else {
        lineChartMeta[canvasId] = { data, pad, plotW, plotH, minV, range, w, h, dynamicColor, cleanImageData, fullImageData };
      }
    }

    if (animateChart) lineAnimId = requestAnimationFrame(render);
    else render(performance.now() + DURATION);
  }

  function setupLineChartHover(canvasId = 'portfolio-canvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    canvas.addEventListener('mousemove', (e) => {
      const meta = lineChartMeta[canvasId];
      if (!meta || !meta.data || meta.data.length < 2 || !meta.cleanImageData) return;
      const { data, pad, plotW, plotH, minV, range, w, h, dynamicColor, cleanImageData, fullImageData } = meta;

      const canvasRect = canvas.getBoundingClientRect();
      const mx = e.clientX - canvasRect.left;
      const relX = mx - pad.left;

      const ctx = canvas.getContext('2d');

      if (relX < 0 || relX > plotW) {
        if (fullImageData) ctx.putImageData(fullImageData, 0, 0);
        hideTooltip();
        resetLineDisplay();
        canvas.style.cursor = 'default';
        return;
      }

      const idx = Math.round(relX / (plotW / (data.length - 1)));
      const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
      const d = data[clampedIdx];

      canvas.style.cursor = 'crosshair';

      const pointX = pad.left + (plotW * clampedIdx / (data.length - 1));
      const pointY = pad.top + plotH - ((d.value - minV) / range * plotH);

      // RESTORE CLEAN IMAGE DATA (THIS ELIMINATES THE ORIGINAL HEAD CIRCLE!)
      ctx.putImageData(cleanImageData, 0, 0);

      // DRAW HOVER ELEMENTS (THE SINGLE CIRCLE ON THE ENTIRE CANVAS)
      ctx.save();

      // 1. Vertical Dashed Probe
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pointX, pad.top);
      ctx.lineTo(pointX, pad.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. The ONLY Glowing Circle on Canvas
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = dynamicColor;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(pointX, pointY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = dynamicColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 3. Current Date Pill Badge
      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      const dateText = d.label;
      const textW = ctx.measureText(dateText).width;
      const pillW = textW + 16;
      const pillH = 20;
      const pillX = Math.max(pad.left, Math.min(w - pad.right - pillW, pointX - (pillW / 2)));
      const pillY = h - 23;

      ctx.fillStyle = 'rgba(18, 20, 30, 0.96)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dateText, pillX + (pillW / 2), pillY + (pillH / 2));

      ctx.restore();

      // Tooltip
      showTooltip(e, `
        <div class="tt-label">${d.label}</div>
        <div class="tt-value tt-positive">${formatCompact(d.value)} shares</div>
        <div style="color:var(--text-muted);font-size:0.7rem;margin-top:2px">Net cumulative hold</div>
      `);

      // Update Live Value Display
      const valDisp = document.getElementById('portfolio-value-display');
      if (valDisp) valDisp.textContent = `${formatCompact(d.value)} shares (net)`;
      const legDate = document.getElementById('portfolio-legend-date');
      if (legDate) legDate.textContent = d.label;
    });

    canvas.addEventListener('mouseleave', () => {
      const meta = lineChartMeta[canvasId];
      if (meta && meta.fullImageData) {
        const ctx = canvas.getContext('2d');
        ctx.putImageData(meta.fullImageData, 0, 0); // RESTORES ORIGINAL CIRCLE!
      }
      hideTooltip();
      resetLineDisplay();
      canvas.style.cursor = 'default';
    });

    function resetLineDisplay() {
      const meta = lineChartMeta[canvasId];
      if (!meta || !meta.data || meta.data.length === 0) return;
      const lastVal = meta.data[meta.data.length - 1].value;
      const valDisp = document.getElementById('portfolio-value-display');
      if (valDisp) valDisp.textContent = `${formatCompact(lastVal)} shares (net)`;
      const legDate = document.getElementById('portfolio-legend-date');
      if (legDate) legDate.textContent = 'Net Shareholdings Trend';
    }
  }

  let barChartAnimId = null;
  let barChartMeta = null;

  function drawBarChart(canvasId, data, animateChart = true) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth || 300;
    const h = parent.clientHeight || 300;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = window.innerWidth < 768;
    const pad = {
      top: 20,
      right: isMobile ? 12 : 24,
      bottom: isMobile ? 26 : 32,
      left: isMobile ? 48 : 70
    };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    if (barChartAnimId) cancelAnimationFrame(barChartAnimId);
    ctx.clearRect(0, 0, w, h);

    if (!data || data.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No capital flow activity in this timeframe', w / 2, h / 2);
      return;
    }

    const values = data.map(d => d.value);
    const maxV = Math.max(...values, 0);
    const minV = Math.min(...values, 0);
    const range = maxV - minV || 1;

    const zeroY = pad.top + plotH - ((0 - minV) / range * plotH);
    const rawBarW = (plotW / data.length);
    const barW = Math.max(2.5, rawBarW - (data.length > 60 ? 1 : data.length > 25 ? 3 : 6));

    let startTime = null;
    const DURATION = animateChart ? 600 : 0;

    function renderFrame(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = DURATION > 0 ? Math.min(elapsed / DURATION, 1) : 1;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const val = minV + (range * i / 4);
        const y = pad.top + plotH - (plotH * i / 4);
        ctx.fillText(formatCompact(val), pad.left - 8, y + 3);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
      }

      // Zero baseline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.left, zeroY);
      ctx.lineTo(w - pad.right, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Bars
      data.forEach((d, i) => {
        const x = pad.left + (plotW * i / data.length) + (plotW / data.length - barW) / 2;
        const fullBarH = (Math.abs(d.value) / range) * plotH;
        const currentBarH = fullBarH * easeProgress;
        const y = d.value >= 0 ? zeroY - currentBarH : zeroY;

        if (d.value >= 0) {
          const grad = ctx.createLinearGradient(0, y, 0, zeroY);
          grad.addColorStop(0, '#10b981');
          grad.addColorStop(1, '#059669');
          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
          ctx.shadowBlur = 6;
        } else {
          const grad = ctx.createLinearGradient(0, zeroY, 0, y + currentBarH);
          grad.addColorStop(0, '#e11d48');
          grad.addColorStop(1, '#f43f5e');
          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(244, 63, 94, 0.3)';
          ctx.shadowBlur = 6;
        }

        ctx.beginPath();
        const r = Math.min(3, barW / 2);
        ctx.roundRect(x, y, barW, Math.max(1, currentBarH), d.value >= 0 ? [r, r, 0, 0] : [0, 0, r, r]);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // X Axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      const maxLabels = isMobile ? 4 : 8;

      let formatLabel = (labelStr) => {
        const parts = labelStr.split(' ');
        return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : labelStr;
      };

      const indicesToDraw = [];
      if (data.length > 0) {
        indicesToDraw.push(0);
        if (data.length > 1) {
          const step = (data.length - 1) / (maxLabels - 1);
          for (let i = 1; i < maxLabels - 1; i++) {
            const idx = Math.round(i * step);
            if (!indicesToDraw.includes(idx)) indicesToDraw.push(idx);
          }
          if (!indicesToDraw.includes(data.length - 1)) indicesToDraw.push(data.length - 1);
        }
      }
      indicesToDraw.sort((a, b) => a - b);

      indicesToDraw.forEach(i => {
        const x = pad.left + (plotW * i / data.length) + (plotW / data.length) / 2;
        ctx.fillText(formatLabel(data[i].label), x, h - 8);
      });

      if (progress < 1) {
        barChartAnimId = requestAnimationFrame(renderFrame);
      } else {
        const savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        barChartMeta = { data, pad, plotW, plotH, minV, range, barW, w, h, zeroY, savedImageData };
      }
    }

    if (animateChart) barChartAnimId = requestAnimationFrame(renderFrame);
    else renderFrame(performance.now() + DURATION);
  }

  function setupBarChartHover(canvasId = 'returns-canvas', onBarClick = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    canvas.addEventListener('mousemove', (e) => {
      if (!barChartMeta || !barChartMeta.data || barChartMeta.data.length === 0 || !barChartMeta.savedImageData) return;
      const { data, pad, plotW, plotH, minV, range, barW, w, h, zeroY, savedImageData } = barChartMeta;

      const canvasRect = canvas.getBoundingClientRect();
      const mx = e.clientX - canvasRect.left;
      const relX = mx - pad.left;

      const ctx = canvas.getContext('2d');

      if (relX < 0 || relX > plotW) {
        ctx.putImageData(savedImageData, 0, 0);
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

      ctx.putImageData(savedImageData, 0, 0);

      ctx.save();

      const barCenterX = pad.left + (plotW * clampedIdx / data.length) + (plotW / data.length) / 2;
      const barX = pad.left + (plotW * clampedIdx / data.length) + (plotW / data.length - barW) / 2;
      const barH = (Math.abs(d.value) / range) * plotH;
      const barY = d.value >= 0 ? zeroY - barH : zeroY;
      const r = Math.min(3, barW / 2);

      // Vertical Dashed Probe
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(barCenterX, pad.top);
      ctx.lineTo(barCenterX, pad.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Bar Glow
      ctx.fillStyle = d.value >= 0 ? '#10b981' : '#f43f5e';
      ctx.shadowColor = d.value >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(244, 63, 94, 0.8)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, Math.max(2, barH), d.value >= 0 ? [r, r, 0, 0] : [0, 0, r, r]);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Date Badge Pill
      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      const dateText = d.label;
      const textW = ctx.measureText(dateText).width;
      const pillW = textW + 16;
      const pillH = 20;
      const pillX = Math.max(pad.left, Math.min(w - pad.right - pillW, barCenterX - (pillW / 2)));
      const pillY = h - 23;

      ctx.fillStyle = 'rgba(18, 20, 30, 0.96)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dateText, pillX + (pillW / 2), pillY + (pillH / 2));
      ctx.restore();
    });

    canvas.addEventListener('mouseleave', () => {
      if (barChartMeta && barChartMeta.savedImageData) {
        const ctx = canvas.getContext('2d');
        ctx.putImageData(barChartMeta.savedImageData, 0, 0);
      }
      hideTooltip();
      canvas.style.cursor = 'default';
    });

    canvas.addEventListener('click', (e) => {
      if (!barChartMeta || !barChartMeta.data || barChartMeta.data.length === 0) return;
      const { data, pad, plotW } = barChartMeta;
      const canvasRect = canvas.getBoundingClientRect();
      const mx = e.clientX - canvasRect.left;
      const relX = mx - pad.left;
      if (relX < 0 || relX > plotW) return;

      const idx = Math.floor(relX / (plotW / data.length));
      const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
      const d = data[clampedIdx];
      if (onBarClick) onBarClick(d);
    });
  }

  function showTooltip(e, html) {
    let tt = document.getElementById('chart-tooltip');
    if (!tt) {
      tt = document.createElement('div');
      tt.id = 'chart-tooltip';
      tt.className = 'chart-tooltip';
      document.body.appendChild(tt);
    }
    tt.innerHTML = html;
    tt.style.display = 'block';
    const x = Math.min(window.innerWidth - 180, e.clientX + 14);
    const y = Math.max(10, e.clientY - 35);
    tt.style.left = `${x}px`;
    tt.style.top = `${y}px`;
  }

  function hideTooltip() {
    const tt = document.getElementById('chart-tooltip');
    if (tt) tt.style.display = 'none';
  }

  const PIE_COLORS = ['#f43f5e', '#fb7185', '#e11d48', '#fda4af', '#38bdf8', '#fbbf24', '#34d399', '#a78bfa', '#f97316', '#22d3ee', '#818cf8', '#64748b'];

  function getPieData(type = 'company', rawData = getRawData()) {
    if (!rawData || !rawData.holdings) return [];
    const total = rawData.holdings.reduce((s, h) => s + (h.market_value || 0), 0);
    if (total === 0) return [];

    if (type === 'company') {
      const sorted = [...rawData.holdings].sort((a, b) => (b.market_value || 0) - (a.market_value || 0));
      const top9 = sorted.slice(0, 9);
      const top9Total = top9.reduce((s, h) => s + (h.market_value || 0), 0);
      const othersVal = total - top9Total;

      const result = top9.map((h, i) => ({
        label: h.stock_name,
        sublabel: h.company_name,
        value: h.market_value || 0,
        pct: ((h.market_value || 0) / total * 100).toFixed(1),
        color: PIE_COLORS[i % PIE_COLORS.length]
      }));

      if (othersVal > 0) {
        result.push({
          label: `Others (${sorted.length - 9})`,
          sublabel: 'Remaining Holdings',
          value: othersVal,
          pct: (othersVal / total * 100).toFixed(1),
          color: '#64748b'
        });
      }
      return result;
    } else {
      const map = {};
      rawData.holdings.forEach(h => {
        map[h.sector] = (map[h.sector] || 0) + (h.market_value || 0);
      });

      const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
      const top8 = sorted.slice(0, 8);
      const top8Total = top8.reduce((s, [, v]) => s + v, 0);
      const othersVal = total - top8Total;

      const result = top8.map(([sec, val], i) => ({
        label: sec,
        sublabel: '',
        value: val,
        pct: (val / total * 100).toFixed(1),
        color: PIE_COLORS[i % PIE_COLORS.length]
      }));

      if (othersVal > 0) {
        result.push({
          label: 'Others',
          sublabel: '',
          value: othersVal,
          pct: (othersVal / total * 100).toFixed(1),
          color: '#64748b'
        });
      }
      return result;
    }
  }

  let pieChartDataCache = { company: [], sector: [] };

  function drawPieChart(canvasId, data, type = 'company', hoveredIndex = -1) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    pieChartDataCache[type] = data;

    const w = parent.clientWidth || 130;
    const h = parent.clientHeight || 130;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const baseOuterR = Math.min(cx, cy) - 9;
    const baseInnerR = baseOuterR * 0.58;

    ctx.clearRect(0, 0, w, h);
    if (!data || data.length === 0) return;

    const total = data.reduce((s, d) => s + d.value, 0);
    let startAngle = -Math.PI / 2;

    // Calculate angles first
    data.forEach((d) => {
      const sweep = (d.value / total) * (Math.PI * 2);
      d._startAngle = startAngle;
      d._endAngle = startAngle + sweep;
      startAngle = d._endAngle;
    });

    // PASS 1: Draw all non-hovered slices underneath
    data.forEach((d, i) => {
      if (i === hoveredIndex) return;

      ctx.save();
      ctx.globalAlpha = hoveredIndex !== -1 ? 0.35 : 1.0;
      ctx.fillStyle = d.color;

      ctx.beginPath();
      ctx.arc(cx, cy, baseOuterR, d._startAngle, d._endAngle);
      ctx.arc(cx, cy, baseInnerR, d._endAngle, d._startAngle, true);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#08090e';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });

    // PASS 2: Draw hovered slice ON TOP with full, unbroken, perfectly closed outline & pop-out
    if (hoveredIndex !== -1 && data[hoveredIndex]) {
      const d = data[hoveredIndex];
      const midAngle = (d._startAngle + d._endAngle) / 2;
      const popDist = 4.5;
      const ox = Math.cos(midAngle) * popDist;
      const oy = Math.sin(midAngle) * popDist;

      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.arc(cx + ox, cy + oy, baseOuterR + 1, d._startAngle, d._endAngle);
      ctx.arc(cx + ox, cy + oy, baseInnerR - 1, d._endAngle, d._startAngle, true);
      ctx.closePath();
      ctx.fill();

      // Completely closed, thick, glowing white stroke
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();
    }

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (hoveredIndex !== -1 && data[hoveredIndex]) {
      const hItem = data[hoveredIndex];
      ctx.fillText(`${hItem.pct}%`, cx, cy - 6);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 8.5px "Plus Jakarta Sans", sans-serif';
      const shortLabel = hItem.label.length > 7 ? hItem.label.slice(0, 6) + '..' : hItem.label;
      ctx.fillText(shortLabel, cx, cy + 7);
    } else {
      const centerText = type === 'company' ? `${getRawData()?.holdings?.length || 260}` : `${data.length}`;
      const centerSub = type === 'company' ? 'stocks' : 'sectors';
      ctx.fillText(centerText, cx, cy - 5);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(centerSub, cx, cy + 7);
    }
  }

  function renderPieLegend(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = data.map((d, i) => `
      <div class="pie-legend-row flex items-center justify-between p-1.5 px-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs cursor-pointer transition-all hover:bg-white/[0.08] hover:border-primary/40" data-index="${i}" data-label="${d.label}">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="w-2 h-2 rounded-full shrink-0 shadow-sm" style="background-color: ${d.color}"></span>
          <span class="font-bold text-white text-[11px] truncate max-w-[80px]">${d.label}</span>
        </div>
        <span class="font-mono text-[11px] text-outline shrink-0 ml-1 font-semibold">${d.pct}%</span>
      </div>
    `).join('');
  }

  function setupPieInteractivity(canvasId, legendId, type) {
    const canvas = document.getElementById(canvasId);
    const legendEl = document.getElementById(legendId);
    if (!canvas) return;

    let currentHover = -1;

    function getSliceIndex(e) {
      const data = pieChartDataCache[type] || [];
      if (!data.length) return -1;

      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const outerR = Math.min(cx, cy);

      if (dist < outerR * 0.45 || dist > outerR + 10) return -1;

      let angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) angle += Math.PI * 2;

      for (let i = 0; i < data.length; i++) {
        if (angle >= data[i]._startAngle && angle < data[i]._endAngle) {
          return i;
        }
      }
      return -1;
    }

    function setHover(idx, e) {
      if (currentHover === idx) return;
      currentHover = idx;
      const data = pieChartDataCache[type] || [];
      drawPieChart(canvasId, data, type, currentHover);

      if (legendEl) {
        legendEl.querySelectorAll('.pie-legend-row').forEach((row, i) => {
          if (i === idx) {
            row.classList.add('bg-primary/20', 'border-primary/60', 'shadow-[0_0_12px_rgba(244,63,94,0.3)]');
          } else {
            row.classList.remove('bg-primary/20', 'border-primary/60', 'shadow-[0_0_12px_rgba(244,63,94,0.3)]');
          }
        });
      }

      if (idx !== -1 && data[idx]) {
        const item = data[idx];
        const clientX = e ? e.clientX : (legendEl ? legendEl.getBoundingClientRect().left : 200);
        const clientY = e ? e.clientY : (legendEl ? legendEl.getBoundingClientRect().top : 200);
        showTooltip({ clientX, clientY }, `
          <div class="tt-label font-bold text-white">${item.label}</div>
          <div class="tt-value text-primary font-mono text-xs mt-0.5">${item.pct}% weight</div>
          <div class="text-[10px] text-outline mt-0.5">RM ${formatCompact(item.value)}</div>
        `);
      } else {
        hideTooltip();
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      const idx = getSliceIndex(e);
      canvas.style.cursor = idx !== -1 ? 'pointer' : 'default';
      setHover(idx, e);
    });

    canvas.addEventListener('mouseleave', () => {
      setHover(-1, null);
    });

    canvas.addEventListener('click', (e) => {
      const idx = getSliceIndex(e);
      const data = pieChartDataCache[type] || [];
      if (idx !== -1 && data[idx]) {
        handlePieSelection(type, data[idx].label);
      }
    });

    if (legendEl) {
      legendEl.querySelectorAll('.pie-legend-row').forEach((row, i) => {
        row.addEventListener('mouseenter', (e) => setHover(i, e));
        row.addEventListener('mouseleave', () => setHover(-1, null));
        row.addEventListener('click', () => {
          const data = pieChartDataCache[type] || [];
          if (data[i]) {
            handlePieSelection(type, data[i].label);
          }
        });
      });
    }
  }

  function trackAnalytics(eventName, properties = {}) {
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(eventName, properties);
      }
    } catch (e) {
      // Non-blocking telemetry
    }
  }

  function handlePieSelection(type, label) {
    const isMobile = window.innerWidth < 768;
    trackAnalytics('pie_slice_selected', { type, label, device: isMobile ? 'mobile' : 'desktop' });
    if (type === 'sector') {
      if (isMobile) {
        const curSector = store.getState().holdingsSector;
        const newSector = (curSector === label) ? 'all' : label;
        store.setState({ holdingsSector: newSector });
        document.querySelectorAll('#mobile-sector-pills .sector-pill').forEach(b => {
          const match = b.dataset.sector === newSector;
          b.classList.toggle('active', match);
          b.classList.toggle('bg-primary/20', match);
          b.classList.toggle('text-primary', match);
          b.classList.toggle('border-primary/30', match);
          b.classList.toggle('font-semibold', match);
          b.classList.toggle('bg-white/[0.04]', !match);
          b.classList.toggle('text-outline', !match);
          b.classList.toggle('border-white/10', !match);
        });
        filterMobileHoldings();
        updateLegendActiveState('mobile-pie-sector-legend', newSector);
      } else {
        const select = document.getElementById('holdings-sector-filter');
        if (!select) return;
        select.value = (select.value === label) ? 'all' : label;
        filterDesktopHoldings();
        updateLegendActiveState('pie-sector-legend', select.value);
      }
    } else if (type === 'company') {
      if (isMobile) {
        const search = document.getElementById('mobile-holdings-search');
        if (!search) return;
        if (label.startsWith('Others') || search.value.toLowerCase() === label.toLowerCase()) {
          search.value = '';
        } else {
          search.value = label;
        }
        filterMobileHoldings();
        updateLegendActiveState('mobile-pie-company-legend', search.value);
      } else {
        const search = document.getElementById('holdings-search');
        if (!search) return;
        if (label.startsWith('Others') || search.value.toLowerCase() === label.toLowerCase()) {
          search.value = '';
        } else {
          search.value = label;
        }
        filterDesktopHoldings();
        updateLegendActiveState('pie-company-legend', search.value);
      }
    }
  }

  function updateLegendActiveState(legendId, activeVal) {
    const el = document.getElementById(legendId);
    if (!el) return;
    el.querySelectorAll('.pie-legend-row').forEach(row => {
      const label = row.dataset.label;
      if (activeVal && activeVal !== 'all' && label && label.toLowerCase() === activeVal.toLowerCase()) {
        row.classList.add('border-primary', 'bg-primary/25', 'ring-1', 'ring-primary');
      } else {
        row.classList.remove('border-primary', 'bg-primary/25', 'ring-1', 'ring-primary');
      }
    });
  }

  // ----------------------------------------------------
  // 6. DESKTOP TEMPLATES (SET A)
  // ----------------------------------------------------
  function renderDesktopNav(activeTab = 'dashboard') {
    return `
      <aside class="hidden md:flex h-screen w-64 fixed top-0 left-0 flex-col py-6 px-4 z-50 justify-between items-stretch bg-surface/80 backdrop-blur-xl border-r border-white/5">
        <div>
          <!-- Brand Header -->
          <div class="flex items-center justify-between mb-8 px-2">
            <div class="flex items-center gap-3.5">
              <img src="assets/logo.png" alt="EPF Tracker Logo" class="h-12 w-12 object-contain filter drop-shadow-[0_4px_16px_rgba(244,63,94,0.4)] shrink-0">
              <div>
                <h1 class="font-extrabold text-xl text-white tracking-tight leading-none flex items-center gap-1.5">
                  <span>EPF</span><span class="text-primary">Tracker</span>
                </h1>
              </div>
            </div>
          </div>

          <!-- Desktop Tab Links -->
          <nav class="flex flex-col gap-2 w-full" id="desktop-tab-nav">
            <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard" id="tab-dashboard">
              <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              <span class="text-sm font-semibold">Overview</span>
            </button>

            <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'holdings' ? 'active' : ''}" data-tab="holdings" id="tab-holdings">
              <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
              <span class="text-sm font-semibold">Holdings</span>
            </button>

            <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'returns' ? 'active' : ''}" data-tab="returns" id="tab-returns">
              <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>
              <span class="text-sm font-semibold">Flows</span>
            </button>

            <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'transactions' ? 'active' : ''}" data-tab="transactions" id="tab-transactions">
              <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
              <span class="text-sm font-semibold">Transactions</span>
            </button>
          </nav>
        </div>
      </aside>
    `;
  }

  function renderDesktopDashboard(data = getRawData()) {
    const holdings = data?.holdings || [];
    const totalMarketValue = holdings.reduce((s, h) => s + (h.market_value || 0), 0);

    const sectorMap = {};
    holdings.forEach(h => { sectorMap[h.sector] = (sectorMap[h.sector] || 0) + (h.market_value || 0); });
    const sortedSectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
    const topSector = sortedSectors[0] || ['Banking', 0];
    const topSectorPct = totalMarketValue > 0 ? ((topSector[1] / totalMarketValue) * 100).toFixed(1) : '0.0';

    const sortedHoldings = [...holdings].sort((a, b) => (b.market_value || 0) - (a.market_value || 0));
    const topHolding = sortedHoldings[0] || { stock_name: 'TENAGA', company_name: 'TENAGA NASIONAL BHD', market_value: 0, direct_percent: 24.85 };

    const sectorHoldings = holdings.filter(h => h.sector === topSector[0]).sort((a, b) => (b.market_value || 0) - (a.market_value || 0)).slice(0, 3);
    const sectorLogosHtml = sectorHoldings.map((h, i) => `
      <div class="relative w-8 h-8 rounded-full border border-white/20 overflow-hidden flex items-center justify-center shadow-md shrink-0 -ml-2 first:ml-0 bg-surface-container" style="z-index: ${30 - i * 10}">
        ${renderStockLogo(h.stock_name, h.company_name, 32)}
      </div>
    `).join('');

    return `
      <div id="desktop-panel-dashboard" class="flex flex-col gap-3.5 h-full w-full min-w-0 pt-2 pb-1 overflow-hidden">
        <div class="flex flex-col gap-0.5 shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold uppercase tracking-widest text-outline">Institutional Portfolio</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">Active Scope</span>
          </div>
          <div class="flex items-baseline gap-3">
            <h2 class="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-mono-numeric">
              ${formatCurrency(totalMarketValue)}
            </h2>
            <span class="badge-pill-success text-xs font-semibold">
              <svg class="w-3.5 h-3.5 text-emerald-400 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              +2.4%
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 shrink-0">
          <div id="bento-sector-card" class="glass-card p-4 flex flex-col justify-between h-[130px] relative group cursor-pointer">
            <div class="flex justify-between items-start mb-1.5">
              <div class="flex items-center gap-1.5">
                <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Top Sector Allocation</span>
              </div>
              <div class="flex items-center" id="bento-sector-logos">${sectorLogosHtml}</div>
            </div>
            <div>
              <div class="text-xl font-bold text-on-surface tracking-tight">${topSector[0]}</div>
              <div class="flex items-center justify-between text-xs mt-1 font-mono-numeric">
                <span class="text-on-surface font-semibold">RM ${formatCompact(topSector[1])}</span>
                <span class="text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">${topSectorPct}%</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-primary to-primary-container h-full rounded-full" style="width: ${topSectorPct}%;"></div>
              </div>
            </div>
          </div>

          <div id="bento-holding-card" class="glass-card p-4 flex flex-col justify-between h-[130px] relative group cursor-pointer">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Top Holding Spotlight</span>
              <div class="relative flex h-8 w-8 shrink-0 items-center justify-center">
                ${renderStockLogo(topHolding.stock_name, topHolding.company_name, 32)}
              </div>
            </div>
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-bold text-on-surface tracking-tight">${topHolding.stock_name}</span>
                <span class="text-xs text-outline font-medium truncate max-w-[140px]">${topHolding.company_name}</span>
              </div>
              <div class="text-xs mt-1 flex justify-between items-center font-mono-numeric">
                <span class="text-on-surface font-bold text-sm">${formatCurrency(topHolding.market_value || 0)}</span>
                <span class="badge-pill-success text-xs">
                  ${ICONSTACK.arrow_upward}${topHolding.direct_percent?.toFixed(3)}% in company
                </span>
              </div>
            </div>
          </div>

          <div id="bento-active-card" class="glass-card p-4 flex flex-col justify-between h-[130px] relative group cursor-pointer">
            <div class="flex justify-between items-start mb-1.5">
              <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Active Positions</span>
              <div class="flex items-center justify-center text-primary filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                ${ICONSTACK.layout_grid}
              </div>
            </div>
            <div>
              <div class="text-2xl font-extrabold text-on-surface tracking-tight font-mono-numeric">${holdings.length} positions</div>
              <div class="text-xs text-outline mt-0.5 font-medium">${data?.uniqueStocks || holdings.length} unique stocks across ${sortedSectors.length} sectors</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3.5 flex-1 min-h-0 w-full">
          <div class="lg:col-span-2 glass-card portfolio-trend-card p-5 glow-hover transition-all flex flex-col justify-between h-full min-h-0">
            <div class="flex justify-between items-center mb-2.5 shrink-0">
              <div>
                <h3 class="text-base font-bold text-on-surface tracking-tight">Portfolio Trend</h3>
                <span class="text-xs text-outline">Cumulative net shareholdings momentum</span>
              </div>
              <div class="chart-toggle-group flex gap-0.5" id="time-toggle">
                <button class="chart-toggle active" data-range="1M">1M</button>
                <button class="chart-toggle" data-range="3M">3M</button>
                <button class="chart-toggle" data-range="1Y">1Y</button>
                <button class="chart-toggle" data-range="ALL">All Time</button>
              </div>
            </div>
            <div class="chart-body flex-1 relative min-h-0 w-full">
              <canvas id="portfolio-canvas"></canvas>
            </div>
            <div class="chart-footer mt-2 flex items-center justify-between border-t border-white/10 pt-2 pb-0.5 shrink-0">
              <div class="chart-legend-item flex items-center gap-2">
                <span class="legend-line w-5 h-1 bg-primary rounded-full shadow-sm"></span>
                <span class="legend-label text-xs text-outline font-medium" id="portfolio-legend-date">Net Shareholdings Trend</span>
              </div>
              <div class="chart-value text-sm font-bold text-on-surface font-mono-numeric" id="portfolio-value-display">0 shares (net)</div>
            </div>
          </div>

          <div class="glass-card recent-filings-card p-5 glow-hover transition-all flex flex-col h-full min-h-0">
            <div class="flex justify-between items-center mb-2.5 border-b border-white/10 pb-2 shrink-0">
              <div>
                <h3 class="text-base font-bold text-on-surface tracking-tight">Recent Filings</h3>
                <span class="text-xs text-outline">Bursa announcements feed</span>
              </div>
              <svg class="w-4 h-4 text-outline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
            </div>
            <div class="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar min-h-0" id="bento-activity-feed"></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderDesktopHoldings(data = getRawData()) {
    const holdings = data?.holdings || [];
    const sectors = [...new Set(holdings.map(h => h.sector))].sort();

    return `
      <div id="desktop-panel-holdings" class="flex flex-col gap-3.5 w-full h-full min-w-0 pt-2 pb-1 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 shrink-0">
          <div class="glass-card p-4 flex flex-col justify-between h-[210px]" id="pie-company-card">
            <div class="flex justify-between items-center mb-1.5">
              <h3 class="text-sm font-bold text-on-surface tracking-tight">Allocation by Company</h3>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Top 10 Weight</span>
            </div>
            <div class="flex-1 flex items-center gap-4 min-h-0">
              <div class="pie-chart-container-compact">
                <canvas id="pie-company-canvas"></canvas>
              </div>
              <div class="flex-1 grid grid-cols-2 gap-1.5 w-full overflow-y-auto max-h-[145px] pr-1 custom-scrollbar" id="pie-company-legend"></div>
            </div>
          </div>

          <div class="glass-card p-4 flex flex-col justify-between h-[210px]" id="pie-sector-card">
            <div class="flex justify-between items-center mb-1.5">
              <h3 class="text-sm font-bold text-on-surface tracking-tight">Allocation by Sector</h3>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Macro Weight</span>
            </div>
            <div class="flex-1 flex items-center gap-4 min-h-0">
              <div class="pie-chart-container-compact">
                <canvas id="pie-sector-canvas"></canvas>
              </div>
              <div class="flex-1 grid grid-cols-2 gap-1.5 w-full overflow-y-auto max-h-[145px] pr-1 custom-scrollbar" id="pie-sector-legend"></div>
            </div>
          </div>
        </div>

        <div class="glass-card table-card p-4 flex flex-col flex-1 min-h-0 overflow-hidden">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 mb-2.5 shrink-0">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-on-surface tracking-tight">Domestic Equity Positions</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20" id="holdings-count">${holdings.length}</span>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:w-56">
                <input type="text" id="holdings-search" placeholder="Search ticker / company..." class="w-full bg-surface-container-low border border-white/10 rounded-lg pl-3 pr-7 py-1.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
                <button id="holdings-clear-search-btn" class="hidden absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-white p-0.5 text-xs transition-colors" title="Clear search">✕</button>
              </div>
              <select id="holdings-sector-filter" class="bg-surface-container-low border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary/50">
                <option value="all">All Sectors</option>
                ${sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
              <button id="holdings-clear-filter-btn" class="hidden items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer shrink-0 shadow-sm">
                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span>Clear Filter</span>
              </button>
            </div>
          </div>

          <div class="table-scroll-wrapper custom-scrollbar">
            <table class="w-full text-left text-xs text-on-surface data-table" id="holdings-table">
              <thead>
                <tr class="text-outline text-[11px] uppercase tracking-wider font-semibold">
                  <th class="py-2.5 px-3">#</th>
                  <th class="py-2.5 px-3">Symbol</th>
                  <th class="py-2.5 px-3">Company</th>
                  <th class="py-2.5 px-3">Sector</th>
                  <th class="py-2.5 px-3 text-right">Price (RM)</th>
                  <th class="py-2.5 px-3 text-right">No. of Shares</th>
                  <th class="py-2.5 px-3 text-right">Market Value (RM)</th>
                  <th class="py-2.5 px-3 text-right">% in Company</th>
                  <th class="py-2.5 px-3 text-right">% in Portfolio</th>
                </tr>
              </thead>
              <tbody id="holdings-tbody" class="divide-y divide-white/[0.04]"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderDesktopReturns() {
    return `
      <div id="desktop-panel-returns" class="flex flex-col gap-3.5 h-full w-full min-w-0 pt-2 pb-1 overflow-hidden">
        <div class="glass-card returns-chart-card p-5 glow-hover transition-all flex flex-col min-w-0 w-full overflow-hidden flex-1 min-h-0">
          <div class="flex justify-between items-center mb-3 flex-wrap gap-3 shrink-0">
            <div>
              <h3 class="text-base font-bold text-on-surface tracking-tight">Net Capital Activity</h3>
              <span class="text-xs text-outline">Accumulation vs Divestment volume over time</span>
            </div>
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div class="chart-toggle-group flex gap-0.5" id="returns-time-toggle">
                <button class="chart-toggle active" data-range="1M">1M</button>
                <button class="chart-toggle" data-range="3M">3M</button>
                <button class="chart-toggle" data-range="1Y">1Y</button>
                <button class="chart-toggle" data-range="ALL">All Time</button>
              </div>
              <div class="chart-toggle-group flex gap-0.5" id="returns-toggle">
                <button class="chart-toggle active" data-view="net">Net</button>
                <button class="chart-toggle" data-view="acquired">Acquired</button>
                <button class="chart-toggle" data-view="disposed">Disposed</button>
              </div>
            </div>
          </div>
          <div class="chart-body-tall flex-1 relative min-h-0 w-full">
            <canvas id="returns-canvas"></canvas>
          </div>
        </div>
        <div class="summary-cards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full shrink-0" id="returns-summary"></div>
      </div>
    `;
  }

  function renderDesktopTransactions() {
    return `
      <div id="desktop-panel-transactions" class="flex flex-col h-full w-full min-w-0 pt-2 pb-1 overflow-hidden">
        <div class="glass-card table-card p-5 flex flex-col flex-1 h-full min-h-0 overflow-hidden">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3.5 shrink-0">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-on-surface tracking-tight">EPF Bursa Filings</h3>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20" id="tx-count">0</span>
              </div>
              <span class="text-xs text-outline mt-0.5">Substantial Shareholder Notices</span>
            </div>
            <div class="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
              <div class="relative flex-1 md:w-64">
                <input type="text" id="tx-search" placeholder="Search stock / company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl pl-3.5 pr-8 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
                <button id="tx-clear-search-btn" class="hidden absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-white p-0.5 text-xs transition-colors" title="Clear search">✕</button>
              </div>
              <select id="tx-filter-type" class="bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50">
                <option value="all">All Types</option>
                <option value="Acquired">Acquired (Buy)</option>
                <option value="Disposed">Disposed (Sell)</option>
              </select>
              <button id="tx-clear-filter-btn" class="hidden items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer shrink-0 shadow-sm">
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span>Clear Filter</span>
              </button>
            </div>
          </div>

          <div class="table-scroll-wrapper custom-scrollbar" id="tx-table-scroll">
            <table class="w-full text-left text-xs text-on-surface data-table" id="tx-table">
              <thead>
                <tr class="text-outline text-[11px] uppercase tracking-wider font-semibold">
                  <th class="py-3 px-3">Date</th>
                  <th class="py-3 px-3">Stock</th>
                  <th class="py-3 px-3">Company</th>
                  <th class="py-3 px-3">Type</th>
                  <th class="py-3 px-3 text-right">Shares Changed</th>
                  <th class="py-3 px-3 text-right">% Change</th>
                  <th class="py-3 px-3 text-right">Total Shares Held</th>
                  <th class="py-3 px-3 text-center">Bursa Link</th>
                </tr>
              </thead>
              <tbody id="tx-tbody" class="divide-y divide-white/[0.04]"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------
  // 7. MOBILE TEMPLATES (SET B)
  // ----------------------------------------------------
  function renderMobileNav(activeTab = 'dashboard') {
    return `
      <nav class="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 z-50 shadow-2xl" id="mobile-tab-nav">
        <button class="mobile-tab-btn flex flex-col items-center justify-center w-14 h-11 rounded-xl ${activeTab === 'dashboard' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="dashboard" id="mobile-btn-dashboard">
          <svg class="w-4 h-4 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span class="text-[9px] tracking-tight">Overview</span>
        </button>
        <button class="mobile-tab-btn flex flex-col items-center justify-center w-14 h-11 rounded-xl ${activeTab === 'holdings' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="holdings" id="mobile-btn-holdings">
          <svg class="w-4 h-4 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
          <span class="text-[9px] tracking-tight">Holdings</span>
        </button>
        <button class="mobile-tab-btn flex flex-col items-center justify-center w-14 h-11 rounded-xl ${activeTab === 'returns' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="returns" id="mobile-btn-returns">
          <svg class="w-4 h-4 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>
          <span class="text-[9px] tracking-tight">Flows</span>
        </button>
        <button class="mobile-tab-btn flex flex-col items-center justify-center w-14 h-11 rounded-xl ${activeTab === 'transactions' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="transactions" id="mobile-btn-transactions">
          <svg class="w-4 h-4 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
          <span class="text-[9px] tracking-tight">Transactions</span>
        </button>
      </nav>
    `;
  }

  function renderMobileDashboard(data = getRawData()) {
    const holdings = data?.holdings || [];
    const totalMarketValue = holdings.reduce((s, h) => s + (h.market_value || 0), 0);
    const sectorMap = {};
    holdings.forEach(h => { sectorMap[h.sector] = (sectorMap[h.sector] || 0) + (h.market_value || 0); });
    const sortedSectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
    const topSector = sortedSectors[0] || ['Banking', 0];
    const topSectorPct = totalMarketValue > 0 ? ((topSector[1] / totalMarketValue) * 100).toFixed(1) : '0.0';
    const sortedHoldings = [...holdings].sort((a, b) => (b.market_value || 0) - (a.market_value || 0));
    const topHolding = sortedHoldings[0] || { stock_name: 'TENAGA', company_name: 'TENAGA NASIONAL BHD', market_value: 0, direct_percent: 24.85 };

    const sectorHoldings = holdings.filter(h => h.sector === topSector[0]).sort((a, b) => (b.market_value || 0) - (a.market_value || 0)).slice(0, 3);
    const sectorLogosHtml = sectorHoldings.map((h, i) => `
      <div class="relative w-7 h-7 rounded-full border border-white/20 overflow-hidden flex items-center justify-center shadow-md shrink-0 -ml-2 first:ml-0 bg-surface-container" style="z-index: ${30 - i * 10}">
        ${renderStockLogo(h.stock_name, h.company_name, 28)}
      </div>
    `).join('');

    return `
      <div id="mobile-panel-dashboard" class="flex flex-col w-full py-2 pb-[62px] gap-3">
        <!-- Hero Balance Card with Crimson Glow -->
        <div id="mobile-hero-balance-card" class="glass-card p-3.5 rounded-2xl flex flex-col gap-1 shrink-0">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-outline">EPF Malaysia Portfolio</span>
            <span class="badge-pill-success text-[10px] font-bold">+2.4%</span>
          </div>
          <div class="flex items-baseline">
            <h2 class="text-2xl font-black text-white font-mono-numeric tracking-tight">
              ${formatCurrency(totalMarketValue)}
            </h2>
          </div>
        </div>

        <!-- 2 Bento Metric Cards -->
        <div class="grid grid-cols-2 gap-2.5 shrink-0">
          <!-- Top Sector Card with Logos -->
          <div id="mobile-bento-sector-card" class="glass-card p-3 rounded-2xl flex flex-col justify-between h-[115px]">
            <div class="flex justify-between items-start">
              <span class="text-[9px] font-bold uppercase tracking-wider text-outline">Top Sector</span>
              <div class="flex items-center" id="mobile-sector-logos">${sectorLogosHtml}</div>
            </div>
            <div>
              <div class="text-sm font-bold text-white truncate">${topSector[0]}</div>
              <div class="flex justify-between items-center text-[10px] font-mono-numeric text-outline mt-0.5">
                <span>RM ${formatCompact(topSector[1])}</span>
                <span class="text-primary font-bold">${topSectorPct}%</span>
              </div>
            </div>
            <div class="w-full bg-white/10 rounded-full h-1 overflow-hidden">
              <div class="bg-gradient-to-r from-primary to-primary-container h-full rounded-full" style="width: ${topSectorPct}%;"></div>
            </div>
          </div>

          <!-- Top Holding Card with Correct Logo Position -->
          <div id="mobile-bento-holding-card" class="glass-card p-3 rounded-2xl flex flex-col justify-between h-[115px] relative overflow-hidden">
            <div class="flex justify-between items-start">
              <span class="text-[9px] font-bold uppercase tracking-wider text-outline">Top Holding</span>
              <div class="relative w-7 h-7 rounded-full border border-white/20 overflow-hidden flex items-center justify-center shadow-md shrink-0 bg-surface-container">
                ${renderStockLogo(topHolding.stock_name, topHolding.company_name, 28)}
              </div>
            </div>
            <div>
              <div class="text-sm font-bold text-white truncate">${topHolding.stock_name}</div>
              <div class="text-[10px] font-mono-numeric text-emerald-400 font-semibold mt-0.5 truncate">
                ${formatCompact(topHolding.market_value)} (${topHolding.direct_percent?.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>

        <!-- Portfolio Trend Chart Card with Ambient Lighting -->
        <div id="mobile-portfolio-card" class="glass-card p-3.5 rounded-2xl flex flex-col gap-2 shrink-0">
          <div class="flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-xs font-bold text-white">Portfolio Trend</h3>
              <span class="text-[9px] text-outline">Net shareholdings</span>
            </div>
            <div class="chart-toggle-group flex gap-0.5" id="mobile-time-toggle">
              <button class="chart-toggle active text-[9px] px-2 py-0.5" data-range="1M">1M</button>
              <button class="chart-toggle text-[9px] px-2 py-0.5" data-range="3M">3M</button>
              <button class="chart-toggle text-[9px] px-2 py-0.5" data-range="1Y">1Y</button>
              <button class="chart-toggle text-[9px] px-2 py-0.5" data-range="ALL">All</button>
            </div>
          </div>
          <div class="chart-body h-[240px] w-full relative">
            <canvas id="mobile-portfolio-canvas"></canvas>
          </div>
        </div>

        <!-- Recent Filings Card (6 entries, stops +5px above nav bar) -->
        <div id="mobile-activity-card" class="glass-card p-3 rounded-2xl flex flex-col gap-1.5 shrink-0">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-white">Recent Bursa Filings</h3>
            <span class="text-[9px] text-outline">Latest notices</span>
          </div>
          <div class="space-y-1.5" id="mobile-activity-feed"></div>
        </div>
      </div>
    `;
  }

  function renderMobileHoldings(data = getRawData()) {
    const holdings = data?.holdings || [];
    const sectors = ['all', ...new Set(holdings.map(h => h.sector))];

    return `
      <div id="mobile-panel-holdings" class="flex flex-col gap-3.5 w-full pb-24 pt-1">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-extrabold text-white tracking-tight">Portfolio Holdings</h2>
            <span class="text-[10px] text-outline">${holdings.length} domestic equity assets</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20" id="mobile-holdings-count">${holdings.length}</span>
        </div>

        <!-- 2 Mobile Interactive Donut Pie Chart Cards -->
        <div class="grid grid-cols-1 gap-3 shrink-0">
          <!-- Allocation by Company -->
          <div class="glass-card p-3.5 rounded-2xl flex flex-col justify-between" id="mobile-pie-company-card">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-xs font-bold text-white tracking-tight">Allocation by Company</h3>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">Top 10</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="relative w-[115px] h-[115px] shrink-0 flex items-center justify-center">
                <canvas id="mobile-pie-company-canvas" class="w-full h-full"></canvas>
              </div>
              <div class="flex-1 min-w-0 space-y-1" id="mobile-pie-company-legend"></div>
            </div>
          </div>

          <!-- Allocation by Sector -->
          <div class="glass-card p-3.5 rounded-2xl flex flex-col justify-between" id="mobile-pie-sector-card">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-xs font-bold text-white tracking-tight">Allocation by Sector</h3>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">Macro</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="relative w-[115px] h-[115px] shrink-0 flex items-center justify-center">
                <canvas id="mobile-pie-sector-canvas" class="w-full h-full"></canvas>
              </div>
              <div class="flex-1 min-w-0 space-y-1" id="mobile-pie-sector-legend"></div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <input type="text" id="mobile-holdings-search" placeholder="Search ticker or company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 shadow-inner">
            <button id="mobile-holdings-clear-search-btn" class="hidden absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-white p-1 text-xs transition-colors" title="Clear search">✕</button>
          </div>
          <button id="mobile-holdings-clear-filter-btn" class="hidden items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 shrink-0 transition-all shadow-sm">
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span>Clear Filter</span>
          </button>
        </div>

        <div class="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar no-scrollbar" id="mobile-sector-pills">
          ${sectors.map(s => `
            <button class="sector-pill whitespace-nowrap px-3 py-1 rounded-lg text-[11px] border transition-all ${s === 'all' ? 'active bg-primary/20 text-primary border-primary/30 font-semibold' : 'bg-white/[0.04] text-outline border-white/10'}" data-sector="${s}">
              ${s === 'all' ? 'All Sectors' : s}
            </button>
          `).join('')}
        </div>

        <div class="space-y-2 mt-0.5" id="mobile-holdings-list"></div>
      </div>
    `;
  }

  function renderMobileReturns() {
    return `
      <div id="mobile-panel-returns" class="flex flex-col gap-2.5 w-full py-1 overflow-hidden">
        <div id="mobile-returns-chart-card" class="glass-card p-3 rounded-xl flex flex-col gap-2 shrink-0">
          <div class="flex justify-between items-center">
            <h3 class="text-xs font-bold text-white tracking-tight">Net Capital Activity</h3>
            <div class="chart-toggle-group flex gap-0.5" id="mobile-returns-toggle">
              <button class="chart-toggle active text-[9px] px-2 py-0.5" data-view="net">Net</button>
              <button class="chart-toggle text-[9px] px-2 py-0.5" data-view="acquired">Buy</button>
              <button class="chart-toggle text-[9px] px-2 py-0.5" data-view="disposed">Sell</button>
            </div>
          </div>
          <div class="chart-toggle-group flex gap-0.5 self-start" id="mobile-returns-time-toggle">
            <button class="chart-toggle active text-[9px] px-2 py-0.5" data-range="1M">1M</button>
            <button class="chart-toggle text-[9px] px-2 py-0.5" data-range="3M">3M</button>
            <button class="chart-toggle text-[9px] px-2 py-0.5" data-range="1Y">1Y</button>
            <button class="chart-toggle text-[9px] px-2 py-0.5" data-range="ALL">All</button>
          </div>
          <div class="chart-body h-[175px] w-full relative overflow-hidden">
            <canvas id="mobile-returns-canvas"></canvas>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 shrink-0" id="mobile-returns-summary"></div>
      </div>
    `;
  }

  function renderMobileTransactions() {
    return `
      <div id="mobile-panel-transactions" class="flex flex-col gap-3.5 w-full pb-16 pt-1">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-extrabold text-white tracking-tight">EPF Transactions</h2>
            <span class="text-[10px] text-outline">Substantial Shareholder Notices</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20" id="mobile-tx-count">${allTransactions.length}</span>
        </div>

        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <input type="text" id="mobile-tx-search" placeholder="Search stock or company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 shadow-inner">
            <button id="mobile-tx-clear-search-btn" class="hidden absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-white p-1 text-xs transition-colors" title="Clear search">✕</button>
          </div>
          <button id="mobile-tx-clear-filter-btn" class="hidden items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 shrink-0 transition-all shadow-sm">
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span>Clear Filter</span>
          </button>
        </div>

        <div class="flex gap-1.5" id="mobile-tx-type-pills">
          <button class="tx-type-pill flex-1 py-1.5 rounded-lg text-xs font-semibold border border-primary/30 bg-primary/20 text-primary active" data-type="all">All</button>
          <button class="tx-type-pill flex-1 py-1.5 rounded-lg text-xs font-semibold border border-white/10 bg-white/[0.04] text-outline" data-type="Acquired">Acquired</button>
          <button class="tx-type-pill flex-1 py-1.5 rounded-lg text-xs font-semibold border border-white/10 bg-white/[0.04] text-outline" data-type="Disposed">Disposed</button>
        </div>

        <div class="space-y-2 mt-0.5" id="mobile-tx-feed"></div>
      </div>
    `;
  }

  function renderMobileRecentFilings() {
    const feed = document.getElementById('mobile-activity-feed');
    if (!feed) return;
    const latest = allTransactions.slice(0, 6);
    feed.innerHTML = latest.map(tx => {
      const isBuy = tx.type === 'Acquired';
      const sign = isBuy ? '+' : '-';
      const color = isBuy ? 'text-emerald-400' : 'text-rose-400';
      return `
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div class="flex items-center gap-2 min-w-0">
            <div class="shrink-0">${renderStockLogo(tx.stock, tx.company, 24)}</div>
            <div class="min-w-0">
              <div class="font-bold text-xs text-white truncate">${tx.stock}</div>
              <div class="text-[9px] text-outline truncate">${tx.company}</div>
            </div>
          </div>
          <div class="text-right shrink-0 ml-2 font-mono-numeric">
            <div class="text-xs font-bold ${color}">${sign}${tx.amount.toLocaleString()}</div>
            <div class="text-[8px] text-outline">${tx.date}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function applyScrollLock(tab) {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      if (tab === 'returns') {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.documentElement.classList.add('mobile-locked');
        document.body.classList.add('mobile-locked');
        const root = document.getElementById('app-root');
        if (root) {
          root.classList.add('overflow-hidden', 'h-screen', 'max-h-screen');
          root.classList.remove('min-h-screen');
        }
        const mobLayout = document.getElementById('mobile-app-layout');
        if (mobLayout) {
          mobLayout.classList.add('overflow-hidden', 'h-screen', 'max-h-screen');
          mobLayout.classList.remove('min-h-screen', 'h-auto');
        }
        const mobContainer = document.getElementById('mobile-view-container');
        if (mobContainer) {
          mobContainer.classList.add('overflow-hidden', 'h-full');
          mobContainer.classList.remove('overflow-y-auto');
        }
      } else {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.height = 'auto';
        document.body.style.height = 'auto';
        document.documentElement.classList.remove('mobile-locked');
        document.body.classList.remove('mobile-locked');
        const root = document.getElementById('app-root');
        if (root) {
          root.classList.remove('overflow-hidden', 'h-screen', 'max-h-screen');
          root.classList.add('min-h-screen');
        }
        const mobLayout = document.getElementById('mobile-app-layout');
        if (mobLayout) {
          mobLayout.classList.remove('overflow-hidden', 'h-screen', 'max-h-screen');
          mobLayout.classList.remove('min-h-screen');
          mobLayout.classList.add('h-auto');
        }
        const mobContainer = document.getElementById('mobile-view-container');
        if (mobContainer) {
          mobContainer.classList.remove('overflow-hidden', 'h-full');
          mobContainer.classList.add('overflow-y-auto');
        }
      }
      return;
    }

    // DESKTOP: Full viewport lock for all tabs (zero window scrollbar, tables scroll internally)
    document.documentElement.classList.remove('mobile-locked');
    document.body.classList.remove('mobile-locked');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const mainPane = document.getElementById('desktop-main-pane');
    if (mainPane) {
      mainPane.classList.add('overflow-hidden', 'h-screen');
      mainPane.classList.remove('overflow-y-auto');
    }
    const viewContainer = document.getElementById('desktop-view-container');
    if (viewContainer) {
      viewContainer.classList.add('overflow-hidden', 'h-full');
      viewContainer.classList.remove('overflow-y-auto');
    }
  }

  // ----------------------------------------------------
  // 8. MASTER APP ORCHESTRATOR
  // ----------------------------------------------------
  let allTransactions = [];
  let currentDeviceMode = null;
  let lastMeasuredWidth = window.innerWidth;

  function initApp() {
    try {
      allTransactions = flattenTransactions(getRawData());
      mountApp();

      // Explicit visitor tracking (SDK)
      const isMob = window.innerWidth < 768;
      trackAnalytics('$pageview', {
        $current_url: window.location.href,
        device: isMob ? 'mobile' : 'desktop',
        is_ios: /iPad|iPhone|iPod/i.test(navigator.userAgent)
      });

      // Redundant HTTPS Beacon fallback (guarantees record even if SDK encounters tracking blockers)
      try {
        const anonId = window.posthog?.get_distinct_id?.() || 'anon_' + Math.random().toString(36).slice(2);
        fetch('https://us.i.posthog.com/capture/', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: 'phc_sn6didtESTQzQe6HTLNuc5AkrcHuzxGGY97q9kBPzvVd',
            event: '$pageview',
            distinct_id: anonId,
            properties: {
              $current_url: window.location.href,
              device: isMob ? 'mobile' : 'desktop',
              is_ios: /iPad|iPhone|iPod/i.test(navigator.userAgent)
            }
          })
        }).catch(() => {});
      } catch (_) {}

      store.subscribe((state, prev) => {
        try {
          if (state.isMobile !== prev.isMobile) {
            mountApp();
          } else if (state.activeTab !== prev.activeTab) {
            handleTabSwitch(state.activeTab);
          }
        } catch (subErr) {
          console.error('[EPF Tracker] State subscription error:', subErr);
        }
      });

      // ONLY resize chart on true horizontal screen orientation or window width resize (NOT on vertical scroll!)
      window.addEventListener('resize', debounce(() => {
        const curW = window.innerWidth;
        if (Math.abs(curW - lastMeasuredWidth) > 5) {
          lastMeasuredWidth = curW;
          const isMob = curW < 768;
          if ((isMob ? 'mobile' : 'desktop') !== currentDeviceMode) {
            store.setState({ isMobile: isMob });
          } else {
            redrawActiveCharts(false); // Render final frame immediately, ZERO reanimation!
          }
        }
      }, 150));
    } catch (fatalErr) {
      console.error('[EPF Tracker] Fatal init error:', fatalErr);
      const root = document.getElementById('app-root');
      if (root) {
        root.innerHTML = `<div class="p-6 text-white text-center flex flex-col items-center justify-center min-h-screen"><h2 class="text-xl font-bold mb-2 text-rose-400">Error Loading Dashboard</h2><p class="text-xs text-outline font-mono max-w-md">${escapeHTML(fatalErr.message || fatalErr)}</p><button onclick="location.reload()" class="mt-4 px-4 py-2 bg-primary rounded-xl text-xs font-bold text-white shadow-lg">Reload App</button></div>`;
      }
    }
  }

  function mountApp() {
    const isMobile = window.innerWidth < 768;
    currentDeviceMode = isMobile ? 'mobile' : 'desktop';
    const root = document.getElementById('app-root');
    if (!root) return;

    const state = store.getState();

    if (isMobile) {
      root.innerHTML = `
        <div class="w-full bg-page text-on-surface flex flex-col" id="mobile-app-layout">
          <header class="h-12 bg-surface/90 backdrop-blur-xl border-b border-white/10 flex items-center px-4 sticky top-0 z-40 shrink-0 shadow-lg" id="mobile-header">
            <div class="flex items-center gap-2">
              <img src="assets/logo.png" alt="EPF Logo" class="h-7 w-7 object-contain filter drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
              <div class="flex items-center gap-1">
                <span class="font-extrabold text-base text-white tracking-tight">EPF</span>
                <span class="font-extrabold text-base text-primary tracking-tight">Tracker</span>
              </div>
            </div>
          </header>
          <main class="w-full max-w-lg mx-auto flex flex-col px-3">
            <div id="mobile-view-container" class="w-full flex flex-col">
              ${renderMobileViewContent(state.activeTab)}
            </div>
          </main>
          ${renderMobileNav(state.activeTab)}
          ${renderPostHogSurveyWidget(true)}
        </div>
      `;
      bindMobileEvents();
      bindSurveyEvents();
      applyScrollLock(state.activeTab);
      requestAnimationFrame(() => renderActiveMobileTab(state.activeTab, true));
    } else {
      root.innerHTML = `
        <div class="flex h-screen overflow-hidden bg-page text-on-surface" id="desktop-app-layout">
          ${renderDesktopNav(state.activeTab)}
          <div class="ml-64 flex-1 flex flex-col h-screen overflow-hidden p-5 mx-auto w-full max-w-[1440px]" id="desktop-main-pane">
            <main id="desktop-view-container" class="w-full flex-1 flex flex-col justify-between overflow-hidden">
              ${renderDesktopViewContent(state.activeTab)}
            </main>
          </div>
          ${renderPostHogSurveyWidget(false)}
        </div>
      `;
      bindDesktopEvents();
      bindSurveyEvents();
      applyScrollLock(state.activeTab);
      requestAnimationFrame(() => renderActiveDesktopTab(state.activeTab, true));
    }
  }

  function renderDesktopViewContent(tab) {
    switch (tab) {
      case 'holdings': return renderDesktopHoldings();
      case 'returns': return renderDesktopReturns();
      case 'transactions': return renderDesktopTransactions();
      default: return renderDesktopDashboard();
    }
  }

  function bindDesktopEvents() {
    document.querySelectorAll('#desktop-tab-nav .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        if (tab) store.setState({ activeTab: tab });
      });
    });

    const state = store.getState();
    if (state.activeTab === 'dashboard') {
      const toggle = document.getElementById('time-toggle');
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          const btn = e.target.closest('.chart-toggle');
          if (!btn) return;
          document.querySelectorAll('#time-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          store.setState({ portfolioRange: btn.dataset.range });
          updateDesktopPortfolioChart(btn.dataset.range, true); // Animate on explicit toggle click
        });
      }
      const holdingCard = document.getElementById('bento-holding-card');
      if (holdingCard) holdingCard.addEventListener('click', () => store.setState({ activeTab: 'holdings' }));
      const activeCard = document.getElementById('bento-active-card');
      if (activeCard) activeCard.addEventListener('click', () => store.setState({ activeTab: 'holdings' }));
    } else if (state.activeTab === 'holdings') {
      const searchInput = document.getElementById('holdings-search');
      if (searchInput) searchInput.addEventListener('input', filterDesktopHoldings);
      const searchClear = document.getElementById('holdings-clear-search-btn');
      if (searchClear) {
        searchClear.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          filterDesktopHoldings();
        });
      }
      const sectorFilter = document.getElementById('holdings-sector-filter');
      if (sectorFilter) sectorFilter.addEventListener('change', filterDesktopHoldings);
      const clearBtn = document.getElementById('holdings-clear-filter-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (sectorFilter) sectorFilter.value = 'all';
          updateLegendActiveState('pie-company-legend', 'all');
          updateLegendActiveState('pie-sector-legend', 'all');
          filterDesktopHoldings();
        });
      }
    } else if (state.activeTab === 'returns') {
      const rTimeToggle = document.getElementById('returns-time-toggle');
      if (rTimeToggle) {
        rTimeToggle.addEventListener('click', (e) => {
          const btn = e.target.closest('.chart-toggle');
          if (!btn) return;
          document.querySelectorAll('#returns-time-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          store.setState({ returnsRange: btn.dataset.range });
          updateDesktopReturnsChart(true);
        });
      }
      const rToggle = document.getElementById('returns-toggle');
      if (rToggle) {
        rToggle.addEventListener('click', (e) => {
          const btn = e.target.closest('.chart-toggle');
          if (!btn) return;
          document.querySelectorAll('#returns-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          store.setState({ returnsView: btn.dataset.view });
          updateDesktopReturnsChart(true);
        });
      }
    } else if (state.activeTab === 'transactions') {
      const txSearch = document.getElementById('tx-search');
      if (txSearch) txSearch.addEventListener('input', filterDesktopTransactions);
      const txSearchClear = document.getElementById('tx-clear-search-btn');
      if (txSearchClear) {
        txSearchClear.addEventListener('click', () => {
          if (txSearch) txSearch.value = '';
          filterDesktopTransactions();
        });
      }
      const txType = document.getElementById('tx-filter-type');
      if (txType) txType.addEventListener('change', filterDesktopTransactions);
      const txClearBtn = document.getElementById('tx-clear-filter-btn');
      if (txClearBtn) {
        txClearBtn.addEventListener('click', () => {
          if (txSearch) txSearch.value = '';
          if (txType) txType.value = 'all';
          filterDesktopTransactions();
        });
      }
    }
  }

  function renderActiveDesktopTab(tab, animate = false) {
    if (tab === 'dashboard') {
      updateDesktopPortfolioChart(store.getState().portfolioRange, animate);
      renderDesktopRecentFilings();
      setupLineChartHover('portfolio-canvas');
    } else if (tab === 'holdings') {
      const cData = getPieData('company');
      const sData = getPieData('sector');
      drawPieChart('pie-company-canvas', cData, 'company');
      drawPieChart('pie-sector-canvas', sData, 'sector');
      renderPieLegend('pie-company-legend', cData);
      renderPieLegend('pie-sector-legend', sData);
      setupPieInteractivity('pie-company-canvas', 'pie-company-legend', 'company');
      setupPieInteractivity('pie-sector-canvas', 'pie-sector-legend', 'sector');
      filterDesktopHoldings();
    } else if (tab === 'returns') {
      updateDesktopReturnsChart(animate);
      renderDesktopReturnsSummary();
      setupBarChartHover('returns-canvas', (barData) => {
        store.setState({ activeTab: 'transactions' });
        setTimeout(() => {
          const input = document.getElementById('tx-search');
          if (input && barData?.label) {
            input.value = barData.label;
            filterDesktopTransactions();
          }
        }, 60);
      });
    } else if (tab === 'transactions') {
      filterDesktopTransactions();
    }
  }

  function updateDesktopPortfolioChart(range, animate = false) {
    const series = getPortfolioTimeSeries(range);
    drawLineChart('portfolio-canvas', series, null, animate);
    const lastVal = series.length > 0 ? series[series.length - 1].value : 0;
    const disp = document.getElementById('portfolio-value-display');
    if (disp) disp.textContent = `${formatCompact(lastVal)} shares (net)`;
  }

  function updateDesktopReturnsChart(animate = false) {
    const { returnsView, returnsRange } = store.getState();
    const data = getReturnsData(returnsView, returnsRange);
    drawBarChart('returns-canvas', data, animate);
  }

  function renderDesktopRecentFilings() {
    const feed = document.getElementById('bento-activity-feed');
    if (!feed) return;
    const latest = allTransactions.slice(0, 50);
    feed.innerHTML = latest.map(tx => {
      const isBuy = tx.type === 'Acquired';
      const sign = isBuy ? '+' : '-';
      const color = isBuy ? 'text-emerald-400' : 'text-rose-400';
      return `
        <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer filing-item" data-stock="${tx.stock}">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">${renderStockLogo(tx.stock, tx.company, 32)}</div>
            <div class="min-w-0">
              <div class="font-bold text-xs text-white truncate">${tx.stock}</div>
              <div class="text-[11px] text-outline truncate">${tx.company}</div>
            </div>
          </div>
          <div class="text-right shrink-0 ml-2 font-mono-numeric">
            <div class="text-xs font-bold ${color}">${sign}${tx.amount.toLocaleString()}</div>
            <div class="text-[10px] text-outline">${tx.date}</div>
          </div>
        </div>
      `;
    }).join('');

    feed.querySelectorAll('.filing-item').forEach(item => {
      item.addEventListener('click', () => {
        store.setState({ activeTab: 'transactions' });
      });
    });
  }

  function filterDesktopHoldings() {
    const searchInput = document.getElementById('holdings-search');
    const search = (searchInput?.value || '').toLowerCase().trim();
    const sector = document.getElementById('holdings-sector-filter')?.value || 'all';
    const holdings = getRawData()?.holdings || [];

    // Toggle clear filter buttons
    const hasFilter = search !== '' || sector !== 'all';
    const clearBtn = document.getElementById('holdings-clear-filter-btn');
    if (clearBtn) {
      clearBtn.classList.toggle('hidden', !hasFilter);
      clearBtn.classList.toggle('flex', hasFilter);
    }
    const searchClear = document.getElementById('holdings-clear-search-btn');
    if (searchClear) {
      searchClear.classList.toggle('hidden', search === '');
    }

    const totalMarketVal = holdings.reduce((s, h) => s + (h.market_value || 0), 0);
    const filtered = holdings.filter(h => {
      const matchSearch = !search || h.stock_name.toLowerCase().includes(search) || h.company_name.toLowerCase().includes(search);
      const matchSector = sector === 'all' || h.sector === sector;
      return matchSearch && matchSector;
    });

    const tbody = document.getElementById('holdings-tbody');
    if (!tbody) return;

    tbody.innerHTML = filtered.map((h, i) => {
      const pctPort = totalMarketVal > 0 ? ((h.market_value / totalMarketVal) * 100).toFixed(3) : '0.000';
      return `
        <tr class="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04]">
          <td class="py-3 px-3 text-outline font-mono">${i + 1}</td>
          <td class="py-3 px-3">
            <div class="flex items-center gap-2.5">
              ${renderStockLogo(h.stock_name, h.company_name, 28)}
              <a href="${getKlseLink(h.stock_name, h.company_name)}" target="_blank" rel="noopener noreferrer" class="font-bold text-white hover:text-primary transition-colors">${h.stock_name}</a>
            </div>
          </td>
          <td class="py-3 px-3 text-on-surface-variant font-medium truncate max-w-[200px]">${h.company_name}</td>
          <td class="py-3 px-3 text-outline">${h.sector}</td>
          <td class="py-3 px-3 text-right font-mono font-semibold text-white">${h.price?.toFixed(2) || '0.00'}</td>
          <td class="py-3 px-3 text-right font-mono text-on-surface-variant">${h.total_securities?.toLocaleString() || '0'}</td>
          <td class="py-3 px-3 text-right font-mono font-bold text-white">${formatCurrency(h.market_value)}</td>
          <td class="py-3 px-3 text-right font-mono font-semibold text-emerald-400">${h.direct_percent?.toFixed(3) || '0.000'}%</td>
          <td class="py-3 px-3 text-right font-mono font-semibold text-primary">${pctPort}%</td>
        </tr>
      `;
    }).join('');

    const countBadge = document.getElementById('holdings-count');
    if (countBadge) countBadge.textContent = filtered.length;
  }

  function renderDesktopReturnsSummary() {
    const dates = Object.values(getRawData()?.txByDate || {});
    const totalAcquired = dates.reduce((s, d) => s + d.acquired, 0);
    const totalDisposed = dates.reduce((s, d) => s + d.disposed, 0);
    const totalNet = totalAcquired - totalDisposed;
    const totalTx = dates.reduce((s, d) => s + d.count, 0);

    const container = document.getElementById('returns-summary');
    if (!container) return;

    container.innerHTML = `
      <div class="returns-stat-card">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Total Acquired</span>
          <div class="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            ${ICONSTACK.trending_up}
          </div>
        </div>
        <div class="my-2">
          <div class="text-xl font-extrabold text-emerald-400 font-mono-numeric">+${formatCompact(totalAcquired)}</div>
        </div>
        <span class="text-xs text-outline">Accumulation volume</span>
      </div>

      <div class="returns-stat-card">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Total Disposed</span>
          <div class="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            ${ICONSTACK.trending_down}
          </div>
        </div>
        <div class="my-2">
          <div class="text-xl font-extrabold text-rose-400 font-mono-numeric">-${formatCompact(totalDisposed)}</div>
        </div>
        <span class="text-xs text-outline">Divestment volume</span>
      </div>

      <div class="returns-stat-card">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Net Momentum</span>
          <div class="h-7 w-7 rounded-lg ${totalNet >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-white/10 flex items-center justify-center shrink-0">
            ${ICONSTACK.account_balance}
          </div>
        </div>
        <div class="my-2">
          <div class="text-xl font-extrabold ${totalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-mono-numeric">${totalNet >= 0 ? '+' : ''}${formatCompact(totalNet)}</div>
        </div>
        <span class="text-xs text-outline">Net shares flow</span>
      </div>

      <div class="returns-stat-card">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Total Filings</span>
          <div class="h-7 w-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            ${ICONSTACK.receipt_long}
          </div>
        </div>
        <div class="my-2">
          <div class="text-xl font-extrabold text-white font-mono-numeric">${totalTx.toLocaleString()}</div>
        </div>
        <span class="text-xs text-outline">Recorded filings</span>
      </div>

      <div class="returns-stat-card">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Tracked Stocks</span>
          <div class="h-7 w-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            ${ICONSTACK.category}
          </div>
        </div>
        <div class="my-2">
          <div class="text-xl font-extrabold text-white font-mono-numeric">${getRawData()?.uniqueStocks || 260}</div>
        </div>
        <span class="text-xs text-outline">Bursa equities</span>
      </div>

      <div class="returns-stat-card">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Trade Days</span>
          <div class="h-7 w-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            ${ICONSTACK.calendar_month}
          </div>
        </div>
        <div class="my-2">
          <div class="text-xl font-extrabold text-white font-mono-numeric">${dates.length}</div>
        </div>
        <span class="text-xs text-outline">Active sessions</span>
      </div>
    `;
  }

  // Desktop transactions infinite scroll state
  let desktopTxFiltered = [];
  let desktopTxRenderedCount = 0;
  const DESKTOP_TX_BATCH_SIZE = 50;
  let desktopTxObserver = null;
  let isDesktopTxLoading = false;

  function renderDesktopTransactionRow(tx) {
    const isBuy = tx.type === 'Acquired';
    const badgeClass = isBuy ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return `
      <tr class="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04]">
        <td class="py-3 px-3 text-outline font-mono text-[11px] whitespace-nowrap">${tx.date}</td>
        <td class="py-3 px-3">
          <div class="flex items-center gap-2">
            ${renderStockLogo(tx.stock, tx.company, 24)}
            <span class="font-bold text-white">${tx.stock}</span>
          </div>
        </td>
        <td class="py-3 px-3 text-on-surface-variant font-medium truncate max-w-[200px]">${tx.company}</td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeClass}">${tx.type}</span>
        </td>
        <td class="py-3 px-3 text-right font-mono font-bold ${isBuy ? 'text-emerald-400' : 'text-rose-400'}">${isBuy ? '+' : '-'}${tx.amount.toLocaleString()}</td>
        <td class="py-3 px-3 text-right font-mono text-outline">${tx.percent ? tx.percent.toFixed(3) + '%' : '-'}</td>
        <td class="py-3 px-3 text-right font-mono font-bold text-white">${tx.total ? tx.total.toLocaleString() : '-'}</td>
        <td class="py-3 px-3 text-center">
          <a href="${tx.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center p-1 rounded-lg text-outline hover:text-primary transition-colors">
            <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </td>
      </tr>
    `;
  }

  function setupDesktopIntersectionObserver() {
    if (desktopTxObserver) {
      desktopTxObserver.disconnect();
      desktopTxObserver = null;
    }
    const sentinel = document.getElementById('tx-desktop-sentinel');
    const scrollWrapper = document.getElementById('tx-table-scroll') || document.querySelector('#desktop-panel-transactions .table-scroll-wrapper');
    if (!sentinel || !scrollWrapper) return;

    desktopTxObserver = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        renderMoreDesktopTransactions();
      }
    }, {
      root: scrollWrapper,
      rootMargin: '300px'
    });
    desktopTxObserver.observe(sentinel);
  }

  function bindDesktopTxScroll() {
    const scrollWrapper = document.getElementById('tx-table-scroll') || document.querySelector('#desktop-panel-transactions .table-scroll-wrapper');
    if (!scrollWrapper) return;

    if (!scrollWrapper.dataset.scrollBound) {
      scrollWrapper.dataset.scrollBound = 'true';
      scrollWrapper.addEventListener('scroll', () => {
        if (scrollWrapper.scrollTop + scrollWrapper.clientHeight >= scrollWrapper.scrollHeight - 300) {
          renderMoreDesktopTransactions();
        }
      }, { passive: true });
    }
  }

  function renderMoreDesktopTransactions() {
    const tbody = document.getElementById('tx-tbody');
    if (!tbody || isDesktopTxLoading) return;
    if (desktopTxRenderedCount >= desktopTxFiltered.length) return;

    isDesktopTxLoading = true;

    // Clean up existing sentinel & archive prompt
    const existingSentinel = document.getElementById('tx-desktop-sentinel');
    if (existingSentinel) existingSentinel.remove();
    const existingArchive = document.getElementById('tx-desktop-archive-row');
    if (existingArchive) existingArchive.remove();

    const start = desktopTxRenderedCount;
    const end = Math.min(start + DESKTOP_TX_BATCH_SIZE, desktopTxFiltered.length);
    const chunk = desktopTxFiltered.slice(start, end);
    desktopTxRenderedCount = end;

    const html = chunk.map(renderDesktopTransactionRow).join('');
    tbody.insertAdjacentHTML('beforeend', html);

    if (desktopTxRenderedCount < desktopTxFiltered.length) {
      const sentinelHtml = `
        <tr id="tx-desktop-sentinel">
          <td colspan="8" class="py-4 text-center text-xs text-outline font-medium">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span class="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Loaded ${desktopTxRenderedCount} of ${desktopTxFiltered.length.toLocaleString()} filings • Scroll down for more</span>
            </div>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', sentinelHtml);
      setupDesktopIntersectionObserver();
    } else {
      if (allTransactions.length <= 3500) {
        const archiveHtml = `
          <tr id="tx-desktop-archive-row">
            <td colspan="8" class="py-4 text-center">
              <div class="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-outline text-xs">
                <span>Showing all ${desktopTxFiltered.length.toLocaleString()} recent filings (May - Sep 2026)</span>
                <button id="btn-load-full-archive" class="px-3 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-semibold cursor-pointer transition-colors flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>Load Complete Historical Archive (122,381 Filings)</span>
                </button>
              </div>
            </td>
          </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', archiveHtml);
        const btn = document.getElementById('btn-load-full-archive');
        if (btn) btn.addEventListener('click', loadFullHistoricalArchive);
      } else {
        const endNotice = `
          <tr id="tx-desktop-end-row">
            <td colspan="8" class="py-3 text-center text-xs text-outline font-medium">
              <span>All ${desktopTxFiltered.length.toLocaleString()} filings displayed</span>
            </td>
          </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', endNotice);
      }
    }

    isDesktopTxLoading = false;
  }

  function filterDesktopTransactions(reset = true) {
    const txSearchInput = document.getElementById('tx-search');
    const search = (txSearchInput?.value || '').toLowerCase().trim();
    const type = document.getElementById('tx-filter-type')?.value || 'all';

    // Toggle clear filter buttons
    const hasFilter = search !== '' || type !== 'all';
    const clearBtn = document.getElementById('tx-clear-filter-btn');
    if (clearBtn) {
      clearBtn.classList.toggle('hidden', !hasFilter);
      clearBtn.classList.toggle('flex', hasFilter);
    }
    const searchClear = document.getElementById('tx-clear-search-btn');
    if (searchClear) {
      searchClear.classList.toggle('hidden', search === '');
    }

    desktopTxFiltered = allTransactions.filter(tx => {
      const matchSearch = !search || tx.stock.toLowerCase().includes(search) || tx.company.toLowerCase().includes(search) || (tx.date && tx.date.toLowerCase().includes(search));
      const matchType = type === 'all' || tx.type === type;
      return matchSearch && matchType;
    });

    const tbody = document.getElementById('tx-tbody');
    if (!tbody) return;

    const shouldReset = reset !== false;
    if (shouldReset) {
      desktopTxRenderedCount = 0;
      tbody.innerHTML = '';
      const scrollWrapper = document.getElementById('tx-table-scroll') || document.querySelector('#desktop-panel-transactions .table-scroll-wrapper');
      if (scrollWrapper) scrollWrapper.scrollTop = 0;
    }

    renderMoreDesktopTransactions();
    bindDesktopTxScroll();

    const countBadge = document.getElementById('tx-count');
    if (countBadge) countBadge.textContent = desktopTxFiltered.length.toLocaleString();
  }

  // ----------------------------------------------------
  // 9. MOBILE VIEW CONTROLLER (SET B)
  // ----------------------------------------------------
  function renderMobileViewContent(tab) {
    switch (tab) {
      case 'holdings': return renderMobileHoldings();
      case 'returns': return renderMobileReturns();
      case 'transactions': return renderMobileTransactions();
      default: return renderMobileDashboard();
    }
  }

  function bindMobileEvents() {
    document.querySelectorAll('#mobile-tab-nav .mobile-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        if (tab) store.setState({ activeTab: tab });
      });
    });

    const state = store.getState();
    if (state.activeTab === 'dashboard') {
      const toggle = document.getElementById('mobile-time-toggle');
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          const btn = e.target.closest('.chart-toggle');
          if (!btn) return;
          document.querySelectorAll('#mobile-time-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          store.setState({ portfolioRange: btn.dataset.range });
          updateMobilePortfolioChart(btn.dataset.range, true); // Animate on toggle click
        });
      }
      const holdingCard = document.getElementById('mobile-bento-holding-card');
      if (holdingCard) holdingCard.addEventListener('click', () => store.setState({ activeTab: 'holdings' }));
      const sectorCard = document.getElementById('mobile-bento-sector-card');
      if (sectorCard) sectorCard.addEventListener('click', () => store.setState({ activeTab: 'holdings' }));
    } else if (state.activeTab === 'holdings') {
      const search = document.getElementById('mobile-holdings-search');
      if (search) search.addEventListener('input', filterMobileHoldings);
      const searchClear = document.getElementById('mobile-holdings-clear-search-btn');
      if (searchClear) {
        searchClear.addEventListener('click', () => {
          if (search) search.value = '';
          filterMobileHoldings();
        });
      }
      const clearBtn = document.getElementById('mobile-holdings-clear-filter-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (search) search.value = '';
          store.setState({ holdingsSector: 'all' });
          document.querySelectorAll('#mobile-sector-pills .sector-pill').forEach(b => {
            const match = b.dataset.sector === 'all';
            b.classList.toggle('active', match);
            b.classList.toggle('bg-primary/20', match);
            b.classList.toggle('text-primary', match);
            b.classList.toggle('border-primary/30', match);
            b.classList.toggle('font-semibold', match);
            b.classList.toggle('bg-white/[0.04]', !match);
            b.classList.toggle('text-outline', !match);
            b.classList.toggle('border-white/10', !match);
          });
          updateLegendActiveState('mobile-pie-company-legend', 'all');
          updateLegendActiveState('mobile-pie-sector-legend', 'all');
          filterMobileHoldings();
        });
      }

      const pills = document.getElementById('mobile-sector-pills');
      if (pills) {
        pills.addEventListener('click', (e) => {
          const btn = e.target.closest('.sector-pill');
          if (!btn) return;
          document.querySelectorAll('#mobile-sector-pills .sector-pill').forEach(b => {
            b.classList.remove('active', 'bg-primary/20', 'text-primary', 'border-primary/30', 'font-semibold');
            b.classList.add('bg-white/[0.04]', 'text-outline', 'border-white/10');
          });
          btn.classList.add('active', 'bg-primary/20', 'text-primary', 'border-primary/30', 'font-semibold');
          btn.classList.remove('bg-white/[0.04]', 'text-outline', 'border-white/10');
          store.setState({ holdingsSector: btn.dataset.sector });
          filterMobileHoldings();
        });
      }
    } else if (state.activeTab === 'returns') {
      const rTime = document.getElementById('mobile-returns-time-toggle');
      if (rTime) {
        rTime.addEventListener('click', (e) => {
          const btn = e.target.closest('.chart-toggle');
          if (!btn) return;
          document.querySelectorAll('#mobile-returns-time-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          store.setState({ returnsRange: btn.dataset.range });
          updateMobileReturnsChart(true);
        });
      }
      const rToggle = document.getElementById('mobile-returns-toggle');
      if (rToggle) {
        rToggle.addEventListener('click', (e) => {
          const btn = e.target.closest('.chart-toggle');
          if (!btn) return;
          document.querySelectorAll('#mobile-returns-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          store.setState({ returnsView: btn.dataset.view });
          updateMobileReturnsChart(true);
        });
      }
    } else if (state.activeTab === 'transactions') {
      const search = document.getElementById('mobile-tx-search');
      if (search) search.addEventListener('input', filterMobileTransactions);
      const searchClear = document.getElementById('mobile-tx-clear-search-btn');
      if (searchClear) {
        searchClear.addEventListener('click', () => {
          if (search) search.value = '';
          filterMobileTransactions();
        });
      }
      const clearBtn = document.getElementById('mobile-tx-clear-filter-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (search) search.value = '';
          store.setState({ txType: 'all' });
          document.querySelectorAll('#mobile-tx-type-pills .tx-type-pill').forEach(b => {
            const match = b.dataset.type === 'all';
            b.classList.toggle('active', match);
            b.classList.toggle('border-primary/30', match);
            b.classList.toggle('bg-primary/20', match);
            b.classList.toggle('text-primary', match);
            b.classList.toggle('border-white/10', !match);
            b.classList.toggle('bg-white/[0.04]', !match);
            b.classList.toggle('text-outline', !match);
          });
          filterMobileTransactions();
        });
      }

      const pills = document.getElementById('mobile-tx-type-pills');
      if (pills) {
        pills.addEventListener('click', (e) => {
          const btn = e.target.closest('.tx-type-pill');
          if (!btn) return;
          document.querySelectorAll('#mobile-tx-type-pills .tx-type-pill').forEach(b => {
            b.classList.remove('active', 'border-primary/30', 'bg-primary/20', 'text-primary');
            b.classList.add('border-white/10', 'bg-white/[0.04]', 'text-outline');
          });
          btn.classList.add('active', 'border-primary/30', 'bg-primary/20', 'text-primary');
          btn.classList.remove('border-white/10', 'bg-white/[0.04]', 'text-outline');
          store.setState({ txType: btn.dataset.type });
          filterMobileTransactions();
        });
      }
    }
  }

  function renderActiveMobileTab(tab, animate = false) {
    if (tab === 'dashboard') {
      updateMobilePortfolioChart(store.getState().portfolioRange, animate);
      renderMobileRecentFilings();
      setupLineChartHover('mobile-portfolio-canvas');
    } else if (tab === 'holdings') {
      const cData = getPieData('company');
      const sData = getPieData('sector');
      drawPieChart('mobile-pie-company-canvas', cData, 'company');
      drawPieChart('mobile-pie-sector-canvas', sData, 'sector');
      renderPieLegend('mobile-pie-company-legend', cData);
      renderPieLegend('mobile-pie-sector-legend', sData);
      setupPieInteractivity('mobile-pie-company-canvas', 'mobile-pie-company-legend', 'company');
      setupPieInteractivity('mobile-pie-sector-canvas', 'mobile-pie-sector-legend', 'sector');
      filterMobileHoldings();
    } else if (tab === 'returns') {
      updateMobileReturnsChart(animate);
      renderMobileReturnsSummary();
      setupBarChartHover('mobile-returns-canvas', (barData) => {
        store.setState({ activeTab: 'transactions' });
        setTimeout(() => {
          const input = document.getElementById('mobile-tx-search');
          if (input && barData?.label) {
            input.value = barData.label;
            filterMobileTransactions();
          }
        }, 60);
      });
    } else if (tab === 'transactions') {
      filterMobileTransactions();
    }
  }

  function updateMobilePortfolioChart(range, animate = false) {
    const series = getPortfolioTimeSeries(range);
    drawLineChart('mobile-portfolio-canvas', series, null, animate);
  }

  function updateMobileReturnsChart(animate = false) {
    const { returnsView, returnsRange } = store.getState();
    const data = getReturnsData(returnsView, returnsRange);
    drawBarChart('mobile-returns-canvas', data, animate);
  }

  function filterMobileHoldings() {
    const searchInput = document.getElementById('mobile-holdings-search');
    const search = (searchInput?.value || '').toLowerCase().trim();
    const sector = store.getState().holdingsSector || 'all';
    const holdings = getRawData()?.holdings || [];

    // Toggle clear filter buttons
    const hasFilter = search !== '' || sector !== 'all';
    const clearBtn = document.getElementById('mobile-holdings-clear-filter-btn');
    if (clearBtn) {
      clearBtn.classList.toggle('hidden', !hasFilter);
      clearBtn.classList.toggle('flex', hasFilter);
    }
    const searchClear = document.getElementById('mobile-holdings-clear-search-btn');
    if (searchClear) {
      searchClear.classList.toggle('hidden', search === '');
    }

    const filtered = holdings.filter(h => {
      const matchSearch = !search || h.stock_name.toLowerCase().includes(search) || h.company_name.toLowerCase().includes(search);
      const matchSector = sector === 'all' || h.sector === sector;
      return matchSearch && matchSector;
    });

    const list = document.getElementById('mobile-holdings-list');
    if (!list) return;

    list.innerHTML = filtered.map(h => {
      return `
        <div class="glass-card p-3 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-2.5 min-w-0">
            ${renderStockLogo(h.stock_name, h.company_name, 30)}
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs text-white">${h.stock_name}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-outline">${h.sector}</span>
              </div>
              <div class="text-[10px] text-outline truncate mt-0.5">${h.company_name}</div>
            </div>
          </div>
          <div class="text-right shrink-0 ml-2 font-mono-numeric">
            <div class="text-xs font-bold text-white">${formatCurrency(h.market_value)}</div>
            <div class="text-[10px] text-emerald-400 font-semibold mt-0.5">${h.direct_percent?.toFixed(2)}% in co</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderMobileReturnsSummary() {
    const dates = Object.values(getRawData()?.txByDate || {});
    const totalAcquired = dates.reduce((s, d) => s + d.acquired, 0);
    const totalDisposed = dates.reduce((s, d) => s + d.disposed, 0);
    const totalNet = totalAcquired - totalDisposed;
    const totalTx = dates.reduce((s, d) => s + d.count, 0);

    const container = document.getElementById('mobile-returns-summary');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-card p-2.5 rounded-xl">
        <span class="text-[9px] font-bold text-outline uppercase">Acquired</span>
        <div class="text-base font-bold text-emerald-400 font-mono-numeric mt-0.5">+${formatCompact(totalAcquired)}</div>
      </div>
      <div class="glass-card p-2.5 rounded-xl">
        <span class="text-[9px] font-bold text-outline uppercase">Disposed</span>
        <div class="text-base font-bold text-rose-400 font-mono-numeric mt-0.5">-${formatCompact(totalDisposed)}</div>
      </div>
      <div class="glass-card p-2.5 rounded-xl">
        <span class="text-[9px] font-bold text-outline uppercase">Net Flow</span>
        <div class="text-base font-bold ${totalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-mono-numeric mt-0.5">${totalNet >= 0 ? '+' : ''}${formatCompact(totalNet)}</div>
      </div>
      <div class="glass-card p-2.5 rounded-xl">
        <span class="text-[9px] font-bold text-outline uppercase">Filings</span>
        <div class="text-base font-bold text-white font-mono-numeric mt-0.5">${totalTx.toLocaleString()}</div>
      </div>
    `;
  }

  // Mobile transactions infinite scroll state
  let mobileTxFiltered = [];
  let mobileTxRenderedCount = 0;
  const MOBILE_TX_BATCH_SIZE = 40;
  let mobileTxObserver = null;
  let isMobileTxLoading = false;

  function renderMobileTransactionCard(tx) {
    const isBuy = tx.type === 'Acquired';
    const badgeClass = isBuy ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return `
      <a href="${tx.url}" target="_blank" rel="noopener noreferrer" class="glass-card p-3 rounded-xl flex items-center justify-between hover:bg-white/[0.04] transition-colors block cursor-pointer">
        <div class="flex items-center gap-2 min-w-0">
          ${renderStockLogo(tx.stock, tx.company, 28)}
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-xs text-white">${tx.stock}</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold border ${badgeClass}">${tx.type}</span>
            </div>
            <div class="text-[10px] text-outline truncate mt-0.5">${tx.company}</div>
          </div>
        </div>
        <div class="text-right shrink-0 ml-2 font-mono-numeric">
          <div class="text-xs font-bold ${isBuy ? 'text-emerald-400' : 'text-rose-400'}">${isBuy ? '+' : '-'}${tx.amount.toLocaleString()}</div>
          <div class="text-[9px] text-outline">${tx.date}</div>
        </div>
      </a>
    `;
  }

  function setupMobileIntersectionObserver() {
    if (mobileTxObserver) {
      mobileTxObserver.disconnect();
      mobileTxObserver = null;
    }
    const sentinel = document.getElementById('tx-mobile-sentinel');
    if (!sentinel) return;

    mobileTxObserver = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        renderMoreMobileTransactions();
      }
    }, {
      rootMargin: '300px'
    });
    mobileTxObserver.observe(sentinel);
  }

  function bindMobileTxScroll() {
    const onScroll = () => {
      const sentinel = document.getElementById('tx-mobile-sentinel');
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 300) {
        renderMoreMobileTransactions();
      }
    };
    const mobContainer = document.getElementById('mobile-view-container');
    if (mobContainer && !mobContainer.dataset.txScrollBound) {
      mobContainer.dataset.txScrollBound = 'true';
      mobContainer.addEventListener('scroll', onScroll, { passive: true });
    }
    if (!window.__mobileTxScrollBound) {
      window.__mobileTxScrollBound = true;
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  function renderMoreMobileTransactions() {
    const feed = document.getElementById('mobile-tx-feed');
    if (!feed || isMobileTxLoading) return;
    if (mobileTxRenderedCount >= mobileTxFiltered.length) return;

    isMobileTxLoading = true;

    const existingSentinel = document.getElementById('tx-mobile-sentinel');
    if (existingSentinel) existingSentinel.remove();
    const existingArchive = document.getElementById('tx-mobile-archive-row');
    if (existingArchive) existingArchive.remove();

    const start = mobileTxRenderedCount;
    const end = Math.min(start + MOBILE_TX_BATCH_SIZE, mobileTxFiltered.length);
    const chunk = mobileTxFiltered.slice(start, end);
    mobileTxRenderedCount = end;

    const cardsHtml = chunk.map(renderMobileTransactionCard).join('');
    feed.insertAdjacentHTML('beforeend', cardsHtml);

    if (mobileTxRenderedCount < mobileTxFiltered.length) {
      const sentinelHtml = `
        <div id="tx-mobile-sentinel" class="py-3 text-center text-xs text-outline font-medium">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02]">
            <span class="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Loaded ${mobileTxRenderedCount} of ${mobileTxFiltered.length.toLocaleString()} filings • Scroll for more</span>
          </div>
        </div>
      `;
      feed.insertAdjacentHTML('beforeend', sentinelHtml);
      setupMobileIntersectionObserver();
    } else {
      if (allTransactions.length <= 3500) {
        const archiveHtml = `
          <div id="tx-mobile-archive-row" class="py-3 text-center">
            <div class="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-outline text-xs">
              <span>Showing all ${mobileTxFiltered.length.toLocaleString()} recent filings</span>
              <button id="btn-mobile-load-full-archive" class="w-full py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                <span>Load Complete Archive (122k+ Filings)</span>
              </button>
            </div>
          </div>
        `;
        feed.insertAdjacentHTML('beforeend', archiveHtml);
        const btn = document.getElementById('btn-mobile-load-full-archive');
        if (btn) btn.addEventListener('click', loadFullHistoricalArchive);
      } else {
        const endNotice = `
          <div class="py-3 text-center text-xs text-outline font-medium">
            <span>All ${mobileTxFiltered.length.toLocaleString()} filings displayed</span>
          </div>
        `;
        feed.insertAdjacentHTML('beforeend', endNotice);
      }
    }

    isMobileTxLoading = false;
  }

  function filterMobileTransactions(reset = true) {
    const searchInput = document.getElementById('mobile-tx-search');
    const search = (searchInput?.value || '').toLowerCase().trim();
    const type = store.getState().txType || 'all';

    // Toggle clear filter buttons
    const hasFilter = search !== '' || type !== 'all';
    const clearBtn = document.getElementById('mobile-tx-clear-filter-btn');
    if (clearBtn) {
      clearBtn.classList.toggle('hidden', !hasFilter);
      clearBtn.classList.toggle('flex', hasFilter);
    }
    const searchClear = document.getElementById('mobile-tx-clear-search-btn');
    if (searchClear) {
      searchClear.classList.toggle('hidden', search === '');
    }

    mobileTxFiltered = allTransactions.filter(tx => {
      const matchSearch = !search || tx.stock.toLowerCase().includes(search) || tx.company.toLowerCase().includes(search) || (tx.date && tx.date.toLowerCase().includes(search));
      const matchType = type === 'all' || tx.type === type;
      return matchSearch && matchType;
    });

    const feed = document.getElementById('mobile-tx-feed');
    if (!feed) return;

    const shouldReset = reset !== false;
    if (shouldReset) {
      mobileTxRenderedCount = 0;
      feed.innerHTML = '';
      window.scrollTo({ top: 0 });
    }

    renderMoreMobileTransactions();
    bindMobileTxScroll();

    const countBadge = document.getElementById('mobile-tx-count');
    if (countBadge) countBadge.textContent = mobileTxFiltered.length.toLocaleString();
  }

  let isLoadingFullArchive = false;
  async function loadFullHistoricalArchive() {
    if (isLoadingFullArchive) return;
    isLoadingFullArchive = true;
    const btns = [
      document.getElementById('btn-load-full-archive'),
      document.getElementById('btn-mobile-load-full-archive')
    ].filter(Boolean);

    btns.forEach(b => {
      b.disabled = true;
      b.innerHTML = `<span class="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span> Loading 122,000+ records...`;
    });

    try {
      const res = await fetch('data_full.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const fullData = await res.json();
      allTransactions = flattenTransactions(fullData);
      
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        filterMobileTransactions(false);
      } else {
        filterDesktopTransactions(false);
      }
    } catch (err) {
      console.error('[Archive Load Error]', err);
      btns.forEach(b => {
        b.disabled = false;
        b.textContent = 'Failed to load archive. Tap to retry.';
      });
    } finally {
      isLoadingFullArchive = false;
    }
  }

  function handleTabSwitch(tab) {
    const isMobile = window.innerWidth < 768;
    trackAnalytics('tab_switched', { tab, device: isMobile ? 'mobile' : 'desktop' });
    const container = document.getElementById(isMobile ? 'mobile-view-container' : 'desktop-view-container');
    if (!container) return;

    container.innerHTML = isMobile ? renderMobileViewContent(tab) : renderDesktopViewContent(tab);
    applyScrollLock(tab);

    if (isMobile) {
      document.querySelectorAll('#mobile-tab-nav .mobile-tab-btn').forEach(btn => {
        const active = btn.dataset.tab === tab;
        btn.classList.toggle('text-primary', active);
        btn.classList.toggle('font-bold', active);
        btn.classList.toggle('active', active);
        btn.classList.toggle('text-outline', !active);
      });
      bindMobileEvents();
      requestAnimationFrame(() => renderActiveMobileTab(tab, false));
    } else {
      document.querySelectorAll('#desktop-tab-nav .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
      });
      bindDesktopEvents();
      requestAnimationFrame(() => renderActiveDesktopTab(tab, false));
    }
  }

  function redrawActiveCharts(animate = false) {
    const isMobile = window.innerWidth < 768;
    const tab = store.getState().activeTab;
    if (tab === 'dashboard') {
      if (isMobile) updateMobilePortfolioChart(store.getState().portfolioRange, animate);
      else updateDesktopPortfolioChart(store.getState().portfolioRange, animate);
    } else if (tab === 'holdings') {
      const cData = getPieData('company');
      const sData = getPieData('sector');
      if (isMobile) {
        drawPieChart('mobile-pie-company-canvas', cData, 'company');
        drawPieChart('mobile-pie-sector-canvas', sData, 'sector');
      } else {
        drawPieChart('pie-company-canvas', cData, 'company');
        drawPieChart('pie-sector-canvas', sData, 'sector');
      }
    } else if (tab === 'returns') {
      if (isMobile) updateMobileReturnsChart(animate);
      else updateDesktopReturnsChart(animate);
    }
  }

  function debounce(fn, ms) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), ms);
    };
  }

  // ----------------------------------------------------
  // 9. POSTHOG USER FEEDBACK & SURVEY WIDGET
  // ----------------------------------------------------
  function renderPostHogSurveyWidget(isMobile = false) {
    const containerClass = isMobile ? 'bottom-16 right-3.5' : 'bottom-5 left-5';
    const popoverAlignClass = isMobile ? 'right-0' : 'left-0';
    return `
      <!-- Floating PostHog Survey / Feedback Trigger -->
      <div id="posthog-survey-container" class="fixed ${containerClass} z-50">
        <button id="survey-trigger-btn" class="flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container/95 hover:bg-white/10 border border-white/15 hover:border-primary/50 text-xs font-semibold text-white shadow-2xl hover:shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xl group">
          <svg class="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Feedback</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        <!-- Interactive Survey Popover Modal -->
        <div id="survey-modal-popover" class="hidden absolute bottom-12 ${popoverAlignClass} w-[300px] sm:w-[340px] p-4 rounded-2xl glass-card border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
          <div class="flex items-start justify-between mb-2.5">
            <div>
              <h4 class="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>EPF Tracker Survey</span>
                <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30">PostHog</span>
              </h4>
              <p class="text-[10px] text-outline mt-0.5">How is your tracking experience?</p>
            </div>
            <button id="survey-close-btn" class="text-outline hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-xs" title="Close">✕</button>
          </div>

          <form id="posthog-survey-form" class="space-y-2.5">
            <!-- Sentiment Rating -->
            <div>
              <label class="block text-[10px] text-outline mb-1 font-medium">Overall Rating:</label>
              <div class="grid grid-cols-4 gap-1.5" id="survey-rating-group">
                <button type="button" class="survey-rating-btn flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer text-xs" data-rating="5" data-label="Great">
                  <span class="text-base mb-0.5">😍</span>
                  <span class="text-[9px] text-outline font-medium">Great</span>
                </button>
                <button type="button" class="survey-rating-btn flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer text-xs" data-rating="4" data-label="Good">
                  <span class="text-base mb-0.5">🙂</span>
                  <span class="text-[9px] text-outline font-medium">Good</span>
                </button>
                <button type="button" class="survey-rating-btn flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer text-xs" data-rating="3" data-label="Okay">
                  <span class="text-base mb-0.5">😐</span>
                  <span class="text-[9px] text-outline font-medium">Okay</span>
                </button>
                <button type="button" class="survey-rating-btn flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer text-xs" data-rating="2" data-label="Poor">
                  <span class="text-base mb-0.5">🙁</span>
                  <span class="text-[9px] text-outline font-medium">Poor</span>
                </button>
              </div>
            </div>

            <!-- Desired Features Writable Input -->
            <div>
              <label class="block text-[10px] text-outline mb-1 font-medium">Desired features or tools you want:</label>
              <input type="text" id="survey-feature-input" placeholder="e.g. Dividend yield, alerts, PDF export..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3 py-1.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
              <div class="flex flex-wrap gap-1 mt-1.5" id="survey-tag-group">
                <button type="button" class="survey-tag-btn px-2 py-0.5 rounded-md text-[9px] bg-white/[0.03] border border-white/10 text-outline hover:text-white transition-all cursor-pointer" data-tag="Dividend Yield Tracker">+ Dividend Yield</button>
                <button type="button" class="survey-tag-btn px-2 py-0.5 rounded-md text-[9px] bg-white/[0.03] border border-white/10 text-outline hover:text-white transition-all cursor-pointer" data-tag="Daily Stock Alerts">+ Price Alerts</button>
                <button type="button" class="survey-tag-btn px-2 py-0.5 rounded-md text-[9px] bg-white/[0.03] border border-white/10 text-outline hover:text-white transition-all cursor-pointer" data-tag="Longer History Data">+ 5Y History</button>
                <button type="button" class="survey-tag-btn px-2 py-0.5 rounded-md text-[9px] bg-white/[0.03] border border-white/10 text-outline hover:text-white transition-all cursor-pointer" data-tag="CSV / Excel Export">+ CSV Export</button>
              </div>
            </div>

            <!-- Additional Comments Text Area -->
            <div>
              <label class="block text-[10px] text-outline mb-1 font-medium">Additional feedback or suggestions:</label>
              <textarea id="survey-comment-input" placeholder="Suggestions, bugs, or general feedback..." class="w-full bg-surface-container-low border border-white/10 rounded-xl p-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 resize-none h-12"></textarea>
            </div>

            <!-- Submit Button -->
            <button type="submit" id="survey-submit-btn" class="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 text-white font-bold text-xs tracking-tight shadow-md hover:shadow-primary/30 transition-all cursor-pointer">
              Send Feedback
            </button>
          </form>

          <!-- Thank you state -->
          <div id="survey-thank-you" class="hidden py-4 flex flex-col items-center justify-center text-center">
            <div class="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1.5">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h4 class="text-xs font-bold text-white">Thank You! ❤️</h4>
            <p class="text-[10px] text-outline mt-0.5">Your feedback was sent directly to PostHog.</p>
          </div>
        </div>
      </div>
    `;
  }

  function bindSurveyEvents() {
    const trigger = document.getElementById('survey-trigger-btn');
    const modal = document.getElementById('survey-modal-popover');
    const closeBtn = document.getElementById('survey-close-btn');
    const form = document.getElementById('posthog-survey-form');
    const thankYou = document.getElementById('survey-thank-you');
    const featureInput = document.getElementById('survey-feature-input');
    if (!trigger || !modal) return;

    let selectedRating = 5;
    let selectedRatingLabel = 'Great';

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      modal.classList.toggle('hidden');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.classList.add('hidden');
      });
    }

    // Rating emoji buttons
    document.querySelectorAll('#survey-rating-group .survey-rating-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#survey-rating-group .survey-rating-btn').forEach(b => {
          b.classList.remove('active', 'border-primary', 'bg-primary/20', 'ring-1', 'ring-primary');
          b.classList.add('bg-white/[0.04]', 'border-white/10');
        });
        btn.classList.add('active', 'border-primary', 'bg-primary/20', 'ring-1', 'ring-primary');
        btn.classList.remove('bg-white/[0.04]', 'border-white/10');
        selectedRating = parseInt(btn.dataset.rating, 10) || 5;
        selectedRatingLabel = btn.dataset.label || 'Great';
      });
    });

    // Default select 1st button (Great)
    const firstRating = document.querySelector('#survey-rating-group .survey-rating-btn');
    if (firstRating) {
      firstRating.classList.add('active', 'border-primary', 'bg-primary/20', 'ring-1', 'ring-primary');
      firstRating.classList.remove('bg-white/[0.04]', 'border-white/10');
    }

    // Tag buttons: Append or toggle feature text directly into feature input
    document.querySelectorAll('#survey-tag-group .survey-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;
        if (!featureInput) return;
        const currentVal = featureInput.value.trim();
        if (currentVal.includes(tag)) {
          // Remove if already present
          const updated = currentVal.split(',').map(s => s.trim()).filter(s => s !== tag).join(', ');
          featureInput.value = updated;
          btn.classList.remove('bg-primary/20', 'border-primary/40', 'text-primary', 'font-semibold');
          btn.classList.add('bg-white/[0.03]', 'border-white/10', 'text-outline');
        } else {
          // Append
          featureInput.value = currentVal ? `${currentVal}, ${tag}` : tag;
          btn.classList.add('bg-primary/20', 'border-primary/40', 'text-primary', 'font-semibold');
          btn.classList.remove('bg-white/[0.03]', 'border-white/10', 'text-outline');
        }
        featureInput.focus();
      });
    });

    // Form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('survey-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>Submitting...</span>`;
        }

        const desiredFeatures = (document.getElementById('survey-feature-input')?.value || '').trim();
        const comment = (document.getElementById('survey-comment-input')?.value || '').trim();
        const payload = {
          rating: selectedRating,
          rating_label: selectedRatingLabel,
          desired_features: desiredFeatures,
          comment: comment,
          active_tab: store.getState().activeTab,
          screen_width: window.innerWidth,
          device: window.innerWidth < 768 ? 'mobile' : 'desktop'
        };

        // 1. PostHog JS SDK Capture
        try {
          if (window.posthog) {
            window.posthog.capture('survey_submitted', payload);
            window.posthog.capture('user_feedback', payload);
          }
        } catch (_) {}

        // 2. Direct HTTPS Beacon Fallback (Bypasses any SDK latency)
        try {
          fetch('https://us.i.posthog.com/capture/', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: 'phc_sn6didtESTQzQe6HTLNuc5AkrcHuzxGGY97q9kBPzvVd',
              event: 'survey_submitted',
              properties: {
                ...payload,
                distinct_id: window.posthog?.get_distinct_id?.() || 'anon_' + Math.random().toString(36).slice(2),
                $current_url: window.location.href
              }
            })
          }).catch(() => {});
        } catch (_) {}

        console.log('✅ [EPF Tracker] Feedback submitted to PostHog:', payload);

        form.classList.add('hidden');
        if (thankYou) thankYou.classList.remove('hidden');

        setTimeout(() => {
          modal.classList.add('hidden');
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = `Send Feedback`;
            }
            form.classList.remove('hidden');
            if (thankYou) thankYou.classList.add('hidden');
            if (document.getElementById('survey-feature-input')) {
              document.getElementById('survey-feature-input').value = '';
            }
            if (document.getElementById('survey-comment-input')) {
              document.getElementById('survey-comment-input').value = '';
            }
            document.querySelectorAll('#survey-tag-group .survey-tag-btn').forEach(b => {
              b.classList.remove('bg-primary/20', 'border-primary/40', 'text-primary', 'font-semibold');
              b.classList.add('bg-white/[0.03]', 'border-white/10', 'text-outline');
            });
          }, 400);
        }, 2200);
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!modal.contains(e.target) && !trigger.contains(e.target)) {
        modal.classList.add('hidden');
      }
    });
  }

  // ----------------------------------------------------
  // AUTO-INIT ON DOM READY
  // ----------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  window.EPFTracker = { initApp, store };
})();
