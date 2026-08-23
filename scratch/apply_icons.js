const fs = require('fs');

const icons = JSON.parse(fs.readFileSync('scratch/clean_icons.json', 'utf8'));

function makeSvg(svgStr, customClass, customWidth, customHeight) {
  let s = svgStr;
  if (customWidth) s = s.replace(/width="[^"]*"/, `width="${customWidth}"`);
  if (customHeight) s = s.replace(/height="[^"]*"/, `height="${customHeight}"`);
  if (customClass) {
    if (s.includes('class="')) {
      s = s.replace(/class="[^"]*"/, `class="${customClass}"`);
    } else {
      s = s.replace('<svg', `<svg class="${customClass}"`);
    }
  }
  return s;
}

let html = fs.readFileSync('frontend/index.html', 'utf8');
let app = fs.readFileSync('frontend/app.js', 'utf8');

// 1. Remove Material Symbols font stylesheet in index.html
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:[^>]*>/g, '<!-- Iconstack Icons Loaded Directly as Inline SVGs -->');

// 2. Replace all Material Symbols in index.html with specific Iconstack SVGs
// Brand
html = html.replace(
  /<span class="material-symbols-outlined text-white text-\[20px\]">query_stats<\/span>/g,
  makeSvg(icons.query_stats, 'w-5 h-5 text-white', 20, 20)
);

// Sidebar Nav tabs
html = html.replace(
  /<span class="material-symbols-outlined text-\[20px\]"[^>]*>dashboard<\/span>/g,
  makeSvg(icons.dashboard, 'w-5 h-5 flex-shrink-0', 20, 20)
);
html = html.replace(
  /<span class="material-symbols-outlined text-\[20px\]"[^>]*>account_balance_wallet<\/span>/g,
  makeSvg(icons.account_balance_wallet, 'w-5 h-5 flex-shrink-0', 20, 20)
);
html = html.replace(
  /<span class="material-symbols-outlined text-\[20px\]"[^>]*>trending_up<\/span>/g,
  makeSvg(icons.trending_up, 'w-5 h-5 flex-shrink-0', 20, 20)
);
html = html.replace(
  /<span class="material-symbols-outlined text-\[20px\]"[^>]*>receipt_long<\/span>/g,
  makeSvg(icons.receipt_long, 'w-5 h-5 flex-shrink-0', 20, 20)
);

// Promo pill sparkles
html = html.replace(
  /<span class="material-symbols-outlined text-\[14px\]">auto_awesome<\/span>/g,
  makeSvg(icons.auto_awesome, 'w-3.5 h-3.5 text-primary', 14, 14)
);

// Stat card arrows
html = html.replace(
  /<span class="material-symbols-outlined text-\[14px\]">arrow_upward<\/span>/g,
  makeSvg(icons.arrow_upward, 'w-3.5 h-3.5 text-emerald-400', 14, 14)
);
html = html.replace(
  /<span class="material-symbols-outlined text-\[12px\]">arrow_upward<\/span>/g,
  makeSvg(icons.arrow_upward, 'w-3 h-3 text-emerald-400', 12, 12)
);

// Tooltip info icons
html = html.replace(
  /<span class="material-symbols-outlined text-\[14px\] text-outline\/60 cursor-help" title="([^"]*)">info<\/span>/g,
  (match, title) => makeSvg(icons.info, 'w-3.5 h-3.5 text-outline/60 cursor-help inline-block', 14, 14).replace('<svg', `<svg title="${title}"`)
);

// Active positions layers icon
html = html.replace(
  /<span class="material-symbols-outlined text-\[20px\]">payments<\/span>/g,
  makeSvg(icons.payments, 'w-5 h-5 text-indigo-400', 20, 20)
);

// Recent filings history icon
html = html.replace(
  /<span class="material-symbols-outlined text-outline text-\[20px\]">history<\/span>/g,
  makeSvg(icons.history, 'w-5 h-5 text-outline', 20, 20)
);

// Search inputs
html = html.replace(
  /<span[^>]*class="material-symbols-outlined absolute left-2\.5 top-1\/2 -translate-y-1\/2 text-outline text-\[16px\]">search<\/span>/g,
  makeSvg(icons.search, 'w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none', 16, 16)
);

