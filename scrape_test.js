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

const getAnnouncementId = (url) => {
    const match = url.match(/ann_id=(\d+)/);
    return match ? match[1] : null;
};

const hasCompleteDetails = (record) => {
    if (!record) {
        return false;
    }

    const hasRequiredTotal = Number(record.direct_percent || 0) === 0 || Number(record.total_securities_after_change || 0) > 0;

    return Boolean(
        record.company_name &&
        record.stock_name &&
        record.date_announced &&
        Array.isArray(record.transactions) &&
        record.transactions.length > 0 &&
        hasRequiredTotal
    );
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
    const completeIds = new Set();
    const incompleteIds = new Set();
    existingResults = existingResults.filter(record => {
        const annId = getAnnouncementId(record.url || '');
        if (!annId) {
            return true;
        }

        if (hasCompleteDetails(record)) {
            completeIds.add(annId);
            return true;
        }

        incompleteIds.add(annId);
        return false;
    });

    if (incompleteIds.size > 0) {
        console.log(`[i] Will retry ${incompleteIds.size} incomplete detail record(s): ${Array.from(incompleteIds).join(', ')}`);
        fs.writeFileSync(RESULTS_FILE, JSON.stringify(existingResults, null, 2));
    }

    // Dynamic Date Calculation:
    // If we have previous results, find the latest announcement date in the database
    // and look back from that date (with a 3-day safety buffer) to bridge any gaps.
    // Otherwise, perform a full backfill from 01/01/2026.
    const now = new Date();
    const TO_DATE = getFormattedDate(now);
    const FROM_DATE = existingResults.length > 0
        ? (() => {
            let latest = new Date('2026-01-01');
            for (const r of existingResults) {
                if (r.date_announced) {
                    const d = new Date(r.date_announced);
                    if (!isNaN(d.getTime()) && d > latest) {
                        latest = d;
                    }
                }
            }
            // Subtract 3 days safety buffer to capture overlapping announcements on the same day
            latest.setDate(latest.getDate() - 3);
            const limit = new Date('2026-01-01');
            const target = latest < limit ? limit : latest;
            return getFormattedDate(target);
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

    let apiReachable = false;

    while (hasNextPage) {
        console.log(`    Querying API page ${pageNum}...`);
        let retries = 3;
        let res = null;

        while (retries > 0) {
            try {
                res = await gotScraping({
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
                    timeout: { request: 30000 },
                });
                break; // success
            } catch (e) {
                retries--;
                console.log(`    [✗] Request error (${retries} retries left): ${e.message}`);
                if (retries > 0) {
                    await new Promise(r => setTimeout(r, 3000));
                }
            }
        }

        if (!res) {
            console.log(`    [✗] Failed to reach API after retries on page ${pageNum}`);
            hasNextPage = false;
            break;
        }

        if (res.statusCode !== 200) {
            console.log(`    [✗] Non-200 status code: ${res.statusCode}`);
            // Check for Cloudflare challenge
            if (res.body && (res.body.includes('Just a moment') || res.body.includes('cf-browser-verification'))) {
                console.log('    [✗] Cloudflare challenge detected — API is blocking this IP');
            }
            hasNextPage = false;
            break;
        }

        // Verify response is valid JSON (not an HTML challenge page)
        let data;
        try {
            data = JSON.parse(res.body);
        } catch (e) {
            console.log(`    [✗] Response is not valid JSON — likely a Cloudflare/WAF block`);
            console.log(`    [✗] Response preview: ${res.body.substring(0, 200)}`);
            hasNextPage = false;
            break;
        }

        apiReachable = true;
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
            
        if (items.length < 20) {
            hasNextPage = false;
        } else {
            pageNum++;
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    if (!apiReachable) {
        console.error('\n[✗] FATAL: Could not reach Bursa API — exiting with error');
        process.exit(1);
    }

    fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));
    console.log(`[✓] Saved ${links.length} unique links (added ${newLinksAdded} new) to ${LINKS_FILE}`);

    // ==========================================
    // Phase 2: Detail Scraping with Checkpointing
    // ==========================================
    console.log('\n--- Phase 2: Scraping Details ---');

    for (let i = 0; i < links.length; i++) {
        const url = links[i];
        const annId = getAnnouncementId(url);

        if (annId && completeIds.has(annId)) {
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

            const parseNumber = (value) => {
                const parsed = parseInt(String(value || '').replace(/[^\d-]/g, ''), 10);
                return Number.isNaN(parsed) ? 0 : parsed;
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

            if (transactions.length === 0) {
                // Fallback for Cessation notices
                const disposedStr = getValueNextTo('No of securities disposed');
                if (disposedStr) {
                    const disposedVal = parseInt(disposedStr.replace(/,/g, ''), 10) || 0;
                    if (disposedVal > 0) {
                        transactions.push({
                            type_of_transaction: 'Divestment',
                            no_of_securities: disposedVal
                        });
                    }
                }
                
                // Fallback for Interest notices
                if (transactions.length === 0) {
                    const acquiredStr = getValueNextTo('No of securities acquired') || getValueNextTo('No of securities');
                    if (acquiredStr) {
                        const acquiredVal = parseInt(acquiredStr.replace(/,/g, ''), 10) || 0;
                        if (acquiredVal > 0) {
                            transactions.push({
                                type_of_transaction: 'Acquired',
                                no_of_securities: acquiredVal
                            });
                        }
                    }
                }
            }

            const directPercentStr = getValueNextTo('Direct (%)');
            let directPercent = parseFloat(directPercentStr.replace(/%/g, '')) || 0;

            if (directPercent === 0) {
                const indirectPercentStr = getValueNextTo('Indirect/deemed interest (%)') || getValueNextTo('Indirect (%)') || getValueNextTo('Deemed (%)');
                if (indirectPercentStr) {
                    directPercent = parseFloat(indirectPercentStr.replace(/%/g, '')) || 0;
                }
            }

            const totalSecuritiesStr = getValueNextTo('Total no of securities after change');
            let totalSecurities = parseNumber(totalSecuritiesStr);

            if (totalSecurities === 0) {
                const directUnits = parseNumber(getValueNextTo('Direct (units)'));
                const indirectUnits = parseNumber(
                    getValueNextTo('Indirect/deemed interest (units)') ||
                    getValueNextTo('Indirect (units)') ||
                    getValueNextTo('Deemed (units)')
                );
                totalSecurities = directUnits + indirectUnits;
            }

            const data = {
                company_name: companyName,
                stock_name: stockName,
                date_announced: dateAnnounced,
                transactions: transactions,
                direct_percent: directPercent,
                total_securities_after_change: totalSecurities
            };

            const resultObj = { url, ...data };
            if (!hasCompleteDetails(resultObj)) {
                console.log(`  [!] Incomplete detail data for ID ${annId}; leaving it unsaved for retry`);
                console.log(`      company="${data.company_name}", stock="${data.stock_name}", date="${data.date_announced}", transactions=${data.transactions.length}`);
                continue;
            }
            console.log(`  [✓] ${data.company_name} (${data.stock_name}) — ${data.transactions.length} transaction(s)`);

            existingResults.push(resultObj);
            if (annId) {
                completeIds.add(annId);
            }
            
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
