const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Goride = mongoose.model('Goride', new Schema({
  userId: String,
  fromWhere: String,
  toWhere: String,
  finished: Boolean,
  price: Number,
  createdAt: Date,
  finishedAt: Date
}))

module.exports = Goride