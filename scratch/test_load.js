const fs = require('fs');

// Mock all DOM methods accessed in app.js
const mockElement = {
  value: '',
  getContext: () => ({
    canvas: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
    beginPath: () => {},
    moveTo: () => {},
    scale: () => {},
    setLineDash: () => {},
    roundRect: () => {},
    lineTo: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
    clearRect: () => {},
    fillText: () => {},
    strokeText: () => {},
    measureText: () => ({ width: 10 }),
    createLinearGradient: () => ({ addColorStop: () => {} })
  }),
  addEventListener: () => {},
  appendChild: () => {},
  classList: {
    add: () => {},
    remove: () => {},
    contains: () => false
  },
  closest: () => ({ classList: { add: () => {}, remove: () => {} } }),
  style: {},
  parentElement: { getBoundingClientRect: () => ({ width: 400, height: 200 }) },
  querySelector: () => null,
  querySelectorAll: () => []
};

global.window = {
  EPF_DATA: { holdings: [], transactions: [] },
  addEventListener: () => {},
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  requestAnimationFrame: () => {}
};
global.requestAnimationFrame = () => {};

global.document = {
  getElementById: () => mockElement,
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: () => ({ ...mockElement, style: {} })
};

// Evaluate data.js
const dataContent = fs.readFileSync('frontend/data.js', 'utf8')
  .replace(/(const|var|let)\s+EPF_DATA\s*=/, 'global.EPF_DATA =');
eval(dataContent);
global.window.EPF_DATA = global.EPF_DATA;

// Evaluate app.js
const appContent = fs.readFileSync('frontend/app.js', 'utf8');
try {
  eval(appContent);
  console.log('Successfully loaded app.js without runtime errors!');
} catch (e) {
  console.error('RUNTIME ERROR IN APP.JS:', e);
}
