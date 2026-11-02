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

  // Soft shadow under the navigation once the page scrolls.
  var nav = document.querySelector(".globalnav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Opt sections into scroll reveals. Only elements that start below the fold
  // are hidden, so nothing visible on load ever flickers.
  if (!reduce) {
    var fold = window.innerHeight * 0.92;
    var below = function (el) { return el.getBoundingClientRect().top > fold; };
    var single = [
      [".block-head", 0], [".section-headline", 0], [".section-intro", 90],
      [".gallery", 120], [".solutions-band", 0], [".home-cta .container", 0],
      [".cta-band .container", 0], [".specs", 0], [".founder-photo", 0],
      [".founder-copy", 120], [".contact-card", 0], [".contact-include", 0], [".faq", 0]
    ];
    single.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        if (!el.hasAttribute("data-reveal") && below(el)) {
          el.setAttribute("data-reveal", "");
          if (pair[1]) el.style.setProperty("--d", pair[1] + "ms");
        }
      });
    });
    [".product-cols", ".services", ".steps", ".app-cards", ".service-cards", ".feature-grid"].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (list) {
        Array.prototype.forEach.call(list.children, function (child, i) {
          if (!below(child)) return;
          if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
          if (!child.style.getPropertyValue("--d")) child.style.setProperty("--d", (i % 4) * 100 + "ms");
        });
      });
    });
    document.querySelectorAll(".founder-photo[data-reveal], .bigscreen-media[data-reveal]").forEach(function (el) {
      el.setAttribute("data-reveal", "scale");
    });
  }

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (reduce || !items.length) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  // Fail-safe reveal: anything already on screen is shown before hiding is
  // armed, and a scroll-position check backs up the IntersectionObserver.
  function show(el) { el.classList.add("is-visible"); }
  function inView(el) { var r = el.getBoundingClientRect(); return r.top < window.innerHeight * 0.92 && r.bottom > 0; }
  items.forEach(function (el) { if (inView(el)) show(el); });
  root.classList.add("reveal-armed");

  var pending = items.filter(function (el) { return !el.classList.contains("is-visible"); });
  var ticking = false;
  function check() {
    ticking = false;
    pending = pending.filter(function (el) {
      if (inView(el) || window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) { show(el); return false; }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScrollCheck);
      window.removeEventListener("resize", onScrollCheck);
    }
  }
  function onScrollCheck() { if (!ticking) { ticking = true; window.requestAnimationFrame(check); } }
  window.addEventListener("scroll", onScrollCheck, { passive: true });
  window.addEventListener("resize", onScrollCheck);

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    pending.forEach(function (el) { io.observe(el); });
  }
})();
