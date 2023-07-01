const express = require("express");
const router = express.Router();
const request = require("request");
const querystring = require("querystring");
const axios = require("axios");
const { QB_EDIT } = require("../../helpers/qb_crud");
const { formatIntervals, formatIntervals2 } = require("./helpers/intervals");

//  Format Date and Times
const moment = require("moment");
moment().format();
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

//  Formatting, Convert To JSON
const convert = require("xml-js");
const jsonOptions = {
  ignoreText: false,
  compact: true,
  elementNameFn: (val) => {
    return val.replace(/:/g, "_");
  },
  textKey: "value",
  spaces: 0,
};

//  QuickBase
const QB = require("../../config/quickbase");

const {
  QB_QUERY,
  QB_QUERY_LOCATION,
  QB_QUERY_INTERVALS,
} = require("./helpers/quickbase_query");

const { post_intervals } = require("./helpers/post_intervals");

//  Config File and Base64
const config = require("../../config/pge");
const base64String =
  "Basic " +
  new Buffer(config.clientID + ":" + config.clientSecret).toString("base64");

Date.prototype.getUnixTime = function () {
  return (this.getTime() / 1000) | 0;
};
if (!Date.now)
  Date.now = function () {
    return new Date();
  };
Date.time = function () {
  return Date.now().getUnixTime();
};

//  @GET    Client Token
//  @Route  /quickbase/client/token
//  @Query  token = Tooth)$@8a
router.get("/client/token", (req, res) => {
  if (req.query.token !== "Tooth)$@8a") {
    return res.json({ error: "Wrong token" });
  }
  Options = {
    url: "https://api.pge.com/datacustodian/oauth/v2/token",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: base64String,
    },
    qs: {
      grant_type: "client_credentials",
    },
    agentOptions: config.agentOptions,
  };

  request(Options, (error, resp, body) => {
    return res.json(JSON.parse(body));
  });
});

//  @GET    Access Token
//  @Route  /quickbase/new/token
//  @Query  RecId / Refresh Token
router.get("/new/token", (req, res) => {
  const recId = req.query.recId;
  const refresh_token = req.query.refresh_token;

  //  GET Refresh Token Option...
  const refresh = {
    url: `https://api.pge.com/datacustodian/oauth/v2/token?&refresh_token=${refresh_token}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: base64String,
    },
    qs: {
      grant_type: "refresh_token",
    },
    agentOptions: config.agentOptions,
  };

  //  Send Request
  request(refresh, (error, resp, body) => {
    if (body.indexOf("invalid_request") === -1) {
      const expIn = moment()
        .subtract(365, "minutes")
        .utc()
        .format("YYYY-MM-DD HH:mm");
      body = JSON.parse(body);
      const Options = {
        method: "post",
        url: `https://aes.quickbase.com/db/bn79wnafc?a=API_EditRecord&rid=${recId}`,
        data: querystring.stringify({
          _fid_367: body.access_token,
          _fid_368: body.refresh_token,
          _fid_370: expIn,
          apptoken: QB.QB_API_KEY,
          username: QB.QB_LOGIN,
          password: QB.QB_PASSWORD,
        }),
      };
      axios(Options).then(() => {
        res.json({ token: body.access_token });
        return;
      });
    } else {
      res.json({ error: "No Token" });
    }
  });
});

