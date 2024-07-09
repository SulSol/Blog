const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: String,
    full_name: String,
    password: String,
    googleId: String,
    githubId: String,
})

module.exports = mongoose.model('user', userSchema);
