const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    base_url: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String
    },
    updated_at: {
        type: Date
    },
    created_at: {
        type: Date
    }
})

schema.methods.getDomain = function () {
    return this.url.split('://')[1].split('/')[0] || null
}

schema.methods.getUrlSchema = function () {
    return this.url.split('://')[0]
}

module.exports = model('Site', schema)