const fs = require("fs");

module.exports = {
  clientID: "80b998d737b24f868ba92f2f525adbc7",
  clientSecret: "d6df789635a040d48ec206a0cb4a19cc",
  clientKey: "50440",
  login: "https://sharemydata.pge.com/myAuthorization/",
  site: "https://api.pge.com/datacustodian",
  authorizationPath: "/oauth/v2/authorize",
  dataRequestURL:
    "https://apiqa.pge.com/GreenButtonConnect/espi/1_1/resource/Batch/Subscription/",
  tokenPath: "/oauth/v2/token",
  agentOptions: {
    //read the certificate and also pass the password
    pfx: fs.readFileSync("public/certificate/aescustomer3.pfx"),
    passphrase: "Feb135911@"
  }
};
