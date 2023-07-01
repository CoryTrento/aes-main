const ESTIMATE = async (bill_month, bill_usage, bill_cost, bill_rate) => {
  try {
    // Sort Date
    const month = {
      available: 0,
      total_usage: 0,
      percentage: {},
      usage: {},
      cost: {}
    };

    // Check Rates
    if (bill_rate === "B")
      month.percentage = {
        January: 6.83641840951041,
        February: 6.68356566795627,
        March: 6.84281381525239,
        April: 6.81549067305164,
        May: 8.72682839382605,
        June: 11.8821572150495,
        July: 11.6318780967334,
        August: 10.8134033278432,
        September: 8.14467372344953,
        October: 6.48151895460288,
        November: 7.32307954584859,
        December: 7.81817217687608
      };
    if (bill_rate === "H")
      month.percentage = {
        January: 9.28786795117292,
        February: 8.44647455818439,
        March: 6.89362177978456,
        April: 7.04276454095506,
        May: 6.99192204073798,
        June: 8.77155950514823,
        July: 10.1294255825751,
        August: 9.71041054462029,
        September: 7.94214837555355,
        October: 6.49379407302126,
        November: 8.43777706306298,
        December: 9.8522339851837
      };

    month.available = month.percentage[bill_month];
    month.total_usage = (Number(bill_usage) / month.available) * 100;

    // Do math
    for (percent in month.percentage) {
      const key = percent;
      const percent_amount = month.percentage[key];
      const total = month.total_usage;
      month.usage[key] = Math.round((total * percent_amount) / 100);
      month.cost[key] = month.usage[key] * Number(bill_cost);
    }

    return month;
  } catch (err) {
    return err;
  }
};

module.exports = {
  ESTIMATE
};
