/**
 * Класс запуска приложения
 */

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const server = express();
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const PassportService = require('./services/passport')
const request = require('./services/response')

const RedisClient = redis.createClient({
    host: 'redis',
})

RedisClient.on('error', function(error) {
    console.error('REDIS ERROR', error)
});

server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(
    session({
        secret: process.env.APP_KEY,
        store: new RedisStore({ client: RedisClient }),
        cookie: {
            // secure: true, //только для https
            // path: '/storage', //хуй знает, не работает, потом как нибудь разберусь
            httpOnly: true,
            maxAge: 60 * 60 * 1000 * 24 //День
        },
        resave: false,
        saveUninitialized: false
    })
)

server.use(PassportService.initialize(undefined))
server.use(PassportService.session(undefined))
server.use(request)

server.use('/api', require('./routes/api')) //API роуты
server.use('/', require('./routes/site')) //Роуты обычных страниц сайта

async function startServer(uri, callback) {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch (e) {
        console.log('Server Error: ', e.message)
        process.exit(1)
    }
}

startServer();

module.exports = server;