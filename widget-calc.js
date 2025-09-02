
import {
    checkDisabledBtn,
    createList,
    createListCurrency,
    createSalaryTemplate,
    filterList,
    // updateMeta,
    commaSeprateVal
} from " https://dl.dropboxusercontent.com/scl/fi/te4u95ynukh6p4kyce411/widget-helper.js?rlkey=nfbvw2pfbmiflji7picouahk8&st=2ghio4ld&dl=0"

let currencyList = [
    { label: "USD", value: "USD" },
    { label: "GBP", value: "GBP" },
    { label: "EUR", value: "EUR" },
];
const url = "https://cost-calculator.skuad.io/cost-calculator/active-country-list?enabled=true";
const fetchCountryData = async (url) => {
    let response = await fetch(url);
    const newVar = await response.json();
    const filteredArray = newVar.data.filter((filteredItem) => filteredItem.label && filteredItem.enabled)
    return filteredArray
};
const countryList = await fetchCountryData(url);
// console.info(countryList, 'countryList  ')
const countryListWithCurrency = countryList
createList(currencyList, "currency-list");
createListCurrency(currencyList, "currency-input");
const baseUrl = 'https://cost-calculator.skuad.io/cost-calculator/cost';
const endpoint = baseUrl + "?client=website&countryCode=:countryCode&currencyCode=:currencyCode&salary=:salary&isExpat=:isExpat&provinceCode=:provinceCode"
const countryDownArrow = document.getElementById('show-calc-country')
const form = document.getElementById("form");
const countryInput = document.getElementById("country-input");
countryInput.value = 'Loading...';
countryInput.setAttribute('disabled', '')
const currencyInput = document.getElementById("currency-input");
const currencyListEl = document.getElementById("currency-list");
const countryListEl = document.getElementById("country-list");
const grossSalaryInput = document.getElementById("gross-salary-input");
// const downloadPDFElement = document.getElementById('resp-download-pdf')
const getCountryForError = document.querySelector('.error-msg-heading')
const calculateBtn = document.getElementById("calculate-salary")
grossSalaryInput.value = 50000
const currencyCurSelect = (text, isOnLoad) => {
    const selectedCountry = countryListWithCurrency.find((country) => country.label === text)
    if (!selectedCountry) return;
    const filterdCurrencyList = currencyList.filter((currency, index) => currency.value !== selectedCountry.currValue && index < 3)
    const findedCountryCodeObj = currencyList.find((currItem) => currItem.value === selectedCountry.currValue)
    if (findedCountryCodeObj && !isOnLoad) {
        currencyList = currencyList.slice(0, 3)
        createListCurrency(currencyList, 'currency-input');
        return
    }
    currencyList = filterdCurrencyList
    currencyList.push({ label: selectedCountry.currValue, value: selectedCountry.currValue })
    createListCurrency(currencyList, 'currency-input');
}
fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=c23115da6cf642e59b96f32b9d512a4c", {
    crossDomain: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
    method: "GET",
})
    .then(response => response.json())
    .then(result => {
        countryInput.value = '';
        currencyList.push({ label: '', value: '' });
    }
    )
    .catch().finally(() => {
        let currentCountry = document.getElementById("current-country-new")
        document.getElementById("c-country-name").innerText = currentCountry.innerText
        document.getElementById("current-country-2").innerText = currentCountry.innerText

        if (currentCountry.innerText === "UAE") {
            currentCountry.innerText = "United Arab Emirates"
        } else if (currentCountry.innerText === "USA" || currentCountry.innerText === "United States") {
            currentCountry.innerText = "United States of America"
        }
        const matchedCountry = countryList.find(countryObj => {
            // console.info(countryObj.label, currentCountry.innerText, 'countryObj');
            return countryObj.label === currentCountry.innerText
        })

        // console.info('label', matchedCountry, currentCountry);
        
       if (matchedCountry){
        if (matchedCountry.label === currentCountry.innerText) {
            countryInput.removeAttribute('disabled')
            countryInput.value = matchedCountry.label;
            currencyCurSelect(matchedCountry.label)
        }
       }else{
       return
       }
        _handleSubmit()
    });

