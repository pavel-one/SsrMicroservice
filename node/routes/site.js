const app = require('../app.class')

app.router.get('/ping', (req, res) => {
    app.success(res, 'pong')
})

app.router.get('/dashboard', (req, res) => {
    res.sendFile(app.getPath('public/index.html'))
})



module.exports = app.router