const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Meter = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  meterInfo:{
    type: Array,
    required: true
  }
})

mongoose.model('meter', Meter);