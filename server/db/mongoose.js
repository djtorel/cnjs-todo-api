const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'
mongoose.Promise = global.Promise
mongoose.connect(MONGODB_URI, { useMongoClient: true })

module.exports = { mongoose }
