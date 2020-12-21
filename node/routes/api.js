const app = require('../app.class')
const User = require('../models/User')
const Bcrypt = require('bcrypt')

app.router.post('/auth', auth)
app.router.post('/register', register)
app.router.get('/props', props)
app.router.get('/user', user)

async function user(req, res) {
    const user = {
        id: null,
        name: null,
        email: null,
        phone: null
    }

    if (req.user) {
        user.id = req.user.id || null
        user.name = req.user.name || null
        user.email = req.user.email || null
        user.phone = req.user.phone || null
    }

    return res.success('Успешно', user)
}

async function props(req, res) {

    return res.success('Успешно', [])
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

    newUser.save().then(r => {
        return res.success('Регистрация прошла успешно')
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