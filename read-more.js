const readMoreUpperTag = document.querySelectorAll(".read-more-upper-tag"),
  readMoreLowerTag = document.querySelectorAll(".read-more-lower-tag"),
  a = document.createElement("a"),
  getParentNode = (e, o) => {
    let r = e;
    for (; !r.classList.contains(o); ) r = r.parentNode;
    return r;
  };
function hideSomeItems(e = !0, o) {
  (o || readMoreUpperTag).forEach((o) => {
    let r = o.parentNode.nextElementSibling;
    for (; r && !r.classList.contains("read-more-lower-tag"); ) {
      if (e) r.style.display = "none";
      else {
        const e = r.tagName.toLowerCase();
        r.style.display = "ul" === e || "ol" === e ? "flex" : "block";
      }
      r = r.nextElementSibling;
    }
    readMoreLowerTag.forEach((e) => {
      (e.parentNode.style.display = "flex"),
        (e.parentNode.style.flexDirection = "column");
    });
  });
}
readMoreLowerTag.forEach((e) => {
  e.addEventListener("click", (e) => {
    const o = getParentNode(e.target, "read-more-lower-tag"),
      r = o.classList.contains("expanded"),
      t = o.querySelector(".eor-rich-read-more div"),
      a = o.querySelector(".eor-rich-read-more .show-more-img"),
      l = getParentNode(e.target, "blog-details-rich");
    hideSomeItems(r, l.querySelectorAll(".read-more-upper-tag")),
      r
        ? (console.info(2),
          (t.innerText = "Read more"),
          (a.style.transform = "rotate(0deg)"),
          console.info(l, l.clientHeight, l.scrollHeight, l.offsetTop, "jj"),
          l.scrollHeight > l.clientHeight
            ? l.scrollTo({ top: 200, behavior: "smooth" })
            : (console.info(2),
              window.scrollTo({ top: l.offsetTop - 400, behavior: "smooth" })))
        : ((t.innerText = "Read less"), (a.style.transform = "rotate(180deg)")),
      o.classList.toggle("expanded");
  });
}),
  hideSomeItems(!0);
