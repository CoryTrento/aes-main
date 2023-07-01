module.exports = {
  formatContent: (text, page) => {
    //console.log(text)
    if(page === "page"){
      text = text.split("")
      if(text[0] === '"'){
        text[0] = text[0].replace('"',"")
      }
      if(text[text.length-1] === '"'){
        text[text.length-1] = text[text.length-1].replace('"',"")
      }
      text = text.join("")
    }

    if(page === "agentBio"){
      text = text.replace('{"#text":"','')
      text = text.replace('family.","BR":""}','')
      text = text.split("")
      if(text[0] === '"'){
        text[0] = text[0].replace('"',"")
      }
      if(text[text.length-1] === '"'){
        text[text.length-1] = text[text.length-1].replace('"',"")
      }
      text = text.join("")
    }

    return text;
  },
  formatNumber : (number) => {
    if(number === ""){
      number = 0.00
    }else{
      number = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return number
  },

  formatImage: (link) => {
    link = link.replace('/view?usp=sharing', '')
    link = link.replace('file/d/', 'uc?id=')
    return link
  },
  formatParagraph: function(string){
    if (typeof string === 'object') {
      string = JSON.stringify(string)
      string = JSON.parse(string)
      string = string["#text"]
    }
  return string
}
}