const Spider = require('node-spider');
const puppeteer = require('puppeteer')
const path = require('path')
const Url = require('url')

Spider.prototype._request = async function (opts, done) {
    let nameScreen = ''
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    })

    const page = await browser.newPage()

    let response
    try {
        response = await page.goto(opts.url)
        await page.setViewport({
            width: +process.env.SITE_PAGE_WIDTH || 1366,
            height: +process.env.SITE_PAGE_HEIGHT || 768
        })

        const url = new Url.parse(opts.url)

        nameScreen = `${url.hostname}-${url.pathname}.jpg`.replace(/\//g, '_')

        await page.screenshot({
            path: path.resolve(process.env.DIR_SITE_PAGE_SCREEN + nameScreen),
            type: "jpeg",
            fullPage: false
        })
    } catch (e) {
        await page.close()
        await browser.close()

        done(e.message, {
            body: '',
            url: opts.url,
            site: opts.siteObj
        })

        return false
    }

    if (!response) {
        return false
    }

    if (response.status().toString()[0] !== '2') {
        await page.close()
        await browser.close()

        done('Код страницы не 2хх: ' + response.status(), {
            body: '',
            url: opts.url,
            site: opts.siteObj
        })
        return;
    }

    const body = await page.content()

    await page.close()
    await browser.close()

    done(false, {
        body: body,
        url: opts.url,
        site: opts.siteObj,
        screen: nameScreen
    })
}

module.exports = Spider;