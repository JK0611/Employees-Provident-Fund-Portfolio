const fs = require('fs');

try {
  const content = fs.readFileSync('scrape_test_results.json', 'utf8');
  JSON.parse(content);
  console.log('JSON is valid!');
} catch (e) {
  console.error('Error:', e.message);
  if (e.message.includes('position')) {
    const match = e.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      console.log('Context around position ' + pos + ':');
      console.log('--- BEFORE ---');
      console.log(content.substring(Math.max(0, pos - 150), pos));
      console.log('--- POINTER ---');
      console.log('^ (' + content.charAt(pos) + ')');
      console.log('--- AFTER ---');
      console.log(content.substring(pos, Math.min(content.length, pos + 150)));
    }
  }
}
