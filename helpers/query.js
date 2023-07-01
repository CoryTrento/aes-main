const axios = require('axios');
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

//QuickBase
const QB = require('../config/quickbase');

module.exports = {
  QB_QUERY: async(table, query_type, parameters, clist) => {
    //  @Table bpgi8qd7p  @Query Types API_DoQuery / API_DoQueryCount  @Parameters
    // {7.EX.${street}}AND{9.EX.${city}}  @Clist 3.4
    let results = await axios.get(`https://aes.quickbase.com/db/${table}?a=${query_type}&query=${parameters}&clist=${clist}&apptoken=${QB.QB_API_KEY_FLEET}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`)

    results = convert.xml2json(results.data, jsonOptions);
    results = JSON.parse(results);

    if (query_type === "API_DoQuery") {
      results = results.qdbapi.record;
      if (!results.length) 
        results = [results]
    }

    if (query_type === "API_DoQueryCount") {
      results = results.qdbapi.numMatches.value;
    }

    return results
  },
  QB_QUERY_FID: async(table, type, parameters, clist) => {
    try {
      let results = await axios.get(`https://aes.quickbase.com/db/${table}?a=API_DoQuery&query=${parameters}&clist=${clist}&fmt=structured&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`)
      const array = []
      results = JSON
        .parse(convert.xml2json(results.data, jsonOptions))
        .qdbapi
        .table
        .records
        .record
      if (!results.length) 
        results = [results]

      results = results.forEach(query => {
        const obj = {}
        query
          .f
          .forEach(item => obj[`_fid_${item._attributes.id}`] = item.value)
        array.push(obj)
      })

      return type !== "obj"
        ? array
        : array[0]

    } catch (err) {
      return []
    }
  }
}