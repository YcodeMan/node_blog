const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    title: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    pv: {
        type: Number,
        default: 0
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

postsSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})
module.exports = mongoose.model('post', postsSchema, 'post')