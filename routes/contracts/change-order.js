const express = require("express");
const router = express.Router();

//QuickBase
const { QB_QUERY_FID } = require("../../helpers/query");

const makeString = contract => {
  for (keys in contract) {
    if (Array.isArray(contract[keys])) {
      contract[keys] = contract[keys].join("");
    }
  }
  return contract;
};

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

router.get("/", async (req, res) => {
  let {
    customer,
    date,
    project,
    changeOrder,
    amount,
    reason,
    textForPrint
  } = req.query;
  amount = toMoney(amount);
  try {
    const contract = makeString(
      await QB_QUERY_FID(
        "bnyi4n2cv",
        "obj",
        "{6.EX.Change Order Contract}AND{76.EX.1}",
        "31.7.8"
      )
    );
    contract._fid_7 = contract._fid_7
      .replace(/#customer/, customer)
      .replace(/#date/, date)
      .replace(/#projectNum/, project)
      .replace(/#changOrderNum/, changeOrder)
      .replace(/#amount/, amount)
      .replace(/#reason/, reason)
      .replace(/#textForPrint/, textForPrint);

    res.render("contracts/change-order", contract);
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;
