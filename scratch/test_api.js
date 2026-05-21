const cheerio = require('cheerio');

async function test() {
    const { gotScraping } = await import('got-scraping');
    
    // Test with current date range (same as what workflow would use)
    const now = new Date();
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    
    const pad = (n) => String(n).padStart(2, '0');
    const TO_DATE = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`;
    const FROM_DATE = `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
    
    console.log(`Testing API with FROM=${FROM_DATE} TO=${TO_DATE}`);
    
    const res = await gotScraping({
        url: 'https://www.bursamalaysia.com/api/v1/announcements/search',
        searchParams: {
            ann_type: 'company',
            keyword: 'Employees Provident Fund',
            dt_ht: FROM_DATE,
            dt_lt: TO_DATE,
            page: 1,
        },
        headers: {
            'Referer': 'https://www.bursamalaysia.com/market_information/announcements/company_announcement',
        },
        headerGeneratorOptions: {
            browsers: ['chrome'],
            operatingSystems: ['windows'],
        },
    });
    
    console.log('Status:', res.statusCode);
    const data = JSON.parse(res.body);
    console.log('recordsFiltered:', data.recordsFiltered);
    console.log('Items on page:', data.data?.length);
    
    if (data.data && data.data.length > 0) {
        // Show first 3 items
        for (let i = 0; i < Math.min(3, data.data.length); i++) {
            const $ = cheerio.load(data.data[i][3]);
            const link = $('a').attr('href');
            const title = $('a').text().trim();
            console.log(`  [${i+1}] ${title.substring(0, 80)}`);
            console.log(`      Date: ${data.data[i][0]}`);
            console.log(`      Link: ${link}`);
        }
    }
    
    // Now test with swapped params to see if dt_ht/dt_lt are correct
    console.log('\n--- Testing with SWAPPED params (dt_ht=TO, dt_lt=FROM) ---');
    const res2 = await gotScraping({
        url: 'https://www.bursamalaysia.com/api/v1/announcements/search',
        searchParams: {
            ann_type: 'company',
            keyword: 'Employees Provident Fund',
            dt_ht: TO_DATE,  // swapped
            dt_lt: FROM_DATE, // swapped
            page: 1,
        },
        headers: {
            'Referer': 'https://www.bursamalaysia.com/market_information/announcements/company_announcement',
        },
        headerGeneratorOptions: {
            browsers: ['chrome'],
            operatingSystems: ['windows'],
        },
    });
    
    const data2 = JSON.parse(res2.body);
    console.log('recordsFiltered (swapped):', data2.recordsFiltered);
    console.log('Items on page (swapped):', data2.data?.length);
}

test().catch(e => console.error('Error:', e.message));
