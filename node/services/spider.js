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
    await page.goto(opts.url)
    const body = await page.content()

    await browser.close()

    done(false, {
        body: body,
        url: opts.url,
        site: opts.siteObj
    })
}

module.exports = Spider;