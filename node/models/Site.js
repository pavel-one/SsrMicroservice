const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {
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
    description: {
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