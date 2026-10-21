// CYBERSEC CYPRUS — service pages: EN/EL swap, FAQ accordion, scroll reveal.
// English is baked into the HTML; Greek lives in data-el="" on each leaf node.
(function () {
  "use strict";

  var SUPPORTED = ["en", "el"];
  var STORE = "cybersec_lang"; // shared with the rest of the site

  var lang = "en";
  try {
    var saved = localStorage.getItem(STORE);
    if (SUPPORTED.indexOf(saved) !== -1) lang = saved;
  } catch (e) { /* ignore */ }

  // Capture the baked English once, so we can swap both ways.
  var nodes = [].slice.call(document.querySelectorAll("[data-el]"));
  nodes.forEach(function (el) {
    if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent);
  });

  function apply() {
    document.documentElement.lang = lang;
    nodes.forEach(function (el) {
      var v = lang === "el" ? el.getAttribute("data-el") : el.getAttribute("data-en");
      if (v != null) el.textContent = v;
    });
    [].forEach.call(document.querySelectorAll("[data-setlang]"), function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-setlang") === lang);
    });
  }

  function setLang(next) {
    if (SUPPORTED.indexOf(next) === -1 || next === lang) return;
    lang = next;
    try { localStorage.setItem(STORE, lang); } catch (e) { /* ignore */ }
    apply();
  }

  [].forEach.call(document.querySelectorAll("[data-setlang]"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-setlang")); });
  });

  // FAQ accordion
  [].forEach.call(document.querySelectorAll(".svc-q__head"), function (head) {
    head.setAttribute("aria-expanded", "false");
    head.addEventListener("click", function () {
      var q = head.closest(".svc-q");
      var open = q.classList.toggle("open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // Scroll reveal
  function wireReveal() {
    var items = document.querySelectorAll(".reveal:not(.in)");
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      [].forEach.call(items, function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    [].forEach.call(items, function (el) { io.observe(el); });
  }

  apply();
  wireReveal();
})();
