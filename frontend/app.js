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

    // Use client dimensions for exact pixel sharpness
    const w = parent.clientWidth || 300;
    const h = parent.clientHeight || 280;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = window.innerWidth < 768;
    const dynamicColor = color || (getComputedStyle(document.documentElement).getPropertyValue('--chart-primary').trim() || '#f43f5e');
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-subtle').trim() || 'rgba(255, 255, 255, 0.06)';

    const pad = {
      top: 20,
      right: isMobile ? 12 : 24,
      bottom: isMobile ? 26 : 32,
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
        ctx.fillText(displayLabel, x, h - 8);
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
      ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
      const dateText = d.label;
      const textW = ctx.measureText(dateText).width;
      const pillW = textW + 16;
      const pillH = 22;
      const pillX = Math.max(pad.left, Math.min(w - pad.right - pillW, pointX - (pillW / 2)));
      const pillY = h - 26;

      ctx.fillStyle = 'rgba(18, 20, 30, 0.96)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 6);
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
    const h = parent.clientHeight || 320;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = window.innerWidth < 768;
    const pad = {
      top: 24,
      right: isMobile ? 12 : 24,
      bottom: isMobile ? 28 : 36,
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
            if (!indicesToDraw.push(idx)) indicesToDraw.push(idx);
          }
          if (!indicesToDraw.includes(data.length - 1)) indicesToDraw.push(data.length - 1);
        }
      }
      indicesToDraw.sort((a, b) => a - b);

      indicesToDraw.forEach(i => {
        const x = pad.left + (plotW * i / data.length) + (plotW / data.length) / 2;
        ctx.fillText(formatLabel(data[i].label), x, h - 10);
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
      ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
      const dateText = d.label;
      const textW = ctx.measureText(dateText).width;
      const pillW = textW + 16;
      const pillH = 22;
      const pillX = Math.max(pad.left, Math.min(w - pad.right - pillW, barCenterX - (pillW / 2)));
      const pillY = h - 26;

      ctx.fillStyle = 'rgba(18, 20, 30, 0.96)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 6);
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
    tt.style.left = `${e.pageX + 12}px`;
    tt.style.top = `${e.pageY - 28}px`;
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

  function drawPieChart(canvasId, data, type = 'company') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    const w = Math.min(parent.clientWidth || 180, 180);
    const h = Math.min(parent.clientHeight || 180, 180);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(cx, cy) - 10;
    const innerR = outerR * 0.58;

    ctx.clearRect(0, 0, w, h);
    if (!data || data.length === 0) return;

    const total = data.reduce((s, d) => s + d.value, 0);
    let startAngle = -Math.PI / 2;

    data.forEach((d) => {
      const sweep = (d.value / total) * (Math.PI * 2);
      const endAngle = startAngle + sweep;

      ctx.save();
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#08090e';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      startAngle = endAngle;
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const centerText = type === 'company' ? `${getRawData()?.holdings?.length || 260} stocks` : `${data.length} sectors`;
    ctx.fillText(centerText, cx, cy);
  }

  function renderPieLegend(containerId, data) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = data.map(d => `
      <div class="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs">
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${d.color}"></span>
          <span class="font-bold text-white truncate">${d.label}</span>
        </div>
        <span class="font-mono text-outline shrink-0 ml-2">${d.pct}%</span>
      </div>
    `).join('');
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
              <span class="text-sm font-semibold">Dashboard</span>
            </button>

            <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'holdings' ? 'active' : ''}" data-tab="holdings" id="tab-holdings">
              <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
              <span class="text-sm font-semibold">Holdings</span>
            </button>

            <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'returns' ? 'active' : ''}" data-tab="returns" id="tab-returns">
              <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>
              <span class="text-sm font-semibold">Returns</span>
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
      <div class="relative w-7 h-7 rounded-full border border-white/20 overflow-hidden flex items-center justify-center shadow-md shrink-0 -ml-1.5 first:ml-0" style="z-index: ${30 - i * 10}">
        ${renderStockLogo(h.stock_name, h.company_name, 28)}
      </div>
    `).join('');

    return `
      <div id="desktop-panel-dashboard" class="flex flex-col gap-6 w-full min-w-0">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-widest text-outline">Institutional Portfolio</span>
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

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div id="bento-sector-card" class="glass-card p-6 flex flex-col justify-between min-h-[160px] relative group cursor-pointer">
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-1.5">
                <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Top Sector Allocation</span>
              </div>
              <div class="flex items-center" id="bento-sector-logos">${sectorLogosHtml}</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-on-surface tracking-tight">${topSector[0]}</div>
              <div class="flex items-center justify-between text-xs mt-2 font-mono-numeric">
                <span class="text-on-surface font-semibold">RM ${formatCompact(topSector[1])}</span>
                <span class="text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">${topSectorPct}%</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
                <div class="bg-gradient-to-r from-primary to-primary-container h-full rounded-full" style="width: ${topSectorPct}%;"></div>
              </div>
            </div>
          </div>

          <div id="bento-holding-card" class="glass-card p-6 flex flex-col justify-between min-h-[160px] relative group cursor-pointer">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Top Holding Spotlight</span>
              <div class="relative flex h-10 w-10 shrink-0 items-center justify-center">
                ${renderStockLogo(topHolding.stock_name, topHolding.company_name, 38)}
              </div>
            </div>
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-xl font-bold text-on-surface tracking-tight">${topHolding.stock_name}</span>
                <span class="text-xs text-outline font-medium truncate max-w-[140px]">${topHolding.company_name}</span>
              </div>
              <div class="text-xs mt-2 flex justify-between items-center font-mono-numeric">
                <span class="text-on-surface font-bold text-sm">${formatCurrency(topHolding.market_value || 0)}</span>
                <span class="badge-pill-success text-xs">
                  ${ICONSTACK.arrow_upward}${topHolding.direct_percent?.toFixed(3)}% in company
                </span>
              </div>
            </div>
          </div>

          <div id="bento-active-card" class="glass-card p-6 flex flex-col justify-between min-h-[160px] relative group cursor-pointer">
            <div class="flex justify-between items-start mb-3">
              <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Active Positions</span>
              <div class="flex items-center justify-center text-primary filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                ${ICONSTACK.layout_grid}
              </div>
            </div>
            <div>
              <div class="text-3xl font-extrabold text-on-surface tracking-tight font-mono-numeric">${holdings.length} positions</div>
              <div class="text-xs text-outline mt-1.5 font-medium">${data?.uniqueStocks || holdings.length} unique stocks across ${sortedSectors.length} sectors</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 glass-card portfolio-trend-card p-6 glow-hover transition-all flex flex-col">
            <div class="flex justify-between items-center mb-6">
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
            <div class="chart-body flex-1 relative">
              <canvas id="portfolio-canvas"></canvas>
            </div>
            <div class="chart-footer mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <div class="chart-legend-item flex items-center gap-2">
                <span class="legend-line w-5 h-1 bg-primary rounded-full shadow-sm"></span>
                <span class="legend-label text-xs text-outline font-medium" id="portfolio-legend-date">Net Shareholdings Trend</span>
              </div>
              <div class="chart-value text-base font-bold text-on-surface font-mono-numeric" id="portfolio-value-display">0 shares (net)</div>
            </div>
          </div>

          <div class="glass-card recent-filings-card p-6 glow-hover transition-all flex flex-col">
            <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <div>
                <h3 class="text-base font-bold text-on-surface tracking-tight">Recent Filings</h3>
                <span class="text-xs text-outline">Bursa announcements feed</span>
              </div>
              <svg class="w-5 h-5 text-outline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
            </div>
            <div class="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar" id="bento-activity-feed"></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderDesktopHoldings(data = getRawData()) {
    const holdings = data?.holdings || [];
    const sectors = [...new Set(holdings.map(h => h.sector))].sort();

    return `
      <div id="desktop-panel-holdings" class="flex flex-col gap-6 w-full min-w-0">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="glass-card p-6 flex flex-col min-h-[360px]">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold text-on-surface tracking-tight">Allocation by Company</h3>
              <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Top 10 Weight</span>
            </div>
            <div class="flex-1 flex flex-col sm:flex-row items-center gap-6">
              <div class="pie-chart-container">
                <canvas id="pie-company-canvas"></canvas>
              </div>
              <div class="flex-1 grid grid-cols-2 gap-2 w-full" id="pie-company-legend"></div>
            </div>
          </div>

          <div class="glass-card p-6 flex flex-col min-h-[360px]">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold text-on-surface tracking-tight">Allocation by Sector</h3>
              <span class="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Macro Weight</span>
            </div>
            <div class="flex-1 flex flex-col sm:flex-row items-center gap-6">
              <div class="pie-chart-container">
                <canvas id="pie-sector-canvas"></canvas>
              </div>
              <div class="flex-1 grid grid-cols-2 gap-2 w-full" id="pie-sector-legend"></div>
            </div>
          </div>
        </div>

        <div class="glass-card table-card p-6 flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-on-surface tracking-tight">Domestic Equity Positions</h3>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20" id="holdings-count">${holdings.length}</span>
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <div class="relative flex-1 sm:w-64">
                <input type="text" id="holdings-search" placeholder="Search ticker / company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
              </div>
              <select id="holdings-sector-filter" class="bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50">
                <option value="all">All Sectors</option>
                ${sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs text-on-surface data-table" id="holdings-table">
              <thead>
                <tr class="border-b border-white/10 text-outline text-[11px] uppercase tracking-wider font-semibold">
                  <th class="py-3 px-3">#</th>
                  <th class="py-3 px-3">Symbol</th>
                  <th class="py-3 px-3">Company</th>
                  <th class="py-3 px-3">Sector</th>
                  <th class="py-3 px-3 text-right">Price (RM)</th>
                  <th class="py-3 px-3 text-right">No. of Shares</th>
                  <th class="py-3 px-3 text-right">Market Value (RM)</th>
                  <th class="py-3 px-3 text-right">% in Company</th>
                  <th class="py-3 px-3 text-right">% in Portfolio</th>
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
      <div id="desktop-panel-returns" class="flex flex-col gap-6 w-full min-w-0">
        <div class="glass-card portfolio-trend-card p-6 glow-hover transition-all flex flex-col min-w-0 w-full overflow-hidden">
          <div class="flex justify-between items-center mb-6 flex-wrap gap-3">
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
          <div class="chart-body chart-body-tall flex-1 relative">
            <canvas id="returns-canvas"></canvas>
          </div>
        </div>
        <div class="summary-cards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full" id="returns-summary"></div>
      </div>
    `;
  }

  function renderDesktopTransactions() {
    return `
      <div id="desktop-panel-transactions" class="flex flex-col gap-6 w-full min-w-0">
        <div class="glass-card table-card p-6 flex flex-col gap-4">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-on-surface tracking-tight">EPF Bursa Filings</h3>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20" id="tx-count">0</span>
              </div>
              <span class="text-xs text-outline mt-0.5">Substantial Shareholder Notices</span>
            </div>
            <div class="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <div class="relative flex-1 md:w-64">
                <input type="text" id="tx-search" placeholder="Search stock / company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
              </div>
              <select id="tx-filter-type" class="bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50">
                <option value="all">All Types</option>
                <option value="Acquired">Acquired (Buy)</option>
                <option value="Disposed">Disposed (Sell)</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs text-on-surface data-table" id="tx-table">
              <thead>
                <tr class="border-b border-white/10 text-outline text-[11px] uppercase tracking-wider font-semibold">
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
      <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 z-50 shadow-2xl" id="mobile-tab-nav">
        <button class="mobile-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl ${activeTab === 'dashboard' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="dashboard">
          <svg class="w-5 h-5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span class="text-[10px] tracking-tight">Overview</span>
        </button>

        <button class="mobile-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl ${activeTab === 'holdings' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="holdings">
          <svg class="w-5 h-5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
          <span class="text-[10px] tracking-tight">Holdings</span>
        </button>

        <button class="mobile-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl ${activeTab === 'returns' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="returns">
          <svg class="w-5 h-5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>
          <span class="text-[10px] tracking-tight">Flows</span>
        </button>

        <button class="mobile-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl ${activeTab === 'transactions' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="transactions">
          <svg class="w-5 h-5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
          <span class="text-[10px] tracking-tight">Filings</span>
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

    return `
      <div id="mobile-panel-dashboard" class="flex flex-col gap-4 w-full pb-20">
        <div class="flex items-center justify-between pt-2 pb-1">
          <div class="flex items-center gap-2.5">
            <img src="assets/logo.png" alt="EPF Tracker" class="h-9 w-9 object-contain filter drop-shadow-[0_2px_10px_rgba(244,63,94,0.4)]">
            <div class="flex items-center gap-1">
              <span class="font-extrabold text-lg text-white tracking-tight">EPF</span>
              <span class="font-extrabold text-lg text-primary tracking-tight">Tracker</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">Live</span>
        </div>

        <div class="glass-card p-4 rounded-2xl flex flex-col gap-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-outline">EPF Malaysia Portfolio</span>
          <div class="flex items-baseline justify-between">
            <h2 class="text-2xl font-black text-white font-mono-numeric tracking-tight">
              ${formatCurrency(totalMarketValue)}
            </h2>
            <span class="badge-pill-success text-[11px] font-bold">+2.4%</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="glass-card p-3.5 rounded-xl flex flex-col justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-outline">Top Sector</span>
            <div class="mt-2">
              <div class="text-base font-bold text-white truncate">${topSector[0]}</div>
              <div class="flex justify-between items-center text-[11px] font-mono-numeric text-outline mt-1">
                <span>RM ${formatCompact(topSector[1])}</span>
                <span class="text-primary font-bold">${topSectorPct}%</span>
              </div>
            </div>
          </div>

          <div class="glass-card p-3.5 rounded-xl flex flex-col justify-between">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold uppercase tracking-wider text-outline">Top Stock</span>
              <div class="h-6 w-6 shrink-0 flex items-center justify-center">
                ${renderStockLogo(topHolding.stock_name, topHolding.company_name, 24)}
              </div>
            </div>
            <div class="mt-2">
              <div class="text-base font-bold text-white truncate">${topHolding.stock_name}</div>
              <div class="text-[11px] font-mono-numeric text-emerald-400 font-semibold mt-1 truncate">
                ${formatCompact(topHolding.market_value)}
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card p-4 rounded-2xl flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-white">Portfolio Trend</h3>
              <span class="text-[10px] text-outline">Net shareholdings</span>
            </div>
            <div class="chart-toggle-group flex gap-0.5" id="mobile-time-toggle">
              <button class="chart-toggle active text-[10px] px-2.5 py-1" data-range="1M">1M</button>
              <button class="chart-toggle text-[10px] px-2.5 py-1" data-range="3M">3M</button>
              <button class="chart-toggle text-[10px] px-2.5 py-1" data-range="1Y">1Y</button>
              <button class="chart-toggle text-[10px] px-2.5 py-1" data-range="ALL">All</button>
            </div>
          </div>
          <div class="chart-body w-full relative overflow-hidden">
            <canvas id="mobile-portfolio-canvas"></canvas>
          </div>
        </div>

        <div class="glass-card p-4 rounded-2xl flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white">Recent Bursa Filings</h3>
            <span class="text-[10px] text-outline">Latest notices</span>
          </div>
          <div class="space-y-2" id="mobile-activity-feed"></div>
        </div>
      </div>
    `;
  }

  function renderMobileHoldings(data = getRawData()) {
    const holdings = data?.holdings || [];
    const sectors = [...new Set(holdings.map(h => h.sector))].sort();

    return `
      <div id="mobile-panel-holdings" class="flex flex-col gap-3.5 w-full pb-20">
        <div class="flex flex-col gap-2 pt-2">
          <div class="relative w-full">
            <input type="text" id="mobile-holdings-search" placeholder="Search stock or company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
          </div>
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 text-xs" id="mobile-sector-pills">
            <button class="sector-pill active px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[11px] font-semibold whitespace-nowrap shrink-0" data-sector="all">All (${holdings.length})</button>
            ${sectors.map(s => `<button class="sector-pill px-3 py-1 rounded-full bg-white/[0.04] text-outline hover:text-white border border-white/10 text-[11px] whitespace-nowrap shrink-0" data-sector="${s}">${s}</button>`).join('')}
          </div>
        </div>
        <div class="space-y-2.5" id="mobile-holdings-list"></div>
      </div>
    `;
  }

  function renderMobileReturns() {
    return `
      <div id="mobile-panel-returns" class="flex flex-col gap-4 w-full pb-20 pt-2">
        <div class="glass-card p-4 rounded-2xl flex flex-col gap-3">
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <h3 class="text-sm font-bold text-white">Net Capital Activity</h3>
              <div class="chart-toggle-group flex gap-0.5" id="mobile-returns-toggle">
                <button class="chart-toggle active text-[10px] px-2 py-0.5" data-view="net">Net</button>
                <button class="chart-toggle text-[10px] px-2 py-0.5" data-view="acquired">Buy</button>
                <button class="chart-toggle text-[10px] px-2 py-0.5" data-view="disposed">Sell</button>
              </div>
            </div>
            <div class="chart-toggle-group flex gap-0.5 self-start" id="mobile-returns-time-toggle">
              <button class="chart-toggle active text-[10px] px-2 py-0.5" data-range="1M">1M</button>
              <button class="chart-toggle text-[10px] px-2 py-0.5" data-range="3M">3M</button>
              <button class="chart-toggle text-[10px] px-2 py-0.5" data-range="1Y">1Y</button>
              <button class="chart-toggle text-[10px] px-2 py-0.5" data-range="ALL">All</button>
            </div>
          </div>
          <div class="chart-body chart-body-tall w-full relative overflow-hidden">
            <canvas id="mobile-returns-canvas"></canvas>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2.5" id="mobile-returns-summary"></div>
      </div>
    `;
  }

  function renderMobileTransactions() {
    return `
      <div id="mobile-panel-transactions" class="flex flex-col gap-3.5 w-full pb-20 pt-2">
        <div class="flex flex-col gap-2">
          <input type="text" id="mobile-tx-search" placeholder="Search filings..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5 text-xs" id="mobile-tx-type-pills">
            <button class="tx-type-pill active px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[11px] font-semibold whitespace-nowrap shrink-0" data-type="all">All Filings</button>
            <button class="tx-type-pill px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] whitespace-nowrap shrink-0" data-type="Acquired">Acquired (Buy)</button>
            <button class="tx-type-pill px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] whitespace-nowrap shrink-0" data-type="Disposed">Disposed (Sell)</button>
          </div>
        </div>
        <div class="space-y-2.5" id="mobile-tx-feed"></div>
      </div>
    `;
  }

  // ----------------------------------------------------
  // 8. MASTER APP ORCHESTRATOR
  // ----------------------------------------------------
  let allTransactions = [];
  let currentDeviceMode = null;
  let chartResizeObserver = null;

  function initApp() {
    allTransactions = flattenTransactions(getRawData());
    mountApp();

    store.subscribe((state, prev) => {
      if (state.isMobile !== prev.isMobile) {
        mountApp();
      } else if (state.activeTab !== prev.activeTab) {
        handleTabSwitch(state.activeTab);
      }
    });

    window.addEventListener('resize', debounce(() => {
      const isMob = window.innerWidth < 768;
      if ((isMob ? 'mobile' : 'desktop') !== currentDeviceMode) {
        store.setState({ isMobile: isMob });
      } else {
        redrawActiveCharts();
      }
    }, 150));

    // Setup ResizeObserver for pixel-perfect responsiveness
    if (window.ResizeObserver) {
      chartResizeObserver = new ResizeObserver(debounce((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            redrawActiveCharts(false);
          }
        }
      }, 100));
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
        <div class="w-full min-h-screen bg-page text-on-surface px-4 pt-2">
          <main class="w-full max-w-lg mx-auto">
            <div id="mobile-view-container">
              ${renderMobileViewContent(state.activeTab)}
            </div>
          </main>
          ${renderMobileNav(state.activeTab)}
        </div>
      `;
      bindMobileEvents();
      requestAnimationFrame(() => {
        renderActiveMobileTab(state.activeTab);
        observeChartContainers();
      });
    } else {
      root.innerHTML = `
        <div class="flex min-h-screen bg-page text-on-surface">
          ${renderDesktopNav(state.activeTab)}
          <div class="ml-64 flex-1 flex flex-col min-h-screen p-8 mx-auto w-full max-w-[1440px]">
            <main id="desktop-view-container" class="w-full flex-1">
              ${renderDesktopViewContent(state.activeTab)}
            </main>
          </div>
        </div>
      `;
      bindDesktopEvents();
      requestAnimationFrame(() => {
        renderActiveDesktopTab(state.activeTab);
        observeChartContainers();
      });
    }
  }

  function observeChartContainers() {
    if (!chartResizeObserver) return;
    chartResizeObserver.disconnect();
    document.querySelectorAll('.chart-body, .pie-chart-container').forEach(el => {
      chartResizeObserver.observe(el);
    });
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
          updateDesktopPortfolioChart(btn.dataset.range);
        });
      }
      const holdingCard = document.getElementById('bento-holding-card');
      if (holdingCard) holdingCard.addEventListener('click', () => store.setState({ activeTab: 'holdings' }));
      const activeCard = document.getElementById('bento-active-card');
      if (activeCard) activeCard.addEventListener('click', () => store.setState({ activeTab: 'holdings' }));
    } else if (state.activeTab === 'holdings') {
      const searchInput = document.getElementById('holdings-search');
      if (searchInput) searchInput.addEventListener('input', filterDesktopHoldings);
      const sectorFilter = document.getElementById('holdings-sector-filter');
      if (sectorFilter) sectorFilter.addEventListener('change', filterDesktopHoldings);
    } else if (state.activeTab === 'returns') {
      const rTimeToggle = document.getElementById('returns-time-toggle');
      if (rTimeToggle) {
        rTimeToggle.addEventListener('click', (e) => {
          const btn = e.target.closest('.chart-toggle');
          if (!btn) return;
          document.querySelectorAll('#returns-time-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          store.setState({ returnsRange: btn.dataset.range });
          updateDesktopReturnsChart();
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
          updateDesktopReturnsChart();
        });
      }
    } else if (state.activeTab === 'transactions') {
      const txSearch = document.getElementById('tx-search');
      if (txSearch) txSearch.addEventListener('input', filterDesktopTransactions);
      const txType = document.getElementById('tx-filter-type');
      if (txType) txType.addEventListener('change', filterDesktopTransactions);
    }
  }

  function renderActiveDesktopTab(tab) {
    if (tab === 'dashboard') {
      updateDesktopPortfolioChart(store.getState().portfolioRange);
      renderDesktopRecentFilings();
      setupLineChartHover('portfolio-canvas');
    } else if (tab === 'holdings') {
      const cData = getPieData('company');
      const sData = getPieData('sector');
      drawPieChart('pie-company-canvas', cData, 'company');
      drawPieChart('pie-sector-canvas', sData, 'sector');
      renderPieLegend('pie-company-legend', cData);
      renderPieLegend('pie-sector-legend', sData);
      filterDesktopHoldings();
    } else if (tab === 'returns') {
      updateDesktopReturnsChart(true);
      renderDesktopReturnsSummary();
      setupBarChartHover('returns-canvas', () => store.setState({ activeTab: 'transactions' }));
    } else if (tab === 'transactions') {
      filterDesktopTransactions();
    }
  }

  function updateDesktopPortfolioChart(range) {
    const series = getPortfolioTimeSeries(range);
    drawLineChart('portfolio-canvas', series, null, true);
    const lastVal = series.length > 0 ? series[series.length - 1].value : 0;
    const disp = document.getElementById('portfolio-value-display');
    if (disp) disp.textContent = `${formatCompact(lastVal)} shares (net)`;
  }

  function updateDesktopReturnsChart(animate = true) {
    const { returnsView, returnsRange } = store.getState();
    const data = getReturnsData(returnsView, returnsRange);
    drawBarChart('returns-canvas', data, animate);
  }

  function renderDesktopRecentFilings() {
    const feed = document.getElementById('bento-activity-feed');
    if (!feed) return;
    const latest = allTransactions.slice(0, 8);
    feed.innerHTML = latest.map(tx => {
      const isBuy = tx.type === 'Acquired';
      const sign = isBuy ? '+' : '-';
      const color = isBuy ? 'text-emerald-400' : 'text-rose-400';
      return `
        <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors">
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
  }

  function filterDesktopHoldings() {
    const search = (document.getElementById('holdings-search')?.value || '').toLowerCase().trim();
    const sector = document.getElementById('holdings-sector-filter')?.value || 'all';
    const holdings = getRawData()?.holdings || [];

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
              <a href="${getKlseLink(h.stock_name, h.company_name)}" target="_blank" class="font-bold text-white hover:text-primary transition-colors">${h.stock_name}</a>
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

  function filterDesktopTransactions() {
    const search = (document.getElementById('tx-search')?.value || '').toLowerCase().trim();
    const type = document.getElementById('tx-filter-type')?.value || 'all';

    const filtered = allTransactions.filter(tx => {
      const matchSearch = !search || tx.stock.toLowerCase().includes(search) || tx.company.toLowerCase().includes(search);
      const matchType = type === 'all' || tx.type === type;
      return matchSearch && matchType;
    });

    const tbody = document.getElementById('tx-tbody');
    if (!tbody) return;

    tbody.innerHTML = filtered.slice(0, 50).map(tx => {
      const isBuy = tx.type === 'Acquired';
      const badgeClass = isBuy ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      return `
        <tr class="hover:bg-white/[0.02] transition-colors border-b border-white/[0.04]">
          <td class="py-3 px-3 text-outline font-mono text-[11px]">${tx.date}</td>
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
            <a href="${tx.url}" target="_blank" class="inline-flex items-center justify-center p-1 rounded-lg text-outline hover:text-primary transition-colors">
              <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    const countBadge = document.getElementById('tx-count');
    if (countBadge) countBadge.textContent = filtered.length;
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
          updateMobilePortfolioChart(btn.dataset.range);
        });
      }
    } else if (state.activeTab === 'holdings') {
      const search = document.getElementById('mobile-holdings-search');
      if (search) search.addEventListener('input', filterMobileHoldings);

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
          updateMobileReturnsChart();
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
          updateMobileReturnsChart();
        });
      }
    } else if (state.activeTab === 'transactions') {
      const search = document.getElementById('mobile-tx-search');
      if (search) search.addEventListener('input', filterMobileTransactions);

      const pills = document.getElementById('mobile-tx-type-pills');
      if (pills) {
        pills.addEventListener('click', (e) => {
          const btn = e.target.closest('.tx-type-pill');
          if (!btn) return;
          document.querySelectorAll('#mobile-tx-type-pills .tx-type-pill').forEach(b => b.classList.remove('active', 'ring-2', 'ring-primary'));
          btn.classList.add('active', 'ring-2', 'ring-primary');
          store.setState({ txType: btn.dataset.type });
          filterMobileTransactions();
        });
      }
    }
  }

  function renderActiveMobileTab(tab) {
    if (tab === 'dashboard') {
      updateMobilePortfolioChart(store.getState().portfolioRange);
      renderMobileRecentFilings();
      setupLineChartHover('mobile-portfolio-canvas');
    } else if (tab === 'holdings') {
      filterMobileHoldings();
    } else if (tab === 'returns') {
      updateMobileReturnsChart(true);
      renderMobileReturnsSummary();
      setupBarChartHover('mobile-returns-canvas', () => store.setState({ activeTab: 'transactions' }));
    } else if (tab === 'transactions') {
      filterMobileTransactions();
    }
  }

  function updateMobilePortfolioChart(range) {
    const series = getPortfolioTimeSeries(range);
    drawLineChart('mobile-portfolio-canvas', series, null, true);
  }

  function updateMobileReturnsChart(animate = true) {
    const { returnsView, returnsRange } = store.getState();
    const data = getReturnsData(returnsView, returnsRange);
    drawBarChart('mobile-returns-canvas', data, animate);
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
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="shrink-0">${renderStockLogo(tx.stock, tx.company, 28)}</div>
            <div class="min-w-0">
              <div class="font-bold text-xs text-white truncate">${tx.stock}</div>
              <div class="text-[10px] text-outline truncate">${tx.company}</div>
            </div>
          </div>
          <div class="text-right shrink-0 ml-2 font-mono-numeric">
            <div class="text-xs font-bold ${color}">${sign}${tx.amount.toLocaleString()}</div>
            <div class="text-[9px] text-outline">${tx.date}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function filterMobileHoldings() {
    const search = (document.getElementById('mobile-holdings-search')?.value || '').toLowerCase().trim();
    const sector = store.getState().holdingsSector || 'all';
    const holdings = getRawData()?.holdings || [];

    const filtered = holdings.filter(h => {
      const matchSearch = !search || h.stock_name.toLowerCase().includes(search) || h.company_name.toLowerCase().includes(search);
      const matchSector = sector === 'all' || h.sector === sector;
      return matchSearch && matchSector;
    });

    const list = document.getElementById('mobile-holdings-list');
    if (!list) return;

    list.innerHTML = filtered.map(h => {
      return `
        <div class="glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            ${renderStockLogo(h.stock_name, h.company_name, 34)}
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-sm text-white">${h.stock_name}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-outline">${h.sector}</span>
              </div>
              <div class="text-xs text-outline truncate mt-0.5">${h.company_name}</div>
            </div>
          </div>
          <div class="text-right shrink-0 ml-2 font-mono-numeric">
            <div class="text-xs font-bold text-white">${formatCurrency(h.market_value)}</div>
            <div class="text-[11px] text-emerald-400 font-semibold mt-0.5">${h.direct_percent?.toFixed(2)}% in co</div>
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
      <div class="glass-card p-3 rounded-xl">
        <span class="text-[10px] font-bold text-outline uppercase">Acquired</span>
        <div class="text-lg font-bold text-emerald-400 font-mono-numeric mt-1">+${formatCompact(totalAcquired)}</div>
      </div>
      <div class="glass-card p-3 rounded-xl">
        <span class="text-[10px] font-bold text-outline uppercase">Disposed</span>
        <div class="text-lg font-bold text-rose-400 font-mono-numeric mt-1">-${formatCompact(totalDisposed)}</div>
      </div>
      <div class="glass-card p-3 rounded-xl">
        <span class="text-[10px] font-bold text-outline uppercase">Net Flow</span>
        <div class="text-lg font-bold ${totalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-mono-numeric mt-1">${totalNet >= 0 ? '+' : ''}${formatCompact(totalNet)}</div>
      </div>
      <div class="glass-card p-3 rounded-xl">
        <span class="text-[10px] font-bold text-outline uppercase">Filings</span>
        <div class="text-lg font-bold text-white font-mono-numeric mt-1">${totalTx.toLocaleString()}</div>
      </div>
    `;
  }

  function filterMobileTransactions() {
    const search = (document.getElementById('mobile-tx-search')?.value || '').toLowerCase().trim();
    const type = store.getState().txType || 'all';

    const filtered = allTransactions.filter(tx => {
      const matchSearch = !search || tx.stock.toLowerCase().includes(search) || tx.company.toLowerCase().includes(search);
      const matchType = type === 'all' || tx.type === type;
      return matchSearch && matchType;
    });

    const feed = document.getElementById('mobile-tx-feed');
    if (!feed) return;

    feed.innerHTML = filtered.slice(0, 40).map(tx => {
      const isBuy = tx.type === 'Acquired';
      const badgeClass = isBuy ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      return `
        <div class="glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-2.5 min-w-0">
            ${renderStockLogo(tx.stock, tx.company, 32)}
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs text-white">${tx.stock}</span>
                <span class="px-1.5 py-0.2 rounded text-[9px] font-bold border ${badgeClass}">${tx.type}</span>
              </div>
              <div class="text-[11px] text-outline truncate mt-0.5">${tx.company}</div>
            </div>
          </div>
          <div class="text-right shrink-0 ml-2 font-mono-numeric">
            <div class="text-xs font-bold ${isBuy ? 'text-emerald-400' : 'text-rose-400'}">${isBuy ? '+' : '-'}${tx.amount.toLocaleString()}</div>
            <div class="text-[10px] text-outline">${tx.date}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function handleTabSwitch(tab) {
    const isMobile = window.innerWidth < 768;
    const container = document.getElementById(isMobile ? 'mobile-view-container' : 'desktop-view-container');
    if (!container) return;

    container.innerHTML = isMobile ? renderMobileViewContent(tab) : renderDesktopViewContent(tab);

    if (isMobile) {
      document.querySelectorAll('#mobile-tab-nav .mobile-tab-btn').forEach(btn => {
        const active = btn.dataset.tab === tab;
        btn.classList.toggle('text-primary', active);
        btn.classList.toggle('font-bold', active);
        btn.classList.toggle('active', active);
        btn.classList.toggle('text-outline', !active);
      });
      bindMobileEvents();
      requestAnimationFrame(() => {
        renderActiveMobileTab(tab);
        observeChartContainers();
      });
    } else {
      document.querySelectorAll('#desktop-tab-nav .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
      });
      bindDesktopEvents();
      requestAnimationFrame(() => {
        renderActiveDesktopTab(tab);
        observeChartContainers();
      });
    }
  }

  function redrawActiveCharts(animate = false) {
    const isMobile = window.innerWidth < 768;
    const tab = store.getState().activeTab;
    if (tab === 'dashboard') {
      if (isMobile) updateMobilePortfolioChart(store.getState().portfolioRange);
      else {
        const series = getPortfolioTimeSeries(store.getState().portfolioRange);
        drawLineChart('portfolio-canvas', series, null, animate);
      }
    } else if (tab === 'holdings' && !isMobile) {
      const cData = getPieData('company');
      const sData = getPieData('sector');
      drawPieChart('pie-company-canvas', cData, 'company');
      drawPieChart('pie-sector-canvas', sData, 'sector');
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
  // AUTO-INIT ON DOM READY
  // ----------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  window.EPFTracker = { initApp, store };
})();
