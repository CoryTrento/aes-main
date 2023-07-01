const axios = require("axios");

//QuickBase
const QB = require("../../../config/quickbase");

const NEW_STREET = str => {
  str = str.split(" ");
  str = `${str[0]} ${str[1]}`;
  return str;
};

module.exports = {
  QB_QUERY: async function(meter, date, usage, cost) {
    const result = await axios.get(
      `https://aes.quickbase.com/db/bpi5u9hs7?a=API_DoQueryCount&query={9.EX.${meter}}AND{6.EX.${date}}&apptoken=${
        QB.QB_API_KEY_FLEET
      }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
    );
    return result;
  },
  QB_QUERY_LOCATION: async function(street, city) {
    let streetAlt = NEW_STREET(street);
    console.log(streetAlt);
    const result = await axios.get(
      `https://aes.quickbase.com/db/bpgi8qd7p?a=API_DoQuery&query={7.CT.${streetAlt}}AND{9.CT.${city}}&clist=3.4&apptoken=${
        QB.QB_API_KEY_FLEET
      }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
    );
    return result;
  },
  QB_QUERY_INTERVALS: async function(rec_id, time_stamp) {
    const result = await axios.get(
      `https://aes.quickbase.com/db/bpjpxv7wt?a=API_DoQueryCount&query={126.EX.${rec_id}}AND{9.EX.${time_stamp}}&clist=3.4&apptoken=${
        QB.QB_API_KEY_FLEET
      }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
    );
    return result;
  }
};
