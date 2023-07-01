
const navItems = $(".nav-link");
const proposal = $('.proposal');
const compareList = $('.compareList');
const checkBox = $('.form-check-input');
const removeBtn = $('.removeBtn');
const compareAnchor = $('.compareAnchor');
const compareNav = document.getElementById('compareNav');
//Nav Buttons and View Comparison Button
navItems.on('click', (e) => {
  
  let id = e.target.dataset.id
  $(".navbar-collapse").collapse('hide');
  navItems.each((index, value) => {
    value.classList = "nav-link"
  })
  proposal.each((each, value) => {
    value.classList = "proposal d-none d-print-block"
  
    if (value.id === id) {
      value.classList = "proposal d-print-block"
    }
  })
  
  if(e.target.dataset.thebutton === "true"){
    compareNav.classList = "nav-link active"
    e.target.classList = "btn btn-primary text-white compareButton"
  }else{
    e.target.classList = "nav-link active"
  }
           
  window.scrollTo(0, 0);

  
})

//Hide All Li's
compareList.each((each, li) => {
  $(li).hide()
  $('#compareNav').hide()
})

//If QB Is Checked Show Li
checkBox.each((index, check) => {
if(check.checked === true){
    const id = check.dataset.id
    const targetLi = document.getElementsByClassName(id)
    $(targetLi).show()
    $('#compareNav').show()
  }
})

//Checkbox click event
checkBox.on('click', (e) => {
  const id = e.target.dataset.id

  const targetLi = document.getElementsByClassName(id)
  
  if(e.target.checked === true){
    $('#compareNav').show()
   
    $(targetLi).show()
    e.target.checked = true;
  }else{
    $(targetLi).hide();
    e.target.checked = false;
  }
})

compareAnchor.on('click', (e) => {

  const targetId = e.target.dataset.id;
  proposal.each((index, prop) => {

  let propId = prop.id;
  prop.classList = "proposal d-none d-print-block";
  
    if (propId === targetId) {
      prop.classList = "proposal d-print-block"
    }
  })
  navItems.each((index, nav) => {
   
    const navId = nav.dataset.id
    nav.classList = "nav-link"
    if(navId === targetId){
      
      nav.classList = "nav-link active"
    }
  })
})

//Remove BTN event
removeBtn.on('click', (e) => {
  const id = e.target.dataset.id

  const targetLi = document.getElementsByClassName(id)
  checkBox.each((index, box) => {
    if(box.dataset.id === id){
     
      $(box).removeAttr("checked")
      box.checked = false;
    }
  })
 
  $(targetLi).hide()
  
})
