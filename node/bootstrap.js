/**
 * Класс запуска приложения
 */

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const server = express();

server.use('/api', require('./routes/api')) //API роуты
server.use('/', require('./routes/site')) //Роуты обычных страниц сайта

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (e) {
        console.log('Server Error: ', e.message)
        process.exit(1)
    }
}
startServer();

module.exports = server;