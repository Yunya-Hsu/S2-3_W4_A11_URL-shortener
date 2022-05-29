const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shortUrlSchema = new Schema({
  originUrl: {
    type: String,
    required: true
  },
  shortURL: {
    type: String,
  }
})

module.exports = mongoose.model('Shorten', shortUrlSchema)