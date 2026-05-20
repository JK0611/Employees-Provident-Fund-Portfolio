const axios = require('axios');
const cheerio = require('cheerio');

// Test: Can we get the announcement detail HTML from a Cloudflare cookie session?
async function testWithCookies() {
    const api = axios.create({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://www.bursamalaysia.com/market_information/announcements/company_announcement',
        }
    });

    // Step 1: First test - can we parse the listing API HTML to extract ann_ids?
    console.log('--- Testing Listing API ---');
    try {
        const listRes = await api.get('https://www.bursamalaysia.com/api/v1/announcements/search', {
            params: { keyword: 'Employees Provident Fund', ann_type: 'company', from_date: '13/05/2026', to_date: '20/05/2026', page: 1 }
        });
        
        const items = listRes.data.data;
        console.log(`Found ${listRes.data.recordsFiltered} filtered results, ${items.length} on this page`);
        
        // Parse ann_ids from the HTML in each row
        for (const item of items.slice(0, 3)) {
            const html = item[3]; // The announcement title column with link
            const $ = cheerio.load(html);
            const link = $('a').attr('href');
            const title = $('a').text().trim();
            const annIdMatch = link ? link.match(/ann_id=(\d+)/) : null;
            console.log(`  ann_id: ${annIdMatch ? annIdMatch[1] : 'N/A'} | ${title.substring(0, 80)}`);
            
            // Parse company from column 2
            const $company = cheerio.load(item[2]);
            const companyName = $company('a').text().trim();
            const stockCode = $company('a').attr('href')?.match(/stock_code=(\w+)/)?.[1];
            console.log(`    Company: ${companyName} | Stock Code: ${stockCode}`);
            
            // Parse date from column 1
            const $date = cheerio.load(item[1]);
            const date = $date('.d-lg-inline-block').text().trim() || $date('div').first().text().trim();
            console.log(`    Date: ${date}`);
        }
    } catch (e) {
        console.log('Listing API error:', e.response?.status, e.message);
    }

    // Step 2: Test the get_announcement API (possible endpoints)
    console.log('\n--- Testing Detail Endpoints ---');
    const endpoints = [
        'https://www.bursamalaysia.com/api/v1/announcements/view/3667422',
        'https://www.bursamalaysia.com/api/v1/announcements/detail/3667422',
        'https://www.bursamalaysia.com/api/v1/announcements/announcement_detail?ann_id=3667422',
        'https://www.bursamalaysia.com/api/v1/company_announcement/3667422',
    ];
    
    for (const url of endpoints) {
        try {
            const r = await api.get(url);
            console.log(`OK: ${url} -> ${JSON.stringify(r.data).substring(0, 200)}`);
        } catch (e) {
            console.log(`${e.response?.status}: ${url}`);
        }
    }
}

testWithCookies();
