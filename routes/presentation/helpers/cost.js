module.exports = {
  CREATE_COST: price => {
    const return_array = [];

    const global_obj = {
      title: price._fid_6,
      num_of_modules: price._fid_73,
      dc_kw: price._fid_74,
      annual: price._fid_336,
      percent_offset: price._fid_352,
      module_warranty: price._fid_374,
      monitoring_warranty: price._fid_375,
      inverter_warranty: price._fid_377
    };

    // The Objects
    const cash_obj = {
      ...global_obj,
      id: price._fid_386,
      compare: price._fid_338,
      name: "Cash",
      price: price._fid_235,
      tax_credit: price._fid_355,
      net_price: price._fid_358,
      repayment: price._fid_361,
      monthly_payment: price._fid_364,
      kWh_25yr: price._fid_402,
      cost_25yr: "",
      saving_25yr: price._fid_405
    };
    if (Number(price._fid_341) === 0 && Number(price._fid_235) > 0)
      return_array.push(cash_obj);

    const loan_obj = {
      ...global_obj,
      id: price._fid_387,
      compare: price._fid_340,
      name: price._fid_519,
      price: price._fid_257,
      tax_credit: price._fid_356,
      net_price: price._fid_359,
      repayment: price._fid_362,
      monthly_payment: price._fid_365,
      kWh_25yr: price._fid_403,
      cost_25yr: "",
      saving_25yr: price._fid_406
    };
    if (Number(price._fid_257) > 0) return_array.push(loan_obj);

    const lease_obj = {
      ...global_obj,
      id: price._fid_388,
      compare: price._fid_339,
      name: "Lease",
      price: 0,
      tax_credit: price._fid_357,
      net_price: price._fid_360,
      repayment: price._fid_363,
      monthly_payment: price._fid_366,
      kWh_25yr: price._fid_404,
      cost_25yr: "",
      saving_25yr: price._fid_407
    };
    if (Number(price._fid_366) > 0) return_array.push(lease_obj);
    return return_array;
  }
};
