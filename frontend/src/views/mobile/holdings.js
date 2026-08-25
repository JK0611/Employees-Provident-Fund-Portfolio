/**
 * Set B: Mobile Holdings View
 * Native mobile card feed with smooth touch scroll and search
 */

import { formatCompact, formatCurrency, getKlseLink } from '../../core/utils.js';
import { renderStockLogo } from '../../core/data.js';

export function renderMobileHoldings(data = window.EPF_DATA) {
  const holdings = data?.holdings || [];
  const sectors = [...new Set(holdings.map(h => h.sector))].sort();

  return `
    <div id="mobile-panel-holdings" class="flex flex-col gap-3.5 w-full pb-20">
      <!-- Search & Filter Bar -->
      <div class="flex flex-col gap-2 pt-2">
        <div class="relative w-full">
          <input type="text" id="mobile-holdings-search" placeholder="Search stock or company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
        </div>
        <!-- Horizontal Scrollable Sector Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 text-xs" id="mobile-sector-pills">
          <button class="sector-pill active px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[11px] font-semibold whitespace-nowrap shrink-0" data-sector="all">All (${holdings.length})</button>
          ${sectors.map(s => `<button class="sector-pill px-3 py-1 rounded-full bg-white/[0.04] text-outline hover:text-white border border-white/10 text-[11px] whitespace-nowrap shrink-0" data-sector="${s}">${s}</button>`).join('')}
        </div>
      </div>

      <!-- Mobile Holdings Card Stream -->
      <div class="space-y-2.5" id="mobile-holdings-list">
        <!-- Dynamically rendered card items -->
      </div>
    </div>
  `;
}
