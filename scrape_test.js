const { PlaywrightCrawler, Dataset } = require('crawlee');
const fs = require('fs');

async function run() {
    console.log('--- Starting Robust Scrape (First 5 Links) ---');
    
    const crawler = new PlaywrightCrawler({
        launchContext: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            launchOptions: {
                headless: true,
                args: [
                    '--disable-blink-features=AutomationControlled',
                ],
            },
        },
        maxRequestsPerCrawl: 20, 
        requestHandler: async ({ page, request, log, crawler }) => {
            log.info(`Processing ${request.url}...`);

            if (request.label === 'LIST') {
                try {
                    await page.goto(request.url, { waitUntil: 'load', timeout: 60000 });
                } catch (e) {
                    log.error(`Navigation failed: ${e.message}`);
                }

                // Wait for the table to load
                try {
                    await page.waitForSelector('#announcement_table tbody tr', { timeout: 30000 });
                } catch (e) {
                    log.error('Table not found.');
                    return;
                }
                
                // Extract first 5 links
                const links = await page.$$eval('#announcement_table tbody tr', (rows) => {
                    return rows.slice(0, 5).map(row => {
                        const link = row.querySelector('td:nth-child(4) a');
                        return link ? link.href : null;
                    }).filter(l => l !== null);
                });

                log.info(`Found ${links.length} links. Adding to queue...`);
                await crawler.addRequests(links.map(url => ({ url, label: 'DETAIL' })));
            } else if (request.label === 'DETAIL') {
                // ... same as before but maybe with a delay
                await new Promise(r => setTimeout(r, Math.random() * 2000 + 1000));
                // Handle Iframe
                const iframeSelector = await page.evaluate(() => {
                    if (document.querySelector('#story_iframe')) return '#story_iframe';
                    if (document.querySelector('#announcement_details')) return '#announcement_details';
                    return null;
                });

                if (!iframeSelector) {
                    log.error('Could not find iframe for details');
                    return;
                }

                log.info(`Switching to iframe: ${iframeSelector}`);
                const iframeElement = await page.waitForSelector(iframeSelector);
                const frame = await iframeElement.contentFrame();
                
                if (!frame) {
                    log.error('Could not access iframe content frame');
                    return;
                }

                await frame.waitForSelector('table', { timeout: 20000 });

                // Extract structured data
                const data = await frame.evaluate(() => {
                    const findTdByText = (text) => {
                        return Array.from(document.querySelectorAll('td'))
                            .find(td => td.innerText.trim().includes(text));
                    };

                    const getValueNextTo = (text) => {
                        const td = findTdByText(text);
                        return td ? td.nextElementSibling?.innerText.trim() : '';
                    };

                    const companyRaw = document.querySelector('.company-name')?.innerText.trim() || 
                                     document.querySelector('h3')?.innerText.trim() || '';
                    
                    const stockNameMatch = companyRaw.match(/\(([^)]+)\)/);
                    const stockName = stockNameMatch ? stockNameMatch[1] : '';
                    const companyName = companyRaw.split('(')[0].trim();
                    
                    const announcedDate = getValueNextTo('Date Announced') || getValueNextTo('Announcement Date');

                    // Transactions table
                    const transTable = Array.from(document.querySelectorAll('table'))
                        .find(t => t.innerText.includes('Details of changes'));
                    
                    const transactions = [];
                    let changeDate = '';
                    
                    if (transTable) {
                        const rows = Array.from(transTable.querySelectorAll('tr'));
                        // Find the header row to know columns
                        const headerIdx = rows.findIndex(r => r.innerText.includes('Date of change'));
                        if (headerIdx !== -1) {
                            const dataRows = rows.slice(headerIdx + 1);
                            dataRows.forEach(row => {
                                const cells = row.querySelectorAll('td');
                                if (cells.length >= 4) {
                                    const date = cells[1]?.innerText.trim();
                                    const amount = cells[2]?.innerText.replace(/,/g, '').trim();
                                    const type = cells[3]?.innerText.trim();
                                    
                                    if (date && date !== 'No' && !date.includes('Date')) {
                                        changeDate = date;
                                        if (type && amount) {
                                            transactions.push({ 
                                                type, 
                                                amount: parseInt(amount, 10) || 0 
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }

                    const totalHoldingStr = getValueNextTo('Total no of securities after change');
                    const totalHolding = parseInt(totalHoldingStr.replace(/,/g, ''), 10) || 0;

                    const percentageStr = getValueNextTo('Direct (%)');
                    const percentage = parseFloat(percentageStr.replace(/%/g, '')) || 0;

                    return {
                        company: companyName,
                        stock_name: stockName,
                        announced_date: announcedDate,
                        change_date: changeDate,
                        transactions,
                        total_holding: totalHolding,
                        percentage
                    };
                });

                await Dataset.pushData({
                    url: request.url,
                    ...data
                });
            }
        },
    });

    const startUrl = 'https://www.bursamalaysia.com/market_information/announcements/company_announcements?keyword=Employees+Provident+Fund&from_date=01/01/2026&to_date=13/05/2026';

    await crawler.run([{ url: startUrl, label: 'LIST' }]);
    
    const dataset = await Dataset.open();
    const { items } = await dataset.getData();
    
    const outputPath = 'scrape_test_results.json';
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    
    console.log(`\n--- Done! ---`);
    console.log(`Successfully scraped ${items.length} announcements.`);
    console.log(`Results saved to ${outputPath}`);
}

run().catch(err => {
    console.error('Fatal error during scrape:', err);
});

