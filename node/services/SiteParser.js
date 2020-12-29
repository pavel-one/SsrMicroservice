const Spider = require('./spider')
const SiteModel = require('../models/Site')

class SiteParser {
    constructor(params = {}, site) {
        const defaultParams = {
            concurrent: process.env.SPIDER_THREADS, //Количество потоков
            delay: process.env.SPIDER_DELAY, //Задержка после каждого парсинга
            // logs: process.stderr, //Куда логировать
            allowDuplicates: false,
            catchErrors: true,
            addReferrer: false,
            xhr: false,
            keepAlive: false,
            error: this.error,
            done: this.done,

            siteObj: site,
            parserClass: this, //TODO: Какая то ебанина, наверное как то по другому можно получить контекст
        }

        this.site = site
        this.events = require('../events/SiteEvents')
        this.spider = new Spider({...defaultParams, ...params})
        this.queue(this.site.base_url)
    }

    queue(url) {
        this.spider.queue(url, this.handle)
    }

    handle(doc) {
        console.log('HANDLE', doc.url)
        //Первая страница
        if (doc.url === doc.res.site.base_url) {
            doc.res.site.load = true
            doc.res.site.title = doc.$('title').text()
            doc.res.site.description = doc.$('meta[name="description"]').attr('content') || ''
            doc.res.site.save()
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

            this.queue(url);
        });
    }

    async error(err = '', url) {
        if (url === this.siteObj.base_url) {
            this.parserClass.log(err, this.siteObj._id)
            await this.parserClass.events.removeSiteEvent(this.siteObj)
            await this.parserClass.removeSite(this.siteObj._id)
            // console.log(SiteModel.findById(this.siteObj._id))
        }
    }

    //TODO: Хуйня
    async removeSite(id) {
        const siteObj = await SiteModel.findOne({_id: id})
        await siteObj.remove()
    }

    async done() {
        console.log('Парсинг закончился', this.opts.siteObj._id)
        this.opts.siteObj.load = false
        this.opts.siteObj.save()
    }

    log(...msg) {
        console.log(msg)
    }
}

module.exports = SiteParser