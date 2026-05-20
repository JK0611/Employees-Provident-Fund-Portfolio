const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(__dirname, 'scrape_test_results.json');
const DATA_FILE = path.join(__dirname, 'frontend', 'data.js');
const CACHE_FILE = path.join(__dirname, 'codes_cache.json');

// Sector classification helper
const sectorMapping = {
  'Financial Services': 'Banking',
  'Technology': 'Technology',
  'Industrials': 'Industrial',
  'Consumer Defensive': 'Consumer',
  'Consumer Cyclical': 'Consumer',
  'Utilities': 'Utilities',
  'Real Estate': 'Property',
  'Basic Materials': 'Industrial',
  'Healthcare': 'Healthcare',
  'Communication Services': 'Telecom',
  'Energy': 'Industrial',
  'Financial': 'Banking'
};

function normalizeSector(sec) {
  if (!sec) return 'Others';
  if (sectorMapping[sec]) return sectorMapping[sec];
  for (const key of Object.keys(sectorMapping)) {
    if (sec.toLowerCase().includes(key.toLowerCase())) {
      return sectorMapping[key];
    }
  }
  return sec;
}

// Load cache
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (e) {
    console.log('Error reading cache:', e.message);
  }
}

async function fetchStockCodeAndSector(stockName, companyName) {
  if (cache[stockName] && cache[stockName].code) {
    return cache[stockName];
  }

  // 1. Try direct ticker search (e.g. "BURSA.KL") - Most accurate for Bursa Malaysia
  console.log(`[Yahoo] Fetching direct ticker lookup for ${stockName}.KL...`);
  try {
    const res = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${stockName}.KL&quotesCount=3`);
    const data = await res.json();
    const bursaQuote = data.quotes ? data.quotes.find(q => q.symbol && q.symbol.endsWith('.KL')) : null;

    if (bursaQuote) {
      const code = bursaQuote.symbol.split('.')[0];
      const sector = normalizeSector(bursaQuote.sector);
      const metadata = { code, sector };
      cache[stockName] = metadata;
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      return metadata;
    }
  } catch (e) {
    console.log(`Failed direct ticker lookup for ${stockName}.KL:`, e.message);
  }

  // 2. Try generic symbol search
  console.log(`[Yahoo] Fetching generic symbol lookup for ${stockName}...`);
  try {
    const res = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${stockName}&quotesCount=5`);
    const data = await res.json();
    const bursaQuote = data.quotes ? data.quotes.find(q => q.symbol && q.symbol.endsWith('.KL')) : null;

    if (bursaQuote) {
      const code = bursaQuote.symbol.split('.')[0];
      const sector = normalizeSector(bursaQuote.sector);
      const metadata = { code, sector };
      cache[stockName] = metadata;
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      return metadata;
    }
  } catch (e) {
    console.log(`Failed generic symbol lookup for ${stockName}:`, e.message);
  }

  // 3. Fallback to company name search if symbol failed
  if (companyName) {
    const cleanCompany = companyName
      .replace(/\bBERHAD\b/gi, '')
      .replace(/\bBHD\b/gi, '')
      .replace(/\bCORPORATION\b/gi, '')
      .replace(/\bGROUP\b/gi, '')
      .replace(/\bHOLDINGS\b/gi, '')
      .replace(/\bCO\b/gi, '')
      .replace(/\bM\b/gi, '')
      .trim();

    console.log(`[Yahoo] Falling back to company search for ${stockName}: "${cleanCompany}"...`);
    try {
      const res = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(cleanCompany)}&quotesCount=5`);
      const data = await res.json();
      const bursaQuote = data.quotes ? data.quotes.find(q => q.symbol && q.symbol.endsWith('.KL')) : null;

      if (bursaQuote) {
        const code = bursaQuote.symbol.split('.')[0];
        const sector = normalizeSector(bursaQuote.sector);
        const metadata = { code, sector };
        cache[stockName] = metadata;
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
        return metadata;
      }
    } catch (e) {
      console.log(`Failed company search fallback for ${stockName}:`, e.message);
    }
  }

  // Fallback
  return { code: null, sector: 'Others' };
}

async function processData() {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.error(`Scrape results file not found at ${RESULTS_FILE}`);
    return;
  }

  console.log('Processing EPF announcement results...');
  const rawData = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));

  // Sort raw data by date to ensure proper timeline ordering
  rawData.sort((a, b) => new Date(a.date_announced) - new Date(b.date_announced));

  // Find unique stocks and track active holdings
  const holdingsMap = {};
  const allTransactions = [];
  const txByDate = {};

  for (const item of rawData) {
    if (!item.stock_name || item.stock_name.trim() === '') continue;

    const stock = item.stock_name.trim();
    const date = item.date_announced;
    const directPercent = item.direct_percent || 0;
    const totalSecurities = item.total_securities_after_change || 0;

    // Filter transactions (acquired / disposed)
    const validTransactions = (item.transactions || []).map(tx => {
      let type = tx.type_of_transaction;
      if (type.toLowerCase().startsWith('acq')) type = 'Acquired';
      else if (type.toLowerCase().startsWith('disp')) type = 'Disposed';
      return { type, amount: tx.no_of_securities };
    });

    if (validTransactions.length > 0) {
      allTransactions.push({
        stock,
        company: item.company_name,
        date,
        url: item.url,
        transactions: validTransactions,
        percent: directPercent,
        total: totalSecurities
      });

      // Aggregate daily volumes
      if (!txByDate[date]) {
        txByDate[date] = { acquired: 0, disposed: 0, net: 0, count: 0 };
      }
      validTransactions.forEach(tx => {
        if (tx.type === 'Acquired') txByDate[date].acquired += tx.amount;
        if (tx.type === 'Disposed') txByDate[date].disposed += tx.amount;
      });
      txByDate[date].net = txByDate[date].acquired - txByDate[date].disposed;
      txByDate[date].count += 1;
    }

    // Latest state
    holdingsMap[stock] = {
      stock_name: stock,
      company_name: item.company_name,
      direct_percent: directPercent,
      total_securities: totalSecurities,
      date: date
    };
  }

  // Filter out completely disposed stocks (either total securities is 0 or percent is 0)
  const holdings = [];
  for (const stock of Object.keys(holdingsMap)) {
    const h = holdingsMap[stock];
    if (h.total_securities > 0 && h.direct_percent > 0) {
      holdings.push(h);
    }
  }

  // Fetch codes & sectors dynamically for active holdings
  console.log(`Processing metadata for ${holdings.length} active holdings...`);
  for (const h of holdings) {
    const meta = await fetchStockCodeAndSector(h.stock_name, h.company_name);
    h.stock_code = meta.code;
    h.sector = meta.sector;
  }

  // Sort holdings by value (total securities)
  holdings.sort((a, b) => b.total_securities - a.total_securities);

  // Group transactions in reverse chronological order for dashboard timeline
  allTransactions.reverse();

  // Construct final dataset
  const finalDataset = {
    holdings,
    txByDate,
    transactions: allTransactions,
    uniqueStocks: holdings.length
  };

  const outputContent = `const EPF_DATA = ${JSON.stringify(finalDataset, null, 2)};`;
  fs.writeFileSync(DATA_FILE, outputContent);
  console.log(`[✓] Successfully processed and saved data to ${DATA_FILE}`);
}

processData();
