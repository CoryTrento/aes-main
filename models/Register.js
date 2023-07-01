const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'person' },
  access_token: String,
  refresh_token: String,
  token_type: String,
  expires_in: Date,
  scope: String,
  resourceURI: String,
  authorizationURI: String,
  pge_id: String,
  meters: Array,
  date: {
    type: Date,
    default: Date.now
  }
});

const PersonSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  account: [AccountSchema]
})




mongoose.model('person', PersonSchema);
mongoose.model('account', AccountSchema);