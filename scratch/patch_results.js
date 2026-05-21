const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(__dirname, '..', 'scrape_test_results.json');

if (!fs.existsSync(RESULTS_FILE)) {
  console.error('File not found:', RESULTS_FILE);
  process.exit(1);
}

const cessationIds = new Set([
  '3665580', '3664872', '3664622', '3663620', '3657136',
  '3656998', '3652163', '3646302', '3645804', '3644805',
  '3632731', '3628456', '3667166'
]);

const data = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
let patchCount = 0;

data.forEach(item => {
  const match = item.url.match(/ann_id=(\d+)/);
  const annId = match ? match[1] : null;
  if (annId && cessationIds.has(annId)) {
    if (item.transactions) {
      item.transactions.forEach(tx => {
        if (tx.type_of_transaction === 'Disposed') {
          tx.type_of_transaction = 'Divestment';
          patchCount++;
          console.log(`Patched ${item.stock_name} announcement ID ${annId} to Divestment.`);
        }
      });
    }
  }
});

fs.writeFileSync(RESULTS_FILE, JSON.stringify(data, null, 2));
console.log(`Database patch complete. Patched ${patchCount} transactions.`);
