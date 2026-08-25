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
    <div id="desktop-panel-holdings" class="flex flex-col gap-6 w-full min-w-0">
      <!-- Allocation Donut Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top 10 Company Allocation -->
        <div class="glass-card p-6 flex flex-col min-h-[360px]" id="pie-company-card">
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

        <!-- Sector Macro Allocation -->
        <div class="glass-card p-6 flex flex-col min-h-[360px]" id="pie-sector-card">
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

      <!-- Domestic Equities Full Data Table -->
      <div class="glass-card table-card p-6 flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-on-surface tracking-tight">Domestic Equity Positions</h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20" id="holdings-count">${holdings.length}</span>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Search Input -->
            <div class="relative flex-1 sm:w-64">
              <input type="text" id="holdings-search" placeholder="Search ticker / company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
            </div>
            <!-- Sector Filter Dropdown -->
            <select id="holdings-sector-filter" class="bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50">
              <option value="all">All Sectors</option>
              ${sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Table Container -->
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
            <tbody id="holdings-tbody" class="divide-y divide-white/[0.04]">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
