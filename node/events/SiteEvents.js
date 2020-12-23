const fs = require('fs')
const puppeteer = require('puppeteer')
const captureWebsite = require('capture-website')
const pathClass = require('path')
const cheerio = require('cheerio')

const createNewSiteEvent = async function (site) {

    await fillMetaData(site)
    await createScreenshot(site)

    // await siteMap(site)
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
    const $ = await getHtml(site.url)

    site.title = $('title').text()
    site.description = $('meta[name="description"]').attr('content') || ''
    return site.save()
}

async function siteMap(site) {
    const $ = await getHtml(site.base_url)
    const links = await getLinks($, site.base_url)

    await site.addLinks(links)

    await parse(site)


    console.log('saved')
}

async function parse(site) {
    let data = JSON.parse(site.sitemap)
    console.log('PARSE: ', data.length)

    let startLinks = data[data.length - 1].links

    for (const value of startLinks) {
        let $ = await getHtml(site.base_url + '/' + value)
        let links = await getLinks($, site.base_url)
        await site.addLinks(links)
    }
}

//helpers
async function getHtml(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    });
    const page = await browser.newPage();
    await page.goto(url);
    return cheerio.load(await page.content())
}

async function getLinks($, url) {
    const links = $('a')
    const out = []

    if (links.length === 0) {
        return out
    }

    links.each((i, item) => {
        let href = $(item).attr('href')
        if (!href) {
            return true;
        }
        href = href.replace(url, '')

        if (href === '#' || href === '' || href === '/') {
            return true;
        }
        if (href.startsWith('http')) {
            return true
        }
        if (href.startsWith('#')) {
            return true
        }
        out.push(href)
    })
    return out;
}

module.exports = {
    createNewSiteEvent,
    removeSiteEvent,
}