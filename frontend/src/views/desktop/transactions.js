/**
 * Set A: Desktop Transactions View
 * Interactive Bursa Malaysia Transaction Log with Advanced Multi-filtering & Pagination
 */

export function renderDesktopTransactions() {
  return `
    <div id="desktop-panel-transactions" class="flex flex-col gap-6 w-full min-w-0">
      <div class="glass-card table-card p-6 flex flex-col gap-4">
        <!-- Header & Quick Filters -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-on-surface tracking-tight">EPF Bursa Filings</h3>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20" id="tx-count">0</span>
            </div>
            <span class="text-xs text-outline mt-0.5" id="tx-last-update">Substantial Shareholder Notices</span>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <!-- Search -->
            <div class="relative flex-1 md:w-64">
              <input type="text" id="tx-search" placeholder="Search stock / company..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
            </div>

            <!-- Type Filter -->
            <select id="tx-filter-type" class="bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary/50">
              <option value="all">All Types</option>
              <option value="Acquired">Acquired (Buy)</option>
              <option value="Disposed">Disposed (Sell)</option>
            </select>
          </div>
        </div>

        <!-- Transactions Table -->
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
            <tbody id="tx-tbody" class="divide-y divide-white/[0.04]">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div class="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-outline" id="tx-pagination">
          <span id="tx-page-info">Showing 1 - 50 of 0</span>
          <div class="flex items-center gap-2">
            <button id="tx-prev-btn" class="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Previous</button>
            <button id="tx-next-btn" class="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
