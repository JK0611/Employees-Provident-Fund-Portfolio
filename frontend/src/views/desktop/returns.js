/**
 * Set A: Desktop Returns View
 * Net Capital Activity Canvas & 6 Key Financial Metrics
 */

export function renderDesktopReturns() {
  return `
    <div id="desktop-panel-returns" class="flex flex-col gap-3.5 h-full w-full min-w-0 pt-2 pb-1 overflow-y-auto custom-scrollbar pr-1">
      <!-- Main Net Activity Chart Card -->
      <div class="glass-card returns-chart-card p-5 glow-hover transition-all flex flex-col min-w-0 w-full overflow-hidden shrink-0 h-[390px]">
        <div class="flex justify-between items-center mb-3 flex-wrap gap-3 shrink-0">
          <div>
            <h3 class="text-base font-bold text-on-surface tracking-tight">Net Capital Activity</h3>
            <span class="text-xs text-outline">Accumulation vs Divestment volume over time</span>
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
          <canvas id="returns-canvas"></canvas>
        </div>
      </div>

      <!-- Summary Cards Grid (6 Columns) -->
      <div class="summary-cards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full shrink-0" id="returns-summary">
        <!-- Dynamically populated -->
      </div>

      <!-- Top Capital Movers (Flow Leaders) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 w-full pb-4 shrink-0" id="returns-movers"></div>
    </div>
  `;
}
