const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 500
    },
    image: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('Post', PostSchema)