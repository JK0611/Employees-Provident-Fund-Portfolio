const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const BASE_URL = 'https://www.bursamalaysia.com';
const API_URL = `${BASE_URL}/market_information/announcements/company_announcement/data`;
const MAIN_PAGE = `${BASE_URL}/bm/market_information/announcements/company_announcement`;

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.9',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': MAIN_PAGE
};

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeFirstPage() {
    console.log('--- Step 1: Baking Session ---');
    let cookies = '';
    try {
        const landing = await axios.get(MAIN_PAGE, { headers: { 'User-Agent': HEADERS['User-Agent'] } });
        cookies = landing.headers['set-cookie'] ? landing.headers['set-cookie'].map(c => c.split(';')[0]).join('; ') : '';
        console.log('Session baked.');
    } catch (err) {
        console.error('Failed to bake session:', err.message);
    }

    console.log('\n--- Step 2: Fetching Page 1 Links ---');
    const params = new URLSearchParams({
        per_page: 50,
        page: 1,
        keyword: 'Employees Provident Fund',
        from_date: '01/01/2026',
        to_date: '13/05/2026'
    });

    try {
        const response = await axios.get(`${API_URL}?${params.toString()}`, {
            headers: { ...HEADERS, Cookie: cookies }
        });

        const data = response.data;
        if (!data || !data.data) {
            console.error('No data found in API response.');
            return;
        }

        const entries = data.data;
        console.log(`Found ${entries.length} entries on Page 1.`);

        const results = [];

        console.log('\n--- Step 3: Scraping Details (First 5 for test) ---');
        // Limiting to 5 for a quick check as requested
        for (let i = 0; i < 5; i++) {
            const entry = entries[i];
            const htmlString = entry.title; // The title field in the API usually contains the link HTML
            const $ = cheerio.load(htmlString);
            const linkPath = $('a').attr('href');
            const title = $('a').text().trim();
            const company = entry.company_name || 'N/A';
            const date = entry.announcement_date || 'N/A';

            if (!linkPath) {
                console.log(`Skipping entry ${i+1}: No link found.`);
                continue;
            }

            const fullLink = linkPath.startsWith('http') ? linkPath : `${BASE_URL}${linkPath}`;
            console.log(`[${i+1}/5] Scraping: ${title} (${company})`);

            try {
                const detailResp = await axios.get(fullLink, {
                    headers: { ...HEADERS, Cookie: cookies }
                });
                const $detail = cheerio.load(detailResp.data);

                // Basic extraction of "Details of changes" table
                const details = {};
                $detail('table.table-striped tr').each((_, row) => {
                    const key = $detail(row).find('td').eq(0).text().trim();
                    const value = $detail(row).find('td').eq(1).text().trim();
                    if (key && value) details[key] = value;
                });

                results.push({
                    title,
                    company,
                    date,
                    url: fullLink,
                    details
                });

                // Randomized human-like delay
                const wait = Math.floor(Math.random() * 3000) + 2000;
                await sleep(wait);
            } catch (err) {
                console.error(`Failed to scrape ${fullLink}:`, err.message);
            }
        }

        fs.writeFileSync('scrape_test_results.json', JSON.stringify(results, null, 2));
        console.log('\n--- Done! ---');
        console.log('Results saved to scrape_test_results.json');

    } catch (err) {
        console.error('API request failed:', err.message);
    }
}

scrapeFirstPage();
