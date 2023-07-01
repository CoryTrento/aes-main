//Load PG&E Config
const config = require('../config/pge')
const base64String = "Basic " + new Buffer(config.clientID + ':' + config.clientSecret).toString('base64');

  ClientToken = {
      "url": "https://api.pge.com/datacustodian/oauth/v2/token",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": base64String
      },
      "qs": {
        "grant_type": "client_credentials"
      },
      "agentOptions": config.agentOptions
  }

module.exports = ClientToken;