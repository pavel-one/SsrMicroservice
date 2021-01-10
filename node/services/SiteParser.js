const SpiderClass = require('./spider')
const SitePageModel = require('../models/SitePage')

let Spider;

async function errorParser(err = '', url) {
    if (url === this.siteObj.base_url) {
        try {
            await this.siteObj.removeEvent()
        } catch (e) {
            //TODO: Сделать обработку
        }

        return this;
    }

    let sitePage = await SitePageModel.findOne({
        url: url
    })

    if (sitePage) {
        await sitePage.fillPage(undefined, true, err)
    } else {
        sitePage = await new SitePageModel({
            url: url,
            errorMessage: err,
            error: true,
            title: 'Не определено',

            site_id: this.siteObj._id,
            html: 'Не определено',
            lastDate: new Date()
        })
        await sitePage.save()
    }

    console.log('ERROR: ', url, err)
}

function doneParser() {
    console.log('Парсинг закончился', this.opts.siteObj._id)
    //TODO: Вынести в эвент
    this.opts.siteObj.loadState(false)
    this.opts.siteObj.save()
}

async function handleParser(doc) {
    let siteModel = await SitePageModel.findOne({
        url: doc.url
    })

    if (siteModel) {
        await siteModel.fillPage(doc, false)
    } else {
        siteModel = await new SitePageModel({
            title: doc.$('title').text() || 'Не определено',
            url: doc.url,
            site_id: doc.res.site._id,
            html: doc.res.body,
            error: false,
            screen: doc.res.screen,
            lastDate: new Date()
        }).save()
    }


    //Первая страница
    if (doc.url === doc.res.site.base_url) {
        await doc.res.site.loadState()
        doc.res.site.title = doc.$('title').text()
        doc.res.site.description = doc.$('meta[name="description"]').attr('content') || ''

        await doc.res.site.save()
    } else {
        doc.res.site.load_date = new Date()

        await doc.res.site.save()
    }

    doc.$('a').each((i, elem) => {
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
        if (href.indexOf(':') !== -1) {
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
        Spider.queue(url, handleParser);
    });
}

const Parse = function (site) {
    Spider = new SpiderClass({
        concurrent: process.env.SPIDER_THREADS, //Количество потоков
        delay: process.env.SPIDER_DELAY, //Задержка после каждого парсинга
        // logs: process.stderr, //Куда логировать
        allowDuplicates: false,
        catchErrors: true,
        addReferrer: false,
        xhr: false,
        keepAlive: false,
        error: errorParser,
        done: doneParser,
        siteObj: site,
    })

    Spider.queue(site.base_url, handleParser)
}

module.exports = Parse