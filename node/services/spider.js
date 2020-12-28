const Spider = require('node-spider');
const puppeteer = require('puppeteer')

Spider.prototype._request = async function (opts, done) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    })

    const page = await browser.newPage()
    const response = await page.goto(opts.url)
        .catch(error => {
            done(error.message, {
                body: '',
                url: opts.url,
                site: opts.siteObj
            })
        })

    if (!response) {
        return
    }

    if (response.status().toString()[0] !== '2') {
        done('Код страницы не 2хх: ' + response.status(), {
            body: '',
            url: opts.url,
            site: opts.siteObj
        })
        return;
    }

    const body = await page.content()

    await browser.close()

    done(false, {
        body: body,
        url: opts.url,
        site: opts.siteObj
    })
}

module.exports = Spider;