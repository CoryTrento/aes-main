const {formatNumber} = require('./formatContent');

module.exports = {

  currentPath : function(payment, kWh, yearCost25, yearSaving25, balloon) {
    
    let infoObj = {
      payment: payment,
      kWh: kWh,
      yearCost25: yearCost25,
      yearSaving25
    }

    return infoObj
  },

  energyFuture: function(name, payment, kWh, yearCost25, yearSaving25, gross, incentive, net, term, compare, title, breakEven, totalPromotions){
    let infoObj = {
      name: name,
      payment: payment,
      kWh: kWh,
      yearCost25: yearCost25,
      yearSaving25: yearSaving25,
      gross: gross,
      incentive: incentive,
      net: net,
      term: term,
      checked: compare,
      title: title,
      breakEven: breakEven,
      totalPromotions: totalPromotions
    }

    return infoObj
  },

  compareAll: function(recId, name, title, annualKwh, quantity, dcKw, priceInfo, percentOffset, kWhr, field, propId, oppId, oppName, moduleWarranty, microInverterWarranty, workmanshipWarranty, warranty){

    let obj = {
      recId,
      name,
      title,
      annualKwh,
      quantity,
      dcKw,
      priceInfo,
      percentOffset,
      kWhr,
      field,
      propId,
      oppId,
      oppName,
      moduleWarranty,
      microInverterWarranty,
      workmanshipWarranty,
      warranty
    }

    return obj
  }


}