/**
 * Set A: Desktop Transactions View
 * Substantial Shareholder Notices Full Data Table
 */

import { renderStockLogo } from '../../core/data.js';

export function renderDesktopTransactions() {
  return `
    <div id="desktop-panel-transactions" class="flex flex-col h-full w-full min-w-0 pt-2 pb-1 overflow-hidden">
      <!-- EPF Bursa Filings Data Table Card -->
      <div class="glass-card table-card p-5 flex flex-col flex-1 h-full min-h-0 overflow-hidden">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3.5 shrink-0">
          <div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <h3 class="text-base font-bold text-on-surface tracking-tight">EPF Bursa Filings</h3>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 font-mono-numeric" id="tx-count">122,381 Filings</span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.04] text-outline border border-white/10 flex items-center gap-1.5" id="tx-latest-badge" title="Latest Bursa Malaysia announcement in database">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Latest Update: <span class="text-white font-semibold" id="tx-latest-date">04 Sep 2026</span>
              </span>
            </div>
            <span class="text-xs text-outline mt-0.5">Substantial Shareholder Notices</span>
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <!-- Search Input -->
            <div class="relative flex-1 md:w-64">
              <input type="text" id="tx-search" placeholder="Search stock / company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
            </div>
            <!-- Type Filter Dropdown -->
            <select id="tx-filter-type" class="bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50">
              <option value="all">All Types</option>
              <option value="Acquired">Acquired (Buy)</option>
              <option value="Disposed">Disposed (Sell)</option>
            </select>
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
