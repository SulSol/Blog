const mongoose = require('mongoose')

const CategSchema = new mongoose.Schema({
    name: String,
    key: Number,
})

module.exports = mongoose.model('category', CategSchema)