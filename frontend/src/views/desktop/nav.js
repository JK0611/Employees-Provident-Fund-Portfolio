/**
 * Set A: Desktop Navigation Sidebar
 * Large standalone Bunga Raya logo, bold EPF Tracker typography, left-to-right silk sweep tabs
 */

export function renderDesktopNav(activeTab = 'dashboard', onTabClick) {
  return `
    <aside class="hidden md:flex h-screen w-64 fixed top-0 left-0 flex-col py-6 px-4 z-50 justify-between items-stretch bg-surface/80 backdrop-blur-xl border-r border-white/5">
      <div>
        <!-- Brand Header (Desktop Standalone Large Logo) -->
        <div class="flex items-center justify-between mb-8 px-2">
          <div class="flex items-center gap-3.5">
            <img src="assets/logo.png" alt="EPF Tracker Logo" class="h-12 w-12 object-contain filter drop-shadow-[0_4px_16px_rgba(244,63,94,0.4)] shrink-0">
            <div>
              <h1 class="font-extrabold text-xl text-white tracking-tight leading-none flex items-center gap-1.5">
                <span>EPF</span><span class="text-primary">Tracker</span>
              </h1>
            </div>
          </div>
        </div>

        <!-- Desktop Tab Navigation Links -->
        <nav class="flex flex-col gap-2 w-full" id="desktop-tab-nav">
          <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard" id="tab-dashboard">
            <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <span class="text-sm font-semibold">Dashboard</span>
          </button>

          <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'holdings' ? 'active' : ''}" data-tab="holdings" id="tab-holdings">
            <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
            <span class="text-sm font-semibold">Holdings</span>
          </button>

          <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'returns' ? 'active' : ''}" data-tab="returns" id="tab-returns">
            <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>
            <span class="text-sm font-semibold">Returns</span>
          </button>

          <button class="tab-btn flex items-center gap-3 px-4 py-3 ${activeTab === 'transactions' ? 'active' : ''}" data-tab="transactions" id="tab-transactions">
            <svg class="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
            <span class="text-sm font-semibold">Transactions</span>
          </button>
        </nav>
      </div>
    </aside>
  `;
}
