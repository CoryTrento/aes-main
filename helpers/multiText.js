module.exports = {
  ToTextArray: (MultiText) => {
    if(MultiText){
      MultiText = MultiText.split(";")
      MultiText.forEach((word, index) => MultiText[index] = word.trim() )
    }else{
      MultiText = [];
    }
    return MultiText
  }
}