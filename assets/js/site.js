/* Vixera AI — site behavior (no dependencies) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ── Products mega menu ── */
  var megaBtn = document.querySelector("[data-mega-btn]");
  var mega = document.querySelector("[data-mega]");
  if (megaBtn && mega) {
    function closeMega() {
      mega.classList.remove("open");
      megaBtn.setAttribute("aria-expanded", "false");
    }
    megaBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = mega.classList.toggle("open");
      megaBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!mega.contains(e.target) && e.target !== megaBtn) closeMega();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMega(); megaBtn.focus(); }
    });
  }

  /* ── Mobile menu ── */
  var burger = document.querySelector("[data-burger]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ── Section reveal (visible by default; scroll-checked, never lost) ── */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    var pending = [];
    function show(el) { el.classList.add("in"); el.classList.remove("pending"); }
    function sweep() {
      var batch = [];
      for (var i = pending.length - 1; i >= 0; i--) {
        var r = pending[i].getBoundingClientRect();
        if (r.top < window.innerHeight * 0.94 && r.bottom > 0) {
          batch.push(pending[i]);
          pending.splice(i, 1);
        }
      }
      batch.reverse().forEach(function (el, i) {
        setTimeout(function () { show(el); }, i * 80); // soft stagger within a frame
      });
      if (!pending.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; sweep(); });
    }
    document.querySelectorAll(".reveal").forEach(function (el) {
      var r = el.getBoundingClientRect();
      // Never hide content already in the first viewport
      if (r.top < window.innerHeight * 0.9) { el.classList.add("in"); return; }
      el.classList.add("pending");
      pending.push(el);
    });
    if (pending.length) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      // Safety net: nothing stays hidden no matter what
      setTimeout(function () { pending.forEach(show); pending = []; }, 6000);
    }
  }

  /* ── Waitlist form (local-only until a backend is connected) ── */
  var wl = document.querySelector("[data-waitlist]");
  if (wl) {
    var form = wl.querySelector("form");
    var err = wl.querySelector(".wl-error");
    var success = wl.querySelector(".wl-success");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]');
      var value = (email.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        err.classList.add("show");
        email.setAttribute("aria-invalid", "true");
        email.focus();
        return;
      }
      err.classList.remove("show");
      email.removeAttribute("aria-invalid");
      try {
        var entries = JSON.parse(localStorage.getItem("vixera_waitlist") || "[]");
        var product = form.querySelector("select");
        entries.push({
          email: value,
          first_name: (form.querySelector('input[name="first_name"]') || {}).value || "",
          product: product ? product.value : "vixera_one",
          created_at: new Date().toISOString()
        });
        localStorage.setItem("vixera_waitlist", JSON.stringify(entries));
      } catch (_) { /* storage unavailable — success state still shows */ }
      form.hidden = true;
      success.classList.add("show");
      track("waitlist_submitted");
    });
  }

  /* ── Command demo chips ── */
  document.querySelectorAll("[data-demo-chip]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var q = document.querySelector("[data-demo-q]");
      var a = document.querySelector("[data-demo-a]");
      if (q) q.textContent = chip.getAttribute("data-q");
      if (a) a.textContent = chip.getAttribute("data-a");
    });
  });

  /* ── Dynamic year ── */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ── Analytics hook (no-op unless an analytics provider is added) ── */
  function track(event) {
    if (window.va && typeof window.va === "function") { window.va("event", { name: event }); }
  }
  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () { track(el.getAttribute("data-track")); });
  });
})();
