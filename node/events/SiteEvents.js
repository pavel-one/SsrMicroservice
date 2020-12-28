const fs = require('fs')
const captureWebsite = require('capture-website')
const pathClass = require('path')
const Spider = require("../services/spider");

const createNewSiteEvent = async function (site) {

    // await fillMetaData(site)
    mapSite(site)
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

function mapSite(site) {
    let spider = new Spider({
        concurrent: 1,
        delay: 30000,
        logs: process.stderr,
        allowDuplicates: false,
        catchErrors: true,
        addReferrer: false,
        xhr: false,
        keepAlive: false,

        //- All options are passed to `request` module, for example:
        headers: {'user-agent': 'node-spider'},
        siteObj: site,
        encoding: 'utf8'
    });

    const handleRequest = function (doc) {
        // new page crawled
        // console.log(doc); // response object
        // console.log(doc.url); // page url
        // uses cheerio, check its docs for more info

        // doc.res.site.title = doc.$('title').text()
        // doc.res.site.description = doc.$('meta[name="description"]').attr('content') || ''
        // doc.res.site.save()

        console.log('Handle itarate: ', doc.url)

        doc.$('a').each(function (i, elem) {
            let href = doc.$(elem).attr('href')
            if (!href) {
                return
            }

            href = href.split('#')[0];
            if (!href) {
                return;
            }

            let url = doc.resolve(href);
            // crawl more
            spider.queue(url, handleRequest);
        });
    };

    spider.queue(site.base_url, handleRequest);
}

module.exports = {
    createNewSiteEvent,
    removeSiteEvent
}