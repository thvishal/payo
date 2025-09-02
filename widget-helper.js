export const currencyLocalMap = { INR: "en-IN", USD: "en-US", IDR: "id-ID" };
let currencyFormat = ({
  amount: e,
  currency: t,
  fixedBy: l = 2,
  locale: a = navigator.language,
}) => {
  let n = "-";
  try {
    if (e || 0 === e) {
      e = Number(e).toFixed(l);
      let r = String(e).split(".");
      n = `${t ? t + " " : ""}${Intl.NumberFormat(
        currencyLocalMap[t] || a
      ).format(r[0])}.${r[1]}`;
    }
  } catch (i) {}
  return n;
};
export const commaSeprateVal = (e) => {
  var t, l, a;
  return e
    .toString()
    .replace(/,/gi, "")
    .replace(/^0+|[^\d.]/g, "")
    .split(/(?=(?:\d{3})+$)/)
    .join(",");
};
export default currencyFormat;
export const toggleList = () => {};
export const createList = (e = [], t = "country-list") => {
  let l = document.getElementById(t);
  l.innerHTML = null;
  var a = document.createDocumentFragment();
  for (let n = 0; n < e.length; n++) {
    let r = document.createElement("li"),
      i = e[n];
    (r.dataset.value = i.value),
      (r.innerText = i.label),
      r.classList.add("list-items"),
      a.appendChild(r);
  }
  l.appendChild(a);
};
export const createListCurrency = (e = [], t = "currency-input") => {
  let l = document.getElementById(t);
  l.innerHTML = null;
  for (let a = 0; a < e.length; a++) {
    let n = document.createElement("option"),
      r = e[a];
    (n.value = r.value),
      (n.innerText = r.label),
      n.classList.add("list-items"),
      l.appendChild(n);
  }
};
export const filterList = (e = [], t = "", l) => {
  let a = e.filter((e) => e.label.toLowerCase().includes(t?.toLowerCase()));
  a.length || (a = [{ label: "Country is not found", disabled: !0 }]),
    createList(a, l);
};
export const createTaxList = (e = [], t = "") => {
  let l = document.createElement("div");
  l.classList.add("inner-breakup");
  let a = document.createElement("div");
  a.classList = "breakups-main cont-breakup hidden";
  for (let n = 0; n < e.length; n++) {
    let r = e[n],
      i = document.createElement("ul");
    i.classList = "d-flex-new justify-content-space-between acc-item-container";
    let s = document.createElement("li");
    s.innerHTML = r.label;
    let d = document.createElement("li");
    if (null === d) continue;
    let c = currencyFormat({ amount: r.value, currency: t || "USD" });
    (d.innerHTML = c),
      d.classList.add("ml-auto"),
      i.appendChild(s),
      i.appendChild(d),
      l.appendChild(i);
  }
  return a.appendChild(l), a;
};
export const checkDisabledBtn = () => {
  let e = document.getElementById("country-input").value,
    t = document.getElementById("currency-input").value,
    l = document.getElementById("gross-salary-input").value,
    a = document.getElementById("calculate-salary");
  e && t && l
    ? (a.removeAttribute("disabled"), a.classList.add("calculate-active"))
    : a.setAttribute("disabled", !0);
};
let errorElement = document.getElementById("err-msg");
export const createSuggestedCountryList = (e) => {
  let t = document.getElementById("suggestedCountries");
  e.forEach((e) => {
    let l = document.createElement("li"),
      a = document.createElement("a"),
      n = e.label,
      r = e.value;
    (a.innerText = n),
      a.setAttribute("data-code", r),
      l.appendChild(a),
      t.appendChild(l);
  });
};
let toolTipEle = `<div class="tool-tip">

<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9.5" cy="10" r="9.5" fill="#0092F4"/>
<path d="M9.69081 6.80818C10.2988 6.80818 10.7686 6.37981 10.7686 5.81327C10.7686 5.24672 10.2988 4.81836 9.69081 4.81836C9.08281 4.81836 8.64062 5.28818 8.64062 5.81327C8.64062 6.33836 9.08281 6.80818 9.69081 6.80818ZM10.5337 14.6984V8.01036H8.87553V14.6984H10.5337Z" fill="white"/>
</svg>

<span class="tooltiptext">__tooltiptext__</span>
</div>`,
  arrowImage =
    "https://uploads-ssl.webflow.com/61cda68a44d858d793b97e11/6436b07536f3aab95d48a418_Arrow.svg",
  getParentsElement = (e, t) =>
    e.classList.contains(t) ? e : getParentsElement(e.parentElement, t);
