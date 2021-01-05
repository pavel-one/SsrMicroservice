const SpiderClass = require('./spider')

let Spider;

function errorParser(err = '', url) {
    if (url === this.siteObj.base_url) {
        this.siteObj.removeEvent() //TODO: Выбивает варнинг, не смог разобраться почему

        return this;
    }
    this.opts.siteObj.loadState(false)
    this.opts.siteObj.save()
    console.log('ERROR: ', url, err)
}

function doneParser() {
    console.log('Парсинг закончился', this.opts.siteObj._id)
    //TODO: Сделать дату последнего обновления, вынести в эвент
    this.opts.siteObj.loadState(false)
    this.opts.siteObj.save()
}

async function handleParser(doc) {
    console.log('handle', doc.url)
    //Первая страница
    if (doc.url === doc.res.site.base_url) {
        await doc.res.site.loadState()
        doc.res.site.title = doc.$('title').text()
        doc.res.site.description = doc.$('meta[name="description"]').attr('content') || ''
        doc.res.site.save()
    } else {
        doc.res.site.load_date = new Date()
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