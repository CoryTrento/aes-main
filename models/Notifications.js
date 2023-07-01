const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Note = new Schema({
  batch: {
    type: Object,
    required: true
  },
  batchType: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('notification', Note);