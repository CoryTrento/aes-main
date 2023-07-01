const sumMonth = require('./sumMonths')

module.exports = async(production) => {
  try {
    var holderArr = [];
    var january = 31;
    var janCal = [];
    var feb = january + 28;
    var febCal = [];
    var march = feb + 31;
    var marCal = [];
    var april = march + 30;
    var aprCal = [];
    var may = april + 31;
    var mayCal = [];
    var june = may + 30;
    var junCal = [];
    var july = june + 31;
    var julCal = [];
    var august = july + 31;
    var augCal = [];
    var september = august + 30;
    var sepCal = [];
    var october = september + 31;
    var octCal = [];
    var november = october + 30;
    var novCal = [];
    var december = november + 31;
    var decCal = [];

    var hours = production.outputs.ac;

    for (var i = 0; i < hours.length; i += 24) {
      holderArr.push(hours.slice(i, i + 24));
    }

    //Get January
    for (var i = 0; i < january; i++) {
      janCal.push(holderArr[i]);
    }

    //Get February
    for (var i = january; i < feb; i++) {
      febCal.push(holderArr[i]);
    }
    //Get March
    for (var i = feb; i < march; i++) {
      marCal.push(holderArr[i]);
    }
    //Get April
    for (var i = march; i < april; i++) {
      aprCal.push(holderArr[i]);
    }
    //Get May
    for (var i = april; i < may; i++) {
      mayCal.push(holderArr[i]);
    }
    //Get June
    for (var i = may; i < june; i++) {
      junCal.push(holderArr[i]);
    }
    //Get July
    for (var i = june; i < july; i++) {
      julCal.push(holderArr[i]);
    }
    //Get August
    for (var i = july; i < august; i++) {
      augCal.push(holderArr[i]);
    }
    //Get September
    for (var i = august; i < september; i++) {
      sepCal.push(holderArr[i]);
    }
    //Get October
    for (var i = september; i < october; i++) {
      octCal.push(holderArr[i]);
    }
    //Get November
    for (var i = october; i < november; i++) {
      novCal.push(holderArr[i]);
    }
    //Get December
    for (var i = november; i < december; i++) {
      decCal.push(holderArr[i]);
    }

    const options = [
      sumMonth(janCal, "January"),
      sumMonth(febCal, "February"),
      sumMonth(marCal, "March"),
      sumMonth(aprCal, "April"),
      sumMonth(mayCal, "May"),
      sumMonth(junCal, "June"),
      sumMonth(julCal, "July"),
      sumMonth(julCal, "August"),
      sumMonth(sepCal, "September"),
      sumMonth(octCal, "October"),
      sumMonth(novCal, "November"),
      sumMonth(decCal, "December")
    ]

    return options

  } catch (err) {
    return {err}
  }

}
