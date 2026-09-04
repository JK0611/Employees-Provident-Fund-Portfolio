const fs = require('fs');
const path = require('path');

function getMissingLogos() {
  const dataJsPath = path.join(__dirname, '..', 'frontend', 'data.js');
  const logoJsonPath = path.join(__dirname, '..', 'frontend', 'logo.json');

  if (!fs.existsSync(dataJsPath) || !fs.existsSync(logoJsonPath)) {
    console.error('Required data files not found.');
    process.exit(1);
  }

  const rawJs = fs.readFileSync(dataJsPath, 'utf8');
  const epfData = JSON.parse(rawJs.replace(/^const EPF_DATA = /, '').replace(/;$/, ''));
  const logoList = JSON.parse(fs.readFileSync(logoJsonPath, 'utf8'));

  const logoMap = {};
  logoList.forEach(item => {
    if (item.company) {
      logoMap[item.company.toUpperCase().trim()] = item.logo_url;
    }
  });

  function hasLogo(company, stock) {
    const normComp = (company || '').toUpperCase().trim();
    if (logoMap[normComp]) return true;
    const firstWord = normComp.split(' ')[0];
    if (logoMap[firstWord]) return true;
    const stockKey = (stock || '').toUpperCase().trim();
    if (logoMap[stockKey]) return true;
    return false;
  }

  const holdings = epfData.holdings || [];
  const missingHoldings = [];

  holdings.forEach(h => {
    if (!hasLogo(h.company_name, h.stock_name)) {
      missingHoldings.push({
        stock: h.stock_name,
        company: h.company_name,
        sector: h.sector || 'Others',
        market_value: h.market_value || 0,
        direct_percent: h.direct_percent || 0
      });
    }
  });

  // Sort by market value descending (highest portfolio value first)
  missingHoldings.sort((a, b) => b.market_value - a.market_value);

  return {
    totalHoldings: holdings.length,
    missingCount: missingHoldings.length,
    missing: missingHoldings
  };
}

if (require.main === module) {
  const { totalHoldings, missingCount, missing } = getMissingLogos();
  console.log(`\n=============================================================`);
  console.log(`EPF PORTFOLIO LOGO AUDIT: ${missingCount} OF ${totalHoldings} COMPANIES MISSING LOGOS`);
  console.log(`=============================================================\n`);
  
  missing.forEach((item, idx) => {
    const mv = item.market_value > 0 ? `RM ${(item.market_value / 1e6).toFixed(1)}M` : 'N/A';
    const pct = item.direct_percent > 0 ? `${item.direct_percent.toFixed(2)}%` : 'N/A';
    console.log(`${idx + 1}. [${item.stock}] ${item.company} | Sector: ${item.sector} | Value: ${mv} | Stake: ${pct}`);
  });
}

module.exports = { getMissingLogos };
