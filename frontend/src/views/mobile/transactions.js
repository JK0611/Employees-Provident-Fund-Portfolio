/**
 * Set B: Mobile Transactions View
 * Touch-optimized transaction stream with quick filter pills
 */

export function renderMobileTransactions() {
  return `
    <div id="mobile-panel-transactions" class="flex flex-col gap-3.5 w-full pb-20 pt-2">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-extrabold text-white tracking-tight">EPF Transactions</h2>
          <div class="text-[10px] text-outline flex items-center gap-1.5 mt-0.5">
            <span>Substantial Shareholder Notices</span>
            <span>•</span>
            <span class="text-emerald-400 font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span id="mobile-tx-latest-date">04 Sep 2026</span>
            </span>
          </div>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 font-mono-numeric" id="mobile-tx-count">122,381 Filings</span>
      </div>

      <!-- Search & Type Filter -->
      <div class="flex flex-col gap-2">
        <input type="text" id="mobile-tx-search" placeholder="Search filings..." class="w-full bg-surface-container-low border border-white/10 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50">
        
        <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5 text-xs" id="mobile-tx-type-pills">
          <button class="tx-type-pill active px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[11px] font-semibold whitespace-nowrap shrink-0" data-type="all">All Filings</button>
          <button class="tx-type-pill px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] whitespace-nowrap shrink-0" data-type="Acquired">Acquired (Buy)</button>
          <button class="tx-type-pill px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] whitespace-nowrap shrink-0" data-type="Disposed">Disposed (Sell)</button>
        </div>
      </div>

      <!-- Transaction Items Feed -->
      <div class="space-y-2.5" id="mobile-tx-feed">
        <!-- Dynamically populated -->
      </div>
    </div>
  `;
}
