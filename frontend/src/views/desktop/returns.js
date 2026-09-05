/**
 * Set A: Desktop Returns View
 * Net Capital Activity Canvas, Search & Movers, & 6 Key Financial Metrics
 * Perfectly fitted single-screen viewport without page scroll
 */

export function renderDesktopReturns() {
  return `
    <div id="desktop-panel-returns" class="flex flex-col gap-2.5 h-full w-full min-w-0 pt-1 pb-1 overflow-hidden">
      <!-- Main Net Activity Chart Card (Flexible, moderately sized) -->
      <div class="glass-card returns-chart-card px-5 py-3 glow-hover transition-all flex flex-col min-w-0 w-full overflow-hidden flex-1 min-h-[160px]">
        <div class="flex justify-between items-center mb-1.5 flex-wrap gap-2 shrink-0">
          <div>
            <h3 class="text-sm sm:text-base font-bold text-on-surface tracking-tight">Net Capital Activity</h3>
            <span class="text-[11px] text-outline">Accumulation vs Divestment volume over time</span>
          </div>
          <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
            <!-- Timeframe Selector -->
            <div class="chart-toggle-group flex gap-0.5" id="returns-time-toggle">
              <button class="chart-toggle active" data-range="1M">1M</button>
              <button class="chart-toggle" data-range="3M">3M</button>
              <button class="chart-toggle" data-range="1Y">1Y</button>
              <button class="chart-toggle" data-range="ALL">All Time</button>
            </div>
            <!-- Flow View Selector -->
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

      <!-- Summary Cards Grid (6 Columns, Uncompressed) -->
      <div class="summary-cards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 w-full shrink-0" id="returns-summary"></div>

      <!-- Picture 1: Search Launcher + Side-by-side Top Net Accumulated & Top Net Divested (4 items each) -->
      <div class="flex flex-col gap-2 w-full shrink-0" id="returns-movers"></div>
    </div>
  `;
}
