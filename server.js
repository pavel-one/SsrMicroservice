const express = require('./node/bootstrap')


express.listen(process.env.SERVER_PORT, () => {
    console.log(`Сервер заработал на ${process.env.SERVER_PORT} порту`)
})

