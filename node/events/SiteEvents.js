const fs = require('fs')
const captureWebsite = require('capture-website')
const pathClass = require('path')
const Parser = require("../services/SiteParser");

const createNewSiteEvent = async function (site) {
    Parser(site)
    await createScreenshot(site)
}

async function createScreenshot(site) {
    const name = site.getDomain() + '.png'
    const path = process.env.DIR_SITE_SCREEN + name;
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


module.exports = {
    createNewSiteEvent
}