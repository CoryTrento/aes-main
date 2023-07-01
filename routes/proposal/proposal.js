const express = require('express');
const router = express.Router();
const axios = require('axios');

//QuickBase
const QB = require('../../config/quickbase');

//JSON to XML function
const {getJsonData} = require('../../helpers/getJson');

//Format Text function
const {formatContent} = require('../../helpers/formatContent');

//Format Images 
const {formatImage} = require('../../helpers/formatContent');

// Get Price Info Obj and Current Path Obj
const {currentPath} = require('../../helpers/priceInfo');
const {energyFuture} = require('../../helpers/priceInfo');
const {compareAll} = require('../../helpers/priceInfo');

//MultiText Function  
const {ToTextArray} = require('../../helpers/multiText');

//Get Solar Proposal Stay OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/solar', (req, res) => {
  //Opportunity RecordId to Query
  const recId = req.query.recId
  const customerNameF = req.query.name.replace(/ *\([^)]*\) */g, "");
  const OppRecId = req.query.recId;
  let propRecId;
  
  //Get all the Data 
  const getOpportunity = async (id) => {
    let finishedArray = [];
    let compareArray = [];
    let itemsProcessed = 0
    let opportunity, proposals;
    let agentName, agentPhoto, agentPhone, agentEmail, agentBio, customerNameProp;
    let standardEfficiencyPhoto, highEfficiencyPhoto;
    let pageOneContent, pageTwoContent, pageThreeContent, disclaimerContent;
    let hasBattery = false;
    
    //Get Opportunity *************************
    const opp = await axios(`https://aes.quickbase.com/db/bkcu36ybd?a=API_DoQuery&query={3.EX.${id}}&clist=3.1126.559&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`)
    opportunity = await getJsonData(opp.data)
    
    //Get Proposal ****************************
    const prop = await axios(`https://aes.quickbase.com/db/bkqrxt547?a=API_DoQuery&query={531.EX.${id}}AND{326.CT.${customerNameF}}AND{607.EX.1}&clist=1139.362.477.1075.1076.326.1049.1032.1033.1035.1027.503.1019.1012.1010.1009.1008.1007.1006.1005.1003.968.807.792.793.794.795.783.782.476.478.588.734.770.723.738.736.719.764.765.766.758.768.757.755.754.753.502.748.749.746.747.743.744.745.727.728.729.740.741.742.175.739.737.735.720.730.731.732.724.725.676.700.699.344.340.697.695.692.693.689.690.691.694.688.687.686.683.684.674.675.677.678.679.680.681.682.602.672.673.3.607.109.111.112.535.438.660.663.664.658.659.666.671&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`)
    proposals = await getJsonData(prop.data)
    
    
    if(proposals === undefined) return res.json({error: "No proposal active"})
    
    //Make One Proposal An Array
    if(!proposals.length){
      proposals = [proposals]
    }
      
    //Check if there is a proposal ********************************************************************************
    if(proposals.length){
    proposals.forEach((proposal, index) => {

      //Initialize Data Holders
      let arrays, costAdders, promotions, documents;
      let pricesArray = [], currentPathArrays = [];
      
      //Proposal RecordId
      let recId = proposal.record_id_;
      propRecId = proposal.record_id_;
      if(!customerNameProp) customerNameProp = proposal.project_record___name__f_;
      //Warranty Information
      let moduleWarranty = proposal.module_warranty;
      let microInverterWarranty = proposal.micro_inverter_warranty; 
      let workmanshipWarranty = proposal.workmanship_warranty;

      //What to Compare
      let compareCashChecked = proposal.compare_cash !== 0 ? "checked" : "";
      let compareFinancedChecked = proposal.compare_financed !== 0 ? "checked" : "";
      let compareLeaseChecked = proposal.compare_lease !== 0 ? "checked" : "";
     
      //Update Agent Info;
      agentName = proposal.agent_to_agent_s_contact_record__f____name__reports___f_;
      agentPhoto = proposal.agent_to_agent_s_contact_record__f____photo_link;
      agentPhone = proposal.agent_to_agent_s_contact_record__f____phone_3 !== "" ? proposal.agent_to_agent_s_contact_record__f____phone_3 : proposal.agent_to_agent_s_contact_record__f____phone_2;
      agentEmail = proposal.agent_to_agent_s_contact_record__f____email_1;
      agentBio = JSON.stringify(proposal.agent_to_agent_s_contact_record__f____agent_bio);
      agentBio = formatContent(agentBio, "agentBio");
      
      //Photos Used From Proposal
      let mainLogo = formatImage(proposal.main_logo_photo__f_)
      standardEfficiencyPhoto = proposal.standard_efficiency_photo__f_;
      highEfficiencyPhoto = proposal.high_efficiency_photo__f_;
      let maxFitPhoto;
      let awardPhoto = formatImage(proposal.awards_photo__f_);
      proposal.img_link_for_presentation__f_ = proposal.img_link_for_presentation__f_.replace(/\s/g, "")

      //Page One Content
      let pageOneParagraphOne = JSON.stringify(proposal.page_one_paragraph_one__f_);
      let pageOneParagraphTwo = JSON.stringify(proposal.page_one_paragraph_two__f_);
      let pageOnePhotoLink = JSON.stringify(proposal.page_one_photo__f_);

      pageOneContent = {paragraphOne: formatContent(pageOneParagraphOne, "page"), paragraphTwo: formatContent(pageOneParagraphTwo, "page"), pageOnePhoto: formatContent(pageOnePhotoLink, 'page'), mainLogo: mainLogo, awardPhoto: awardPhoto};
     
      //Page Two Content
      let pageTwoParagraphOne = JSON.stringify(proposal.page_two_paragraph_one__f_);
      let pageTwoParagraphTwo = JSON.stringify(proposal.page_two_paragraph_two__f_);
      let pageTwoParagraphThree = JSON.stringify(proposal.page_two_paragraph_three__f_);
      let pageTwoEndSentence = JSON.stringify(proposal.page_two_end_sentence__f_);
      let pageTwoSeParagraphOne = JSON.stringify(proposal.standard_efficiency_paragraph_one__f_);
      let pageTwoSeParagraphTwo = JSON.stringify(proposal.standard_efficiency_paragraph_two__f);
      let pageTwoHeParagraphOne = JSON.stringify(proposal.high_efficiency_paragraph_one__f_);
      let pageTwoHeParagraphTwo = JSON.stringify(proposal.high_efficiency_paragraph_two__f_);
      let systemMonitoringSoftware = JSON.stringify(proposal.system_monitoring_software__f_);
      if(proposal.has_battery__f_ !== ""){
        hasBattery = true;
      }
      pageTwoContent = {paragraphOne: formatContent(pageTwoParagraphOne, "page"), paragraphTwo: formatContent(pageTwoParagraphTwo, "page"),paragraphThree: formatContent(pageTwoParagraphThree, "page"), seParagraphOne: formatContent(pageTwoSeParagraphOne, "page"), seParagraphTwo: formatContent(pageTwoSeParagraphTwo, "page"), heParagraphOne: formatContent(pageTwoHeParagraphOne, "page"), heParagraphTwo: formatContent(pageTwoHeParagraphTwo, "page"), endSentence: formatContent(pageTwoEndSentence, 'page'), systemMonitoringSoftware: formatContent(systemMonitoringSoftware, 'page')}

      //Page Three Content
      let pageThreeNetMetering = JSON.stringify(proposal.page_three_net_metering__f_);
      let incentiveOne = JSON.stringify(proposal.page_three_incentive_one__f_);
      let incentiveTwo = JSON.stringify(proposal.page_three_incentive_two__f_);
      let incentiveThree = JSON.stringify(proposal.page_three_incentive_three__f_);
      let pageThreeCash = JSON.stringify(proposal.page_three_cash__f_);
          pageThreeCash = formatContent(pageThreeCash, "page");
      let pageThreeLoan = JSON.stringify(proposal.page_three_loan__f_);
          pageThreeLoan = formatContent(pageThreeLoan, "page");
      let pageThreeLease = JSON.stringify(proposal.page_three_lease__f_);
          pageThreeLease = formatContent(pageThreeLease, "page");
      let pageThreeLinkOne = JSON.stringify(proposal.page_three_finance_link_one__f_);
          pageThreeLinkOne = formatContent(pageThreeLinkOne, "page")
      let pageThreeLinkTwo = JSON.stringify(proposal.page_three_finance_link_two__f_);
          pageThreeLinkTwo = formatContent(pageThreeLinkTwo, "page")
      let pageThreeTopPhoto = JSON.stringify(proposal.page_three_top_image__f_);
          pageThreeTopPhoto = formatContent(pageThreeTopPhoto, "page")
      let getStartedCash = JSON.stringify(proposal.get_started_cash__f_);
          getStartedCash = formatContent(getStartedCash, "page")
      let getStartedLoan = JSON.stringify(proposal.get_started_loan__f_);
          getStartedLoan = formatContent(getStartedLoan, "page")      
      let getStartedLease = JSON.stringify(proposal.get_started_lease__f_);
          getStartedLease = formatContent(getStartedLease, "page")
      pageThreeContent = {paragraphOne: formatContent(pageThreeNetMetering, "page"), incentiveOne: formatContent(incentiveOne, 'page'), incentiveTwo: formatContent(incentiveTwo, 'page'), incentiveThree: formatContent(incentiveThree, 'page'), pageThreeCash: pageThreeCash, pageThreeLoan: pageThreeLoan, pageThreeLease: pageThreeLease, pageThreeLinkOne: pageThreeLinkOne, pageThreeLinkTwo: pageThreeLinkTwo, pageThreeTopPhoto: pageThreeTopPhoto, getStartedCash, getStartedLoan, getStartedLease}

      //Disclaimer Content
      let disclaimerOne = JSON.stringify(proposal.disclaimer_one__f_);
          disclaimerOne = formatContent(disclaimerOne, "page");
      let disclaimerTwo = JSON.stringify(proposal.disclaimer_two__f_);
          disclaimerTwo = formatContent(disclaimerTwo, "page");
      let disclaimerThree = JSON.stringify(proposal.disclaimer_three__f_);
          disclaimerThree = formatContent(disclaimerThree, "page");  
      let disclaimerFour = JSON.stringify(proposal.disclaimer_four__f_);
          disclaimerFour = formatContent(disclaimerFour, "page");   
      let disclaimerFive = JSON.stringify(proposal.disclaimer_five__f_);
          disclaimerFive = formatContent(disclaimerFive, "page");  
      disclaimerContent = {disclaimerOne, disclaimerTwo, disclaimerThree, disclaimerFour, disclaimerFive};

      //Promotions Rebates And Referrals
      proposal.discount_array_to_use__f_ = ToTextArray(proposal.discount_array_to_use__f_);
      proposal.rebate_array_to_use__f_ = ToTextArray(proposal.rebate_array_to_use__f_);
      proposal.referral_array_to_use__f_ = ToTextArray(proposal.referral_array_to_use__f_);
      proposal.marketing_array_to_use__f_ = ToTextArray(proposal.marketing_array_to_use__f_);
      if(proposal.total_promotion_amount_without_referrals__f_ === "") proposal.total_promotion_amount_without_referrals__f_ = 0;
     
      //Proposal Usage and Production
      let annualProduction = proposal.annual_production__f_;

      //Proposal Title
      let title = proposal.proposal_title;

      //New Prices for Proposal ************************************************************************************************
      //Discounts Rebates
      let totalDiscounts = proposal.discounts__f_;
      let totalRebates = proposal.total_rebates_amount__f_;
      //Without Solar
      let currentMonthlyPayment = proposal.current_monthly_payment__f_;
      let without25YearKwh = proposal.without_solar_25_year_kwh______f_;
      let without25YearCost = proposal.without_solar_25_year_cost__f_;
      let without25YearSaving = 0.00;
      //25 Year Cost
      let cash25YearCost = proposal.cash_net__f_;
      let loan25YearCost = proposal.loan_cost_with_incentive__f_;
      let lease25YearCost = proposal.total_lease_payment__f_;
      //25 Year kWh
      let cash25YearKwh = proposal.cash_25_year_kwh__f_
      let loan25YearKwh = proposal.financed_25_year_kwh__f_;
      let lease25YearKwh = proposal.lease_25_year_kwh__f_;
      //25 Year Savings
      let cash25YearSaving = proposal.cash_saving_25_year__f_;
      let loan25YearSaving = proposal.loan_saving_25_year__f_;
      let lease25YearSaving = proposal.lease_saving_25_year__f_;
      //Incentives
      let cashIncentive = proposal.cash_incentive__f_;
      let loanIncentive = proposal.finance_incentive__f_;
      let leaseIncentive = 0.00;
      //Promotions  
      let totalPromotions = proposal.total_promotion_amount_without_referrals__f_ !== "" ? proposal.total_promotion_amount_without_referrals__f_: 0.00;
      //Net
      let cashNet = proposal.cash_net__f_;
      let loanNet = proposal.financed_net__f_;
      let leaseNet = 0.00;
      //Payments
      let loanPayments = proposal.monthly_payment__f_ != '' ? proposal.monthly_payment__f_ : 0;
      let leasePayment = proposal.sunpower_lease_monthly_payment != "" ? proposal.sunpower_lease_monthly_payment : 0;
      //Proposal Prices
      let cashPrice = proposal.cash_price_for_proposal__f_;
      let financedPrice = proposal.loan_price_for_proposal__f_;
      let leasePrice = 0;
      //Terms and Interest
      let financingTerms = proposal.terms_used_for_proposal__f_;
      let interestRate = proposal.variable_____interest;
      //Break Even 
      let cashBreakEven = proposal.cash_break_even__yrs__f_;
      let loanBreakEven = proposal.loan_break_even__yrs__f_;
      let leaseBreakEven = proposal.lease_break_even__yrs__f_;

      //Price Objects
      let cashInfoObj = energyFuture("Cash", 0.00, cash25YearKwh, cash25YearCost, cash25YearSaving, cashPrice, cashIncentive, cashNet, "", compareCashChecked, title, cashBreakEven, totalPromotions);
      cashInfoObj.balloon = 0;
      
      let loanInfoObj = energyFuture("Loan", loanPayments, loan25YearKwh, loan25YearCost, loan25YearSaving, financedPrice, loanIncentive, loanNet, financingTerms, compareFinancedChecked, title, loanBreakEven, totalPromotions);
      loanInfoObj.balloon = proposal.balloon_payment_2__f_;
      if(proposal.variable_name___financing_institution === "Clean Energy Credit Union") proposal.variable_name___financing_institution  = "Clean Energy"
      loanInfoObj.financing_institution = `${proposal.variable_name___financing_institution} ${financingTerms} yr  ${interestRate !== "" ? '/ '+interestRate: ''}`

      let leaseInfoObj = energyFuture("Lease", leasePayment, lease25YearKwh, lease25YearCost, lease25YearSaving, leasePrice, leaseIncentive, leaseNet, "", compareLeaseChecked, title, leaseBreakEven, totalPromotions);
      leaseInfoObj.balloon = 0;
    
      //priceArray Push
      if(proposal.hide_cash_price_from_presentation !== 1) pricesArray.push(cashInfoObj);
      if(loanPayments !== 0) pricesArray.push(loanInfoObj);
      if(leasePayment !== 0) pricesArray.push(leaseInfoObj);
    
      //Current Path Array
      currentPathArrays.push(currentPath(currentMonthlyPayment, without25YearKwh, without25YearCost, without25YearSaving, proposal.balloon_payment_2__f_))

      //Dont Want to get Into Each Proposal
      let percentOffset = Number(proposal.percentage_kw_offset__f_) * 100
      let percentLeft = percentOffset > 100 ? 0 : 100 - percentOffset;
      percentLeft = percentLeft.toFixed();
      percentOffset = percentOffset.toFixed();
      
      //Compare Cash Push
      let cashObj = compareAll(propRecId, 'Cash', title, annualProduction, proposal.total_panel_quantity__f_, proposal.system_dc_kw_array_total, cashInfoObj, percentOffset, proposal.cash_25_year_kwh__f_, "_fid_730", recId, OppRecId, customerNameF, moduleWarranty, microInverterWarranty, workmanshipWarranty)
      cashObj.discountAmount = proposal.discount_amount_to_use__f_;
      cashObj.rebateAmount =  proposal.rebate_amount_to_use__f_;
      cashObj.referralAmount = proposal.referral_amount_to_use__f_;
      cashObj.totalPromoWithoutReferral = proposal.total_promotion_amount_without_referrals__f_;
      cashObj.priceBeforeDiscounts = proposal.cash_price___discount__f_;
      proposal.balloon_payment_2__f_ !== "" ? cashObj.balloon = 0 : cashObj.balloon = 0;
      if(proposal.hide_cash_price_from_presentation !== 1) compareArray.push(cashObj);
      
      //Compare Loan Push
      let financedObj = compareAll(propRecId, "Financed", proposal.proposal_title, annualProduction, proposal.total_panel_quantity__f_, proposal.system_dc_kw_array_total, loanInfoObj, percentOffset,
      proposal.cash_25_year_kwh__f_, "_fid_731", recId, OppRecId, customerNameF, moduleWarranty, microInverterWarranty, workmanshipWarranty)
      financedObj.discountAmount = proposal.discount_amount_to_use__f_;
      financedObj.rebateAmount =  proposal.rebate_amount_to_use__f_;
      financedObj.referralAmount = proposal.referral_amount_to_use__f_;
      financedObj.totalPromoWithoutReferral = proposal.total_promotion_amount_without_referrals__f_;
      financedObj.priceBeforeDiscounts = proposal.loan_price___discount__f_;
      proposal.balloon_payment_2__f_ !== "" ? financedObj.balloon = proposal.balloon_payment_2__f_ : financedObj.balloon = 0;
      if(loanPayments !== 0)  compareArray.push(financedObj);
     
      //Compare Lease Push
      let leaseObj = compareAll(propRecId, "Lease", proposal.proposal_title, annualProduction, proposal.total_panel_quantity__f_, proposal.system_dc_kw_array_total, leaseInfoObj, percentOffset,
      proposal.cash_25_year_kwh__f_, "_fid_732", recId, OppRecId, customerNameF, moduleWarranty, microInverterWarranty, workmanshipWarranty)
      leaseObj.discountAmount = proposal.discount_amount_to_use__f_;
      leaseObj.rebateAmount =  proposal.rebate_amount_to_use__f_;
      leaseObj.referralAmount = proposal.referral_amount_to_use__f_;
      leaseObj.totalPromoWithoutReferral = proposal.total_promotion_amount_without_referrals__f_;
      leaseObj.priceBeforeDiscounts = proposal.lease_price___discount__f_;
      proposal.balloon_payment_2__f_ !== "" ? leaseObj.balloon = 0 : leaseObj.balloon = 0;
      if(leasePayment !== 0) compareArray.push(leaseObj);

      // Handle Proposal Image
      if(proposal.img_link_for_presentation__f_.split("?")[1] === ""){
        proposal.img_link_for_presentation__f_ = null
      }
      
      //Get Arrays, Cost Adders, Promotions
       axios.all([
        axios.get(`https://aes.quickbase.com/db/bkq96b4w5?a=API_DoQuery&query={28.EX.${recId}}AND{228.EX.1}&clist=289.257.248.249.251.252.242.243.12.28.23.11.172.6.15.219&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
        axios.get(`https://aes.quickbase.com/db/bkry2fqtb?a=API_DoQuery&query={7.EX.${recId}}AND{162.EX.1}AND{195.EX.1}&clist=195.7.73.160.154&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
        axios.get(`https://aes.quickbase.com/db/bkr6akjie?a=API_DoQuery&query={132.EX.${propRecId}}AND{225.EX.1}&clist=64.23.11.172.6.15.219&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`),
        axios.get(`https://aes.quickbase.com/db/bkdfitsjr?a=API_DoQuery&query={66.EX.${propRecId}}AND{68.EX.1}&clist=6.68.69&apptoken=${QB.QB_API_KEY}&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`)
      ])
      .catch(err => console.log(err))
      .then(axios.spread((array, cost, promo, doc) => {
       arrays = getJsonData(array.data)
       if(!arrays.length) arrays = [arrays];

        //From Arrays
        let efficiency = arrays[0].product_record___manufacturer === "SunPower" ? "High" : "Standard";
        let moduleType = arrays[0].product_record___model_number;
        let specSheet = arrays[0].related_product_record__module_pricing____spec_sheet_link;
        let manufacturer = arrays[0].product_record___manufacturer;
        let moduleWarrantyText = arrays[0].module_warranty_text;
        let monitoringWarrantyText = arrays[0].monitoring_warranty_text
        let workmanshipWarrantyText = arrays[0].workmanship_warranty_text;
        let inverterWarrantyText = arrays[0].inverter_warranty_text__f_;
        
        for(var i=0; i<compareArray.length; i++){
          if(compareArray[i].recId === recId){
            compareArray[i].warranty = {moduleWarrantyText, monitoringWarrantyText, workmanshipWarrantyText, inverterWarrantyText}
          }
        }
     
        //Cost Adders
        costAdders = getJsonData(cost.data)
        if(costAdders !== undefined && !costAdders.length){
          costAdders = [costAdders]
        }else{
          costAdders = costAdders
        }
        
        let hasCostAdders = costAdders !== undefined ? true : false;
        //Promotions & Has Promotions Variable
        promotions = getJsonData(promo.data)
        if(promotions !== undefined && !promotions.length){
          promotions = [promotions]
        }else{
          promotions = promotions
        }
        let hasPromotion = promotions !== undefined ? true : false;
        let included = hasPromotion !== false ? true : hasCostAdders !== false ? true : false;

        //Documents
        documents = getJsonData(doc.data)
        if(documents){
          maxFitPhoto = documents.document_link
        }else{
          maxFitPhoto = '';
        }
        //Push To Global Finished Array
        finishedArray.push(proposal = { proposal, arrays, costAdders, included, promotions: promotions, pricesArray, disclaimerContent, currentPathArrays, moduleType, manufacturer, efficiency, percentOffset, percentLeft, recId: recId, OppRecId: OppRecId, customerNameF: customerNameF, moduleWarrantyText, monitoringWarrantyText, workmanshipWarrantyText, maxFitPhoto, totalDiscounts, totalRebates, inverterWarrantyText, specSheet },
        )
        finishedArray = finishedArray.sort(function(a,b) {return (a.proposal.proposal_title > b.proposal.proposal_title) ? 1 : (a.proposal.proposal_title > b.proposal.proposal_title) ? -1 : 0 });
       
      }))
      .then(() => {
        itemsProcessed++
        if(itemsProcessed === proposals.length){
          res.render('proposal/solar',{
            finishedArray: finishedArray,
            compareArray: compareArray,
            opportunity: opportunity,
            customerNameProp: customerNameProp,
            agentPhoto: agentPhoto,
            agentName: agentName,
            agentEmail: agentEmail,
            agentPhone: agentPhone,
            agentBio: agentBio,
            standardEfficiencyPhoto: standardEfficiencyPhoto,
            highEfficiencyPhoto, highEfficiencyPhoto,
            pageOneContent: pageOneContent,
            pageTwoContent: pageTwoContent,
            pageThreeContent: pageThreeContent,
            hasBattery: hasBattery,
            currentPath: currentPathArrays[0]
          })
        }
      })

      //End Of ForEach *********************************************************************************************
    })
  }
   
  }

  if(!recId || !customerNameF){
    res.send("Missing Customer Information. Please make sure 'Include In Proposal Report' is checked.")
  }else{
    getOpportunity(recId)
  }
  
})
//Get Solar Proposal Stay OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

module.exports = router 