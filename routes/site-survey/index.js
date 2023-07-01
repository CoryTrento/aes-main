const express = require("express");
const router = express.Router();

//QuickBase
const { QB_QUERY_FID } = require("../../helpers/qb_crud");

router.get("/", async (req, res) => {
  try {
    const price = await QB_QUERY_FID(
      "bpmbhwbng",
      "obj",
      `{3.EX.${req.query.recId}}`,
      "346.312.251.608.73.75.607.645.646.652.372.647.373.653.378.654"
    );

    price._fid_346 = price._fid_346.replace(
      "solarenergyforlife.com",
      "savingenergyforlife.com"
    );

    if( price._fid_645)
    price._fid_645 = price._fid_645
      .split(";")
      .join("&deg;, ")
      .concat("&deg;");

    price.rep = await QB_QUERY_FID(
      "bkhxst86z",
      "obj",
      `{9.CT.${price._fid_346}}`,
      "58.31"
    );
    res.render("site-survey/index", price);
  } catch (err) {
    res.json({ error: "No Price" });
    console.log(err);
  }
});

module.exports = router;