// Table sort arrows
html = html.replace(
  /<span class="material-symbols-outlined text-\[12px\] align-middle">swap_vert<\/span>/g,
  makeSvg(icons.swap_vert, 'w-3 h-3 inline-block align-middle ml-0.5 opacity-50 hover:opacity-100 transition-opacity', 12, 12)
);

// Table filters
html = html.replace(
  /<span\s+class="material-symbols-outlined text-\[14px\] col-filter-icon text-outline cursor-pointer hover:text-primary transition-colors"\s+onclick="togglePopup\(event, this, '([^']+)'\)">filter_alt<\/span>/g,
  (match, popupId) => makeSvg(icons.filter_alt, 'w-3.5 h-3.5 col-filter-icon text-outline cursor-pointer hover:text-primary transition-colors inline-block align-middle ml-1', 14, 14).replace('<svg', `<svg onclick="togglePopup(event, this, '${popupId}')"`)
);

// 3. Export clean ICONSTACK object in frontend/app.js
const iconMapJs = `
// ============================================
// Iconstack SVG Icon Repository
// ============================================
const ICONSTACK = {
  trending_up: \`${makeSvg(icons.trending_up, 'w-4 h-4 inline-block align-middle', 16, 16)}\`,
  trending_down: \`${makeSvg(icons.trending_down, 'w-4 h-4 inline-block align-middle', 16, 16)}\`,
  account_balance: \`${makeSvg(icons.account_balance, 'w-4 h-4 inline-block align-middle', 16, 16)}\`,
  receipt_long: \`${makeSvg(icons.receipt_long, 'w-4 h-4 inline-block align-middle', 16, 16)}\`,
  category: \`${makeSvg(icons.category, 'w-4 h-4 inline-block align-middle', 16, 16)}\`,
  calendar_month: \`${makeSvg(icons.calendar_month, 'w-4 h-4 inline-block align-middle', 16, 16)}\`,
  arrow_upward: \`${makeSvg(icons.arrow_upward, 'w-3 h-3 inline-block align-middle mr-0.5', 12, 12)}\`,
  arrow_downward: \`${makeSvg(icons.trending_down, 'w-3 h-3 inline-block align-middle mr-0.5', 12, 12)}\`,
  search: \`${makeSvg(icons.search, 'w-4 h-4', 16, 16)}\`,
  history: \`${makeSvg(icons.history, 'w-4 h-4', 16, 16)}\`
};
`;

// Insert ICONSTACK at the top of app.js if not present
if (!app.includes('const ICONSTACK = {')) {
  app = app.replace('/* ============================================', iconMapJs + '\n/* ============================================');
}

// Replace Material Symbols in renderReturnsSummary in app.js
app = app.replace(
  /<span class="material-symbols-outlined text-\[17px\]">trending_up<\/span>/g,
  '${ICONSTACK.trending_up}'
);
app = app.replace(
  /<span class="material-symbols-outlined text-\[17px\]">trending_down<\/span>/g,
  '${ICONSTACK.trending_down}'
);
app = app.replace(
  /<span class="material-symbols-outlined text-\[17px\]">account_balance<\/span>/g,
  '${ICONSTACK.account_balance}'
);
app = app.replace(
  /<span class="material-symbols-outlined text-\[17px\]">receipt_long<\/span>/g,
  '${ICONSTACK.receipt_long}'
);
app = app.replace(
  /<span class="material-symbols-outlined text-\[17px\]">category<\/span>/g,
  '${ICONSTACK.category}'
);
app = app.replace(
  /<span class="material-symbols-outlined text-\[17px\]">calendar_month<\/span>/g,
  '${ICONSTACK.calendar_month}'
);
app = app.replace(
  /<span class="material-symbols-outlined text-\[12px\] mr-0\.5">arrow_upward<\/span>/g,
  '${ICONSTACK.arrow_upward}'
);
app = app.replace(
  /<span class="material-symbols-outlined text-\[10px\]">\$\{actionIcon\}<\/span>/g,
  '${actionIcon === "trending_up" ? ICONSTACK.trending_up : ICONSTACK.trending_down}'
);

fs.writeFileSync('frontend/index.html', html);
fs.writeFileSync('frontend/app.js', app);
console.log('Successfully replaced ALL icons with Iconstack SVGs across index.html and app.js!');
