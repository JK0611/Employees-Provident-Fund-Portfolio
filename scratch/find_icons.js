const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const app = fs.readFileSync('frontend/app.js', 'utf8');

const regex = /<span[^>]*class="[^"]*material-symbols[^"]*"[^>]*>([^<]+)<\/span>/g;
const iconsHtml = [];
let m;
while ((m = regex.exec(html)) !== null) {
  iconsHtml.push({ full: m[0], name: m[1].trim() });
}

const iconsApp = [];
while ((m = regex.exec(app)) !== null) {
  iconsApp.push({ full: m[0], name: m[1].trim() });
}

console.log('--- Icons in HTML ---');
iconsHtml.forEach(i => console.log(i.name, '->', i.full));
console.log('\n--- Icons in APP.JS ---');
iconsApp.forEach(i => console.log(i.name, '->', i.full));
