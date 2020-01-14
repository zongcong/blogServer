const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogSchema = new Schema({
  level: {
    type: String
  },
  message: {
    type: String
  },
  info: {
    method: String,
    url: String,
    costTime: Number,
    body: String,
    response: {
      status: Number,
      message: String,
      header: String,
      body: String
    }
  }
}, {
  collection: 'log',
  versionKey: false
});

module.exports = mongoose.model('log', LogSchema);
