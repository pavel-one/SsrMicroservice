const {Schema, model} = require('mongoose')
const fs = require('fs')
const url = require('url')
const SitePageModel = require('./SitePage')

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
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    load_date: {
        type: Date
    },
    loadParser: {
        type: Boolean
    }
})

schema.methods.loadState = async function (state = true) {
    this.loadParser = state

    if (state === false) {
        this.load_date = new Date()
    }
    await this.save()
}

//TODO: Вынести на событие, или сделать нормальную систему событий
schema.methods.removeEvent = async function () {
    //Удаляем скриншот сайта
    if (this.photo !== 'no-photo.png') {
        const path = process.env.DIR_SITE_SCREEN + this.photo;

        if (fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
    }

    //Удаляем скриншоты страниц, если они были
    const dir = process.env.DIR_SITE_PAGE_SCREEN
    const SitePageScreens = fs.readdirSync(dir)

    if (SitePageScreens.length) {
        SitePageScreens.forEach(name => {
            let nameDomain = name.split('-')[0]
            if (nameDomain && nameDomain === this.getDomain()) {
                fs.unlinkSync(dir + name)
            }
        })
    }

    //Удаляем зависимости
    await SitePageModel.deleteMany({
        site_id: this._id
    })

    return this.remove()
}

schema.methods.getDomain = function () {
    return url.parse(this.url).hostname
}

schema.methods.getUrlSchema = function () {
    return url.parse(this.url).protocol
}

module.exports = model('Site', schema)