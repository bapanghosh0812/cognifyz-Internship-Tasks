/* =====================================================================
   Cognifyz Web Development Internship — Shared site behaviour
   Injects the navigation + footer on every page, and powers
   scroll reveal, active-link highlighting and the mobile menu.
   Author: Bapan Ghosh
   ===================================================================== */
(function () {
  "use strict";

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (page === "") page = "index.html";

  /* ---------------- Navigation markup ---------------- */
  var nav =
    '<div class="nav-inner container">' +
      '<a class="brand" href="index.html">' +
        '<span class="brand-mark">BG</span>' +
        '<span class="brand-text"><b>Cognifyz</b><small>Web Development</small></span>' +
      '</a>' +
      '<button class="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>' +
      '<nav class="nav-menu">' +
        '<a href="index.html">Home</a>' +
        drop("Level 1", [["level1-html-css.html","1","HTML & CSS"],["level1-javascript.html","2","JavaScript"]]) +
        drop("Level 2", [["level2-frameworks.html","1","Frameworks"],["level2-grid.html","2","Grid Layout"],["level2-responsive.html","3","Responsive"]]) +
        drop("Level 3", [["level3-gallery.html","1","Gallery & Slideshow"],["level3-landing.html","2","Landing Page"]]) +
        drop("Apps", [["calculator.html","+","Calculator"],["color-studio.html","#","Color Studio"]]) +
        '<a class="btn btn-gold nav-cta" href="level3-landing.html">Apply Now</a>' +
      '</nav>' +
    '</div>';

  function drop(label, items) {
    var inner = items.map(function (it) {
      return '<a href="' + it[0] + '"><span class="ix">' + it[1] + '</span>' + it[2] + '</a>';
    }).join("");
    return '<div class="nav-drop"><button type="button">' + label + '</button>' +
           '<div class="nav-drop-menu">' + inner + '</div></div>';
  }

  /* ---------------- Footer markup ---------------- */
  var footer =
    '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
        '<a class="brand" href="index.html"><span class="brand-mark">BG</span>' +
        '<span class="brand-text"><b>Cognifyz</b><small>Web Development</small></span></a>' +
        '<p>Where Data Meets Intelligence. A complete Web Development internship submission — three levels, crafted with care.</p>' +
        '<div class="socials">' +
          '<a href="#" title="LinkedIn">in</a><a href="#" title="Twitter">✦</a>' +
          '<a href="#" title="Web">🌐</a><a href="mailto:contact@cognifyz.com" title="Email">✉</a>' +
        '</div>' +
      '</div>' +
      '<div><h4>Levels</h4>' +
        '<a href="level1-html-css.html">Level 1 · HTML/CSS</a>' +
        '<a href="level1-javascript.html">Level 1 · JavaScript</a>' +
        '<a href="level2-frameworks.html">Level 2 · Frameworks</a>' +
        '<a href="level3-gallery.html">Level 3 · Gallery</a>' +
      '</div>' +
      '<div><h4>Apps</h4>' +
        '<a href="calculator.html">Scientific Calculator</a>' +
        '<a href="color-studio.html">Color Studio</a>' +
        '<a href="level2-responsive.html">Responsive Demo</a>' +
        '<a href="level3-landing.html">Landing Page</a>' +
      '</div>' +
      '<div><h4>Contact</h4>' +
        '<a href="mailto:contact@cognifyz.com">contact@cognifyz.com</a>' +
        '<a href="https://www.cognifyz.com" target="_blank" rel="noopener">www.cognifyz.com</a>' +
        '<a href="#">Warora, Chandrapur, MH</a>' +
        '<a href="#">Ref: CTI/A1/C410735</a>' +
      '</div>' +
    '</div>' +
    '<div class="container footer-bottom">' +
      '<span>© <span id="yr"></span> Cognifyz Technologies. All rights reserved.</span>' +
      '<span>Designed &amp; developed by <b>Bapan Ghosh</b></span>' +
    '</div>';

  /* ---------------- Inject ---------------- */
  function inject() {
    var navHost = document.getElementById("site-nav");
    var footHost = document.getElementById("site-footer");
    if (navHost) { navHost.className = "nav"; navHost.innerHTML = nav; }
    if (footHost) { footHost.className = "footer"; footHost.innerHTML = footer; }

    // active link highlight
    document.querySelectorAll(".nav-menu a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      if (href === page) {
        a.classList.add("active");
        var d = a.closest(".nav-drop");
        if (d) d.querySelector("button").classList.add("active");
      }
    });

    var yr = document.getElementById("yr");
    if (yr) yr.textContent = new Date().getFullYear();

    wireNav();
    wireReveal();
  }

  /* ---------------- Nav behaviour ---------------- */
  function wireNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        toggle.classList.toggle("open");
        menu.classList.toggle("open");
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          toggle.classList.remove("open");
          menu.classList.remove("open");
        });
      });
    }
    // dropdown accordion (mobile) / click-toggle
    document.querySelectorAll(".nav-drop > button").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        var d = b.parentElement;
        var wasOpen = d.classList.contains("open");
        document.querySelectorAll(".nav-drop").forEach(function (x) { x.classList.remove("open"); });
        if (!wasOpen) d.classList.add("open");
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-drop")) {
        document.querySelectorAll(".nav-drop").forEach(function (x) { x.classList.remove("open"); });
      }
    });
    // scrolled state
    var navEl = document.getElementById("site-nav");
    var onScroll = function () {
      if (navEl) navEl.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Scroll reveal (robust) ----------------
     Reveals any element at or above the viewport, so content can
     never stay stuck hidden after an anchor jump or fast scroll. */
  function wireReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    var ticking = false;
    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      els = els.filter(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.92) { el.classList.add("in"); return false; }
        return true;
      });
      if (!els.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { check(); ticking = false; }); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    // safety sweep shortly after load for late layout shifts (fonts, images)
    setTimeout(check, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
