const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({
  client_id: {
    type: String
  },
  ref: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('admin', Admin);