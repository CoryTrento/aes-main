const express = require("express");
const router = express.Router();

//  Index Route
router.get("/", (req, res) => {
  res.render("index/home");
});

//  Render Registration
router.get("/customer/registration", (req, res) => {
  res.render("index/customerReg");
});

//  Post to Registration
router.post("/customer/registration", (req, res) => {
  req.session.email = req.body.email.toLowerCase();
  req.session.first_name = req.body.first_name.toLowerCase();
  req.session.last_name = req.body.last_name.toLowerCase();
  res.redirect(
    "https://sharemydata.pge.com/myAuthorization/?client_id=80b998d737b24f868ba92f2f525adbc7&redirect_uri=https://www.aescustomer.com/pge/redirect&response_type=code"
  );
});

//  Send Thank You
router.get("/thank/you", (req, res) => {
  res.render("index/thankYou");
});

module.exports = router;
