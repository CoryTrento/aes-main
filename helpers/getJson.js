
var fastXmlParser = require('fast-xml-parser');

module.exports = {
  getJsonData: function (xml, type) {
    let data = [];
    var jsonObj = fastXmlParser.parse(xml);
    
    data = jsonObj.qdbapi.record
    
    return data
 }

}