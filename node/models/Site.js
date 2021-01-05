const {Schema, model} = require('mongoose')
const fs = require('fs')
const url = require('url')

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
    },
    sitemap: {
        type: String
    },
    load: {
        type: Boolean
    }
})

//TODO: Вынести на событие, или сделать нормальную систему событий
schema.methods.removeEvent = async function () {
    if (this.photo !== 'no-photo.png') {
        const path = 'public/user_screenshots/' + this.photo;

        if (fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
    }

    return this.remove()
}

schema.methods.getDomain = function () {
    return url.parse(this.url).hostname
}

schema.methods.getUrlSchema = function () {
    return url.parse(this.url).protocol
}

schema.methods.addLinks = async function (links) {
    if (!this.sitemap) {
        this.sitemap = JSON.stringify([{links}])
        return this.save()
    }

    const linksObj = JSON.parse(this.sitemap)
    linksObj.push([{links}])

    this.sitemap = JSON.stringify(linksObj)
    return this.save()
}

module.exports = model('Site', schema)