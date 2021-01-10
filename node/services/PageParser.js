const puppeteer = require('puppeteer')
const Document = require('node-spider/lib/document')
const path = require('path')

class PageParser {
    SitePageObj
    browser
    page
    doc
    error = false
    errorMessage = ''
    screen = ''
    url

    constructor(SitePageObj) {
        this.SitePageObj = SitePageObj
        this.url = require('url').parse(SitePageObj.url)
    }

    async parse() {
        try {
            this.browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            })

            this.page = await this.browser.newPage()
            const response = await this.page.goto(this.SitePageObj.url)
            await this.checkStatus(response)
            await this.page.setViewport({
                width: +process.env.SITE_PAGE_WIDTH || 1366,
                height: +process.env.SITE_PAGE_HEIGHT || 768
            })

            this.screen = `${this.url.hostname}-${this.url.pathname}.jpg`.replace(/\//g, '_')
            await this.page.screenshot({
                path: path.resolve(process.env.DIR_SITE_PAGE_SCREEN + this.screen),
                type: "jpeg",
                fullPage: false
            })

        } catch (e) {
            await this.close()
            this.error = true
            this.errorMessage = e.message

            console.log('ERROR IN PAGE PARSER: ', e)

            return this
        }

        this.response = await this.page.content()
        this.doc = new Document(this.SitePageObj.url, {
            body: this.getResponse(),
            screen: this.screen
        })

        await this.close()

        return this
    }

    checkStatus(response) {
        if (response.status().toString()[0] !== '2') {
            throw new Error('Код страницы не 2хх: ' + response.status())
        }
    }

    async close() {
        await this.page.close()
        await this.browser.close()
    }

    getResponse() {
        return this.response
    }

}

module.exports = PageParser