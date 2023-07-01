const querystring = require('querystring');

//QuickBase
const QB = require('../../../config/quickbase');

module.exports = function(customerName, month, year, production, monitoring) {
  const QB_Options = {
    method: 'post',
    "url": `https://aes.quickbase.com/db/bpgssr4hc?a=API_AddRecord`,
    data: querystring.stringify({
      "_fid_12": customerName,
      "_fid_9": month,
      "_fid_10": year,
      "_fid_11": production,
      "_fid_38": monitoring,
      "apptoken": QB.QB_API_KEY_FLEET,
      "username": QB.QB_LOGIN,
      "password": QB.QB_PASSWORD
    })
  }
  return QB_Options
}