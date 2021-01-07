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

module.exports = model('SitePage', schema)