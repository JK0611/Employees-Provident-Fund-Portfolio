const fs = require('fs');

const run = async () => {
  const { gotScraping } = await import('got-scraping');
  const links = JSON.parse(fs.readFileSync('links.json', 'utf8'));
  
  // Pick some links around the middle or end
  const testLinks = links.slice(100000, 100005);
  
  console.log('Testing 5 detail fetches...');
  for (const link of testLinks) {
    const annId = link.match(/ann_id=(\d+)/)?.[1];
    if (!annId) continue;
    
    const detailUrl = `https://disclosure.bursamalaysia.com/FileAccess/viewHtml?e=${annId}`;
    const start = Date.now();
    try {
      const res = await gotScraping({
        url: detailUrl,
        headers: {
          'Referer': 'https://www.bursamalaysia.com/',
        },
        headerGeneratorOptions: {
          browsers: ['chrome'],
          operatingSystems: ['windows'],
        },
      });
      console.log(`ID ${annId}: status ${res.statusCode}, size ${res.body.length}, time ${Date.now() - start}ms`);
    } catch (e) {
      console.log(`ID ${annId}: FAILED: ${e.message}, time ${Date.now() - start}ms`);
    }
  }
};

run();
