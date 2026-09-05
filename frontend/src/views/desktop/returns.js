/**
 * Set A: Desktop Returns View
 * Net Capital Activity Canvas, Search & Movers, & 6 Key Financial Metrics
 * Perfectly fitted single-screen viewport without page scroll
 */

export function renderDesktopReturns() {
  return `
    <div id="desktop-panel-returns" class="flex flex-col gap-3 h-full w-full min-w-0 pt-1 pb-0.5 overflow-hidden">
      <!-- Main Bento Grid (Left 2 cols: Chart | Right 1 col: Search & Movers) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0 w-full">
        <!-- Main Net Activity Chart Card -->
        <div class="lg:col-span-2 glass-card returns-chart-card p-5 glow-hover transition-all flex flex-col min-w-0 w-full overflow-hidden h-full min-h-0">
          <div class="flex justify-between items-center mb-2.5 flex-wrap gap-3 shrink-0">
            <div>
              <h3 class="text-base font-bold text-on-surface tracking-tight">Net Capital Activity</h3>
              <span class="text-xs text-outline">Accumulation vs Divestment volume over time</span>
            </div>
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div class="chart-toggle-group flex gap-0.5" id="returns-time-toggle">
                <button class="chart-toggle active" data-range="1M">1M</button>
                <button class="chart-toggle" data-range="3M">3M</button>
                <button class="chart-toggle" data-range="1Y">1Y</button>
                <button class="chart-toggle" data-range="ALL">All Time</button>
              </div>
              <div class="chart-toggle-group flex gap-0.5" id="returns-toggle">
                <button class="chart-toggle active" data-view="net">Net</button>
                <button class="chart-toggle" data-view="acquired">Acquired</button>
                <button class="chart-toggle" data-view="disposed">Disposed</button>
              </div>
            </div>
          </div>
          <div class="chart-body-tall flex-1 relative min-h-0 w-full">
            <canvas id="returns-canvas" class="w-full h-full block absolute inset-0"></canvas>
          </div>
        </div>

        <!-- Right: Search Launcher & Top Capital Movers -->
        <div class="flex flex-col gap-2.5 h-full min-h-0">
          <!-- Simplified Search Launcher Bar -->
          <div class="p-2.5 px-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-primary/40 transition-all flex items-center justify-between gap-2 shadow-md group cursor-pointer shrink-0" onclick="window.openStockHistoryDrawer('MAYBANK'); setTimeout(() => document.getElementById('drawer-stock-search')?.focus(), 250);" title="Search past holding history for any stock">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-5 h-5 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <span class="text-xs text-outline group-hover:text-white transition-colors truncate">Search stock history (e.g. MAYBANK, TENAGA)...</span>
            </div>
            <span class="text-xs font-semibold text-primary flex items-center gap-0.5 shrink-0">
              <span>Search</span>
              <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>

          <!-- Top Capital Movers Card -->
          <div class="glass-card p-4 glow-hover transition-all flex-1 min-h-0 flex flex-col overflow-hidden" id="returns-movers"></div>
        </div>
      </div>

      <!-- Bottom: Summary Cards Grid (6 Columns) -->
      <div class="summary-cards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 w-full shrink-0" id="returns-summary"></div>
    </div>
  `;
}
