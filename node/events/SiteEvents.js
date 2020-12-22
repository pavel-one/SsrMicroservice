const fs = require('fs')
const puppeteer = require('puppeteer')
const captureWebsite = require('capture-website')
const pathClass = require('path')
const cheerio = require('cheerio')

const createNewSiteEvent = async function (site) {

    await fillMetaData(site)
    await createScreenshot(site)
}

const removeSiteEvent = async function (site) {
    const path = 'public/user_screenshots/' + site.photo;

    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}

async function createScreenshot(site) {
    const name = site.url.replace('http://', '').replace('https://', '').replace('/', '_') + '.png';
    const path = 'public/user_screenshots/' + name;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }

    captureWebsite.file(site.url, pathClass.resolve(path), {
        launchOptions: {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        }
    }).then(r => {
        site.photo = name
        site.save()
    }).catch(error => {
        console.log('ERROR: ', error.message)
    })
}

async function fillMetaData(site) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });

    const page = await browser.newPage();
    await page.goto(site.url);

    let $ = cheerio.load(await page.content())

    site.title = $('title').text()
    site.description = $('meta[name="description"]').attr('content') || ''
    site.save()

    await browser.close();
}

module.exports = {
    createNewSiteEvent,
    removeSiteEvent
}