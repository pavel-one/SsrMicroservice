const app = require('../app.class')

app.router.get('/ping', (req, res) => {
    app.success(res, 'pong')
})

module.exports = app.router