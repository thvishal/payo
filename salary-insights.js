const scriptURL = 'https://script.google.com/macros/s/AKfycbxYDZo3tZjFkNM5O96Fjda4dGy9ynHXl4GnQiUMQqXbRdGIf_8MWzznmS1uwTlT_9GFFA/exec'
// to read dropdown values
const roleInitailly = document.getElementById('roles-input')
const coutryInitially = document.getElementById('country-input')
const roleTwo = document.getElementById('roles-input-filter')
const coutryTwo = document.getElementById('country-input-filter')
roleInitailly.value = 'Loading...'
coutryInitially.value = 'Loading...'
roleInitailly.setAttribute("disabled", "")
coutryInitially.setAttribute("disabled", "")
let allRoles = []
const createList = (arr, id = '', classForList = '', disabled) => {
    //const fr = document.createDocumentFragment();
    const elSelect = document.getElementById(id);
    const eleUL = elSelect.querySelector('ul')
    const ul = eleUL || document.createElement('ul');
    ul.innerHTML = ''
    // elSelect.getElementsByTagName('ul')[0].remove();
    arr.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add(classForList)
        li.innerText = item;
        li.addEventListener('click', (e) => {
            e.target.parentNode.classList.remove('show')
            if (e.target.innerText === 'Item not found') {
                e.target.parentNode.classList.add('show')
                return
            }
            e.target.parentElement.previousElementSibling.value = e.target.innerText
        })
        ul.appendChild(li);
    })
    ul.classList.add('ul-list')
    elSelect.appendChild(ul);
}
let countries = []
let roles = []
const getData = () => {
    fetch(scriptURL, {
        method: 'GET', "Access-Control-Allow-Origin": "*"
    }).then(res => res.json()).then(res => {
        countries = res.data.countries;
        roles = res.data.roles;
        createList(countries, 'countries', 'country-list-item');
        createList(roles, 'roles', 'roles-list-item');
        createList(roles, 'roles-2', 'roles-list-item-2')
        createList(countries, 'countries-2', 'country-list-item-2')
        // roleInitailly[0].innerText = 'Role'
        // coutryInitially[0].innerText = 'Country'
    }).catch(err => console.log(err)).finally(ele => {
        roleInitailly.value = ''
        coutryInitially.value = ''
        roleInitailly.removeAttribute("disabled")
        coutryInitially.removeAttribute("disabled")
    });
}
getData();
const graphResult = document.getElementById('graph-result')
const loadingImg = document.getElementById('loading-img')
const initiallyDummyGraph = document.getElementById('initially-dummy-graph')
const dscAvgSal = document.getElementById('not-avg-sal')
let minCtcMonth = []
let maxCtcMonth = []
let minCtcYear = []
let maxCtcYear = []
let medianValue = 0;
// console.log(roleInitailly[0], coutryInitially, 'lll')
const durationChange = document.getElementById('duration')
let duration = 'year'
const yourRole = document.querySelectorAll('.your-role')
const selectedCountry = document.querySelectorAll('.current-select-country')
const searchHandler = (event, formId) => {
    event.preventDefault();
    var doneElements = document.querySelectorAll('.w-form-done');
    var failElements = document.querySelectorAll('.w-form-fail');
    var formElements = document.querySelectorAll('form');
    loadingImg.style.display = "flex"
    
    // Add the 'show' class to each form
    formElements.forEach(function (form) {
        form.classList.add('show');
    });
    // Add the 'hide' class to each element
    doneElements.forEach(function (element) {
        element.classList.add('hide');
    });
    failElements.forEach(function (element) {
        element.classList.add('hide');
    });
    const country = coutryInitially.value;
    const role = roleInitailly.value;
    const formData = new FormData();
    if (formId === 'fForm') {
        graphResult.style.display = 'block';
        dscAvgSal.style.display = 'block';
        initiallyDummyGraph.style.display = 'none'
        document.getElementById('country-input-filter').value = country;
        document.getElementById('roles-input-filter').value = role;
        formData.append("country", country);
        formData.append("role", role);
        formData.append("time", duration);
        selectedCountry.forEach(item => item.innerText = country)
        // console.info(selectedCountry,'selectedCountry')
        yourRole.forEach(item => item.innerHTML = role)
    }
    else {
        formData.append("country", coutryTwo.value);
        formData.append("role", roleTwo.value);
        formData.append("time", duration);
        selectedCountry.forEach(item => item.innerText = coutryTwo.value)
        yourRole.forEach(item => item.innerText = roleTwo.value)
    }
    fetch(scriptURL, { method: 'POST', body: formData, "Access-Control-Allow-Origin": "*" })
        .then(res => res.json())
        .then(res => {
            const ctc = res.data;
            // console.log(ctc[0].message, 'ttt')
            if (ctc[0].message === 'data not found') {
                document.getElementById('data-not-found').style.display = 'flex';
                //console.log('error')
                return
            }
            else {
                document.getElementById('data-not-found').style.display = 'none';
                minCtcMonth = ctc.map(item => item.minCtcMonth > 0 ? item.minCtcMonth : null);
                // minCtcMonth = ctc.map(item => console.log(item, "minctc"));
                maxCtcMonth = ctc.map(item => item.maxCtcMonth > 0 ? item.maxCtcMonth : null);
                minCtcYear = ctc.map(item => item.minCtcYear > 0 ? item.minCtcYear : null);
                maxCtcYear = ctc.map(item => item.maxCtcYear > 0 ? item.maxCtcYear : null);
                // console.log(maxCtcYear, minCtcYear, ctc, 'ctc');
                if (duration == 'year') {
                    creatChart(minCtcYear, maxCtcYear);
                    getMedian(maxCtcYear);
                    let actVal = Number(medianValue.toFixed(2));
                     actVal = actVal.toLocaleString();
                    document.getElementById('median-salary').innerText = `$${actVal}`
                }
                else {
                    creatChart(minCtcMonth, maxCtcMonth);
                    getMedian(maxCtcMonth);
                    let actVal = Number(medianValue.toFixed(2));
                     actVal = actVal.toLocaleString();
                    document.getElementById('median-salary').innerText = `$${actVal}`
                }
            }
        }).catch(err => console.log(err)).finally(() => {
            loadingImg.style.display = "none"
        });
}
// to show popup based on value
let counter = false;
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        const isFormSubmitted = localStorage.getItem("isDemoFormSubmitted")
        if (counter && !isFormSubmitted) {
            onChange()
            return
        }
        searchHandler(event, 'fForm');
        counter = true
    });
    document.getElementById('get-final-data').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        const isFormSubmitted = localStorage.getItem("isDemoFormSubmitted")
        if (counter && !isFormSubmitted) {
            onChange()
            return
        }
        searchHandler(event, 'get-final-data');
    });
});
function creatChart(minCtc, maxCtc) {
    let maxCtcValue = maxCtc.reduce((a, b) => Math.max(a, b), -Infinity);
    var existingChart = Chart.getChart('salaryChart');
    // Destroy the existing chart if it exists
    if (existingChart) {
        existingChart.destroy();
    }
    var data = {
        labels: ['1-4 years', '4-7 years', '7-10 years'],
        datasets: [
            {
                label: 'Min Salary',
                backgroundColor (context){
                    const {chart, datasetIndex, index} = context;
                    const ds = chart.data.datasets[datasetIndex];
                    const value = ds.data[index];
                    const y = chart.scales.y.getPixelForValue(value);
                    const meta = chart.getDatasetMeta(datasetIndex);
                    const data = meta.data[index];
                    const {x, width, base} = data;
                    if (x) {
                      const ctx = chart.ctx;
                      const gradient = ctx.createLinearGradient(x, y, x + width, base);
                      gradient.addColorStop(0, 'rgba(0, 146, 244, 0.16)');
                      gradient.addColorStop(0.5, 'rgba(21, 196, 116, 0.16)');
            
                      return gradient;
                    }
                  },
                borderColor: 'rgba(28, 131, 252, 0.2)',
                borderWidth: 0,
                data: minCtc,
            },
            {
                label: 'Max Salary',
                backgroundColor (context){
                    const {chart, datasetIndex, index} = context;
                    const ds = chart.data.datasets[datasetIndex];
                    const value = ds.data[index];
                    const y = chart.scales.y.getPixelForValue(value);
                    const meta = chart.getDatasetMeta(datasetIndex);
                    const data = meta.data[index];
                    const {x, width, base} = data;
                    if (x) {
                      const ctx = chart.ctx;
                      const gradient = ctx.createLinearGradient(x, y, x + width, base);
                      gradient.addColorStop(0, '#0092F4');
                      gradient.addColorStop(0.8, '#15C474');
            
                      return gradient;
                    }
                  },
                borderColor: 'rgba(28, 131, 252, 1)',
                borderWidth: 0,
                data: maxCtc
            },

           

        ]
    };
    // Chart Configuration
    var options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                stacked: false, // Set stacked to false for separate bars
                grid: {
                    drawOnChartArea: true,
                    drawBorder: false,
                },
                border: {
                    dash: [6, 6]
                },
               
            },

           
            y: {
                beginAtZero: false,
                display: false,
                min: 0,
                max: maxCtcValue,
                ticks: {
                    // forces step size to be 50 units
                    stepSize: 0 + maxCtcValue / 2,
                    
                }

            },
        },
        layout: {
            padding: {
                top: 40,
            }
        },
        plugins: {
            datalabels: {
                color: "#1a204a",
                anchor: 'end',
                align: 'top',
                // formatter: (n) => `$${n.toString().substr(0, 2)}K`,
                formatter: (num) => num ? '$' + (Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num)) : "",
                font: function (context) {
                    var avgSize = Math.round((context.chart.height + context.chart.width) / 2);
                    var size = Math.round(avgSize / 32);
                    size = size > 12 ? 16 : size; // setting max limit to 12
                    // console.log(size, 's')
                    return {
                        size: size,
                        family: 'Inter, sans-serif',
                    };
                },
            },
            legend: false,
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `$${tooltipItem.formattedValue}`;
                    }
                }
            }
        },
        elements: {
            bar: {
                borderRadius: {
                    topLeft: 10,
                    topRight: 10,
                },
            },
        },
    };
    // Create Chart
    Chart.register(ChartDataLabels);
    var ctx = document.getElementById('salaryChart').getContext('2d');
    var salaryChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options,
    });
}
//const time = document.getElementsByClassName('time');
const priceSwitchTxtElements = document.querySelectorAll('.price-switch-txt');
const priceSwitchBgElement = document.querySelector('.price-switch-bg');
priceSwitchTxtElements.forEach(element => {
    element.addEventListener('click', function() {
        if (this.classList.contains('month')) {
            duration = 'month'
            document.getElementById('current-duration').innerText = 'monthly'
        creatChart(minCtcMonth, maxCtcMonth);
        getMedian(maxCtcMonth);
        let actVal = Number(medianValue.toFixed(2));
        actVal = actVal.toLocaleString();
        document.getElementById('median-salary').innerText = `$${actVal}`
            // Remove the 'active' class from all elements with the class 'price-switch-txt'
            priceSwitchTxtElements.forEach(txtElement => {
                txtElement.classList.remove('active');
            });
            // Add the 'active' class to the clicked element
            this.classList.add('active');
            // Remove the 'active' class from the element with the class 'price-switch-bg'
            priceSwitchBgElement.classList.remove('active');
        }
        else{
            duration = 'year'
            document.getElementById('current-duration').innerText = 'annual'
            creatChart(minCtcYear, maxCtcYear);
            getMedian(maxCtcYear);
            let actVal = Number(medianValue.toFixed(2));
            actVal = actVal.toLocaleString();
            document.getElementById('median-salary').innerText = `$${actVal}`;
            priceSwitchTxtElements.forEach(txtElement => {
                txtElement.classList.remove('active');
            });
            this.classList.add('active');
            priceSwitchBgElement.classList.add('active');
        }
    })
})
const closePopup = document.getElementById('exitPopup')
const popupClose = document.getElementById('cross-pattern')
const popupForm = document.querySelector('.popup-form')
function onChange() {
    const getSubmittedValue = localStorage.getItem("isDemoFormSubmitted")
    if (!counter || getSubmittedValue) return;
    closePopup.classList.add('visible')
}
// pop close
if (popupClose) {
    popupClose.addEventListener('click', () => {
        closePopup.classList.remove('visible')
    })
}
function getMedian(totalCTC) {
    medianValue = totalCTC.reduce((prev, curr) => prev + curr) / totalCTC.length;
    // console.log(medianValue(list), 'medianValue1')
    // console.log(medianValue, 'medianValue2')
}
function responsiveFonts() {
    if (window.outerWidth > 999) {
        Chart.defaults.font.size = 16;
    };
    if (window.outerWidth < 999 && window.outerWidth > 500) {
        Chart.defaults.font.size = 12;
    };
    if (window.outerWidth < 500) {
        Chart.defaults.font.size = 10;
    };
}
responsiveFonts()
const inputs = document.querySelectorAll('.py-country-select');
// console.log(inputs.previousElementSibling)
inputs.forEach(input => {
    input.addEventListener('click', (e) => {
        const ulList = document.querySelectorAll('.ul-list');
        ulList.forEach(ul => ul.classList.remove('show'))
        e.target.value = ""
        e.target.parentNode.querySelector('ul').classList.add('show')
        let currentItemClass = e.target.parentElement.querySelector('ul').lastChild.className
        const currentListElementID = e.target.parentNode.id;
        const dataobj = {
            roles: roles,
            countries: countries,
            ["roles-2"]: roles,
            ["countries-2"]: countries,
        }
        createList(dataobj[currentListElementID], currentListElementID, currentItemClass)
    })
})
inputs.forEach(input => {
    input.addEventListener('input', (e) => {
        const ulList = document.querySelectorAll('.ul-list');
        ulList.forEach(ul => ul.classList.remove('show'))
        e.target.parentNode.querySelector('ul').classList.add('show')
    })
})
const filterList = (list = [], text = "", id, currentItemClass) => {
    let filteredList = list.filter((item) =>
        item.toLowerCase().includes(text?.toLowerCase())
    );
    if (!filteredList.length) {
        filteredList = ['Item not found']
    }
    createList(filteredList, id, currentItemClass, !filterList.length);
};
inputs.forEach(input => {
    input.addEventListener('input', (e) => {
        const dataobj = {
            roles: roles,
            countries: countries,
            ["roles-2"]: roles,
            ["countries-2"]: countries,
        }
        let currentItemClass = input.nextElementSibling.lastChild.className
        const currentListElementID = input.parentNode.id;
        // console.log(dataobj[currentListElementID], currentListElementID, 'cc')
        filterList(dataobj[currentListElementID], e.target.value, currentListElementID, currentItemClass)
    })
})
document.body.addEventListener("click", (e) => {
    const showElement = document.querySelector('ul.ul-list.show')
    const inputs = document.querySelectorAll('.py-country-select')
    const roleContains = inputs.forEach(input => input.contains(e.target))
    const ulList = document.querySelector('.ul-list')
    ulListContaines = ulList.contains(e.target)
    if (showElement) {
        if (!ulListContaines && !roleContains) {
            showElement.classList.remove('show')
        } else {
            return
        }
    }
    if (e.target.className === 'py-country-select w-input') {
        e.target.nextElementSibling.classList.add('show')
    }
});
document.addEventListener("keydown", (e) => {
    if (e.key === "ESC") {
        const showElement = document.querySelector('ul.ul-list.show')
        showElement.classList.remove('show')
    }
})
inputs.forEach(input => {
    input.addEventListener("keydown", (e) => {
        const keyName = e.key;
        const countryListEl = e.target.nextElementSibling;
        const activeEl = countryListEl.querySelector(".active");
        if (keyName === "ArrowDown") {
            countryListEl.classList.add('show')
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
            // console.log(activeEl.innerText, e.target.nextSibling.previousElementSibling, 'activeEl')
            e.target.nextSibling.previousElementSibling.value = activeEl.innerText;
            e.target.nextSibling.remove("show");
        }
    });
})
