/* press-check portfolio — dynamic layer
   colour bar · reveals · entrance · parallax · crosshair cursor
   Every motion path respects prefers-reduced-motion and coarse pointers. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var mobile = window.matchMedia("(max-width: 680px)");
  var doc = document.documentElement;

  /* ---------- colour bar reflects scroll progress ---------- */
  var fill = document.getElementById("cbfill");
  function progress() {
    var max = doc.scrollHeight - doc.clientHeight;
    var p = max > 0 ? (doc.scrollTop || window.pageYOffset) / max : 0;
    p = Math.max(0, Math.min(1, p));
    if (!fill) return;
    if (mobile.matches) { fill.style.width = (p * 100) + "%"; fill.style.height = ""; }
    else { fill.style.height = (p * 100) + "%"; fill.style.width = ""; }
  }

  /* ---------- image parallax on work rows ------------------ */
  var media = Array.prototype.slice.call(document.querySelectorAll(".wrow__media img"));
  function parallax() {
    if (reduce) return;
    var vh = window.innerHeight;
    for (var i = 0; i < media.length; i++) {
      var el = media[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      var t = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty("--py", (-6 + t * -7).toFixed(2) + "%");
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { progress(); parallax(); ticking = false; });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { progress(); parallax(); });
  progress(); parallax();

  /* ---------- reveal on scroll ----------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- entrance: masked line reveal ----------------- */
  document.body.classList.add("anim-ready");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add("anim-in"); });
  });

  /* ---------- custom crosshair cursor ---------------------- */
  if (!reduce && !coarse && window.matchMedia("(hover: hover)").matches) {
    var cur = document.createElement("div");
    cur.className = "cursor";
    cur.innerHTML = '<span class="cursor__ring"></span><span class="cursor__label">View ↗</span>';
    document.body.appendChild(cur);
    document.body.classList.add("has-cursor");

    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy, active = false;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; cur.classList.add("is-active"); }
    }, { passive: true });
    window.addEventListener("mouseleave", function () { active = false; cur.classList.remove("is-active"); });

    var viewers = Array.prototype.slice.call(document.querySelectorAll('[data-cursor="view"]'));
    viewers.forEach(function (el) {
      el.addEventListener("mouseenter", function () { cur.classList.add("is-view"); });
      el.addEventListener("mouseleave", function () { cur.classList.remove("is-view"); });
    });

    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.left = cx + "px"; cur.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();
  }
})();
