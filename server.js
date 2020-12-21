const express = require('./node/bootstrap')

// const captureWebsite = require('capture-website');

// (async () => {
//     await captureWebsite.file('http://soft.pavel.one', 'screenshot.png', {
//         launchOptions: {
//             args: [
//                 '--no-sandbox',
//                 '--disable-setuid-sandbox'
//             ]
//         }
//     });
// })();

express.listen(process.env.SERVER_PORT, () => {
    console.log(`Сервер заработал на ${process.env.SERVER_PORT} порту`)
})

