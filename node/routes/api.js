//TODO: Зарефакторить это дерьмо
const app = require('../app.class')
const User = require('../models/User')
const Site = require('../models/Site')
const SitePageModel = require('../models/SitePage')
const Bcrypt = require('bcrypt')
const url = require('url')
const {createNewSiteEvent} = require('../events/SiteEvents')

app.router.post('/auth', auth)
app.router.post('/register', register)
app.router.get('/user', user)

app.router.get('/site/:id', getSite)
app.router.get('/site/:id/pages', getSitePages)

app.router.post('/site/:id/page/:page_id', updateSitePage)

app.router.put('/sites', addSite)
app.router.delete('/sites/:id', removeSite)
app.router.get('/sites', getSites)

async function removeSite(req, res) {
    const id = req.params.id

    if (!req.user) {
        return res.fail('Вы не авторизованы')
    }

    if (!id) {
        return res.fail('Не передан id')
    }

    const siteObj = await Site.findOne({
        _id: id,
        user_id: req.user.id
    })

    if (!siteObj) {
        return res.fail('Не найден такой объект')
    }

    if (siteObj.loadParser) {
        return res.fail('Сайт в процессе обработки, удаление невозможно')
    }

    await siteObj.removeEvent() //TODO: Сделать нормальное событие

    return res.success('Успешно')
}

async function getSites(req, res) {

    if (!req.user) {
        return res.fail('Вы не авторизованы')
    }

    const sites = await Site.find({
        user_id: req.user.id
    }).select(
        '_id ' +
        'user_id ' +
        'base_url ' +
        'created_at ' +
        'photo name ' +
        'title ' +
        'description ' +
        'load_date ' +
        'loadParser'
    ).exec()

    res.success('Успешно', sites)
}

async function getSite(req, res) {

    if (!req.user) {
        return res.fail('Вы не авторизованы')
    }

    const site = await Site.findOne({
        _id: req.params.id,
        user_id: req.user.id
    }).catch(err => {
        //TODO: Логировать ошибку
    })

    if (!site) {
        return res.fail('Такого сайта не существует')
    }

    return res.success('Успешно', site)
}

async function getSitePages(req, res) {
    if (!req.user) {
        return res.fail('Вы не авторизованы')
    }

    const site = await Site.findOne({
        _id: req.params.id,
        user_id: req.user.id
    }).catch(err => {
        //TODO: Логировать ошибку
    })

    if (!site) {
        return res.fail('Такого сайта не существует')
    }

    const limit = +req.query.limit || 20
    const page = +req.query.page || 1
    const error = req.query.error ? Boolean(+req.query.error) : false
    const sortField = req.query.sortField || 'lastDate'
    const sortDir = req.query.sortDir || 'desc'
    let sort = {}
    sort[sortField] = sortDir

    if (typeof (limit) !== 'number' || typeof (page) !== 'number') {
        return res.fail('Ошибка')
    }

    if (!limit || limit > 100) {
        return res.fail('Не передан лимит, или он больше 100')
    }

    if (!page) {
        return res.fail('Не передана страница')
    }

    let offset = limit * (page - 1)
    const filter = {
        site_id: site._id,
        error: error
    }

    const Pages = await SitePageModel.aggregate()
        .match(filter)
        .sort(sort)
        // .select('title url error screen lastDate errorMessage')
        .skip(offset)
        .limit(limit)

        .allowDiskUse(true)

        .exec()

    return res.success('Успешно', {
        paginate: {
            total: await SitePageModel.countDocuments(filter).exec(),
            page: page,
            limit: limit,
            offset: offset,
        },
        pages: Pages
    })
}

async function updateSitePage(req, res) {
    if (!req.user) {
        return res.fail('Вы не авторизованы')
    }

    let site = undefined

    try {
        site = await Site.findOne({
            _id: req.params.id,
            user_id: req.user.id
        })
    } catch (e) {
        //TODO: Логировать
    }

    if (!site) {
        return res.fail('Такого сайта не существует')
    }

    let page = undefined

    try {
        page = await SitePageModel.findOne({
            _id: req.params.page_id,
            site_id: site._id
        })
    } catch (e) {
        //TODO: Логировать
    }

    return res.success('Успешно', await page.updatePage())
}

async function addSite(req, res) {
    if (!req.body.name || !req.body.url) {
        return res.fail('Не передано название или адрес сайта')
    }
    const urlObj = url.parse(req.body.url)

    let base_url = urlObj.protocol + '//' + urlObj.hostname

    const SiteObj = await Site.findOne({
        base_url: base_url
    })

    if (SiteObj) {
        return res.fail('Такой сайт уже добавлен в нашей системе, обратитесь к администратору этого сайта')
    }

    const newSite = new Site({
        user_id: req.user.id,
        name: req.body.name,
        url: urlObj.href,
        base_url: base_url,
        created_at: new Date,
        updated_at: new Date
    })

    newSite.save()
        .then(site => {
            createNewSiteEvent(site)
            return res.success('Успешно', site, 201)
        })
        .catch(r => {
            return res.fail('Ошибка создания, обратитесь к администратору')
        })
}

async function user(req, res) {
    if (!req.user) {
        return res.fail('Вы не авторизованы', {})
    }

    return res.success('Успешно', req.user)
}

async function register(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.fail('Не передан email или пароль', {query: req.body}, 200);
    }

    const user = await User.findOne({
        email: req.body.email
    })

    if (user) {
        return res.fail('Пользователь с таким email уже существует')
    }

    let hash = Bcrypt.hashSync(req.body.password, 10)
    if (!hash) {
        return res.fail('Неизвестная ошибка');
    }

    let newUser = new User({
        email: req.body.email,
        password: hash
    })

    newUser.save().then(user => {
        req.logIn(user, err => {
            if (err) {
                return res.fail('Ошибка авторизации')
            } else {
                return res.success('Регистрация прошла успешно', [], 201)
            }
        })
    }).catch(error => {
        console.log(error)
        return res.fail('Ошибка сохранения пользователя, пожалуйста, попробуйте позже или с другими данными')
    })

}

async function auth(req, res, next) {

    if (req.isAuthenticated()) {
        return res.fail('Вы уже авторизованы')
    }


    if (!req.body.email || !req.body.password) {
        return res.fail('Не передан email или пароль', {query: req.body}, 200);
    }

    const user = await User.findOne({
        email: req.body.email
    })

    if (!user) {
        return res.fail('Пользователь с такой парой логин/пароль не найден, зарегистрироваться?', [], 401)
    }

    if (!user.validPassword(req.body.password)) {
        return res.fail('Пароль не верен')
    }

    req.logIn(user, err => {
        if (err) {
            return res.fail('Ошибка авторизации')
        }
    })

    res.success('Авторизация успешна');


}

module.exports = app.router