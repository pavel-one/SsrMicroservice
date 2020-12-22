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

module.exports = model('Site', schema)