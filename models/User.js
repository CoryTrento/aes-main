const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  street_address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin:{
    type: Boolean
  }, 
  token: {
    type: String
  },
  refreshToken: {
    type: String
  },
  tokenExpires:{
    type: Date
  },
  pgeId: {
    type: String
  },
  meters: {
    type: Array
  },
  info: {
    type: Object
  },
  usage: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('users', UserSchema);