module.exports = {
  barChart: function(usage, production, id){
    let calendarName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let difference = []
    for(var i=0; i<usage.length; i++){
      let color;
      let minus = usage[i] - production[i]
      if(minus<0){
        color = 'rgb(121, 194, 112)'
      }else if(minus>=0){
        color = 'rgb(255, 95, 95)'
      }
      minus = minus.toFixed(2)
      difference.push({name: calendarName[i], produce: minus, id: id, color: color})
    }
    difference.push({usage: usage})
    
    return difference
  }
}