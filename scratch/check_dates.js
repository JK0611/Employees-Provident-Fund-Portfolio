const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scrape_test_results.json', 'utf8'));
console.log('Total records:', data.length);

const dates = data.map(d => new Date(d.date_announced)).filter(d => !isNaN(d));
console.log('Min Date:', new Date(Math.min(...dates)).toISOString().split('T')[0]);
console.log('Max Date:', new Date(Math.max(...dates)).toISOString().split('T')[0]);
