/**
 * Set A: Desktop Holdings View
 * Allocation Donut Charts & Interactive Sortable Holdings Table
 */

import { formatCompact, formatCurrency, getKlseLink } from '../../core/utils.js';
import { renderStockLogo } from '../../core/data.js';

export function renderDesktopHoldings(data = window.EPF_DATA) {
  const holdings = data?.holdings || [];
  const sectors = [...new Set(holdings.map(h => h.sector))].sort();

  return `
    <div id="desktop-panel-holdings" class="flex flex-col gap-3.5 w-full h-full min-w-0 pt-2 pb-1 overflow-hidden">
      <!-- Allocation Donut Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 shrink-0">
        <!-- Top 10 Company Allocation -->
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

        <!-- Sector Macro Allocation -->
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

      <!-- Domestic Equities Full Data Table Card -->
      <div class="glass-card table-card p-4 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 mb-2.5 shrink-0">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-on-surface tracking-tight">Domestic Equity Positions</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20" id="holdings-count">${holdings.length}</span>
          </div>
          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <!-- Search Input -->
            <div class="relative flex-1 sm:w-56">
              <input type="text" id="holdings-search" placeholder="Search ticker / company..." class="w-full bg-surface-container-low border border-white/10 rounded-lg px-3 py-1.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
            </div>
            <!-- Sector Filter Dropdown -->
            <select id="holdings-sector-filter" class="bg-surface-container-low border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary/50">
              <option value="all">All Sectors</option>
              ${sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
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
