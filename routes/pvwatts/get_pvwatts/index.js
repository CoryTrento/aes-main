const axios = require('axios')

module.exports = {
  GET_PVWATTS: async(url) => {
    try {
      const results = await axios
        .get(url)
        .then((data) => {
          return {error: false, data: data.data}
        })
      return results
    } catch (err) {
      return {error: true, message: err}
    }
  }
}