const axios = require('axios');

//QuickBase
const QB_POST = require('../helpers/quickbase_options');
const QB_QUERY = require('../helpers/quickbase_query');

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

module.exports = function SubmitDeck(csv, month, year, monitoring) {
  csv.forEach(item => {
    const customerName = item[Object.keys(item)[0]].replace(/’/g, "'");
    const production = Number(item[Object.keys(item)[2]]);

    // Check for production
    if (!isNaN(production)) {
      console.log(customerName, production)

      // Check If Data Exists
      QB_QUERY(customerName, monitoring, month, year)
      .then(query => {
        let count = convert.xml2json(query.data, jsonOptions);
        count = JSON.parse(count);
        let numOfCount = Number(count.qdbapi.numMatches.value);
        
        if (numOfCount === 0) {
          // Post Data
          axios(QB_POST(customerName, month, year, production, monitoring)).then(data => console.log("uploaded"))
        } else {
          console.log('Already Exist', customerName)
        }
      })
    } else {
      console.log('Is Nan')
    }
  })
}