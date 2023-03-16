const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Gofood = mongoose.model('Gofood', new Schema({
  userId: String,
  fromMerchant: String,
  toWhere: String,
  finished: Boolean,
  price: Number,
  createdAt: Date,
  finishedAt: Date
}))

module.exports = Gofood