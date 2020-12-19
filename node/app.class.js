const {Router} = require('express')

class AppClass {
    router = Router()
    path = require('path')
    version = '1.0'
    salt = process.env.APP_KEY

    constructor() {
    }

    getPath(path = '') {
        return this.path.resolve(path);
    }
}

module.exports = new AppClass()