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
    if (site.photo === 'no-photo.png') {
        return true
    }

    const path = 'public/user_screenshots/' + site.photo;

    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
        return true
    }

    return false
}

async function createScreenshot(site) {
    const name = site.getDomain() + '.png'
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
        site.photo = 'no-photo.png'
        site.save()
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