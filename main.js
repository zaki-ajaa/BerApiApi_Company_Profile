(function () {
  "use strict";

  var body = document.body;
  var loader = document.getElementById("loader");
  var start = performance.now();
  var MIN_LOADER_MS = 1600;

  function finishLoading() {
    if (body.classList.contains("is-loaded")) return;
    var wait = Math.max(0, MIN_LOADER_MS - (performance.now() - start));
    setTimeout(function () {
      body.classList.add("is-loaded");
      setTimeout(function () {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      }, 900);
    }, wait);
  }

  if (document.readyState === "complete") {
    finishLoading();
  } else {
    window.addEventListener("load", finishLoading);
  }
  setTimeout(finishLoading, 4500);

  var header = document.querySelector(".site-header");
  var toTop = document.getElementById("toTop");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", y > 12);
    toTop.classList.toggle("show", y > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  var counters = document.querySelectorAll("[data-count]");
  var countObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        animateCount(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach(function (el) {
    countObserver.observe(el);
  });

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1300;
    var t0 = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("id-ID") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var sections = document.querySelectorAll("section[id], footer[id]");
  var navLinks = document.querySelectorAll(".nav__link");
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(function (el) {
    sectionObserver.observe(el);
  });
})();
