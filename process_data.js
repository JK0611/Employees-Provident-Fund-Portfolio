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

async function fetchDomainFromSearch(companyName, stockName) {
  // 1. Try DuckDuckGo Instant Answer API first (excellent for popular corporate brands, super fast and clean JSON)
  const cleanComp = companyName
    .replace(/\b(BERHAD|BHD|CORPORATION|GROUP|HOLDINGS|CO|M|RETAIL)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  const ddgQueries = [cleanComp, stockName];
  for (const q of ddgQueries) {
    if (!q) continue;
    try {
      console.log(`[DDG API] Trying Instant Answer for "${q}"...`);
      const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json`);
      if (res.status === 200) {
        const data = await res.json();
        if (data.Results && data.Results.length > 0) {
          const official = data.Results.find(r => r.Text && r.Text.toLowerCase().includes('official site'));
          if (official && official.FirstURL) {
            const domain = official.FirstURL.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
            console.log(`[DDG API] Resolved domain from Instant Answer: ${domain}`);
            return domain;
          }
          if (data.Results[0].FirstURL) {
            const domain = data.Results[0].FirstURL.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
            console.log(`[DDG API] Resolved domain from FirstURL: ${domain}`);
            return domain;
          }
        }
      }
    } catch (e) {
      console.log(`[DDG API] Failed for "${q}":`, e.message);
    }
  }

  // 2. Fallback to Bing Search HTML scraping (very robust, rarely rate-limited or blocked)
  const queries = [
    `${companyName} official website`,
    `${stockName} Malaysia official website`
  ];

  for (const query of queries) {
    try {
      console.log(`[Bing Search] Resolving domain for query: "${query}"...`);
      const res = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      if (res.status !== 200) {
        console.log(`[Bing Search] Bing returned status ${res.status}. Trying next query...`);
        continue;
      }
      const html = await res.text();
      const matches = html.match(/<cite>([^<]+)<\/cite>/g);
      if (matches) {
        const urls = matches.map(m => m.replace(/<\/?cite>/g, '').trim().split(' ')[0]);
        const ignoreDomains = [
          'wikipedia.org', 'bursamalaysia.com', 'yahoo.com', 'bloomberg.com',
          'facebook.com', 'linkedin.com', 'wsj.com', 'reuters.com', 'theedgemalaysia.com',
          'youtube.com', 'instagram.com', 'twitter.com', 'pinterest.com', 'tiktok.com',
          'klse.i3investor.com', 'klsescreener.com', 'tradingview.com', 'time.is', '24timezones.com'
        ];
        for (const url of urls) {
          const cleanUrl = url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
          if (cleanUrl && !ignoreDomains.some(d => cleanUrl.includes(d))) {
            console.log(`[Bing Search] Resolved domain: ${cleanUrl}`);
            return cleanUrl;
          }
        }
      }
    } catch (e) {
      console.log(`[Bing Search] Failed to resolve domain:`, e.message);
    }
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  return null;
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

  // Sort raw data by date to ensure proper timeline ordering, with ann_id as a secondary key for consistent same-day order
  rawData.sort((a, b) => {
    const dateDiff = new Date(a.date_announced) - new Date(b.date_announced);
    if (dateDiff !== 0) return dateDiff;
    const idA = parseInt(a.url.match(/ann_id=(\d+)/)?.[1] || 0, 10);
    const idB = parseInt(b.url.match(/ann_id=(\d+)/)?.[1] || 0, 10);
    return idA - idB;
  });

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

  // Filter out completely disposed stocks (total securities is 0)
  const holdings = [];
  for (const stock of Object.keys(holdingsMap)) {
    const h = holdingsMap[stock];
    if (h.total_securities > 0) {
      holdings.push(h);
    }
  }

  // Fetch codes & sectors dynamically for active holdings
  console.log(`Processing metadata for ${holdings.length} active holdings...`);
  const companyDomains = {};

  for (const h of holdings) {
    const meta = await fetchStockCodeAndSector(h.stock_name, h.company_name);
    h.stock_code = meta.code;
    h.sector = meta.sector;

    if (!meta.domain) {
      const domain = await fetchDomainFromSearch(h.company_name, h.stock_name);
      meta.domain = domain;
      cache[h.stock_name] = meta;
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    }

    h.domain = meta.domain;
    if (meta.domain) {
      companyDomains[h.stock_name] = meta.domain;
      companyDomains[h.company_name] = meta.domain;
    }
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
    uniqueStocks: holdings.length,
    companyDomains
  };

  const outputContent = `const EPF_DATA = ${JSON.stringify(finalDataset, null, 2)};`;
  fs.writeFileSync(DATA_FILE, outputContent);
  console.log(`[✓] Successfully processed and saved data to ${DATA_FILE}`);
}

processData();
