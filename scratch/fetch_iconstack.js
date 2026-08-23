const fs = require('fs');

const ICONS_TO_FETCH = [
  { key: 'query_stats', query: 'chart-line', lib: 'lucide' },
  { key: 'dashboard', query: 'layout-dashboard', lib: 'lucide' },
  { key: 'account_balance_wallet', query: 'wallet', lib: 'lucide' },
  { key: 'trending_up', query: 'trending-up', lib: 'lucide' },
  { key: 'trending_down', query: 'trending-down', lib: 'lucide' },
  { key: 'receipt_long', query: 'receipt', lib: 'lucide' },
  { key: 'auto_awesome', query: 'sparkles', lib: 'lucide' },
  { key: 'arrow_upward', query: 'arrow-up', lib: 'lucide' },
  { key: 'info', query: 'info', lib: 'lucide' },
  { key: 'payments', query: 'layers', lib: 'lucide' },
  { key: 'history', query: 'history', lib: 'lucide' },
  { key: 'search', query: 'search', lib: 'lucide' },
  { key: 'swap_vert', query: 'arrow-up-down', lib: 'lucide' },
  { key: 'filter_alt', query: 'filter', lib: 'lucide' },
  { key: 'account_balance', query: 'landmark', lib: 'lucide' },
  { key: 'category', query: 'shapes', lib: 'lucide' },
  { key: 'calendar_month', query: 'calendar', lib: 'lucide' }
];

async function callMcp(method, params) {
  const res = await fetch('https://sglpxftkuzsqdpdhftwv.supabase.co/functions/v1/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: method,
        arguments: params
      }
    })
  });
  return await res.json();
}

async function main() {
  const results = {};
  for (const item of ICONS_TO_FETCH) {
    console.log(`Searching for ${item.key} (${item.query})...`);
    const searchRes = await callMcp('search_icons', { q: item.query, library: item.lib, limit: 5 });
    console.log('Search result:', searchRes);
    
    // Extract icon ID
    let iconId = item.query;
    try {
      const content = JSON.parse(searchRes.result.content[0].text);
      if (Array.isArray(content) && content.length > 0) {
        iconId = content[0].id || item.query;
        console.log(`Found ID: ${iconId}`);
      }
    } catch (e) {
      console.warn('Parse search error:', e.message);
    }

    const svgRes = await callMcp('get_icon_svg', { library: item.lib, id: iconId });
    try {
      const svgText = svgRes.result.content[0].text;
      results[item.key] = svgText;
      console.log(`Fetched SVG for ${item.key}: ${svgText.slice(0, 60)}...`);
    } catch (e) {
      console.error(`Failed to get SVG for ${item.key}:`, svgRes);
    }
  }

  fs.writeFileSync('scratch/icons.json', JSON.stringify(results, null, 2));
  console.log('All icons fetched and saved to scratch/icons.json!');
}

main();
