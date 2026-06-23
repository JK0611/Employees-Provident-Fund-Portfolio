const run = async () => {
  const { gotScraping } = await import('got-scraping');

  const queries = [
    { label: 'cat=SH,CHSH (exact dropdown value)', params: { cat: 'SH,CHSH' } },
    { label: 'cat=SH (just SH)', params: { cat: 'SH' } },
    { label: 'cat=CHSH (just CHSH)', params: { cat: 'CHSH' } },
  ];

  for (const q of queries) {
    try {
      const res = await gotScraping({
        url: 'https://www.bursamalaysia.com/api/v1/announcements/search',
        searchParams: {
          ann_type: 'company',
          keyword: 'Employees Provident Fund',
          dt_ht: '01/01/2000',
          dt_lt: '17/06/2026',
          page: 1,
          ...q.params,
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
      const data = JSON.parse(res.body);
      console.log(q.label + ' => recordsFiltered: ' + data.recordsFiltered);
    } catch (e) {
      console.error(q.label + ' => ERROR: ' + e.message);
    }
  }
};

run();
