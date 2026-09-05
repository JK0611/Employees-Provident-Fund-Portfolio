const fs = require('fs');
const path = require('path');

function buildStockHistory() {
  const filingsPath = path.join(__dirname, '..', 'data', 'scrape_test_results.json');
  const dataJsPath = path.join(__dirname, '..', 'frontend', 'data.js');
  const outPath = path.join(__dirname, '..', 'frontend', 'stock_history.js');

  if (!fs.existsSync(filingsPath) || !fs.existsSync(dataJsPath)) {
    console.warn('[!] Files missing for stock history build, skipping.');
    return;
  }

  const filings = JSON.parse(fs.readFileSync(filingsPath, 'utf8'));
  const epfData = JSON.parse(fs.readFileSync(dataJsPath, 'utf8').replace('const EPF_DATA = ', '').replace(/;$/, ''));
  const activeTickers = new Set(epfData.holdings.map(h => h.stock_name));

  const tickerMap = {
    LATITUD: 'RKI',
    DIGI: 'CDB',
    TRL: 'TALAMT',
    TRLAND: 'TALAMT',
    TALAM: 'TALAMT',
    TIME: 'EDGENTA',
    FABER: 'EDGENTA',
    HZLBND: 'GUOCO',
    YEELEE: 'YB',
    'YI-LAI': 'YB',
    AIC: 'GLOTEC',
    CBH: 'CRESBLD'
  };

  const stockHist = {};

  filings.forEach(f => {
    let s = tickerMap[f.stock_name] || f.stock_name;
    if (!activeTickers.has(s)) return;
    if (!stockHist[s]) stockHist[s] = [];

    let acq = 0, disp = 0;
    (f.transactions || []).forEach(t => {
      if (t.type_of_transaction === 'Acquired') acq += (t.no_of_securities || 0);
      else if (t.type_of_transaction === 'Disposed') disp += (t.no_of_securities || 0);
    });

    const annId = (f.url || '').split('ann_id=')[1] || '';
    stockHist[s].push([
      f.date_announced,
      f.total_securities_after_change || 0,
      f.direct_percent || 0,
      acq > disp ? acq - disp : -(disp - acq),
      acq > disp ? 1 : 0,
      annId
    ]);
  });

  // Sort chronological (oldest to newest)
  Object.keys(stockHist).forEach(k => {
    stockHist[k].sort((a, b) => new Date(a[0]) - new Date(b[0]));

    // Clean and impute any missing/zero total securities (e.g. Bursa Form 29B/29C omissions)
    for (let i = 0; i < stockHist[k].length; i++) {
      if (!stockHist[k][i][1] || stockHist[k][i][1] <= 0) {
        const prev = i > 0 ? stockHist[k][i - 1][1] : 0;
        const change = stockHist[k][i][3] || 0;
        if (prev > 0) {
          if (change !== 0 && (prev + change) > 0) {
            stockHist[k][i][1] = prev + change;
          } else {
            let nextVal = 0;
            for (let j = i + 1; j < stockHist[k].length; j++) {
              if (stockHist[k][j][1] > 0) {
                nextVal = stockHist[k][j][1];
                break;
              }
            }
            stockHist[k][i][1] = nextVal > 0 ? Math.round((prev + nextVal) / 2) : prev;
          }
        } else {
          let nextVal = 0;
          for (let j = i + 1; j < stockHist[k].length; j++) {
            if (stockHist[k][j][1] > 0) {
              nextVal = stockHist[k][j][1];
              break;
            }
          }
          stockHist[k][i][1] = change > 0 ? change : (nextVal || 0);
        }
      }
    }
  });

  const fileContent = 'window.STOCK_HISTORY = ' + JSON.stringify(stockHist) + ';\n';
  fs.writeFileSync(outPath, fileContent);
  console.log(`[✓] Generated ${outPath} with ${Object.keys(stockHist).length} stocks (${(fileContent.length / 1024 / 1024).toFixed(2)} MB)`);
}

if (require.main === module) {
  buildStockHistory();
}

module.exports = { buildStockHistory };
