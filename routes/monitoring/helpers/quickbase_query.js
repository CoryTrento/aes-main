const axios = require('axios');

//QuickBase
const QB = require('../../../config/quickbase');

module.exports = async function QB_QUERY(customerName, monitoring, month, year){
  const result = await axios.get(`https://aes.quickbase.com/db/bpgssr4hc?a=API_DoQueryCount&query={12.CT.${encodeURIComponent(customerName)}}AND{38.EX.${monitoring}AND{9.EX.${month}}AND{10.EX.${year}}&apptoken=${QB.QB_API_KEY_FLEET}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`)
  return result
}