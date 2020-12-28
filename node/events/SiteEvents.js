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
        concurrent: 4, //Количество потоков
        delay: 5000, //Задержка после каждого парсинга
        //logs: process.stderr, //Куда логировать
        allowDuplicates: false,
        catchErrors: true,
        addReferrer: false,
        xhr: false,
        keepAlive: false,

        //- All options are passed to `request` module, for example:
        headers: {'user-agent': 'node-spider'}, //Пока что не используется
        siteObj: site,
        encoding: 'utf8' //Как и это
    });

    const handleRequest = function (doc) {

        //Первая страница
        if (doc.url === doc.res.site.base_url) {
            doc.res.site.title = doc.$('title').text()
            doc.res.site.description = doc.$('meta[name="description"]').attr('content') || ''
            doc.res.site.save()
        }

        console.log('HANDLE: ', doc.url)

        doc.$('a').each(function (i, elem) {
            let href = doc.$(elem).attr('href')
            if (!href) {
                return
            }

            href = href.split('#')[0];
            if (!href) {
                return;
            }

            if (href.substr(0, 4) === 'http') {
                return;
            }
            if (href[0] === '/') {
                return;
            }

            let $base = doc.$('base'),
                addBase = ''
            if ($base.length) {
                addBase = $base.attr('href')
            }
            if (href[0] !== '/') {
                href = addBase + href
            }
            const url = doc.resolve(href);

            // Запускам кравлер следующей страницы
            spider.queue(url, handleRequest);
        });
    };

    spider.queue(site.base_url, handleRequest);
}

module.exports = {
    createNewSiteEvent,
    removeSiteEvent
}