//  @GET    Meter Info
//  @Route  /quickbase/meter/info
//  @Query  pge_id / token / Related Customer Id
router.get("/meter/info", (req, res) => {
  console.log("Getting Meter Info");
  const recId = req.query.recId;

  let options = {
    url: `https://api.pge.com/GreenButtonConnect/espi/1_1/resource/Batch/RetailCustomer/${req.query.sub_id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.query.token}`,
    },
    agentOptions: config.agentOptions,
  };

  request(options, (error, resp, body) => {
    // Error Checking
    if (
      body === "client credentials doesn't match" ||
      body.indexOf("Invalid access token") !== -1 ||
      body.indexOf("Internal Server Error") !== -1
    ) {
      console.log(body);
      QB_EDIT("bn79wnafc", recId, {
        _fid_401: JSON.parse(body).error_description,
      });
      return;
    }

    // Getting Results
    let result = convert.xml2json(body, jsonOptions);
    result = JSON.parse(result);
    result = result.ns1_feed.ns2_entry;

    let agreementObj = {
      UsagePoint: "",
      Customer: "",
      ServiceLocation: "",
      CustomerAccount: "",
      CustomerAgreement: "",
      Meter: "",
    };
    const agreementArr = [];
    result.forEach((reading) => {
      reading.ns2_link.forEach((link) => {
        const linkArray = link._attributes.href.split("/");
        if (linkArray[linkArray.length - 1] === "ServiceLocation") {
          agreementObj.UsagePoint = linkArray[linkArray.length - 2];
        }
      });
      if (reading.ns2_content.Customer) {
        agreementObj.Customer = reading.ns2_content.Customer.name.value;
      }
      if (reading.ns2_content.ServiceLocation) {
        agreementObj.ServiceLocation = {
          street:
            reading.ns2_content.ServiceLocation.mainAddress.streetDetail
              .addressGeneral.value,
          code: reading.ns2_content.ServiceLocation.mainAddress.townDetail.code
            .value,
          name: reading.ns2_content.ServiceLocation.mainAddress.townDetail.name
            .value,
          state:
            reading.ns2_content.ServiceLocation.mainAddress.townDetail
              .stateOrProvince.value,
        };
      }
      if (reading.ns2_content.CustomerAccount) {
        agreementObj.CustomerAccount =
          reading.ns2_content.CustomerAccount.name.value;
      }
      if (reading.ns2_content.CustomerAgreement) {
        if (reading.ns2_content.CustomerAgreement.name !== undefined) {
          let meter_type =
            reading.ns2_content.CustomerAgreement.type !== undefined
              ? reading.ns2_content.CustomerAgreement.type.value
              : "";
          agreementObj.CustomerAgreement = {
            name: reading.ns2_content.CustomerAgreement.name.value,
            type: meter_type,
          };
        }
      }
      if (reading.ns2_content.Meter) {
        agreementObj.Meter = {
          type: reading.ns2_content.Meter.type.value,
          serialNumber: reading.ns2_content.Meter.serialNumber.value,
          intervalLength: "",
        };

        if (reading.ns2_content.Meter.intervalLength) {
          agreementObj.Meter.intervalLength =
            reading.ns2_content.Meter.intervalLength.value;
        }

        agreementArr.push(agreementObj);
        agreementObj = {
          UsagePoint: "",
          Customer: "",
          ServiceLocation: "",
          CustomerAccount: "",
          CustomerAgreement: "",
          Meter: "",
        };
      }
    });

    if (agreementArr.length === 0) {
      return QB_EDIT("bn79wnafc", recId, {
        _fid_401: "No Meters Please Register Again",
      });
    }

    agreementArr.forEach((agreement) => {
      const Options = {
        method: "post",
        url: `https://aes.quickbase.com/db/bpiyupmjm?a=API_AddRecord`,
        data: querystring.stringify({
          _fid_6: recId,
          _fid_7: agreement.UsagePoint,
          _fid_19: agreement.Customer,
          _fid_21: agreement.ServiceLocation.street,
          _fid_23: agreement.ServiceLocation.name,
          _fid_24: "California",
          _fid_25: agreement.ServiceLocation.code,
          _fid_27: agreement.CustomerAccount,
          _fid_95: agreement.CustomerAgreement.name,
          _fid_32: agreement.CustomerAgreement.type,
          _fid_29: agreement.Meter.type,
          _fid_30: agreement.Meter.serialNumber,
          _fid_31: agreement.Meter.intervalLength,
          apptoken: QB.QB_API_KEY,
          username: QB.QB_LOGIN,
          password: QB.QB_PASSWORD,
        }),
      };
      axios(Options).then(() => console.log("Meters Posted"));
    });
  });

  res.json({ success: true });
});

