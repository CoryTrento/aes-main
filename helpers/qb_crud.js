const querystring = require("querystring");
const axios = require("axios");
const convert = require("xml-js");
const jsonOptions = {
  ignoreText: false,
  compact: true,
  elementNameFn: val => {
    return val.replace(/:/g, "_");
  },
  textKey: "value",
  spaces: 0
};
//QuickBase
const QB = require("../config/quickbase");

module.exports = {
  QB_ADD: (table, data) => {
    const Options = {
      method: "post",
      url: `https://aes.quickbase.com/db/${table}?a=API_AddRecord`,
      data: querystring.stringify({
        ...data,
        apptoken: QB.QB_API_KEY,
        username: QB.QB_LOGIN,
        password: QB.QB_PASSWORD
      })
    };
    axios(Options)
      .then(() => console.log("Posted"))
      .catch(err => console.log(err.request.data));
  },
  QB_EDIT: (table, rec_id, data) => {
    const Options = {
      method: "post",
      url: `https://aes.quickbase.com/db/${table}?a=API_EditRecord&rid=${rec_id}`,
      data: querystring.stringify({
        ...data,
        apptoken: QB.QB_API_KEY,
        username: QB.QB_LOGIN,
        password: QB.QB_PASSWORD
      })
    };
    axios(Options)
      .then(() => console.log("Posted"))
      .catch(err => console.log(err.request.data));
  },
  QB_QUERY_FID: async (table, type, parameters, clist) => {
    try {
      let results = await axios.get(
        `https://aes.quickbase.com/db/${table}?a=API_DoQuery&query=${parameters}&clist=${clist}&fmt=structured&apptoken=${
          QB.QB_API_KEY
        }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
      );
      const array = [];
      results = JSON.parse(convert.xml2json(results.data, jsonOptions)).qdbapi
        .table.records.record;
      if (!results.length) results = [results];

      results = results.forEach(query => {
        const obj = {};
        query.f.forEach(
          item => (obj[`_fid_${item._attributes.id}`] = item.value)
        );
        array.push(obj);
      });

      return type !== "obj" ? array : array[0];
    } catch (err) {
      return [];
    }
  }
};