const toggleMonthYear = document.getElementById('switchMonthly');
const yearlyRadio = document.getElementById("switchYearly");
let comData = null;
const salaryData = (key = "monthly") => {
    const resData = comData[key];
    if (!resData) return;
    const categoryMeta = comData.categories;
    const accordians = categoryMeta.map(category => {
        const subCategories = category.subCategories.filter(item => item.localAmounts[`${key}Value`] && item.visibility).map(item => ({
            ...item, value: item.localAmounts[`${key}Value`]
        }))
        return ({
            ...category,
            value: category.localAmounts[`${key}Value`],
            subCategories: subCategories,
            categoryKey: category.key,
            currency: comData.currency,
        })
    })
    const visibleAccordian = accordians.filter(accordian => accordian.visibility && accordian.value)
    const employerData = visibleAccordian.filter(item => item.categoryKey.includes("employer") || item.categoryKey === "skuadFee" || item.categoryKey === 'skuadFeeDiscount');
    const employeeData = visibleAccordian.filter(item => item.categoryKey.includes("employee"))
    const grossSalary = visibleAccordian.find(item => item.categoryKey === "grossSalary")
    const dd = [
        {
            label: key === "monthly" ? "Monthly" : "Annually",
            data: employerData,
            grossSalaryTitle: `Gross ${key === 'yearly' ? "annual" : "monthly"} pay`,
            totalEmploymentCost: comData.totalEmploymentCost.localAmounts[`${key}Value`],
            currency: comData.currency,
            grossSalary: grossSalary.localAmounts[`${key}Value`],
            durationHeading: `Total ${key === 'yearly' ? "annual" : "monthly"} cost of employment`,
        },
        {
            label: "Amount employee gets",
            data: employeeData,
            grossSalaryTitle: `Gross ${key === 'yearly' ? "annual" : "monthly"} pay`,
            totalEmploymentCost: comData.totalEmployeeSalary.localAmounts[`${key}Value`],
            currency: comData.currency,
            grossSalary: grossSalary.localAmounts[`${key}Value`],
            durationHeading: `Net ${key === 'yearly' ? "annual" : "monthly"} salary`,
        },
    ]
    createSalaryTemplate(dd);
};
function showModalHandler() {
    document.getElementById("show-calculator-modal").style.display = "block";
}
grossSalaryInput.addEventListener('keyup', (e) => {
    grossSalaryInput.value = commaSeprateVal(grossSalaryInput.value)
    checkDisabledBtn();
})

const _handleSubmit = async (e) => {
    let isSubmitted = JSON.parse(localStorage.getItem("salaryPopup"));
    if (e) {
      
        e.preventDefault();
    }
    calculateBtn.setAttribute("disabled", "");
    const countryCd = countryList.find(
        (country) => country.label === countryInput.value
    );
    if (!countryCd) return;
    const currencyCd = currencyList.find(
        (curr) => curr.label === currencyInput.value
    );
    const data = await fetch(
        endpoint
            .replace(":countryCode", countryCd.value)
            .replace(":salary", grossSalaryInput.value.replaceAll(',', ''))
            .replace(":currencyCode", currencyCd.value)
    );
    data
        .json()
        .then((res) => {
            if (res.success) {
                comData = res.data;
                getCountryForError.innerText = `Want a detailed breakdown for cost of employment in ${countryCd.label}`
                // downloadPDFElement.style.display = 'flex';
                document.getElementById("err-msg").style.display = "none";
                comData.currency = currencyCd.value
                salaryData();
                showModalHandler();
                // console.info(comData, 'comdata')
                document.getElementById("input-amt").innerText = commaSeprateVal(grossSalaryInput.value)
                document.getElementById("c-country-name").innerText = countryCd.label
                document.getElementById("current-country-2").innerText = countryCd.label

                document.getElementById("salary-wedget-loading").style.display = 'none'

            } else {
                document.getElementById("err-msg").style.display = "block";
                document.getElementById("show-calculator-modal").style.display = "none";
                getCountryForError.innerText = `Want a detailed breakdown for cost of employment in ${countryInput.value}`
            }
            document.getElementById("calculate-salary").removeAttribute("disabled");
            document.getElementById("calculate-salary").innerText = "Calculate";
            document.getElementById("calc-selected-country").innerText = `Estimated gross annual salary`;
        })
        .catch((err) => {
            document.getElementById("calculate-salary").removeAttribute("disabled");
            document.getElementById("calculate-salary").innerText = "Calculate";
        });
};
form.onsubmit = _handleSubmit;

toggleMonthYear.addEventListener('change', (e) => {
    if (e.target.checked) {
        salaryData('monthly')
    }
})

