const fs = require('fs');
const results = JSON.parse(fs.readFileSync('scrape_test_results.json', 'utf8'));
console.log('Total entries:', results.length);
const unisem = results.filter(r => r.stock_name === 'UNISEM');
console.log('Unisem entries:', unisem.length);
if (unisem.length > 0) {
  console.log('Sample Unisem entry:', unisem[0]);
}
