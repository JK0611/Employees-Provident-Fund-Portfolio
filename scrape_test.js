const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const KEYWORD = 'Employees Provident Fund';
const FROM_DATE = '01/01/2026';
const TO_DATE = '14/05/2026';
const MAX_DETAIL_LINKS = 5;

async function run() {
    console.log('--- Starting EPF Announcement Scrape ---');
    console.log(`Keyword: ${KEYWORD}`);
    console.log(`Date Range: ${FROM_DATE} - ${TO_DATE}`);
    console.log(`Max Links: ${MAX_DETAIL_LINKS}\n`);

    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: require('playwright').chromium.executablePath(),
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1440, height: 900 });

        // ==========================================
        // Step 1: Navigate to announcements page
        // ==========================================
        console.log('[1] Navigating to Bursa Malaysia announcements page...');
        await page.goto('https://www.bursamalaysia.com/market_information/announcements/company_announcement', {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });

        // Wait for Cloudflare challenge to resolve (if present)
        const title = await page.title();
        if (title.includes('Just a moment') || title.includes('Cloudflare')) {
            console.log('[!] Cloudflare challenge detected — waiting for it to auto-resolve...');
            await page.waitForFunction(
                () => !document.title.includes('Just a moment'),
                { timeout: 30000 }
            );
            console.log('[✓] Cloudflare challenge passed!');
        }

        // ==========================================
        // Step 2: Fill keyword
        // ==========================================
        await page.waitForSelector('#keyword', { timeout: 15000 });
        console.log('[2] Filling keyword: "' + KEYWORD + '"');
        await page.type('#keyword', KEYWORD, { delay: 50 });

        // ==========================================
        // Step 3: Set date range
        // ==========================================
        console.log('[3] Setting date range...');
        // Clear and type from date
        await page.click('#inDate', { clickCount: 3 });
        await page.type('#inDate', FROM_DATE, { delay: 30 });
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 500));

        // Clear and type to date
        await page.click('#inDateTo', { clickCount: 3 });
        await page.type('#inDateTo', TO_DATE, { delay: 30 });
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 500));

        // ==========================================
        // Step 4: Click Search
        // ==========================================
        console.log('[4] Clicking Search...');
        await page.click('.form-submit-btn');

        // Wait for results table
        await new Promise(r => setTimeout(r, 3000));
        await page.waitForSelector('#announcement_table tbody tr', { timeout: 30000 });
        console.log('[✓] Results table loaded!');

        // ==========================================
        // Step 5: Extract first N detail links
        // ==========================================
        const links = await page.$$eval('#announcement_table tbody tr', (rows, max) => {
            return rows.slice(0, max).map(row => {
                const titleCell = row.querySelector('td:nth-child(4)');
                const link = titleCell ? titleCell.querySelector('a') : null;
                return link ? link.href : null;
            }).filter(Boolean);
        }, MAX_DETAIL_LINKS);

        console.log(`[5] Found ${links.length} detail links:`);
        links.forEach((url, i) => console.log(`    [${i + 1}] ${url}`));

        // ==========================================
        // Step 6: Scrape each detail page
        // ==========================================
        const results = [];

        for (let i = 0; i < links.length; i++) {
            const url = links[i];
            console.log(`\n[6.${i + 1}] Scraping: ${url}`);

            // Random delay to be polite
            await new Promise(r => setTimeout(r, Math.random() * 2000 + 1000));

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            // Handle Cloudflare again if needed
            const detailTitle = await page.title();
            if (detailTitle.includes('Just a moment')) {
                console.log('  [!] Cloudflare challenge — waiting...');
                await page.waitForFunction(
                    () => !document.title.includes('Just a moment'),
                    { timeout: 30000 }
                );
            }

            await page.waitForNetworkIdle({ timeout: 15000 }).catch(() => {});

            // Find the iframe containing the announcement details
            let frame = null;

            // Try to find by frame URL pattern first
            for (const f of page.frames()) {
                if (f.url().includes('disclosure.bursamalaysia.com')) {
                    frame = f;
                    break;
                }
            }

            // Fallback: try iframe element selectors
            if (!frame) {
                const selectors = ['#story_iframe', '#announcement_details', '#announcement_iframe', 'iframe'];
                for (const sel of selectors) {
                    try {
                        const el = await page.waitForSelector(sel, { timeout: 10000 });
                        if (el) {
                            frame = await el.contentFrame();
                            if (frame) break;
                        }
                    } catch (e) { continue; }
                }
            }

            if (!frame) {
                console.log('  [✗] Could not find content frame — skipping');
                continue;
            }

            // Wait for content inside the frame
            try {
                await frame.waitForSelector('table', { timeout: 20000 });
            } catch (e) {
                console.log('  [✗] No tables found in frame — skipping');
                continue;
            }

            // Extract structured data
            const data = await frame.evaluate(() => {
                const findTdByText = (text) => {
                    return Array.from(document.querySelectorAll('td'))
                        .find(td => td.innerText.trim().includes(text));
                };

                const getValueNextTo = (text) => {
                    const td = findTdByText(text);
                    return td ? (td.nextElementSibling?.innerText.trim() || '') : '';
                };

                // Company Name & Stock Name
                const companyRaw = document.querySelector('.company-name')?.innerText.trim()
                    || document.querySelector('h3')?.innerText.trim()
                    || '';
                const stockNameMatch = companyRaw.match(/\(([^)]+)\)/);
                const stockName = stockNameMatch ? stockNameMatch[1] : '';
                const companyName = companyRaw.split('(')[0].trim();

                // Date Announced
                const dateAnnounced = getValueNextTo('Date Announced')
                    || getValueNextTo('Announcement Date')
                    || '';

                // Transactions (type + no of securities)
                const transTable = Array.from(document.querySelectorAll('table'))
                    .find(t => t.innerText.includes('Details of changes'));

                const transactions = [];
                if (transTable) {
                    const rows = Array.from(transTable.querySelectorAll('tr'));
                    const headerIdx = rows.findIndex(r => r.innerText.includes('Date of change'));
                    if (headerIdx !== -1) {
                        const dataRows = rows.slice(headerIdx + 1);
                        dataRows.forEach(row => {
                            const cells = row.querySelectorAll('td');
                            if (cells.length >= 4) {
                                const type = cells[3]?.innerText.trim();
                                const noOfSecurities = cells[2]?.innerText.replace(/,/g, '').trim();
                                if (type && noOfSecurities && !type.includes('Date') && noOfSecurities !== '') {
                                    transactions.push({
                                        type_of_transaction: type,
                                        no_of_securities: parseInt(noOfSecurities, 10) || 0,
                                    });
                                }
                            }
                        });
                    }
                }

                // Direct (%)
                const directPercentStr = getValueNextTo('Direct (%)');
                const directPercent = parseFloat(directPercentStr.replace(/%/g, '')) || 0;

                // Total no of securities after change
                const totalSecuritiesStr = getValueNextTo('Total no of securities after change');
                const totalSecurities = parseInt(totalSecuritiesStr.replace(/,/g, ''), 10) || 0;

                return {
                    company_name: companyName,
                    stock_name: stockName,
                    date_announced: dateAnnounced,
                    transactions,
                    direct_percent: directPercent,
                    total_securities_after_change: totalSecurities,
                };
            });

            console.log(`  [✓] ${data.company_name} (${data.stock_name}) — ${data.transactions.length} transaction(s)`);
            results.push({ url, ...data });
        }

        // Save results
        const outputPath = 'scrape_test_results.json';
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

        console.log(`\n--- Done! ---`);
        console.log(`Successfully scraped ${results.length} announcements.`);
        console.log(`Results saved to ${outputPath}`);

    } finally {
        await browser.close();
    }
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
