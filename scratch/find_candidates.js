const fs = require('fs');
const results = JSON.parse(fs.readFileSync('scrape_test_results.json', 'utf8'));

const candidates = results.filter(r => {
  return r.transactions && r.transactions.length === 1 && r.transactions[0].type_of_transaction === 'Disposed' && r.total_securities_after_change === 0;
});

console.log('Number of candidates:', candidates.length);
candidates.forEach(c => {
  console.log(`Stock: ${c.stock_name}, Date: ${c.date_announced}, URL: ${c.url}`);
});
