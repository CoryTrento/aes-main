const express = require('express');
const router = express.Router();
const request = require('request');
const axios = require('axios');
const querystring = require('querystring');

//  Moments Time-Zone
const moment = require('moment-timezone');
moment.tz.setDefault("America/Los_Angeles")

//  XML TO JSON Options
const convert = require('xml-js');
const jsonOptions = {
  ignoreText: false,
  compact: true,
  elementNameFn: (val) => {
    return val.replace(/:/g, "_")
  },
  textKey: 'text',
  spaces: 0
}

//  Load PG&E Config
const config = require('../../config/pge')
const base64String = "Basic " + new Buffer(config.clientID + ':' + config.clientSecret).toString('base64');

//  QuickBase
const QB = require('../../config/quickbase');

//  Redirect PGE to MyMeter with code.
router.get('/redirect', (req, res) => {
  
  // PG&E Options
  const options = {
    "url": `https://api.pge.com/datacustodian/oauth/v2/token`,
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": base64String
    },
    "qs": {
      "grant_type": "authorization_code",
      "code": req.query.code,
      "redirect_uri": "https://www.aescustomer.com/pge/redirect"
    },
    "agentOptions": config.agentOptions
  }

  request(options, (err, resp, body) => {
    console.log(body)
    body = JSON.parse(JSON.stringify(body))
    tokenApi = body
    body = JSON.parse(body);
    let sub_id = ''
  
    const expIn = moment().subtract(365, 'minutes').utc().format("YYYY-MM-DD HH:mm");
    if(body.resourceURI){
      sub_id = body.resourceURI.split('/');
      sub_id = sub_id[sub_id.length - 1];
    }else if(body.authorizationURI){
      sub_id = body.authorizationURI.split('/');
      sub_id = sub_id[sub_id.length - 1];
    }
    
    // Post Person to quickbase
    const QB_Options = {
      method: 'post',
      "url": `https://aes.quickbase.com/db/bn79wnafc?a=API_AddRecord`,
      data: querystring.stringify({
        "_fid_6": 'Customer',
        "_fid_64": req.session.email,
        "_fid_63": sub_id,
        "_fid_365": req.session.first_name,
        "_fid_366": req.session.last_name,
        "_fid_367": body.access_token,
        "_fid_368": body.refresh_token,
        "_fid_369": body.token_type,
        "_fid_370": expIn,
        "_fid_371": body.scope,
        "_fid_372": body.resourceURI,
        "_fid_373": body.authorizationURI,
        "apptoken": QB.QB_API_KEY,
        "username": QB.QB_LOGIN,
        "password": QB.QB_PASSWORD,
      })
    }

    // Post Data
    axios(QB_Options)
      .then(data => {
        let respData = convert.xml2json(data.data, jsonOptions);
        respData = JSON.parse(respData);
        let sub_id = body.authorizationURI.split('/');
        sub_id = sub_id[sub_id.length - 1];
        axios.get(`http://localhost:${process.env.PORT}/quickbase/meter/info?sub_id=${sub_id}&token=${body.access_token}&recId=${respData.qdbapi.rid.text}`)
        .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
     res.redirect('/thank/you');
    
  })
})

//  Receive Notifications From PG&E *************************************************************** Notifications GET/POST
router.post('/notification', (req, res) => {
  console.log(req.body)
  res.json({
    Success: "True"
  })
})


module.exports = router;