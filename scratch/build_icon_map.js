const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch/icons.json', 'utf8'));

// Clean SVG string: strip xml comments, extra newlines, width/height if needed or set class
function cleanSvg(jsonStr, defaultClass = '') {
  const obj = JSON.parse(jsonStr);
  let svg = obj.svg;
  // remove html comments
  svg = svg.replace(/<!--[\s\S]*?-->/g, '');
  // normalize whitespace
  svg = svg.replace(/\s+/g, ' ').trim();
  return svg;
}

const tablerFilter = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"/></svg>`;

const iconMap = {};
for (const [k, v] of Object.entries(raw)) {
  if (k === 'filter_alt') {
    iconMap[k] = tablerFilter;
  } else {
    iconMap[k] = cleanSvg(v);
  }
}
iconMap['filter_alt'] = tablerFilter;

fs.writeFileSync('scratch/clean_icons.json', JSON.stringify(iconMap, null, 2));
console.log('Clean icons mapped:', Object.keys(iconMap));
