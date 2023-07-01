const express = require("express");
const router = express.Router();
const axios = require("axios");

//QuickBase
const { QB_QUERY_FID } = require("../../helpers/query");

// Helpers
const { CREATE_COST } = require("./helpers/cost");
const { USAGE_VS_PRODUCTION } = require("./helpers/readings");

router.get("/", (req, res) => {
  const recId = req.query.recId;
  const name = req.query.name.replace(/ *\([^)]*\) */g, "");
  const presentation = {};
  presentation.compare = [];
  axios
    .all([
      // ====================== CONTENT =========================
      QB_QUERY_FID("bnyi4n2cv", "obj", "{6.EX.Presentation}", "a"),
      // ====================== PRICING =========================
      QB_QUERY_FID(
        "bpmbhwbng",
        "arr",
        `{37.EX.${recId}}AND{337.EX.1}AND{312.CT.${name}}`,
        "6.41.3.346.349.335.336.73.74.350.351.352.353.354.235.236.257.341.355.356.357.358.359.360.361.362.363.364.365.366.312.368.369.371.373.374.375.376.377.378.380.382.383.384.385.386.387.388.338.339.340.401.402.403.404.405.406.407.39.251.519.267.268.269.270.271.273.272.274.275.276.277.266.591.615.622.623.624"
      )
    ])
    .then(
      axios.spread((content, pricing) => {
        if (pricing.length === 0)
          return res.json({ success: false, error: "No Price Record" });
        presentation.content = content;
        presentation.pricing = pricing;
        presentation.customerName = pricing[0]._fid_312;
        if (presentation.customerAddress)
          presentation.customerAddress = pricing[0]._fid_251.replace(
            ",",
            ",<br>"
          );

        // Break out of forEach
        let count = 0;
        presentation.pricing.forEach((price, i) => {
          price.cost = CREATE_COST(price);
          price.cost.forEach(option => presentation.compare.push(option));
          price.disclaimer = content;
          price._fid_346 = price._fid_346.replace(
            "solarenergyforlife.com",
            "savingenergyforlife.com"
          );
          axios
            .all([
              // ====================== Contact Agent =========================
              QB_QUERY_FID(
                "bkhxst86z",
                "obj",
                `{9.CT.${price._fid_346.toLowerCase()}}`,
                "58.115.111.9.31"
              ),
              // ====================== Meter Info =========================
              QB_QUERY_FID(
                "bpi5u9hs7",
                "array",
                `{18.EX.${price._fid_39}}AND{32.EX.1}AND{27.XEX.1}`,
                "a"
              )
            ])
            .then(
              axios.spread((agent, readings) => {
                if (!presentation.agent) presentation.agent = agent;
                price.readings = USAGE_VS_PRODUCTION(readings, price);
                count++;
              })
            )
            .then(() => {
              if (count === presentation.pricing.length) {
                return res.render("presentation/presentation", presentation);
              }
            })
            .catch(err => res.json({ success: false, error: err }));
        });
      })
    )
    .catch(err => res.json({ success: false, error: err }));
});

module.exports = router;
