const axios = require('axios');

async function test() {
    const url = 'https://www.bursamalaysia.com/market_information/announcements/company_announcements?keyword=Employees+Provident+Fund';
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            },
            timeout: 10000
        });
        console.log('Status:', response.status);
        console.log('Length:', response.data.length);
    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Response Status:', e.response.status);
        }
    }
}

test();
