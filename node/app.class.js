const {Router} = require('express')

class AppClass {
    router = Router()
    path = require('path')
    version = '1.0'

    constructor() {
    }

    getPath(path = '') {
        return this.path.resolve(path);
    }

    success(response, text = '', data = []) {
        return response.send({
            status: 'ok',
            msg: text,
            data: data
        })
    }
}

module.exports = new AppClass()