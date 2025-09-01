let debug = true;
if(!debug){console.log = function () {};}


let IPcountryCode = "";
let formValidated = true;


function dynamicSort(property) {
  var sortOrder = 1;


  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }


  return function (a, b) {
    return sortOrder === -1
      ? b[property].localeCompare(a[property])
      : a[property].localeCompare(b[property]);
  };
}
document.querySelectorAll('input[type="tel"]').forEach((el,k)=>{
  el.addEventListener('input', function() {
    el.value = el.value.replace(/[^0-9]/g, '');
  })
  })
const emailElement = document.getElementById("email");
if (localStorage.getItem("resEmail") && emailElement) {
  emailElement.value = localStorage.getItem("resEmail");
}
// General function to show email error messages + manage formValidated flag
function showEmailError(message) {
  const emailErrorElement = document.getElementById("email-error");


  if (message) {
    emailErrorElement.style.display = "block";
    emailErrorElement.innerText = message;
    formValidated = false;
  } else {
    emailErrorElement.style.display = "none";
    formValidated = true;
  }
}


// Function to validate email using CodeJudge API (with PUT method)
async function validateWithCodeJudge(email) {
  const response = await fetch(
    `https://work.codejudge.io/api/validate-email/?email=${encodeURIComponent(email)}&corp_email_only=True`,
   {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );


  if (!response.ok) throw new Error("CodeJudge API failed");


  const data = await response.json();


  if (!data.response && data.email_valid && data.corporate_email_valid === false) {
    showEmailError("Please enter a valid company or business email address.");
  } else if (!data.response || !data.email_valid) {
    showEmailError("Please enter a valid company or business email address.");
  } else if (data.response && data.email_valid && data.corporate_email_valid) {
    showEmailError(""); // Clear error
  } else {
    throw new Error("Unexpected response format");
  }
}


// Function to validate email using HubSpot API (fallback)
async function validateWithHubSpot(email) {
  const response = await fetch(
    "https://forms.hsforms.com/emailcheck/v1/json-ext?portalId=8552073&includeFreemailSuggestions=false",
    {
      method: "POST",
      body: email,
    }
  );


  if (!response.ok) throw new Error("HubSpot API failed");


  const data = await response.json();


  if (data.emailFree) {
    showEmailError("Please enter a valid company or business email address.");
  } else {
    showEmailError(""); // No error
  }
}


// Main function
async function checkEmailValidity(email) {
  try {
    await validateWithCodeJudge(email);
  } catch (error) {
    console.warn("CodeJudge API failed, trying HubSpot fallback:", error);
    try {
      await validateWithHubSpot(email);
    } catch (fallbackError) {
      console.error("Both APIs failed:", fallbackError);
      showEmailError("An error occurred. Please try again.");
    }
  }


  return formValidated;
}


emailElement.addEventListener("focusout", (event) => {
    checkEmailValidity(event.target.value)
  });


  function setDefaultSelectOption(selectId, defaultText) {
    const selectElement = document.getElementById(selectId);
    if (selectElement) {
      const defaultOption = new Option(defaultText, "");
      defaultOption.setAttribute("selected", "true");
      defaultOption.setAttribute("disabled", "true");
      selectElement.options[0] = defaultOption;
    }
  }
  
  // Usage:
  setDefaultSelectOption("number_of_remote_hires", "Number of hires");
  setDefaultSelectOption("how_can_we_help_you_new-input", "How can we help you?");
  setDefaultSelectOption("company_size", "Company size");


let countries = [];
let countryCodeSelect = document.getElementById("phone-code-dropdown");
let countryInput = document.querySelector('input[name="country"]');
let countryName       = document.getElementById("countries_you_want_to_enroll");


// Function to set options for the country code select element
const setCountryCodeOptions = (countryList) => {
    let option1 = new Option("Select Country Code", "");
    let countryLoading = document.querySelector('.country-loading');
    countryCodeSelect.options[0] = option1;
    option1.setAttribute("selected", "true");
    option1.setAttribute("disabled", "true");
  
    for (let j = 0; j < countryList.length; j++) {
      let x = `${countryList[j].label} (${countryList[j].dial_code})`;
      countryCodeSelect.options[countryCodeSelect.options.length] = new Option(x, countryList[j].dial_code);
    }
    countryCodeSelect.value = "+1";
    if(countryList && countryLoading){
      countryLoading.style.display='none';
    }
  };


// Use async/await for fetching country list
const fetchCountryList = async () => {
    try {
      const response = await fetch(
        "https://storage.googleapis.com/skuad-public-assets/country-list.json"
      );
      const res = await response.json();
      countries = res.countryList;


  if (countryCodeSelect) {
    setCountryCodeOptions(res.countryList);
  }
    console.log(countries,'countries');


   let countryList2 = res.countryList;
   countryList2.sort(dynamicSort("label"));
   let other = {label: 'Others', dial_code: '', value: 'Others'};
   countryList2.push(other);
   console.log(countryList2);
  if (countryName) {
    countryName.innerHTML = countryList2.map(arr => `<option value="${arr.label}">${arr.label}</option>`).join('');
        
          if(typeof countryName.loadOptions === 'function'){
            countryName.loadOptions();
          }  
         
  }
  
      // Rest of the code for populating country dropdowns
    } catch (error) {
      console.error("Error fetching country list:", error);
    }
  };
  
  // Call the fetchCountryList function
  fetchCountryList();


// Use async/await for fetching IP info
const fetchIpInfo = async () => {
    try {
      const response = await fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=c23115da6cf642e59b96f32b9d512a4c");
      const result = await response.json();
  
      if (result?.country) {
        countryInput.value = result.country.name;
        IPcountryCode = result.country.iso_code;
        countryCodeSelect.value = "+" + result.country.phone_code;
      }
    } catch (error) {
      console.error("Error fetching IP info:", error);
    }
  };
  
  // Call the fetchIpInfo function
  fetchIpInfo();


  countryCodeSelect.addEventListener("change", function () {
    const selectedText = countryCodeSelect.options[countryCodeSelect.selectedIndex].text;
    
    // Remove anything inside parentheses and trim whitespace
    const cleanLabel = selectedText.replace(/\s*\(.*?\)\s*/g, "").trim();
  
    if (countryInput) {
      countryInput.value = cleanLabel;
    }
  });
  
 
const _submitHubspotForm = (formData, countryCode, portalId, formId, callback) => {
  const submitBtn = document.getElementById("request_demo_submit-btn");
  submitBtn.value = "Please wait...";
  submitBtn.disabled = true;
    delete formData["phone-code"];
    delete formData["ld_field"];


    if($('#how_can_we_help_you_new-input').val() == 'Other'){
      delete formData["how_can_we_help_you_new"];
   }
    
   /*if(typeof growsumo !== 'undefined' && growsumo){
    if (growsumo && growsumo.data && growsumo.data.partner_key) {
     formData.partnerstack_partner_key = growsumo.data.partner_key;
    }
   }*/


    let dataJson = {
      submittedAt: new Date().getTime(),
      fields: [],
      context: {
        hutk: getCookie("hubspotutk"),
        pageUri: window.location.href,
        pageName: document.title,
      }
    };
      
    let i = 0;
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        dataJson.fields[i] = {
          objectTypeId: "0-1",
          name: key,
          value: formData[key]
        };
        i++;
      }
    }


   /*if (typeof growsumo !== 'undefined' && growsumo) {
    partnerStackSignUp();
    }
  */


   console.log(dataJson.fields,'dataJson');
   
  let objIndex = dataJson.fields.findIndex((obj => obj.name == "countries_you_want_to_enroll"));
   console.log(objIndex,objIndex)
  
   if(objIndex!==-1)
   {
       dataJson.fields[objIndex].value = $('#countries_you_want_to_enroll').val().toString();
   }
    
    console.log(dataJson.fields,'dataJson');
    
     fetch(
     `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
     {
     headers: {
       Accept: "application/json",
       "Content-Type": "application/json"
       },
     method: "POST",
       body: JSON.stringify(dataJson)
     })
     .then((res) => res.json())
     .then((data) => {
       submitBtn.value = "Submit";
       if (data.inlineMessage) {
           localStorage.setItem("skuadSignupFormData", JSON.stringify({...formData, countryCode}));
             $('.request-demo-form-wrapper-new').addClass('hide');
             $('.ebook-content').removeClass('hide');
         }
       else if (data.status === 'error' && data.errors[0].errorType === "BLOCKED_EMAIL") {
         document.getElementById("email-error").style.display = "block";
         document.getElementById("email-error").innerText="Please enter a valid company or business email address.";
       }
       else if (data.status === 'error' && data.errors[0].errorType === "INVALID_EMAIL") {
         document.getElementById("email-error").style.display = "block";
         document.getElementById("email-error").innerText="Please enter a valid company or business email address.";
       }
       else if (data.status === 'error' && data.errors[0].errorType === "NUMBER_OUT_OF_RANGE") {
         document.getElementById("phone-error").style.display = "block";
         document.getElementById("phone-error").innerText="Please enter valid phone number";
       }
     })
     .catch((error) => {
       submitBtn.value = "Submit";
       submitBtn.disabled = false;
     });
   }


const hubspotOnSubmit = (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  let formData = Object.fromEntries(data.entries());
  const countryCode = IPcountryCode || countries.find(
    (country) => country.dial_code === formData["phone-code"]
  )?.value;
  formData.phone = formData["phone-code"] + formData.phone;


  checkEmailValidity(formData.email)
    .then(() => {
      if (formValidated) {
        _submitHubspotForm(formData, countryCode, "8552073", "2b4e05d0-d685-4929-b37c-f961d7db9de5");
      }
    })
   document.getElementById("request-demo-api-form").style.display="block";
  document.getElementById("hubspot-form-success").style.display="none";
  document.getElementById("hubspot-form-error").style.display="none";
}


 document.getElementById("request-demo-api-form").addEventListener("submit", hubspotOnSubmit);
document.getElementById("request-demo-api-form").addEventListener("change", (e) => {
  if (document.getElementById(e.target.name + "-error")) {
    document.getElementById(e.target.name + "-error").style.display = "none";
  }
  if (e.target.name === 'email') {
    formValidated = true;
  }
});
