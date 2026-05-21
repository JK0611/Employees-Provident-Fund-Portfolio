const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'frontend', 'data.js');

const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
const jsonString = fileContent.replace(/^const EPF_DATA = /, '').replace(/;$/, '');
const data = JSON.parse(jsonString);

console.log('Total transactions:', data.transactions.length);
const divestments = [];
data.transactions.forEach(t => {
  t.transactions.forEach(sub => {
    if (sub.type === 'Divestment') {
      divestments.push({ stock: t.stock, amount: sub.amount, url: t.url });
    }
  });
});

console.log('Divestment transactions in processed data:', divestments.length);
if (divestments.length > 0) {
  console.log('Sample Divestments found:');
  divestments.slice(0, 5).forEach(d => console.log(d));
}
