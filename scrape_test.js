const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const KEYWORD = 'Employees Provident Fund';
const FROM_DATE = '01/01/2026';
const TO_DATE = '14/05/2026';
const LINKS_FILE = path.join(__dirname, 'links.json');
const RESULTS_FILE = path.join(__dirname, 'scrape_test_results.json');

async function run() {
    console.log('--- Starting EPF Announcement Scrape ---');
    console.log(`Keyword: ${KEYWORD}`);
    console.log(`Date Range: ${FROM_DATE} - ${TO_DATE}\n`);
    
    // Load existing results for checkpointing
    let existingResults = [];
    if (fs.existsSync(RESULTS_FILE)) {
        try {
            existingResults = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
            console.log(`[i] Loaded ${existingResults.length} existing records from ${RESULTS_FILE}`);
        } catch (e) {
            console.log('[!] Error parsing existing results, starting fresh.');
        }
    }
    const scrapedIds = new Set(existingResults.map(r => {
        const match = r.url.match(/ann_id=(\d+)/);
        return match ? match[1] : null;
    }).filter(Boolean));

    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: require('playwright').chromium.executablePath(),
    });

    let links = [];

    // ==========================================
    // Phase 1: Pagination & Link Collection
    // ==========================================
    if (fs.existsSync(LINKS_FILE)) {
        try {
            links = JSON.parse(fs.readFileSync(LINKS_FILE, 'utf-8'));
            console.log(`[i] Loaded ${links.length} total links from ${LINKS_FILE}`);
        } catch(e) {}
    }

    if (links.length === 0) {
        console.log('\n--- Phase 1: Collecting Links ---');
        const page = await browser.newPage();

        console.log('[1] Navigating to Bursa Malaysia announcements page...');
        await page.goto('https://www.bursamalaysia.com/market_information/announcements/company_announcement', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const title = await page.title();
        if (title.includes('Just a moment') || title.includes('Attention Required')) {
            console.log('  [!] Cloudflare challenge — waiting...');
            await page.waitForFunction(() => !document.title.includes('Just a moment') && !document.title.includes('Attention Required'), { timeout: 60000 });
        }

        await page.waitForSelector('#keyword', { timeout: 30000 });
        console.log('[2] Filling keyword...');
        await page.type('#keyword', KEYWORD);

        console.log('[3] Setting date range...');
        await page.evaluate(({ from, to }) => {
            if (window.$ || window.jQuery) {
                const jq = window.$ || window.jQuery;
                jq('#inDate').val(from).trigger('change');
                jq('#inDateTo').val(to).trigger('change');
            }
        }, { from: FROM_DATE, to: TO_DATE });

        console.log('[4] Clicking Search...');
        await page.click('.form-submit-btn');
        await new Promise(r => setTimeout(r, 5000));
        await page.waitForSelector('#table-announcements', { timeout: 30000 });

        console.log('[5] Extracting links across all pages...');
        let hasNextPage = true;
        let pageNum = 1;

        while (hasNextPage) {
            console.log(`    Scraping page ${pageNum}...`);
            await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});
            
            const newLinks = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('#table-announcements tbody tr a'));
                return anchors.map(a => a.href).filter(h => h && h.includes('announcement_details'));
            });
            
            // Deduplicate
            for (const link of newLinks) {
                if (!links.includes(link)) {
                    links.push(link);
                }
            }

            // Check if there's a next page
            const nextBtn = await page.$('.paginate_button.next:not(.disabled)');
            if (nextBtn) {
                await nextBtn.click();
                await new Promise(r => setTimeout(r, 2000)); // wait for table reload
                pageNum++;
            } else {
                hasNextPage = false;
            }
        }
        
        fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));
        console.log(`[✓] Saved ${links.length} unique links to ${LINKS_FILE}`);
        await page.close();
    }

    // ==========================================
    // Phase 2: Detail Scraping with Checkpointing
    // ==========================================
    console.log('\n--- Phase 2: Scraping Details ---');
    const detailPage = await browser.newPage();
    
    // Speed optimization: Block images, fonts, css, media
    await detailPage.setRequestInterception(true);
    detailPage.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
            req.abort();
        } else {
            req.continue();
        }
    });

    for (let i = 0; i < links.length; i++) {
        const url = links[i];
        const match = url.match(/ann_id=(\d+)/);
        const annId = match ? match[1] : null;

        if (annId && scrapedIds.has(annId)) {
            console.log(`[${i + 1}/${links.length}] Skipping (already scraped): ${url}`);
            continue;
        }

        console.log(`\n[${i + 1}/${links.length}] Scraping: ${url}`);

        // Random delay to be polite to the server
        await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));

        try {
            await detailPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            // Handle Cloudflare on detail page
            const detailTitle = await detailPage.title();
            if (detailTitle.includes('Just a moment')) {
                console.log('  [!] Cloudflare challenge — waiting...');
                await detailPage.waitForFunction(
                    () => !document.title.includes('Just a moment'),
                    { timeout: 30000 }
                );
            }

            // Find iframe containing the data
            let frame = null;
            for (const f of detailPage.frames()) {
                if (f.url().includes('disclosure.bursamalaysia.com')) {
                    frame = f;
                    break;
                }
            }

            if (!frame) {
                const selectors = ['#story_iframe', '#announcement_details', '#announcement_iframe', 'iframe'];
                for (const sel of selectors) {
                    try {
                        const el = await detailPage.waitForSelector(sel, { timeout: 5000 });
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

            try {
                await frame.waitForSelector('table', { timeout: 15000 });
            } catch (e) {
                console.log('  [✗] No tables found in frame — skipping');
                continue;
            }

            // Extract data from iframe
            const data = await frame.evaluate(() => {
                const getValueNextTo = (text) => {
                    let td = Array.from(document.querySelectorAll('td')).find(el => el.innerText.trim() === text);
                    if (!td) {
                        td = Array.from(document.querySelectorAll('td')).find(el => el.innerText.trim().includes(text));
                    }
                    return td ? (td.nextElementSibling?.innerText.trim() || '') : '';
                };

                const companyName = getValueNextTo('Company Name') || document.querySelector('h3')?.innerText.trim() || '';
                const stockName = getValueNextTo('Stock Name') || '';
                const dateAnnounced = getValueNextTo('Date Announced') || getValueNextTo('Announcement Date') || '';

                const transactions = [];
                const transTables = Array.from(document.querySelectorAll('.ven_table'));
                transTables.forEach(transTable => {
                    const rows = Array.from(transTable.querySelectorAll('tr'));
                    const headerIdx = rows.findIndex(r => r.innerText.includes('Date of change'));
                    if (headerIdx !== -1) {
                        const dataRows = rows.slice(headerIdx + 1);
                        dataRows.forEach(row => {
                            const cells = row.querySelectorAll('td');
                            if (cells.length === 5) {
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
                });

                const directPercentStr = getValueNextTo('Direct (%)');
                const directPercent = parseFloat(directPercentStr.replace(/%/g, '')) || 0;

                const totalSecuritiesStr = getValueNextTo('Total no of securities after change');
                const totalSecurities = parseInt(totalSecuritiesStr.replace(/,/g, ''), 10) || 0;

                return {
                    company_name: companyName,
                    stock_name: stockName,
                    date_announced: dateAnnounced,
                    transactions: transactions,
                    direct_percent: directPercent,
                    total_securities_after_change: totalSecurities
                };
            });

            const resultObj = { url, ...data };
            console.log(`  [✓] ${data.company_name} (${data.stock_name}) — ${data.transactions.length} transaction(s)`);

            existingResults.push(resultObj);
            
            // Checkpoint: Write to file instantly
            fs.writeFileSync(RESULTS_FILE, JSON.stringify(existingResults, null, 2));

        } catch (e) {
            console.log(`  [✗] Error scraping detail page: ${e.message}`);
        }
    }

    console.log('\n--- Done! ---');
    console.log(`Total scraped: ${existingResults.length}`);
    await browser.close();
}

run();
