
const To_Dash = (class_selector) => {
  
  const select = $(class_selector);

  select.each((index, value) => {
    console.log(index, value)
    let valueToText = value.innerHTML.replace('$', "");
    if(valueToText === "NaN"){
      valueToText = 0;
    }
    
    let valueAmount = Number(valueToText) * 10;
  
    if(valueAmount === 0){
      value.innerHTML = '-'
    }
  })
}

//Cash To Dash
To_Dash('.CashToDash');

//Loan To Dash
To_Dash('.LoanToDash');

//Lease To Dash
To_Dash('.LeaseToDash');

//Solution To Dash
To_Dash('.solutionLoanToDash');


//Function to hide values in comparison table if there is not value.
const Hide_If_Zero = (hideId, amountClass) => {
  
  let hide = true;
  const amount_value = $(amountClass);

  amount_value.each((index, value) => {
    let amount = value.innerText.replace("$", "").replace(",", "")  
    amount = Number(amount)
    
    if(amount > 0){
      hide = false
    }
  })

  if(hide === true){
    $(hideId).hide()
  }
}

//Hide Balloon
Hide_If_Zero('.hideBalloonIfNoBalloon', '.balloonAmount');

//Hide Referral
Hide_If_Zero('.hideReferralIfNoPromo', '.referralAmount');

//Hide Rebate
Hide_If_Zero('.hideRebateIfNoPromo', '.rebateAmount');

//Hide Discount
Hide_If_Zero('.hideDiscountIfNoPromo', '.discountAmount');

//Hide Promotion
Hide_If_Zero('.hidePromoIfNoPromo', '.promoAmount');