const mongoose = require('mongoose')

const connectionURL =process.env.DB_CONNECTION_STRING || require('../config.js').connectionURL
mongoose.connect( connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})






