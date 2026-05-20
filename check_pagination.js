const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const KEYWORD = 'Employees Provident Fund';
const FROM_DATE = '01/01/2026';
const TO_DATE = '14/05/2026';

async function run() {
    const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: require('playwright').chromium.executablePath(),
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    
    // Stealth settings
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        window.chrome = { runtime: {} };
    });

    console.log('[1] Navigating...');
    await page.goto('https://www.bursamalaysia.com/market_information/announcements/company_announcement', { waitUntil: 'domcontentloaded', timeout: 60000 });

    const title = await page.title();
    if (title.includes('Just a moment')) {
        console.log('[!] Cloudflare challenge — waiting...');
        await page.waitForFunction(() => !document.title.includes('Just a moment'), { timeout: 60000 });
    }

    await page.waitForSelector('#keyword_search', { timeout: 30000 });
    console.log('[2] Filling keyword');
    await page.type('#keyword_search', KEYWORD);

    console.log('[3] Setting dates');
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

    // Extract pagination HTML
    const paginationData = await page.evaluate(() => {
        const pag = document.querySelector('.dataTables_paginate');
        const info = document.querySelector('.dataTables_info');
        return {
            pagHtml: pag ? pag.innerHTML : 'No pagination found',
            infoText: info ? info.innerText : 'No info text found'
        };
    });

    console.log('Pagination Data:', paginationData);

    await browser.close();
}

run();
