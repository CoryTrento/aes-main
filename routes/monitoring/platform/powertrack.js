const axios = require('axios');


// XML to JSON
const convert = require('xml-js');
const jsonOptions = {
  ignoreText: false,
  compact: true,
  elementNameFn: (val) => {
    return val.replace(/:/g, "_")
  },
  textKey: 'value',
  spaces: 0
}

module.exports = function SubmitPowerTrack(csv, table, month, year) {
  console.log(csv)
  // csv.forEach(item => {   // const customerName =
  // item[Object.keys(item)[0]].replace(/’/g, "'"); const   // production =
  // Number(item[Object.keys(item)[2]]); })
}