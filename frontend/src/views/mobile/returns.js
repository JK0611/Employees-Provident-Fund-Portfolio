/**
 * Set B: Mobile Returns View
 * Clean mobile capital flow chart & responsive metric grid
 */

export function renderMobileReturns() {
  return `
    <div id="mobile-panel-returns" class="flex flex-col gap-4 w-full pb-20 pt-2">
      <!-- Main Mobile Activity Card -->
      <div class="glass-card p-4 rounded-2xl flex flex-col gap-3">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold text-white">Net Capital Activity</h3>
            <div class="chart-toggle-group flex gap-0.5" id="mobile-returns-toggle">
              <button class="chart-toggle active text-[10px] px-2 py-0.5" data-view="net">Net</button>
              <button class="chart-toggle text-[10px] px-2 py-0.5" data-view="acquired">Buy</button>
              <button class="chart-toggle text-[10px] px-2 py-0.5" data-view="disposed">Sell</button>
            </div>
          </div>
          <!-- Time Selector -->
          <div class="chart-toggle-group flex gap-0.5 self-start" id="mobile-returns-time-toggle">
            <button class="chart-toggle active text-[10px] px-2 py-0.5" data-range="1M">1M</button>
            <button class="chart-toggle text-[10px] px-2 py-0.5" data-range="3M">3M</button>
            <button class="chart-toggle text-[10px] px-2 py-0.5" data-range="1Y">1Y</button>
            <button class="chart-toggle text-[10px] px-2 py-0.5" data-range="ALL">All</button>
          </div>
        </div>

        <div class="chart-body chart-body-tall h-[230px] w-full relative overflow-hidden">
          <canvas id="mobile-returns-canvas"></canvas>
        </div>
      </div>

      <!-- Mobile Summary Metrics Grid (2x3) -->
      <div class="grid grid-cols-2 gap-2.5" id="mobile-returns-summary">
        <!-- Dynamically populated -->
      </div>

      <!-- Mobile Top Capital Movers -->
      <div class="flex flex-col gap-3.5 w-full pb-16 shrink-0" id="mobile-returns-movers"></div>
    </div>
  `;
}
