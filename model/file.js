const mongoose = require('mongoose')
const file = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    password: String,
    downloadCount: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: { type: Date, expires: '10m', default: Date.now }
})
module.exports = mongoose.model("file", file)