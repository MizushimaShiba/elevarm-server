const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = mongoose.model('User', new Schema({
  name: String,
  password: String,
  username: {type: String, unique: true},
  email: {type: String, unique: true},
  birthdate: Date
}))

module.exports = User