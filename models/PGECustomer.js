const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PGECustomer = new Schema({
  pge_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  meters: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('PGECustomer', PGECustomer);