function toggleBreakUpHeight(e) {
  if (e.clientHeight > 20) e.style.height = 0;
  else {
    let t = e.querySelector(".inner-breakup");
    e.style.height = t.clientHeight + 16 + "px";
  }
}
let toggleBreakups = (e) => {
  let t = getParentsElement(e.target, "accordian-main"),
    l = t.nextSibling;
  l.classList.toggle("hidden");
  let a = t.children[0].lastChild;
  a.classList.toggle("rotate-180"), toggleBreakUpHeight(l);
};
export const createAccordian = (e) => {
  let t = document.createElement("div");
  t.classList.add("accordian-section");
  let l = e.find((e) => "skuadFeeDiscount" === e.key),
    a = e.filter((e) => "skuadFeeDiscount" !== e.key);
  return (
    a.forEach((e) => {
      if ("skuadFee" === e.key) {
        let a = document.createElement("div"),
          n = document.createElement("div");
        (n.classList = "accordian-main d-flex-new"),
          (n.style.width = "100%"),
          (n.style.justifyContent = "space-between");
        let r = document.createElement("div");
        r.classList = "d-flex-align-center";
        let i = document.createElement("div");
        i.classList = "d-flex-new";
        let s = document.createElement("p");
        s.classList.add("skuad-fee"), (s.innerText = e.label), r.appendChild(s);
        let d = document.createElement("div");
        if (
          (d.classList.add("new-heading-wrapper"),
          d.appendChild(s),
          r.appendChild(d),
          e.tooltip)
        ) {
          let c = document.createElement("div");
          c.classList.add("tooltip-container"),
            (c.innerHTML = toolTipEle.replace("__tooltiptext__", e.tooltip)),
            d.appendChild(c);
        }
        if (e.subCategories.length) {
          let o = document.createElement("img");
          (o.src =
            "https://uploads-ssl.webflow.com/61cda68a44d858d793b97e11/6436b07536f3aab95d48a418_Arrow.svg"),
            r.appendChild(o),
            n.addEventListener("click", toggleBreakups);
        }
        let p = document.createElement("div");
        p.classList.add("right-inner-container");
        let u = document.createElement("p");
        u.classList.add("right-side-value"),
          (u.innerText = currencyFormat({
            amount: e.value,
            currency: e.currency || "USD",
          })),
          "skuadFee" === e.key && l
            ? (i.classList.add("offer-active"),
              p.appendChild(u),
              i.appendChild(p))
            : i.appendChild(u),
          n.appendChild(r),
          n.appendChild(i);
        let m = createTaxList(e.subCategories, e.currency);
        a.appendChild(n), m && a.appendChild(m), t.appendChild(a);
      }
    }),
    t
  );
};
export const createSalaryTemplate = (e) => {
  let t = document.createDocumentFragment();
  e.forEach((e, l) => {
    if ((e.data.filter((e) => e.visibility), l < 1)) {
      let a = document.createElement("div");
      a.classList.add("salary-contribution");
      let n = document.createElement("h2");
      n.innerText = e.label;
      let r = document.createElement("div");
      r.classList.add("cost-label-align");
      let i = document.createElement("p");
      i.classList.add("duration-title"),
        (i.innerText = e.grossSalaryTitle),
        r.appendChild(i);
      let s = document.createElement("div");
      s.classList.add("d-flex-new");
      let d = document.createElement("p");
      d.classList.add("duration-salary"),
        (d.innerText = currencyFormat({
          amount: e.grossSalary,
          currency: e.currency || "USD",
        })),
        s.appendChild(d),
        r.appendChild(s),
        a.appendChild(n),
        a.appendChild(r);
      let c = createAccordian(e.data);
      a.appendChild(c);
      let o = document.createElement("div");
      o.classList.add("employment-cost");
      let p = document.createElement("p");
      p.classList.add("employment-cost-label"),
        (p.innerText = e.durationHeading),
        o.appendChild(p);
      let u = document.createElement("div");
      u.classList.add("d-flex-new");
      let m = document.createElement("p");
      m.classList.add("duration-salary"),
        (m.innerText = currencyFormat({
          amount: e.totalEmploymentCost,
          currency: e.currency || "USD",
        })),
        u.appendChild(m),
        o.appendChild(u),
        e?.data?.length && a.appendChild(o),
        t.appendChild(a);
    }
  });
  let l = document.getElementById("calculation-wrapper");
  (l.innerHTML = ""),
    l.appendChild(t),
    document.querySelector("#calculation-wrapper");
};
