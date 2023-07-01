const express = require("express");
const router = express.Router();
const { GET_PVWATTS } = require("./get_pvwatts");
const formatProduction = require("./format_production");
const { QB_QUERY_FID, QB_EDIT } = require("../../helpers/qb_crud");

router.get("/", (req, res) => {
  const rec_id = req.query.rec_id;

  if (req.query.token !== "Tooth)$@8a")
    return res.json({ success: false, error: "Invalid token" });

  QB_QUERY_FID("bkq96b4w5", "arr", `{291.EX.${rec_id}}`, "3.301").then(data => {
    data.forEach(array => {
      GET_PVWATTS(array._fid_301)
        .then(resp => {
          if (resp.error) {
            let errors = resp.message.response.data.errors.join(", ");
            QB_EDIT("bkq96b4w5", array._fid_3, { _fid_326: errors });
            return;
          }

          formatProduction(resp.data)
            .then(data => {})
            .catch(err => console.log(err));

          const inputs = JSON.stringify(resp.data.inputs)
            .replace(/{/g, "")
            .replace(/}/g, "")
            .replace(/"/g, "")
            .replace(/:/g, ": ")
            .replace(/,/g, " || ");
          const ac_monthly = resp.data.outputs.ac_monthly;
          const post_data = {
            _fid_182: ac_monthly[0],
            _fid_183: ac_monthly[1],
            _fid_184: ac_monthly[2],
            _fid_185: ac_monthly[3],
            _fid_186: ac_monthly[4],
            _fid_187: ac_monthly[5],
            _fid_188: ac_monthly[6],
            _fid_189: ac_monthly[7],
            _fid_190: ac_monthly[8],
            _fid_191: ac_monthly[9],
            _fid_192: ac_monthly[10],
            _fid_193: ac_monthly[11],
            _fid_224: inputs,
            _fid_326: ""
          };
          QB_EDIT("bkq96b4w5", array._fid_3, post_data);
        })
        .catch(err => {
          QB_EDIT("bkq96b4w5", array._fid_3, { _fid_326: "PvWatts Failed " });
        });
    });
    return res.json({ success: true });
  });
});

module.exports = router;
