/**
 * EPF Tracker — Reactive State Store
 * Central source of truth with event dispatching
 */

class Store {
  constructor() {
    this.state = {
      activeTab: 'dashboard',
      portfolioRange: '1M',
      returnsRange: '1M',
      returnsView: 'net',
      isMobile: window.innerWidth < 768,
      holdingsSearch: '',
      holdingsSector: 'all',
      txSearch: '',
      txType: 'all',
      txDateStart: '',
      txDateEnd: '',
      txAmountMin: '',
      txAmountMax: '',
      txPercentMin: '',
      txPercentMax: '',
      txPage: 1
    };
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(partial) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...partial };
    this.listeners.forEach(fn => fn(this.state, prevState));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const store = new Store();

// Auto-track viewport changes
window.addEventListener('resize', () => {
  const isMobile = window.innerWidth < 768;
  if (isMobile !== store.getState().isMobile) {
    store.setState({ isMobile });
  }
});
