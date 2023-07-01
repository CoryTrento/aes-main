const express = require('express')
const router = express.Router();
const fs = require('fs');
const csv = require('csvtojson');

// Import & Export Tables
const SubmitDeck = require('./platform/deck');
const SubmitSma = require('./platform/sma');
const SubmitPowerTrack = require('./platform/powertrack');

router.get('/', (req, res) => {
  res.render('monitoring/monitoring')
})

router.post('/', (req, res) => {

  const table = req.body.table;
  const month = req.body.month;
  const year = req.body.year;
  let files = req.files.sampleFile;

  let csvParams = {
    noheader: false,
    trim: false,
    flatKeys: true,
    ignoreEmpty: true,
    output: "json"
  };
  if (table === "bpgssvkqb") {
    csvParams.delimiter = ';';
    csvParams.trim = true;
  } else if (table === 'bpgssr4hc') {
    csvParams.delimiter = ',';
    csvParams.trim = true;
    csvParams.ignoreEmpty = false;
  }

  fs.readFile(files.data, (data, err) => {
    const payload = data.path;

    csv(csvParams)
      .fromString(payload)
      .then((csvRow) => {

        // If Deck
        if (table === "bpgssr4hc") {
          SubmitDeck(csvRow, month, year, "Deck");
        
        // If SMA
        } else if (table === "bpgssvkqb") {
          SubmitSma(csvRow, month, year, "SMA");

        // If PowerTrack
        } else if (table === "bphzwy2vn") {
          SubmitPowerTrack(csvRow, month, year, "PowerTrack");
        }
        
        res.render('monitoring/monitoring')
      })
  });
})

module.exports = router;