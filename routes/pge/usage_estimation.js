const express = require("express");
const router = express.Router();
const moment = require("moment");

// Helper
const { QB_QUERY_FID, QB_ADD } = require("../../helpers/qb_crud");
const { ESTIMATE } = require("./helpers/estimate_usage");

router.get("/", (req, res) => {
  const {
    bill_month,
    bill_usage,
    bill_cost,
    bill_rate,
    meter_id,
    redirect
  } = req.query;
  ESTIMATE(bill_month, bill_usage, bill_cost, bill_rate).then(estimate => {
    let index = 0;
    for (key in estimate.usage) {
      const month_start = moment()
        .subtract(index + 1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      const month_end = moment()
        .subtract(index, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
      const month_name = moment()
        .subtract(index, "months")
        .format("MMMM");
      QB_QUERY_FID(
        "bpi5u9hs7",
        "arr",
        `{9.EX.${meter_id}}AND{6.OAF.${month_start}}AND{14.OBF.${month_end}}`,
        "a"
      ).then(query => {
        if (query.length === 0) {
          let data = {
            _fid_9: meter_id,
            _fid_6: month_start,
            _fid_14: month_end,
            _fid_7: estimate.usage[month_name],
            _fid_8: estimate.cost[month_name],
            _fid_11: "Estimation"
          };
          QB_ADD("bpi5u9hs7", data);
        }
      });
      if (index === 11) {
        return res.redirect(
          `https://aes.quickbase.com/db/bpiyupmjm?a=dr&rid=${meter_id}`
        );
      }
      index++;
    }
  });
});

module.exports = router;
