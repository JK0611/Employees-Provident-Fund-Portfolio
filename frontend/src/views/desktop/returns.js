/**
 * Set A: Desktop Returns View
 * Net Capital Activity Canvas & 6 Key Financial Metrics
 */

export function renderDesktopReturns() {
  return `
    <div id="desktop-panel-returns" class="flex flex-col gap-6 w-full min-w-0">
      <!-- Main Net Activity Chart Card -->
      <div class="glass-card portfolio-trend-card p-6 glow-hover transition-all flex flex-col min-w-0 w-full overflow-hidden min-h-[440px]">
        <div class="flex justify-between items-center mb-6 flex-wrap gap-3">
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
        <div class="chart-body chart-body-tall flex-1 relative min-h-[320px]">
          <canvas id="returns-canvas"></canvas>
        </div>
      </div>

      <!-- Summary Cards Grid (6 Columns) -->
      <div class="summary-cards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full" id="returns-summary">
        <!-- Dynamically populated -->
      </div>
    </div>
  `;
}
