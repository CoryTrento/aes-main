const express = require("express");
const router = express.Router();
const axios = require("axios");

//QuickBase Variables
const QB = require("../../config/quickbase");

//JSON to XML function
const { getJsonData } = require("../../helpers/getJson");
const { formatParagraph } = require("../../helpers/formatContent");

router.get("/solar", (req, res) => {
  const recId = req.query.recId;
  const customerNameF = req.query.name;
  if (!recId || !customerNameF) {
    res.send({
      Error: "No id or name"
    });
  } else {
    let content, proposal, arrays, costAdders;
    let Warranty,
      CustomerAddress,
      ProjectLocation,
      CashOrFinanced,
      SystemSize,
      ModuleQuantity,
      ModuleType,
      financedPrice,
      contribution,
      ContractNotes;
    let contractObj, priceObj;
    let hideCostAdder;
    let Warning;

    //Get Contract Content
    //console.log(recId)
    const getContract = async id => {
      const contentGet = await axios(
        `https://aes.quickbase.com/db/bnyi4n2cv?a=API_DoQuery&query={6.EX.Solar Contract}AND{76.EX.1}&clist=6.7.8.9.10.11.12.13.14.31&useFids=0&apptoken=${
          QB.QB_API_KEY
        }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
      );
      content = await getJsonData(contentGet.data);
      axios
        .all([
          axios.get(
            `https://aes.quickbase.com/db/bkqrxt547?a=API_DoQuery&query={3.EX.${recId}}AND{326.CT.${customerNameF}}&clist=175.447.589.591.801.782.362.713.482.496.385.486.525.523.524.526.502.111.112.487.390.326.1384.1385&apptoken=${
              QB.QB_API_KEY
            }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
          ),
          axios.get(
            `https://aes.quickbase.com/db/bkq96b4w5?a=API_DoQuery&query={28.EX.${recId}}&clist=11&apptoken=${
              QB.QB_API_KEY
            }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
          ),
          axios.get(
            `https://aes.quickbase.com/db/bkry2fqtb?a=API_DoQuery&query={7.EX.${recId}}&clist=160.73&apptoken=${
              QB.QB_API_KEY
            }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
          )
        ])
        .catch(err => console.log(err))
        .then(
          axios.spread((proposalJSON, arraysJSON, costAddersJSON) => {
            //Proposal Information
            proposal = getJsonData(proposalJSON.data);
            Warranty =
              proposal.related_variable___system_string_type___warranty_terms;
            Warning =
              proposal.lock_proposal !== 1
                ? "Warning! <br> This proposal is not locked"
                : "";
            let CustomerName =
              proposal.name_for_contract !== ""
                ? proposal.name_for_contract
                : proposal.project_record___name__f_;
            let SpousesName = proposal.spouse_s_name;
            NameForContract =
              SpousesName === ""
                ? `${CustomerName},`
                : `${CustomerName} and ${SpousesName},`;
            CustomerAddress =
              proposal.project_record___lead___potential_job_address !== ""
                ? proposal.project_record___lead___potential_job_address
                : proposal.project_record___project_address;
            ProjectLocation =
              proposal.project_record___project_address !== ""
                ? proposal.project_record___project_address
                : proposal.project_record___lead___potential_job_address;
            SystemSize = proposal.system_dc_kw_array_total;
            CashOrFinanced = proposal.payment_method;
            ModuleQuantity = proposal.total_panel_quantity;
            ContractNotes = formatParagraph(proposal.contract_notes);
            contribution = Number(proposal.customer_contribution_portion);
            if (proposal.variable_name___financing_institution === "Sunpower") {
              financedPrice = Number(proposal.sunpower_loan_amount_from_portal);
            } else {
              financedPrice = Number(proposal.financed_price__at_lock_);
            }

            if (CashOrFinanced === "Cash") {
              priceObj = {
                name: CashOrFinanced,
                price: proposal.cash_price_at_lock,
                deposit: proposal.cash_deposit__f_,
                uponWork: proposal.commencement_of_work_amount__f_,
                uponInstallation:
                  proposal.commencement_of_panel_installation__f_,
                balanceDue: proposal.balance_upon_completion_amount__f_
              };
            } else if (CashOrFinanced === "Loan") {
              priceObj = {
                name: CashOrFinanced,
                price: financedPrice,
                contribution: contribution
              };
            }

            //Array Information
            arrays = getJsonData(arraysJSON.data);
            if (!arrays.length) {
              arrays = [arrays];
            } else {
              arrays = arrays;
            }
            ModuleType = arrays[0].product_record___model_number;

            //Cost Adder Information
            if (proposal.___of_work_efforts !== 0) {
              costAdders = getJsonData(costAddersJSON.data);
              if (!costAdders.length) {
                costAdders = [costAdders];
              } else {
                costAdders = costAdders;
              }
            } else {
              costAdders = [
                {
                  hide: true
                }
              ];
            }

            contractObj = {
              CustomerName: NameForContract,
              CustomerAddress: CustomerAddress,
              ProjectLocation: ProjectLocation,
              CashOrFinanced: CashOrFinanced,
              SystemSize: SystemSize,
              ModuleQuantity: ModuleQuantity,
              ModuleType: ModuleType,
              priceObj: priceObj,
              costAdders: costAdders,
              ContractNotes: ContractNotes,
              Warranty: Warranty
            };

            //console.log(content)
            //console.log(proposal)
            //console.log(costAdders)
          })
        )
        .catch(err => console.log(err))
        .then(() => {
          res.render("content/solarContract", {
            content: content,
            contractObj: contractObj,
            contribution: contribution,
            CashOrFinanced: CashOrFinanced,
            hideCostAdder: hideCostAdder,
            ContractNotes: ContractNotes,
            Warning: Warning,
            recId: recId
          });
        });
    };
    //Get Promotions / Arrays / Cost Adders
    getContract(recId);
  }
});

