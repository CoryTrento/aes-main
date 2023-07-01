const moment = require("moment");

const USAGE_VS_PRODUCTION = (reading, price) => {
  const meters = [];

  reading = reading.sort((a, b) => a._fid_14 - b._fid_14);
  // Sort Meters And Push to Array
  reading.forEach(read => {
    if (meters.map(e => e.meter_name).indexOf(read._fid_19) === -1) {
      meters.push({
        price_title: price._fid_6,
        meter_name: read._fid_19,
        canvas_id: price._fid_349,
        meter_usage: {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0
        },
        meter_cost: {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0
        },
        system_production: {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0
        },
        month_offset: {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0
        },
        month_saving: {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0
        }
      });
    }
  });

  // Add Meter Usage
  reading.forEach(read => {
    if (meters.map(e => e.meter_name).indexOf(read._fid_19) !== -1) {
      const meter_index = meters.map(e => e.meter_name).indexOf(read._fid_19);
      const day = moment(Number(read._fid_14)).format("DD");
      let month = moment(Number(read._fid_14)).format("MMMM");

      // if (Number(day) >= 29 && read._fid_11 !== "Estimation") {
      //   month = moment(Number(read._fid_14))
      //     .add(2, "days")
      //     .format("MMMM");
      // }

      const usage_increase =
        price._fid_591 !== undefined
          ? Number(read._fid_7) * Number(price._fid_591)
          : 0;
      const bill_increase =
        price._fid_591 !== undefined
          ? Number(read._fid_8) * Number(price._fid_591)
          : 0;

      meters[meter_index].meter_usage[month] =
        Number(read._fid_7) + usage_increase;

      meters[meter_index].meter_cost[month] =
        Number(read._fid_8) + bill_increase;

      if (month === "January") {
        meters[meter_index].system_production[month] = Number(price._fid_267);
      }
      if (month === "February") {
        meters[meter_index].system_production[month] = Number(price._fid_268);
      }
      if (month === "March") {
        meters[meter_index].system_production[month] = Number(price._fid_269);
      }
      if (month === "April") {
        meters[meter_index].system_production[month] = Number(price._fid_270);
      }
      if (month === "May") {
        meters[meter_index].system_production[month] = Number(price._fid_271);
      }
      if (month === "June") {
        meters[meter_index].system_production[month] = Number(price._fid_273);
      }
      if (month === "July") {
        meters[meter_index].system_production[month] = Number(price._fid_272);
      }
      if (month === "August") {
        meters[meter_index].system_production[month] = Number(price._fid_274);
      }
      if (month === "September") {
        meters[meter_index].system_production[month] = Number(price._fid_275);
      }
      if (month === "October") {
        meters[meter_index].system_production[month] = Number(price._fid_276);
      }
      if (month === "November") {
        meters[meter_index].system_production[month] = Number(price._fid_277);
      }
      if (month === "December") {
        meters[meter_index].system_production[month] = Number(price._fid_266);
      }
    }
  });

  // Month Offset
  meters.forEach(read => {
    for (month in read.meter_usage) {
      const usage = read.meter_usage[month];
      const production = read.system_production[month];
      read.month_offset[month] = usage - production;
    }
  });

  // Offset Value
  meters.forEach(read => {
    for (month in read.meter_usage) {
      const key = month;
      const usage = read.meter_usage[month];
      const cost = read.meter_cost[month];
      const kwHr = cost / usage;
      const offset_value = read.month_offset[month] * kwHr;
      read.month_saving[key] = offset_value;
    }
  });
  return meters;
};

module.exports = {
  USAGE_VS_PRODUCTION
};
