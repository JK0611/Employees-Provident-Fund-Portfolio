/**
 * Set A: Desktop Dashboard View
 * 3-column Bento grid, hero holding card, live activity ticker & momentum chart
 */

import { formatCompact, formatCurrency, ICONSTACK } from '../../core/utils.js';
import { renderStockLogo } from '../../core/data.js';

export function renderDesktopDashboard(data = window.EPF_DATA) {
  const holdings = data?.holdings || [];
  const totalMarketValue = holdings.reduce((s, h) => s + (h.market_value || 0), 0);

  // Sector stats
  const sectorMap = {};
  holdings.forEach(h => { sectorMap[h.sector] = (sectorMap[h.sector] || 0) + (h.market_value || 0); });
  const sortedSectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
  const topSector = sortedSectors[0] || ['Loading...', 0];
  const topSectorPct = totalMarketValue > 0 ? ((topSector[1] / totalMarketValue) * 100).toFixed(1) : '0.0';

  // Top Holding
  const sortedHoldings = [...holdings].sort((a, b) => (b.market_value || 0) - (a.market_value || 0));
  const topHolding = sortedHoldings[0] || { stock_name: 'TENAGA', company_name: 'TENAGA NASIONAL BHD', market_value: 0, direct_percent: 0 };

  // Top Sector Overlapping Logos
  const sectorHoldings = holdings.filter(h => h.sector === topSector[0]).sort((a, b) => (b.market_value || 0) - (a.market_value || 0)).slice(0, 3);
  const sectorLogosHtml = sectorHoldings.map((h, i) => `
    <div class="relative w-7 h-7 rounded-full border border-white/20 overflow-hidden flex items-center justify-center shadow-md shrink-0 -ml-1.5 first:ml-0" style="z-index: ${30 - i * 10}">
      ${renderStockLogo(h.stock_name, h.company_name, 28)}
    </div>
  `).join('');

  return `
    <div id="desktop-panel-dashboard" class="flex flex-col gap-6 w-full min-w-0">
      <!-- Header Metrics Area -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold uppercase tracking-widest text-outline">Institutional Portfolio</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">Active Scope</span>
        </div>
        <div class="flex items-baseline gap-3">
          <h2 class="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-mono-numeric" id="desktop-total-val">
            ${formatCurrency(totalMarketValue)}
          </h2>
          <span class="badge-pill-success text-xs font-semibold">
            <svg class="w-3.5 h-3.5 text-emerald-400 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
            +2.4%
          </span>
        </div>
      </div>

      <!-- Bento Metric Cards (Top Row) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Top Sector Card -->
        <div id="bento-sector-card" class="glass-card p-6 flex flex-col justify-between min-h-[160px] relative group cursor-pointer">
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Top Sector Allocation</span>
              <svg class="w-3.5 h-3.5 text-outline/60 cursor-help" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div class="flex items-center" id="bento-sector-logos">
              ${sectorLogosHtml}
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-on-surface tracking-tight" id="bento-sector-name">${topSector[0]}</div>
            <div class="flex items-center justify-between text-xs mt-2 font-mono-numeric">
              <span class="text-on-surface font-semibold" id="bento-sector-val">RM ${formatCompact(topSector[1])}</span>
              <span class="text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20" id="bento-sector-pct">${topSectorPct}%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
              <div class="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-700 shadow-sm" style="width: ${topSectorPct}%;" id="bento-sector-progress"></div>
            </div>
          </div>
        </div>

        <!-- Top Holding Spotlight Card -->
        <div id="bento-holding-card" class="glass-card p-6 flex flex-col justify-between min-h-[160px] relative group cursor-pointer">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Top Holding Spotlight</span>
              <svg class="w-3.5 h-3.5 text-outline/60 cursor-help" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div class="relative flex h-10 w-10 shrink-0 items-center justify-center" id="bento-holding-logo-container">
              ${renderStockLogo(topHolding.stock_name, topHolding.company_name, 38)}
            </div>
          </div>
          <div>
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-bold text-on-surface tracking-tight" id="bento-holding-symbol">${topHolding.stock_name}</span>
              <span class="text-xs text-outline font-medium truncate max-w-[140px]" id="bento-holding-name">${topHolding.company_name}</span>
            </div>
            <div class="text-xs mt-2 flex justify-between items-center font-mono-numeric">
              <span class="text-on-surface font-bold text-sm" id="bento-holding-val">${formatCurrency(topHolding.market_value || 0)}</span>
              <span class="badge-pill-success text-xs" id="bento-holding-pct">
                ${ICONSTACK.arrow_upward}${topHolding.direct_percent.toFixed(3)}% in company
              </span>
            </div>
          </div>
        </div>

        <!-- Active Positions Card -->
        <div id="bento-active-card" class="glass-card p-6 flex flex-col justify-between min-h-[160px] relative group cursor-pointer">
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-bold uppercase tracking-wider text-outline">Active Positions</span>
              <svg class="w-3.5 h-3.5 text-outline/60 cursor-help" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div class="flex items-center justify-center text-primary filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
              ${ICONSTACK.layout_grid}
            </div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-on-surface tracking-tight font-mono-numeric" id="bento-active-count">${holdings.length} positions</div>
            <div class="text-xs text-outline mt-1.5 font-medium" id="bento-unique-count">${data?.uniqueStocks || holdings.length} unique stocks across ${sortedSectors.length} sectors</div>
          </div>
        </div>
      </div>

      <!-- Main Chart & Feed Bento Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Cumulative Portfolio Value Chart -->
        <div class="lg:col-span-2 glass-card portfolio-trend-card p-6 glow-hover transition-all flex flex-col min-h-[400px]">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-base font-bold text-on-surface tracking-tight">Portfolio Trend</h3>
              <span class="text-xs text-outline">Cumulative net shareholdings momentum</span>
            </div>

            <!-- Time Range Toggle -->
            <div class="chart-toggle-group flex gap-0.5" id="time-toggle">
              <button class="chart-toggle active" data-range="1M">1M</button>
              <button class="chart-toggle" data-range="3M">3M</button>
              <button class="chart-toggle" data-range="1Y">1Y</button>
              <button class="chart-toggle" data-range="ALL">All Time</button>
            </div>
          </div>
          <div class="chart-body flex-1 relative min-h-[280px]">
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

        <!-- Recent Filings Feed -->
        <div class="glass-card recent-filings-card p-6 glow-hover transition-all flex flex-col min-h-[400px]">
          <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
            <div>
              <h3 class="text-base font-bold text-on-surface tracking-tight">Recent Filings</h3>
              <span class="text-xs text-outline">Bursa announcements feed</span>
            </div>
            <svg class="w-5 h-5 text-outline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
          </div>
          <div class="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar" id="bento-activity-feed">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    </div>
  `;
}
