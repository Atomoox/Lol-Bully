import got from 'got';


(async () => {
    const { body } = await got.get('https://api.amiami.com/api/v1.0/items?pagemax=50&lang=eng&s_keywords=Kanna', {
        headers: {
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en,fr-FR;q=0.9,fr;q=0.8,en-US;q=0.7',
            'access-control-request-headers': 'x-user-key',
            'access-control-request-method': 'GET',
            'origin': 'https://www.amiami.com',
            'referer': 'https://www.amiami.com/',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
            'x-user-key': 'amiami_dev'
        },
        throwHttpErrors: false,
    });
    const data = JSON.parse(body);
    data.items.forEach((element: any) => {
        console.log(element.gname);
    });
})();