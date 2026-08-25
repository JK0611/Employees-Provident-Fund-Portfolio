/**
 * Set B: Mobile Dashboard View
 * Touch-optimized layout with pocket metrics, sparklines & live filings
 */

import { formatCompact, formatCurrency, ICONSTACK } from '../../core/utils.js';
import { renderStockLogo } from '../../core/data.js';

export function renderMobileDashboard(data = window.EPF_DATA) {
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

  return `
    <div id="mobile-panel-dashboard" class="flex flex-col gap-4 w-full pb-20">
      <!-- Mobile Brand Header -->
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

      <!-- Hero Valuation Card -->
      <div class="glass-card p-4 rounded-2xl flex flex-col gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-outline">EPF Malaysia Portfolio</span>
        <div class="flex items-baseline justify-between">
          <h2 class="text-2xl font-black text-white font-mono-numeric tracking-tight" id="mobile-total-val">
            ${formatCurrency(totalMarketValue)}
          </h2>
          <span class="badge-pill-success text-[11px] font-bold">
            +2.4%
          </span>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Top Sector -->
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

        <!-- Top Holding -->
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

      <!-- Portfolio Trend Chart Card -->
      <div class="glass-card p-4 rounded-2xl flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-white">Portfolio Trend</h3>
            <span class="text-[10px] text-outline">Net shareholdings</span>
          </div>
          <!-- Time Range Toggle -->
          <div class="chart-toggle-group flex gap-0.5" id="mobile-time-toggle">
            <button class="chart-toggle active text-[10px] px-2.5 py-1" data-range="1M">1M</button>
            <button class="chart-toggle text-[10px] px-2.5 py-1" data-range="3M">3M</button>
            <button class="chart-toggle text-[10px] px-2.5 py-1" data-range="1Y">1Y</button>
            <button class="chart-toggle text-[10px] px-2.5 py-1" data-range="ALL">All</button>
          </div>
        </div>
        <div class="chart-body h-[210px] w-full relative overflow-hidden">
          <canvas id="mobile-portfolio-canvas"></canvas>
        </div>
      </div>

      <!-- Recent Bursa Filings List -->
      <div class="glass-card p-4 rounded-2xl flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white">Recent Bursa Filings</h3>
          <span class="text-[10px] text-outline">Latest notices</span>
        </div>
        <div class="space-y-2" id="mobile-activity-feed">
          <!-- Dynamically populated -->
        </div>
      </div>
    </div>
  `;
}
