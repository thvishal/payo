const navLinks = document.querySelectorAll(
    ".desktop-list li a:not(.w-dyn-bind-empty)"
  ),
  sections = document.querySelectorAll(
    ".blog-details-rich:not(.w-dyn-bind-empty)"
  );
navLinks.forEach((t) => {
  t.addEventListener("click", (e) => {
    e.preventDefault();
    const o = t.dataset.target,
      n = document.querySelector(`.blog-details-rich[data-section="${o}"]`),
      c = n?.querySelector("h2");
    setTimeout(() => {
      if (c) {
        const t = c.getBoundingClientRect(),
          e = window.pageYOffset || document.documentElement.scrollTop,
          o = t.top + e - window.innerHeight / 2 + c.offsetHeight / 2;
        window.scrollTo({ top: o, behavior: "smooth" });
      } else n?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  });
});
let lastActiveSectionId = "";
function scrollToCurrentAnchor() {
  const t = document.querySelector(".toc_outer_wrapper_bottom"),
    e = t?.querySelector("a.active-new");
  if (e) {
    const o = e.getBoundingClientRect(),
      n = t.getBoundingClientRect();
    if (o.top < n.top || o.bottom > n.bottom) {
      const e = o.top - n.top;
      t.scrollBy({ top: e, behavior: "smooth" });
    }
  }
}
window.addEventListener("scroll", () => {
  let t = lastActiveSectionId;
  for (const e of sections) {
    const o = e.getBoundingClientRect();
    if (o.top <= window.innerHeight / 2 && o.bottom >= window.innerHeight / 2) {
      t = e.getAttribute("data-section");
      break;
    }
  }
  t !== lastActiveSectionId &&
    (navLinks.forEach((e) =>
      e.classList.toggle("active-new", e.dataset.target === t)
    ),
    (lastActiveSectionId = t)),
    scrollToCurrentAnchor();
});
const title = encodeURIComponent(document.title),
  url = encodeURIComponent(window.location.href.replace(/\/+$/, "")),
  shareLinks = [
    {
      selector: "[data-share-facebook]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      selector: "[data-share-twitter]",
      href: `https://twitter.com/share?url=${url}&text=${title}`,
    },
    {
      selector: "[data-share-linkedin]",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    },
  ];
shareLinks.forEach(({ selector: t, href: e }) => {
  const o = document.querySelector(t);
  o && (o.setAttribute("href", e), o.setAttribute("target", "_blank"));
});
const copyButton = document.querySelector(".copy-page-link"),
  statusText = document.querySelector(".page-link-text");
copyButton &&
  navigator.clipboard &&
  copyButton.addEventListener("click", () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        statusText && (statusText.textContent = "copied!");
      })
      .catch((t) => {
        statusText && (statusText.textContent = "copy failed"),
          console.error("clipboard copy failed:", t);
      });
  }),
  document.querySelectorAll(".accordion-trigger").forEach((t) => {
    const e = t.nextElementSibling,
      o = t.querySelector("img"),
      n = () => {
        e.classList.toggle("active"), o.classList.toggle("rotate");
      };
    t.addEventListener("click", n), e.addEventListener("click", n);
  });
