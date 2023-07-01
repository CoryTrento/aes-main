module.exports = (month, name) => {

  const monthTotal = {
    name: name,
    am12: 0,
    am1: 0,
    am2: 0,
    am3: 0,
    am4: 0,
    am5: 0,
    am6: 0,
    am7: 0,
    am8: 0,
    am9: 0,
    am10: 0,
    am11: 0,
    pm12: 0,
    pm1: 0,
    pm2: 0,
    pm3: 0,
    pm4: 0,
    pm5: 0,
    pm6: 0,
    pm7: 0,
    pm8: 0,
    pm9: 0,
    pm10: 0,
    pm11: 0,
    total: 0
  }
  month.forEach(day => {
    day.forEach((hour, i) => {
      hour = hour / 1000

      monthTotal.total += hour
      if (i === 0) 
        monthTotal.am12 += hour
      if (i === 1) 
        monthTotal.am1 += hour
      if (i === 2) 
        monthTotal.am2 += hour
      if (i === 3) 
        monthTotal.am3 += hour
      if (i === 4) 
        monthTotal.am4 += hour
      if (i === 5) 
        monthTotal.am5 += hour
      if (i === 6) 
        monthTotal.am6 += hour
      if (i === 7) 
        monthTotal.am7 += hour
      if (i === 8) 
        monthTotal.am8 += hour
      if (i === 9) 
        monthTotal.am9 += hour
      if (i === 10) 
        monthTotal.am10 += hour
      if (i === 11) 
        monthTotal.am11 += hour

      if (i === 12) 
        monthTotal.pm12 += hour
      if (i === 13) 
        monthTotal.pm1 += hour
      if (i === 14) 
        monthTotal.pm2 += hour
      if (i === 15) 
        monthTotal.pm3 += hour
      if (i === 16) 
        monthTotal.pm4 += hour
      if (i === 17) 
        monthTotal.pm5 += hour
      if (i === 18) 
        monthTotal.pm6 += hour
      if (i === 19) 
        monthTotal.pm7 += hour
      if (i === 20) 
        monthTotal.pm8 += hour
      if (i === 21) 
        monthTotal.pm9 += hour
      if (i === 22) 
        monthTotal.pm10 += hour
      if (i === 23) 
        monthTotal.pm11 += hour

    })
  })

  return monthTotal
}