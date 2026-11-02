// Digital AI Labs: mobile menu, highlights gallery and scroll reveals.
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      document.body.classList.toggle("menu-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
        toggle.focus();
      }
    });
  }

  // Products / Solutions dropdowns: click to open, Escape or outside click to close.
  var menuBtns = Array.prototype.slice.call(document.querySelectorAll(".menu-btn"));
  function closeMenus(except) {
    menuBtns.forEach(function (b) { if (b !== except) b.setAttribute("aria-expanded", "false"); });
  }
  menuBtns.forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = btn.getAttribute("aria-expanded") === "true";
      closeMenus(btn);
      btn.setAttribute("aria-expanded", String(!open));
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && panel) {
        e.preventDefault();
        closeMenus(btn);
        btn.setAttribute("aria-expanded", "true");
        var first = panel.querySelector("a");
        if (first) first.focus();
      }
    });
    if (panel) {
      panel.addEventListener("keydown", function (e) {
        var links = Array.prototype.slice.call(panel.querySelectorAll("a"));
        var i = links.indexOf(document.activeElement);
        if (e.key === "ArrowDown" && i > -1) { e.preventDefault(); links[(i + 1) % links.length].focus(); }
        if (e.key === "ArrowUp" && i > -1) { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
        if (e.key === "Escape") { btn.setAttribute("aria-expanded", "false"); btn.focus(); }
      });
      panel.parentElement.addEventListener("focusout", function (e) {
        if (!panel.parentElement.contains(e.relatedTarget) && window.matchMedia("(min-width: 961px)").matches) {
          btn.setAttribute("aria-expanded", "false");
        }
      });
    }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".has-menu")) closeMenus(null);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenus(null);
  });

  // Highlights gallery: previous/next buttons scroll one card at a time.
  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var track = gallery.querySelector(".gallery-track");
    var prev = gallery.querySelector('[data-dir="-1"]');
    var next = gallery.querySelector('[data-dir="1"]');
    if (!track || !prev || !next) return;

    function step() {
      var card = track.querySelector(".gallery-card");
      if (!card) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
      return card.getBoundingClientRect().width + gap;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  // Reveal on scroll, once. Skipped entirely when reduced motion is requested.
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();
