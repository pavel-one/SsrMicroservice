const fs = require('fs')
const captureWebsite = require('capture-website')
const pathClass = require('path')
const Parser = require('../services/SiteParser')

const createNewSiteEvent = async function (site) {

    new Parser({}, site)
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


module.exports = {
    createNewSiteEvent,
    removeSiteEvent
}