yearlyRadio.addEventListener('change', (e) => {
    if (e.target.checked) {
        salaryData('yearly')
    }
    // const selectedDuration = e.target.checked ? "yearly" : "monthly";
    // salaryData(selectedDuration)

})

/*
toggleMonthYear.addEventListener('change', (e) => {
    e.target.parentElement.parentElement.nextElementSibling.classList.remove('active')
    e.target.parentElement.parentElement.previousElementSibling.classList.remove('active')
    if (e.target.checked) {
        salaryData('yearly')
        e.target.parentElement.parentElement.nextElementSibling.classList.add('active')
    }
    if (e.target.checked === false) {
        salaryData('monthly')
        e.target.parentElement.parentElement.previousElementSibling.classList.add('active')
    }
})

*/

/**country start here  */
const toggleCountryList = (e) => {
    if (e) {
        e.stopPropagation();
        if (e.target.value) {
            e.target.value = ''
        }
        const text = "";
        countryListEl.classList.toggle("list-modal");
        currencyListEl.classList.add("list-modal");
        filterList(countryList, text, "country-list");
        checkDisabledBtn();
    } else {
        countryListEl.classList.remove("list-modal");
    }
};
countryDownArrow.addEventListener('click', toggleCountryList)
countryInput.addEventListener("click", toggleCountryList);
countryInput.addEventListener("blur", (e) => {
    const text = e.target.value;
    const isEqual = countryList.find(
        (item) => item.label.toLowerCase() === text.toLowerCase()
    );
    if (!isEqual) countryInput.value = "";
});
const countryListElOnClick = (e) => {
    e.preventDefault();
    if ('Item not found' === e.target.innerText) return;
    if (e.target.nodeName === "UL") return;
    countryInput.value = e.target.innerText;
    currencyCurSelect(e.target.innerText);
    toggleCountryList(e);
    createListCurrency(currencyList, 'currency-input');
    checkDisabledBtn();
};
countryListEl.addEventListener("click", countryListElOnClick);
countryInput.addEventListener("input", (e) => {
    const text = e.target.value;
    filterList(countryList, text, "country-list");
    toggleCountryList()
});
/*currency end here */
document.body.addEventListener("click", () => {
    const els = document.querySelectorAll(".list-cotainer");
    els.forEach((el) => el.classList.add("list-modal"));
});
/* aroowdown and up key country select key  */
countryInput.addEventListener("keydown", (e) => {
    const keyName = e.key;
    const activeEl = countryListEl.querySelector(".active");
    if (keyName === "ArrowDown") {
        const firstChildEle = countryListEl.firstChild;
        if (firstChildEle.innerText === 'Item not found') return;
        if (!activeEl) {
            firstChildEle.classList.add("active");
        } else {
            const nextEl = activeEl.nextSibling;
            activeEl.classList.remove("active");
            nextEl.classList.add("active");
        }
        activeEl.scrollIntoView({
            block: "center",
        });
    } else if (keyName === "ArrowUp") {
        const lastChildEle = countryListEl.lastChild;
        if (!activeEl) {
            lastChildEle.classList.add("active");
        } else {
            const nextEl = activeEl.previousSibling;
            activeEl.classList.remove("active");
            nextEl.classList.add("active");
        }
        activeEl.scrollIntoView({
            block: "center",
        });
    } else if (keyName === "Enter") {
        e.preventDefault();
        countryInput.value = activeEl.innerText;
        countryListEl.classList.add("list-modal");
    }
});



const toggleDemoForm = document.getElementById("toggle-demo-checkbox")
toggleDemoForm.addEventListener("change", (e) => {
    if (e.target.checked) {
        document.querySelector(".filter-wrapper").style.display = "block"
        document.getElementById("job-filter-popup").classList.add("visible")
       
    } else {
        document.querySelector(".filter-wrapper").style.display = "none"
        document.getElementById("job-filter-popup").classList.remove("visible")
      
    }

})

const closeWidgetPopup = document.getElementById("close-popup-widget")
closeWidgetPopup.addEventListener("click", () => {
    document.querySelector(".filter-wrapper").style.display = "none"
    document.getElementById("job-filter-popup").classList.remove("visible")
})


document.getElementById("close-popup-widget").addEventListener("click", () => {

    document.getElementById("toggle-demo-checkbox").click()

})

// below script use for input focus
const inputElement = document.querySelector('.form-input');
inputElement.addEventListener("focus",()=>{
    inputElement.parentElement.parentElement.classList.add("focus")
})