router.get("/non-solar", (req, res) => {
  const id = req.query.id;
  let content, proposal, costAdders;
  var Warning, CustomerName, SpousesName, ProjectLocation, financedPrice;
  let priceObj;
  if (!id) {
    res.send({
      Error: "No id"
    });
  } else {
    const getNonSolarContract = async id => {
      const contentGet = await axios(
        `https://aes.quickbase.com/db/bnyi4n2cv?a=API_DoQuery&query={6.EX.Non Solar Contract}AND{76.EX.1}&clist=6.7.8.9.10.11.12.13.14.31&useFids=0&apptoken=${
          QB.QB_API_KEY
        }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
      );
      content = await getJsonData(contentGet.data);

      //Add later AND{326.CT.${customerNameF}}
      axios
        .all([
          axios.get(
            `https://aes.quickbase.com/db/bkqrxt547?a=API_DoQuery&query={3.EX.${id}}&clist=175.447.589.591.801.782.362.713.482.496.385.486.525.523.524.526.502.111.112.487.390.326.1384.1385&apptoken=${
              QB.QB_API_KEY
            }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
          ),
          axios.get(
            `https://aes.quickbase.com/db/bkry2fqtb?a=API_DoQuery&query={7.EX.${id}}&clist=160.73&apptoken=${
              QB.QB_API_KEY
            }&username=${QB.QB_LOGIN}&password=${QB.QB_PASSWORD}`
          )
        ])
        .catch(err => console.log(err))
        .then(
          axios.spread((proposalJSON, costAddersJSON) => {
            //Proposal Information
            proposal = getJsonData(proposalJSON.data);
            console.log('hit', proposal);
            Warning =
              proposal.lock_proposal !== 1
                ? "Warning! <br> This proposal is not locked"
                : "";
            CustomerName =
              proposal.name_for_contract !== ""
                ? proposal.name_for_contract
                : proposal.project_record___name__f_;
            CustomerAddress =
              proposal.project_record___lead___potential_job_address !== ""
                ? proposal.project_record___lead___potential_job_address
                : proposal.project_record___project_address;
            SpousesName = proposal.spouse_s_name;
            NameForContract =
              SpousesName === ""
                ? `${CustomerName},`
                : `${CustomerName} and ${SpousesName},`;
            ProjectLocation =
              proposal.project_record___project_address !== ""
                ? proposal.project_record___project_address
                : proposal.project_record___lead___potential_job_address;
            ContractNotes = formatParagraph(proposal.contract_notes);

            CashOrFinanced = proposal.payment_method;
            contribution = Number(proposal.customer_contribution_portion);
            if (proposal.variable_name___financing_institution === "Sunpower") {
              financedPrice = Number(proposal.sunpower_loan_amount_from_portal);
            } else {
              financedPrice = Number(proposal.financed_price__at_lock_);
            }

            //Price Info
            if (CashOrFinanced === "Cash") {
              priceObj = {
                name: CashOrFinanced,
                price: proposal.cash_price_at_lock,
                deposit: proposal.cash_deposit__f_,
                uponWork: proposal.commencement_of_work_amount__f_,
                uponInstallation:
                  proposal.commencement_of_panel_installation__f_,
                balanceDue: proposal.balance_upon_completion_amount__f_
              };
            } else if (CashOrFinanced === "Loan") {
              priceObj = {
                name: CashOrFinanced,
                price: financedPrice,
                contribution: contribution
              };
            }
            //Cost Adder Information
            if (proposal.___of_work_efforts !== 0) {
              costAdders = getJsonData(costAddersJSON.data);
              if (!costAdders.length) {
                costAdders = [costAdders];
              } else {
                costAdders = costAdders;
              }
            } else {
              costAdders = [
                {
                  hide: true
                }
              ];
            }

            contractObj = {
              CustomerName: NameForContract,
              CustomerAddress: CustomerAddress,
              ProjectLocation: ProjectLocation,
              CashOrFinanced: CashOrFinanced,
              priceObj: priceObj,
              costAdders: costAdders,
              ContractNotes: ContractNotes,
              start: null,
              end: null
            };
            // console.log(proposal)
            // console.log(contractObj)
          })
        )
        .catch(err => console.log(err))
        .then(() => {
          res.render("content/nonSolarContract", {
            content: content,
            contractObj: contractObj,
            ContractNotes: ContractNotes,
            Warning: Warning,
            CashOrFinanced,
            contribution: contribution,
            recId: id
          });
        });
    };
    getNonSolarContract(id);
  }
});

module.exports = router;
