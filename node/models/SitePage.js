const {Schema, model} = require('mongoose')
const PageParser = require('../services/PageParser')

const schema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    site_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Site'
    },
    title: {
        type: String,
        required: true,
    },
    html: {
        type: String,
        required: true,
    },
    error: {
        type: Boolean,
        required: true,
    },
    errorMessage: {
        type: String
    },
    lastDate: {
        type: Date,
        required: true
    },
    screen: {
        type: String
    }
})

schema.methods.fillPage = async function (doc, error, error_text) {
    //Если error - то doc = undefiend
    if (error) {
        this.error = true
        this.errorMessage = error_text
        this.screen = ''
        this.lastDate = new Date()
        return this.save()
    }

    this.title = doc.$('title').text()
    this.html = doc.res.body
    this.error = false
    this.errorMessage = ''
    this.screen = doc.res.screen
    this.lastDate = new Date()

    return this.save()
}

schema.methods.updatePage = async function () {
    const parser = new PageParser(this)
    await parser.parse()

    return this.fillPage(parser.doc, parser.error, parser.errorMessage)
}

module.exports = model('SitePage', schema)