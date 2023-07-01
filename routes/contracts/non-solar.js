const express = require("express");
const router = express.Router();

//QuickBase
const { QB_QUERY_FID } = require("../../helpers/qb_crud");

// Helpers
const toMoney = amount => {
  amount = parseFloat(amount);
  if (amount == 0 || amount == undefined || amount == null) {
    amount = "0.00";
  } else {
    if (amount > 1) {
      amount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    } else {
      amount = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    }
  }
  return `$${amount}`;
};

const makeString = contract => {
  for (keys in contract) {
    if (Array.isArray(contract[keys])) {
      contract[keys] = contract[keys].join("");
    }
  }
  return contract;
};

router.get("/", async (req, res) => {
  if (!req.query.recId) return res.json({ error: "No Record ID" });

  const contract = makeString(
    await QB_QUERY_FID("bnyi4n2cv", "obj", "{6.EX.Non Solar Contract}", "a")
  );

  const price = await QB_QUERY_FID(
    "bpmbhwbng",
    "obj",
    `{3.EX.${req.query.recId}}`,
    "247.528.243.493.499.500.501.233.456.470.251.223.257.419.381"
  );

  // Check for contributions
  if (Number(price._fid_223) <= 0) {
    contract.hide_contribution = true;
    contract._fid_11 = contract._fid_11.replace(
      "Price includes a #contribution customer contribution.",
      ``
    );
  }

  // Format Money
  const priceWithCon = toMoney(Number(price._fid_243) + Number(price._fid_223));
  price._fid_243 = toMoney(price._fid_243);
  price._fid_493 = toMoney(price._fid_493);
  price._fid_499 = toMoney(price._fid_499);
  price._fid_500 = toMoney(price._fid_500);
  price._fid_501 = toMoney(price._fid_501);
  price._fid_223 = toMoney(price._fid_223);
  price._fid_381 = price._fid_381
    .replace(/<li>/g, "( 1 ) ")
    .replace(/<\/\li>/g, "<br>");

  // Customer Info
  contract._fid_11 = contract._fid_11
    .replace(/#customerName/g, price._fid_456)
    .replace(/#customerAddress/g, price._fid_470)
    .replace(/#projectLocation/g, price._fid_251)
    .replace(/#cashPrice/g, price._fid_243)
    .replace(/#loanPrice/g, price._fid_243)
    .replace(/#deposit/g, price._fid_493)
    .replace(/#uponWork/g, price._fid_499)
    .replace(/#uponInstallation/g, price._fid_500)
    .replace(/#balanceDue/g, price._fid_501)
    .replace(/#contribution/g, price._fid_223)
    .replace(/#PriceWithCon/, priceWithCon)
    .replace(/#contractNotes/, price._fid_419)
    .replace(/#costAdders/g, price._fid_381);

  // Change Based On Type
  if (price._fid_247 == "Cash") {
    contract.selected_price = "Cash";
    contract._fid_11 = contract._fid_11
      .replace(/#cashChecked/g, "&#10003;")
      .replace(/#financedChecked/g, "");
  } else if (price._fid_247 === "Loan") {
    contract.selected_price = "Loan";
    contract._fid_11 = contract._fid_11
      .replace(/#cashChecked/g, "")
      .replace(/#financedChecked/g, "&#10003;");
  }

  res.render("contracts/non-solar", contract);
});

module.exports = router;
