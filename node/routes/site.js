const App = require('../app.class')

App.router.get('/ping', (req, res) => {
    res.success('pong')
})

App.router.get('/dashboard', (req, res) => {
    res.sendFile(App.getPath('public/index.html'))
})

App.router.get('/auth', (req, res) => {
    res.sendFile(App.getPath('public/index.html'))
})



module.exports = App.router