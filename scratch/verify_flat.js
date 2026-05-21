const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'frontend', 'data.js');

const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
const jsonString = fileContent.replace(/^const EPF_DATA = /, '').replace(/;$/, '');
const EPF_DATA = JSON.parse(jsonString);

function flattenTransactions() {
  const list = [];
  EPF_DATA.transactions.forEach(tx => {
    let acquired = 0;
    let disposed = 0;
    tx.transactions.forEach(t => {
      if (t.type === 'Acquired') acquired += t.amount;
      else if (t.type === 'Disposed' || t.type === 'Divestment') disposed += t.amount;
    });

    let type = 'Acquired';
    let amount = 0;
    if (acquired > disposed) {
      type = 'Acquired';
      amount = acquired - disposed;
    } else if (disposed > acquired) {
      type = tx.transactions.some(t => t.type === 'Divestment') ? 'Divestment' : 'Disposed';
      amount = disposed - acquired;
    } else {
      type = tx.transactions[0]?.type || 'Acquired';
      amount = 0;
    }

    list.push({
      date: tx.date,
      stock: tx.stock,
      company: tx.company,
      url: tx.url,
      type: type,
      amount: amount,
      percent: tx.percent,
      total: tx.total,
      rawTransactions: tx.transactions,
      isNet: tx.transactions.length > 1
    });
  });
  return list;
}

const list = flattenTransactions();
const divestments = list.filter(tx => tx.type === 'Divestment');
console.log('Flat Divestment transactions:', divestments.length);
if (divestments.length > 0) {
  console.log('Sample flat divestment entry:');
  console.log(divestments[0]);
}
