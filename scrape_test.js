const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const KEYWORD = 'Employees Provident Fund';
const LINKS_FILE = path.join(__dirname, 'links.json');
const RESULTS_FILE = path.join(__dirname, 'scrape_test_results.json');

const getFormattedDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

async function run() {
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

    // Dynamic Date Calculation:
    // If we have previous results, look back 7 days to check for new announcements.
    // Otherwise, perform a full backfill from 01/01/2026.
    const TO_DATE = getFormattedDate(new Date());
    const FROM_DATE = existingResults.length > 0
        ? (() => {
            const d = new Date();
            d.setDate(d.getDate() - 7);
            return getFormattedDate(d);
          })()
        : '01/01/2026';

    console.log('--- Starting EPF Announcement Scrape ---');
    console.log(`Keyword: ${KEYWORD}`);
    console.log(`Date Range: ${FROM_DATE} - ${TO_DATE}\n`);

    let links = [];
    if (fs.existsSync(LINKS_FILE)) {
        try {
            links = JSON.parse(fs.readFileSync(LINKS_FILE, 'utf-8'));
            console.log(`[i] Loaded ${links.length} total links from ${LINKS_FILE}`);
        } catch(e) {}
    }

    // ==========================================
    // Phase 1: Pagination & Link Collection
    // ==========================================
    console.log('\n--- Phase 1: Collecting Links ---');
    const { gotScraping } = await import('got-scraping');

    let pageNum = 1;
    let hasNextPage = true;
    let newLinksAdded = 0;

    while (hasNextPage) {
        console.log(`    Querying API page ${pageNum}...`);
        try {
            const res = await gotScraping({
                url: 'https://www.bursamalaysia.com/api/v1/announcements/search',
                searchParams: {
                    ann_type: 'company',
                    keyword: KEYWORD,
                    dt_ht: FROM_DATE,
                    dt_lt: TO_DATE,
                    page: pageNum,
                },
                headers: {
                    'Referer': 'https://www.bursamalaysia.com/market_information/announcements/company_announcement',
                },
                headerGeneratorOptions: {
                    browsers: ['chrome'],
                    operatingSystems: ['windows'],
                },
            });

            if (res.statusCode !== 200) {
                console.log(`    [✗] Non-200 status code: ${res.statusCode}`);
                hasNextPage = false;
                break;
            }

            const data = JSON.parse(res.body);
            const items = data.data || [];
            
            if (items.length === 0) {
                hasNextPage = false;
                break;
            }

            for (const item of items) {
                const $title = cheerio.load(item[3]);
                const relativeLink = $title('a').attr('href');
                if (relativeLink) {
                    const fullLink = 'https://www.bursamalaysia.com' + relativeLink;
                    if (!links.includes(fullLink)) {
                        links.push(fullLink);
                        newLinksAdded++;
                    }
                }
            }

            const totalFiltered = parseInt(data.recordsFiltered, 10) || 0;
            console.log(`    Processed page ${pageNum} (${items.length} items). Total database matched: ${totalFiltered}`);
            
            // Check if we have processed all filtered results
            const currentTotalMatchingLinks = links.filter(l => {
                const id = l.match(/ann_id=(\d+)/)?.[1];
                return id && !scrapedIds.has(id); // Count only unscraped ones if we want to be exact
            }).length;

            if (items.length < 20) {
                hasNextPage = false;
            } else {
                pageNum++;
                await new Promise(r => setTimeout(r, 1000));
            }
        } catch (e) {
            console.log(`    [✗] Error querying page ${pageNum}: ${e.message}`);
            hasNextPage = false;
        }
    }

    fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));
    console.log(`[✓] Saved ${links.length} unique links (added ${newLinksAdded} new) to ${LINKS_FILE}`);

    // ==========================================
    // Phase 2: Detail Scraping with Checkpointing
    // ==========================================
    console.log('\n--- Phase 2: Scraping Details ---');

    for (let i = 0; i < links.length; i++) {
        const url = links[i];
        const match = url.match(/ann_id=(\d+)/);
        const annId = match ? match[1] : null;

        if (annId && scrapedIds.has(annId)) {
            console.log(`[${i + 1}/${links.length}] Skipping (already scraped): ${url}`);
            continue;
        }

        console.log(`\n[${i + 1}/${links.length}] Scraping details for ID: ${annId}`);

        // Random polite delay
        await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));

        try {
            const detailUrl = `https://disclosure.bursamalaysia.com/FileAccess/viewHtml?e=${annId}`;
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

            if (res.statusCode !== 200) {
                console.log(`  [✗] Failed to fetch detail: status code ${res.statusCode}`);
                continue;
            }

            const $ = cheerio.load(res.body);
            const tds = $('td');

            if (tds.length === 0) {
                console.log('  [✗] No content found in detail page — skipping');
                continue;
            }

            const getValueNextTo = (text) => {
                let td = tds.filter((idx, el) => $(el).text().trim() === text);
                if (td.length === 0) {
                    td = tds.filter((idx, el) => $(el).text().trim().includes(text));
                }
                return td.length > 0 ? td.first().next().text().trim() : '';
            };

            const companyName = getValueNextTo('Company Name') || $('h3').first().text().trim() || '';
            const stockName = getValueNextTo('Stock Name') || '';
            const dateAnnounced = getValueNextTo('Date Announced') || getValueNextTo('Announcement Date') || '';

            const transactions = [];
            const transTables = $('.ven_table');

            transTables.each((tIdx, transTable) => {
                const rows = $(transTable).find('tr');
                let headerIdx = -1;
                
                rows.each((rIdx, row) => {
                    const rowText = $(row).text();
                    if (rowText.includes('Date of change')) {
                        headerIdx = rIdx;
                    }
                });
                
                if (headerIdx !== -1) {
                    const dataRows = rows.slice(headerIdx + 1);
                    dataRows.each((rIdx, row) => {
                        const cells = $(row).find('td');
                        if (cells.length === 5) {
                            const type = $(cells[3]).text().trim();
                            const noOfSecurities = $(cells[2]).text().replace(/,/g, '').trim();
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
            let directPercent = parseFloat(directPercentStr.replace(/%/g, '')) || 0;

            if (directPercent === 0) {
                const indirectPercentStr = getValueNextTo('Indirect/deemed interest (%)') || getValueNextTo('Indirect (%)') || getValueNextTo('Deemed (%)');
                if (indirectPercentStr) {
                    directPercent = parseFloat(indirectPercentStr.replace(/%/g, '')) || 0;
                }
            }

            const totalSecuritiesStr = getValueNextTo('Total no of securities after change');
            const totalSecurities = parseInt(totalSecuritiesStr.replace(/,/g, ''), 10) || 0;

            const data = {
                company_name: companyName,
                stock_name: stockName,
                date_announced: dateAnnounced,
                transactions: transactions,
                direct_percent: directPercent,
                total_securities_after_change: totalSecurities
            };

            const resultObj = { url, ...data };
            console.log(`  [✓] ${data.company_name} (${data.stock_name}) — ${data.transactions.length} transaction(s)`);

            existingResults.push(resultObj);
            
            // Checkpoint: Save instantly
            fs.writeFileSync(RESULTS_FILE, JSON.stringify(existingResults, null, 2));

        } catch (e) {
            console.log(`  [✗] Error scraping detail page: ${e.message}`);
        }
    }

    console.log('\n--- Done! ---');
    console.log(`Total records: ${existingResults.length}`);
}

run();
