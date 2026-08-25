/**
 * Set B: Mobile Bottom Navigation Tabbar
 * Ultra-smooth frosted glass floating tabbar optimized for thumb zone
 */

export function renderMobileNav(activeTab = 'dashboard') {
  return `
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 z-50 shadow-2xl" id="mobile-tab-nav">
      <button class="mobile-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${activeTab === 'dashboard' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="dashboard">
        <svg class="w-5 h-5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        <span class="text-[10px] tracking-tight">Overview</span>
      </button>

      <button class="mobile-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${activeTab === 'holdings' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="holdings">
        <svg class="w-5 h-5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
        <span class="text-[10px] tracking-tight">Holdings</span>
      </button>

      <button class="mobile-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${activeTab === 'returns' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="returns">
        <svg class="w-5 h-5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>
        <span class="text-[10px] tracking-tight">Flows</span>
      </button>

      <button class="mobile-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${activeTab === 'transactions' ? 'text-primary font-bold active' : 'text-outline hover:text-white'}" data-tab="transactions">
        <svg class="w-5 h-5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
        <span class="text-[10px] tracking-tight">Filings</span>
      </button>
    </nav>
  `;
}