//  @GET    Usage.
//  @Route  /quickbase/usage
//  @Query  rec_id / token / usage_point / sub_id / start / end / year
router.get("/usage", (req, res) => {
  console.log("Get Usage");

  const rec_id = req.query.rec_id;
  const token = req.query.token;
  const usage_point = req.query.usage_point;
  const sub_id = req.query.sub_id;

  //Date
  // const start = new Date(req.query.start).getUnixTime();
  // const end = new Date(req.query.end).getUnixTime();

  const start = moment()
    .startOf("month")
    .subtract(24, "months")
    .format("YYYY-MM-DD");
  const end = moment().format("YYYY-MM-DD");

  for (var m = moment(start); m.diff(end, "days") <= 0; m.add(1, "month")) {
    const pgeStart = m.format("YYYY-MM-DD") + "T08:00:00.000Z";
    const pgeEnd = m.add(1, "month").format("YYYY-MM-DD") + "T08:00:00.000Z";

    //GET Options
    const options = {
      url: `https://api.pge.com/GreenButtonConnect/espi/1_1/resource/Subscription/${sub_id}/UsagePoint/${usage_point}/UsageSummary`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      qs: {
        "published-min": new Date(pgeStart).getUnixTime(),
        "published-max": new Date(pgeEnd).getUnixTime(),
      },
      agentOptions: config.agentOptions,
    };

    //Make Request to pg&e push
    timer(1000).then(function () {
      request(options, (error, resp, body) => {
        console.log(error)
        //Error Checking
        if (
          body.indexOf("Bad Request") !== -1 ||
          body.indexOf("Date Range Too Large") !== -1 ||
          body.indexOf("invalid_client") !== -1 ||
          body.indexOf('"success": false') !== -1 ||
          body === "client credentials doesn't match" ||
          body === "Request failed." ||
          body === null ||
          body === '<ns1:feed xmlns:ns1="http://www.w3.org/2005/Atom"/>'
        ) {
          console.log(body);
          return;
        }

        //Get Results Turn Everything Into JSON
        let result = convert.xml2json(body, jsonOptions);
        result = JSON.parse(result);
        const mapArr = {};

        if (!result.ns1_feed || !result.ns1_feed.ns1_entry) {
          console.log("No feed");
          return false;
        }

        result = result.ns1_feed.ns1_entry;

        if (result === undefined)
          return QB_EDIT("bpiyupmjm", rec_id, { _fid_108: "Error no usage" });

        if (!result.length) result = [result];

        // update
        result.forEach((reading) => {
          const summary = reading.ns1_content.ns0_UsageSummary;
          const timeStamp = moment
            .unix(Number(summary.ns0_billingPeriod.ns0_start.value))
            .add(1, "days")
            .format("YYYY-MM-DD");
          const endDate = moment
            .unix(
              Number(summary.ns0_billingPeriod.ns0_start.value) +
                Number(summary.ns0_billingPeriod.ns0_duration.value)
            )
            .format("YYYY-MM-DD");

          let cost = 0;
          let notesArr = [];
          let costDetails = summary.ns0_costAdditionalDetailLastPeriod;
          let usage = Number(
            summary.ns0_overallConsumptionLastPeriod.ns0_value.value
          );
          let terrif = summary.ns0_tariffProfile.value;

          usage = usage / 1000000;
          if (!costDetails.length) costDetails = [costDetails];
          costDetails.forEach((bill) => {
            if (bill.ns0_note) notesArr.push(bill.ns0_note.value);

            let amount = Number(bill.ns0_amount.value) / 100000;
            cost += amount;
          });

          if (timeStamp in mapArr) {
            mapArr[timeStamp]["cost"] += cost;
          } else {
            mapArr[timeStamp] = {
              rec_id,
              timeStamp,
              endDate,
              usage,
              cost,
              terrif,
            };
          }
        });

        for(reading in mapArr) {
          const Options = {
            method: "post",
            url: `https://aes.quickbase.com/db/bpi5u9hs7?a=API_AddRecord`,
            data: querystring.stringify({
              _fid_9: mapArr[reading].rec_id,
              _fid_6: reading,
              _fid_14: mapArr[reading].endDate,
              _fid_7: mapArr[reading].usage,
              _fid_8: mapArr[reading].cost,
              _fid_16: mapArr[reading].terrif,
              // _fid_11: notesArr.join(", "),
              apptoken: QB.QB_API_KEY,
              username: QB.QB_LOGIN,
              password: QB.QB_PASSWORD,
            }),
          };

          QB_QUERY(rec_id, reading, mapArr[reading].usage, mapArr[reading].cost).then((query) => {
            let count = convert.xml2json(query.data, jsonOptions);
            count = JSON.parse(count);
            let numOfCount = Number(count.qdbapi.numMatches.value);

            if (numOfCount === 0) {
              axios(Options).catch((err) => console.log(err));
            }
          });

          console.log("Usage Posted");
        }
      });
    });
  }

  res.json({ success: true });
});

