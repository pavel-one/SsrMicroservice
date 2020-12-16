const app = require('../app.class')

app.router.get('/', (req, res) => {
    app.success(res, 'Версия API: ' + app.version, {version: app.version})
})

module.exports = app.router