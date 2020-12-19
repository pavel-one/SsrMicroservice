const {Schema, model} = require('mongoose')
const Bcrypt = require('bcrypt')

const schema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        unique: true
    }
})

schema.methods.validPassword = function (password) {
    return Bcrypt.compareSync(password, this.password)
}

module.exports = model('User', schema)