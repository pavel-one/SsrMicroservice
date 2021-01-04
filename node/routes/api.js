const app = require('../app.class')
const User = require('../models/User')
const Site = require('../models/Site')
const Bcrypt = require('bcrypt')
const url = require('url')
const {createNewSiteEvent, removeSiteEvent} = require('../events/SiteEvents')

app.router.post('/auth', auth)
app.router.post('/register', register)
app.router.get('/user', user)

app.router.put('/sites', addSite)
app.router.delete('/sites/:id', removeSite)
app.router.get('/sites', getSites)

async function removeSite(req, res) {
    const id = req.params.id
    const user_id = req.user.id

    if (!id) {
        return res.fail('Не передан id')
    }

    const siteObj = await Site.findOne({
        _id: id,
        user_id: user_id
    })

    if (!siteObj) {
        return res.fail('Не найден такой объект')
    }

    await removeSiteEvent(siteObj)
    await siteObj.remove()

    return res.success('Успешно')
}

async function getSites(req, res) {
    const sites = await Site.find().select(
        '_id ' +
        'base_url ' +
        'created_at ' +
        'photo name ' +
        'title ' +
        'description '
    ).exec()

    res.success('Успешно', sites)
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
    const user = {
        id: null,
        name: null,
        email: null
    }

    if (req.user) {
        user.id = req.user.id || null
        user.name = req.user.name || null
        user.email = req.user.email || null
    }

    return res.success('Успешно', user)
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

    //Хуйня ебучая, авторизовывать через мидлвар - это пиздец
    // PassportService.authenticate('local', {
    //     badRequestMessage: 'Не хватает параметров'
    // },(err, user, info) => {
    //     console.log('AUTH:', err, user, info)
    // })(req, res, next)

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