/**
 * EPF Tracker — Industry Standard Modular Application Orchestrator
 * High-performance adaptive view switcher (Set A Desktop vs Set B Mobile)
 */

import { store } from './core/state.js';
import { formatCompact, formatCurrency, getKlseLink, ICONSTACK } from './core/utils.js';
import { initLogoMap, renderStockLogo, flattenTransactions, getPortfolioTimeSeries, getReturnsData } from './core/data.js';
import { drawLineChart } from './charts/line-chart.js';
import { drawBarChart, setupBarChartHover } from './charts/bar-chart.js';
import { drawPieChart, getPieData, renderPieLegend } from './charts/pie-chart.js';

// Desktop Set A
import { renderDesktopNav } from './views/desktop/nav.js';
import { renderDesktopDashboard } from './views/desktop/dashboard.js';
import { renderDesktopHoldings } from './views/desktop/holdings.js';
import { renderDesktopReturns } from './views/desktop/returns.js';
import { renderDesktopTransactions } from './views/desktop/transactions.js';

// Mobile Set B
import { renderMobileNav } from './views/mobile/nav.js';
import { renderMobileDashboard } from './views/mobile/dashboard.js';
import { renderMobileHoldings } from './views/mobile/holdings.js';
import { renderMobileReturns } from './views/mobile/returns.js';
import { renderMobileTransactions } from './views/mobile/transactions.js';

let allTransactions = [];
let currentDeviceMode = null; // 'desktop' | 'mobile'

export async function initApp() {
  await initLogoMap();
  allTransactions = flattenTransactions(window.EPF_DATA);

  // Initial mount
  mountApp();

  // Watch state changes
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
}

function mountApp() {
  const isMobile = window.innerWidth < 768;
  currentDeviceMode = isMobile ? 'mobile' : 'desktop';
  const root = document.getElementById('app-root');
  if (!root) return;

  const state = store.getState();

  if (isMobile) {
    // ------------------------------------
    // MOUNT SET B: MOBILE WORKSPACE
    // ------------------------------------
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
    renderActiveMobileTab(state.activeTab);
  } else {
    // ------------------------------------
    // MOUNT SET A: DESKTOP WORKSPACE
    // ------------------------------------
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
    renderActiveDesktopTab(state.activeTab);
  }
}

// ----------------------------------------------------
// DESKTOP VIEW CONTROLLER (SET A)
// ----------------------------------------------------
function renderDesktopViewContent(tab) {
  switch (tab) {
    case 'holdings': return renderDesktopHoldings(window.EPF_DATA);
    case 'returns': return renderDesktopReturns();
    case 'transactions': return renderDesktopTransactions();
    default: return renderDesktopDashboard(window.EPF_DATA);
  }
}

function bindDesktopEvents() {
  // Navigation Tabs
  document.querySelectorAll('#desktop-tab-nav .tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.dataset.tab;
      if (tab) store.setState({ activeTab: tab });
    });
  });

  const state = store.getState();
  if (state.activeTab === 'dashboard') {
    // Dashboard Bento Time Toggle
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

    // Top Holding Card Jump
    const holdingCard = document.getElementById('bento-holding-card');
    if (holdingCard) {
      holdingCard.addEventListener('click', () => {
        store.setState({ activeTab: 'holdings' });
      });
    }

    // Active Positions Card Jump
    const activeCard = document.getElementById('bento-active-card');
    if (activeCard) {
      activeCard.addEventListener('click', () => {
        store.setState({ activeTab: 'holdings' });
      });
    }
  } else if (state.activeTab === 'holdings') {
    // Holdings Filters
    const searchInput = document.getElementById('holdings-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => filterDesktopHoldings());
    }
    const sectorFilter = document.getElementById('holdings-sector-filter');
    if (sectorFilter) {
      sectorFilter.addEventListener('change', () => filterDesktopHoldings());
    }
  } else if (state.activeTab === 'returns') {
    // Returns Time Toggle
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

    // Returns Flow Toggle
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
    if (txSearch) txSearch.addEventListener('input', () => filterDesktopTransactions());
    const txType = document.getElementById('tx-filter-type');
    if (txType) txType.addEventListener('change', () => filterDesktopTransactions());
  }
}

