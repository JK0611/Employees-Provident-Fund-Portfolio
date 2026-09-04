/**
 * EPF Tracker — Core Data & Calculation Engine
 * High-speed aggregations, valuations, and time-series computations
 */

import { stockColor } from './utils.js';
import { BURSA_LOGOS } from './logos.js';

let logoMap = {};

// Initialize logo map from bundled list
BURSA_LOGOS.forEach(item => {
  const key = item.company.toUpperCase().trim();
  logoMap[key] = item.logo_url;
});

export async function initLogoMap() {
  // Already preloaded in memory
  return true;
}

export function getLogoUrl(company, stock) {
  const normComp = (company || '').toUpperCase().trim();
  if (logoMap[normComp]) return logoMap[normComp];
  const firstWord = normComp.split(' ')[0];
  if (logoMap[firstWord]) return logoMap[firstWord];
  const stockKey = (stock || '').toUpperCase().trim();
  if (logoMap[stockKey]) return logoMap[stockKey];
  return '';
}

export function renderStockLogo(stock, company, size = 32) {
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

export function flattenTransactions(rawData = window.EPF_DATA) {
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

export function getPortfolioTimeSeries(range = '1M', rawData = window.EPF_DATA) {
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
    return {
      label: d.label,
      value: cumulative,
      date: d.date
    };
  });
}

export function getReturnsData(view = 'net', range = '1M', rawData = window.EPF_DATA) {
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

export function getTotalTransactionsCount(rawData = window.EPF_DATA) {
  if (rawData && typeof rawData.totalTransactions === 'number') {
    return rawData.totalTransactions;
  }
  if (rawData && rawData.transactions) {
    return rawData.transactions.length;
  }
  return 122381;
}

export function getLatestUpdateDate(rawData = window.EPF_DATA) {
  if (rawData && rawData.lastUpdated) {
    return rawData.lastUpdated;
  }
  if (rawData && rawData.transactions && rawData.transactions.length > 0 && rawData.transactions[0].date) {
    return rawData.transactions[0].date;
  }
  return '04 Sep 2026';
}
