require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express();

app.use('/', require('./routes/site'));

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


app.listen(process.env.SERVER_PORT, () => {
    console.log(`Сервер заработал на ${process.env.SERVER_PORT} порту`)
})

