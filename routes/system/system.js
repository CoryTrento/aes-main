const express = require('express');
const router = express.Router();
const axios = require('axios');

//QuickBase
const QB = require('../../config/quickbase');

//JSON to XML function
const {getJsonData} = require('../../helpers/getJson');

//MultiText Function  
const {ToTextArray} = require('../../helpers/multiText');

function compare(a,b) {
  if (a.variable_name < b.variable_name){
    return -1;
  }
    
  if (a.variable_name > b.variable_name){
    return 1;
  }
    
  return 0;
}

//Get System Spec Sheet
router.get('/spec', (req, res) => {
  let id = req.query.id;
  let  proposal, arrays, costAdders, promotions, propImg, contact;
  let customerNameF = req.query.name
  let error;
  const errors = [];
  const getOpp = async (id) => {
    //Get Opportunity *************************
    const prop = await axios(`https://aes.quickbase.com/db/bkqrxt547?a=API_DoQuery&query={3.EX.${id}}AND{326.CT.${customerNameF}}&clist=836.1117.167.859.851.1073.1058.1028.1059.234.1030.1027.1003.1005.1006.535.196.324.4.254.816.221.586.541.822.496.525.523.524.526.819.221.660.258.261.262.113.3.326.658.487.488.390.112.663.250.251.109.485.826.111.385.386.625.362.821.820.211.139.427.426.365.835&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`)
    proposal = await getJsonData(prop.data)
    if(proposal.date_agreement_signed === ""){
      error = 'Error: Date Agreement Signed is empty, please check the proposal.'
    }else{
      let dateAgreementSigned = new Date(proposal.date_agreement_signed).toISOString().replace('T00:00:00.000Z', '').split('-')
      dateAgreementSigned = `${dateAgreementSigned[1]}-${dateAgreementSigned[2]}-${dateAgreementSigned[0]}`
      proposal.dateAgreementSigned = dateAgreementSigned;
    }
    const projectRecord = proposal.related_project_record;
    
    //Handle Proposal Errors Here!
    if(proposal.payment_method !== "Cash" && proposal.variable_name___financing_institution === 'Sunpower' && proposal.sunpower_loan_agreement_number === "" && proposal.sunpower_lease_agreement_number === ""){
      errors.push({text: "Error: Missing SunPower loan/lease ref#"})
    }
    if(Number(proposal.agreement_price__f_) === 0){
      errors.push({text: "Error: Agreement Price (F) has no value"})
    }

    

    //Get Arrays, Cost Adders, Promotions
    axios.all([
      //Arrays
      axios.get(`https://aes.quickbase.com/db/bkq96b4w5?a=API_DoQuery&query={28.EX.${id}}&clist=129.132.146.109.172.35.147.95.41.68.3.15.6.17.177.219&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
      //Cost Adders
      axios.get(`https://aes.quickbase.com/db/bkry2fqtb?a=API_DoQuery&query={7.EX.${id}}&clist=30.3.29.28.7.73.160.154&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
      //Promotions old
      axios.get(`https://aes.quickbase.com/db/bkr6akjie?a=API_DoQuery&query={132.EX.${id}}&clist=72.94.95.77.161.121.3.64.23.11.172.6.15.219&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
      //Promotions NEW
      axios.get(`https://aes.quickbase.com/db/bnhrg3tks?a=API_DoQuery&query={15.EX.${id}}&clist=106.121.3.23.40.43&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
      //Docs
      axios.get(`https://aes.quickbase.com/db/bkdfitsjr?a=API_DoQuery&query={66.EX.${id}}AND{68.EX.1}&clist=6.68.69&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`,
      ),
      //Contacts
      axios.get(`https://aes.quickbase.com/db/bkhxst86z?a=API_DoQuery&query={54.EX.${projectRecord}}&clist=25.7.26.8.33.31.58&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
      //Alerts
      axios.get(`https://aes.quickbase.com/db/bkhksefab?a=API_DoQuery&query={6.EX.${projectRecord}}&clist=118.385.29.363.90.168.3&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
      
    ])
    .catch(err => console.log(err))
    .then(axios.spread((array, cost, promo, newPromo, doc, con, alerts) => {

      //Arrays Data **********************************************************
      arrays = getJsonData(array.data)
      if(arrays !== undefined){
        if(!arrays.length) arrays = [arrays];
        proposal.moduleType = arrays[0].panel_model_number__when_locked_;
        proposal.numberOfArrays = arrays.length;
        proposal.arrays = arrays

        let roofType = [];
        let racking = [];
        let inverter = [];
        arrays.forEach(system => {
          if(roofType.indexOf(system.roof_material) === -1){
            roofType.push(system.roof_material)
          }
          if(racking.indexOf(system.related_matrix_variable__mount_style____product_record___model_number2___racking) === -1){
            racking.push(system.related_matrix_variable__mount_style____product_record___model_number2___racking)
          }
          if(system.inverter____product_record___model_number !== "" && inverter.indexOf(system.inverter____product_record___model_number) === -1){
            inverter.push(system.inverter____product_record___model_number)
          }
        })
        roofType.length > 1 ? roofType = roofType.join(', ') : roofType = roofType.join('')
        racking.length > 1 ? racking = racking.join(", ") : racking = racking.join('');
        if(inverter.length > 0){
          inverter.length > 1 ? inverter = inverter.join(', ') : inverter = inverter.join('');
        }else{
          inverter = false;
        }
        proposal.roofType = roofType;
        proposal.racking = racking;
        proposal.inverter = inverter;
      }else{
        proposal.arrays = false;
      }
        
      //Cost Adder Data **********************************************************
      costAdders = getJsonData(cost.data)
      if(costAdders !== undefined){
        if(!costAdders.length) costAdders = [costAdders];
        proposal.costAdders = costAdders
      }else{
        proposal.costAdders = [];
      }

      //Promotions Data **********************************************************
      promotions = getJsonData(promo.data)
      if(promotions !== undefined){
        if(!promotions.length) promotions = [promotions];
        
        proposal.promotions = promotions.sort(compare)
        proposal.promotions.forEach(promo => {
          if(promo.payout_type__f_ === "Referral"){
            proposal.referral = true
            if(promo.split_referral !== 0){
              promo.split_referral = true
            }else{
              promo.split_referral = false
            }
          }else if(promo.payout_type__f_ === "Rebate" || promo.payout_type__f_ === "Discount"){
            proposal.discountOrRebate = true
          }
        })
      }else{
        proposal.promotions = false;
      }

      //New Promotion Data
      newPromotions = getJsonData(newPromo.data)
      if(newPromotions !== undefined){
        if(!newPromotions.length) newPromotions = [newPromotions];
        proposal.newPromotions = newPromotions.sort(compare);

        proposal.newPromotions.forEach(promo => {
          if(promo.promotion_payout_type__f_ === "Referral"){
            proposal.newReferral = true;
          }else{
            proposal.newReferral = false;
          }
        })
      }else{
        proposal.newPromotions = false;
      }
     

      //Documents
      let checkPropImage;
      propImg = getJsonData(doc.data)
      if(propImg !== undefined){
        if(!propImg.length) propImg = [propImg];
        proposal.propImg = propImg[0].document_link;
        checkPropImage = propImg[0].document_link;
      }else{
        proposal.propImg = false;
      }
      if(!checkPropImage){
        //errors.push({text: "Error: Missing presentation image"})
      }

      //Contact Data **************************************************************
      contact = getJsonData(con.data)
      if(contact !== undefined){
        if(!contact.length) contact = [contact];
        proposal.contact = contact
      }else{
        proposal.contact = [];
      }

      //Alert Data
      alerts = getJsonData(alerts.data)
      if(alerts !== undefined){
        if(!alerts.length) alerts = [alerts];
        proposal.alerts = alerts
      }else{
        proposal.alerts = [];
      }
    }))
    .then(() => {
      // console.log(proposal)
      // console.log(proposal.alerts)
      res.render('system/systemSpec', {
        error,
        errors,
        proposal
      })
    })
  }
  
  getOpp(id)
})


module.exports = router 