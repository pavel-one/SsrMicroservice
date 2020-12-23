const {Schema, model} = require('mongoose')

const schema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    site_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    html: {
        type: String,
        required: true,
    }
})

module.exports = model('SitePage', schema)