//  @GET    Intervals
//  @Route  /quickbase/full/report
//  @Query  rec_id / sub_id / usage_point / token / start / end
router.get("/full/report", async (req, res) => {
  console.log("GET Full Report");
  const usage_point = req.query.usage_point;
  const sub_id = req.query.sub_id;
  const rec_id = req.query.rec_id;
  const token = req.query.token;
  const customer_name = req.query.customer_name;

  //  Dates
  const start = req.query.start;
  const end = req.query.end;
  //  GET Optionss
  const intervals = [];
  for (var m = moment(start); m.isBefore(moment(end)); m.add(1, 'months')) {
    await sleep(3000);
    const pgeStart = m.format("YYYY-MM-DD") + "T08:00:00.000Z";
    const pgeEnd = moment(m).add(1, "month").format("YYYY-MM-DD") + "T08:00:00.000Z";

    console.log(pgeStart + ": StartDate   " + pgeEnd + ": EndDate");
    // //GET Options
    const options = {
      url: `https://api.pge.com/GreenButtonConnect/espi/1_1/resource/Batch/Subscription/${sub_id}/UsagePoint/${usage_point}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      qs: {
        "published-min": new Date(pgeStart).getUnixTime(),
        "published-max": new Date(pgeEnd).getUnixTime(),
      },
      agentOptions: config.agentOptions,
    };

    request(options, (error, resp, data) => {
      if (
        data === "Bad Request" ||
        data === "Internal Server Error" ||
        data.indexOf("invalid_client") !== -1 ||
        data === "client credentials doesn't match" ||
        data === "Request failed." ||
        data === null ||
        data === '<ns1:feed xmlns:ns1="http://www.w3.org/2005/Atom"/>'
      ) {
        console.log("Bad Request", data);
        return;
      }

      let result = convert.xml2json(data, jsonOptions);
      result = JSON.parse(result);
      result = result.ns1_feed.ns1_entry;

      result.forEach((entry) => {
        if (entry.ns1_content) {
          if (entry.ns1_content.ns0_IntervalBlock) {
            var iblock = entry.ns1_content.ns0_IntervalBlock;
            iblock.ns0_IntervalReading.forEach((reading) => {
                intervals.push(reading);
            })
          }
        }
      });

    });
  }
  const sendCsv = formatIntervals2(intervals, rec_id);
  let buff = new Buffer(sendCsv);
  let base64data = buff.toString("base64");

  let xml = `<qdbapi><udata>mydata</udata><field fid="85" filename="${customer_name
    .toLowerCase()
    .replace(",", "-")}-intervals.csv">${base64data}</field></qdbapi>`;
  request(
    {
      url: `https://aes.quickbase.com/db/bpiyupmjm?a=API_EditRecord&rid=${rec_id}&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`,
      method: "POST",
      headers: {
        "content-type": "text/xml",
      },
      body: xml,
    },
    function (err, remoteResponse, remotebody) {
      if (err) {
        console.log("error" + remoteResponse + " -- " + err);
      }
      console.log("Full Report Posted");
    }
  );
  res.json({ success: true, data: intervals });
});

//  @GET    Server Status
//  @Route  /quickbase/server/status
//  @Query  client_token
router.get("/server/status", (req, res) => {
  console.log(req.query.client_token);
  // PG&E Options
  const options = {
    url: `https://api.pge.com/GreenButtonConnect/espi/1_1/resource/ReadServiceStatus`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.query.client_token}`,
    },
    agentOptions: config.agentOptions,
  };

  request(options, (error, resp, body) => {
    console.log(body);
    res.send(body);
  });
});

//  @GET    Location
//  @Route  /quickbase/location
//  @Query  address
router.get("/location", (req, res) => {
  console.log("Looking for related location");
  const street = req.query.street;
  const city = req.query.city;
  const meter_id = req.query.meter_id;

  QB_QUERY_LOCATION(street, city).then((data) => {
    let json = convert.xml2json(data.data, jsonOptions);
    json = JSON.parse(json);
    json = json.qdbapi.record;
    if (json === undefined) {
      return console.log("No Location", json);
    }
    let rec_id = 0;
    if (json.length) {
      for (let i = 0; i < json.length; i++) {
        if (rec_id < Number(json[i].record_id_.value))
          rec_id = Number(json[i].record_id_.value);
      }
    }
    const record_id = rec_id !== 0 ? rec_id : json.record_id_.value;
    if (record_id !== undefined) {
      axios
        .get(
          `https://aes.quickbase.com/db/bpiyupmjm?a=API_EditRecord&rid=${meter_id}&_fid_88=${record_id}&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
        )
        .then((data) => console.log("Location Updated"));
    } else {
      console.log("Error: Location Not Defined");
    }
  });

  res.json({ success: true });
});

router.get("/intervals", async (req, res) => {
  try {
  } catch (err) {
    res.json({ error: "Cannot Get Intervals" });
  }
});

module.exports = router;