function renderActiveDesktopTab(tab) {
  if (tab === 'dashboard') {
    updateDesktopPortfolioChart(store.getState().portfolioRange);
    renderDesktopRecentFilings();
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
    setupBarChartHover('returns-canvas', (d) => {
      store.setState({ activeTab: 'transactions' });
    });
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
          <div class="relative shrink-0">
            ${renderStockLogo(tx.stock, tx.company, 32)}
          </div>
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
  const holdings = window.EPF_DATA?.holdings || [];

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
  const dates = Object.values(window.EPF_DATA?.txByDate || {});
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
        <div class="text-xl font-extrabold text-white font-mono-numeric">${window.EPF_DATA?.uniqueStocks || 260}</div>
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

  const page = store.getState().txPage || 1;
  const perPage = 50;
  const slice = filtered.slice(0, page * perPage);

  tbody.innerHTML = slice.map(tx => {
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
// MOBILE VIEW CONTROLLER (SET B)
// ----------------------------------------------------
function renderMobileViewContent(tab) {
  switch (tab) {
    case 'holdings': return renderMobileHoldings(window.EPF_DATA);
    case 'returns': return renderMobileReturns();
    case 'transactions': return renderMobileTransactions();
    default: return renderMobileDashboard(window.EPF_DATA);
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
    if (search) search.addEventListener('input', () => filterMobileHoldings());

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
    if (search) search.addEventListener('input', () => filterMobileTransactions());

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
  } else if (tab === 'holdings') {
    filterMobileHoldings();
  } else if (tab === 'returns') {
    updateMobileReturnsChart(true);
    renderMobileReturnsSummary();
    setupBarChartHover('mobile-returns-canvas', () => {
      store.setState({ activeTab: 'transactions' });
    });
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
          <div class="shrink-0">
            ${renderStockLogo(tx.stock, tx.company, 28)}
          </div>
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
  const holdings = window.EPF_DATA?.holdings || [];
  const totalVal = holdings.reduce((s, h) => s + (h.market_value || 0), 0);

  const filtered = holdings.filter(h => {
    const matchSearch = !search || h.stock_name.toLowerCase().includes(search) || h.company_name.toLowerCase().includes(search);
    const matchSector = sector === 'all' || h.sector === sector;
    return matchSearch && matchSector;
  });

  const list = document.getElementById('mobile-holdings-list');
  if (!list) return;

  list.innerHTML = filtered.map(h => {
    const pct = totalVal > 0 ? ((h.market_value / totalVal) * 100).toFixed(2) : '0.00';
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
  const dates = Object.values(window.EPF_DATA?.txByDate || {});
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

// ----------------------------------------------------
// TAB SWITCH & CHART REDRAW DISPATCHER
// ----------------------------------------------------
function handleTabSwitch(tab) {
  const isMobile = window.innerWidth < 768;
  const container = document.getElementById(isMobile ? 'mobile-view-container' : 'desktop-view-container');
  if (!container) return;

  container.innerHTML = isMobile ? renderMobileViewContent(tab) : renderDesktopViewContent(tab);

  // Update Nav UI
  if (isMobile) {
    document.querySelectorAll('#mobile-tab-nav .mobile-tab-btn').forEach(btn => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle('text-primary', active);
      btn.classList.toggle('font-bold', active);
      btn.classList.toggle('active', active);
      btn.classList.toggle('text-outline', !active);
    });
    bindMobileEvents();
    renderActiveMobileTab(tab);
  } else {
    document.querySelectorAll('#desktop-tab-nav .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    bindDesktopEvents();
    renderActiveDesktopTab(tab);
  }
}

function redrawActiveCharts() {
  const isMobile = window.innerWidth < 768;
  const tab = store.getState().activeTab;
  if (tab === 'dashboard') {
    if (isMobile) updateMobilePortfolioChart(store.getState().portfolioRange);
    else updateDesktopPortfolioChart(store.getState().portfolioRange);
  } else if (tab === 'returns') {
    if (isMobile) updateMobileReturnsChart(false);
    else updateDesktopReturnsChart(false);
  }
}

function debounce(fn, ms) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}
