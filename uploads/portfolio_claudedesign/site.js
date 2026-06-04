/* ============================================================
   site.js — scroll reveal, scroll-spy nav, counters,
   hero parallax, email copy. (vanilla, no deps)
   ============================================================ */
(function () {
  'use strict';
  // Signals to the inline safety-net that core behaviour executed.
  window.__siteJsRan = true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- hero intro ---- */
  window.addEventListener('load', function () {
    requestAnimationFrame(function () {
      document.querySelector('.hero').classList.add('loaded');
    });
  });
  // fallback in case load already fired
  document.querySelector('.hero').classList.add('loaded');

  /* ---- reveal on scroll ---- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- nav: scrolled bg + scroll-spy ---- */
  var nav = document.getElementById('nav');
  var links = [].slice.call(document.querySelectorAll('#navLinks a'));
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });

  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    var pos = window.scrollY + window.innerHeight * 0.32;
    var current = -1;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i] && sections[i].offsetTop <= pos) current = i;
    }
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- count-up stats (0 → target, fast) ---- */
  function animateCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var comma = el.getAttribute('data-comma');
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var dur = 900, start = null;
    function fmt(n) {
      var body;
      if (dec > 0) { body = n.toFixed(dec); }
      else { var r = Math.round(n); body = comma ? r.toLocaleString('en-US') : String(r); }
      return prefix + body + suffix;
    }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }
  var countEls = [].slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.45 });
    countEls.forEach(function (el) { co.observe(el); });
  }

  /* ---- hero parallax (mouse + scroll) ---- */
  var photo = document.getElementById('heroPhoto');
  var pEls = photo ? [].slice.call(photo.querySelectorAll('[data-parallax]')) : [];
  var mx = 0, my = 0, sy = 0, rafPending = false;
  function applyParallax() {
    rafPending = false;
    pEls.forEach(function (el) {
      var k = parseFloat(el.getAttribute('data-parallax'));
      var tx = mx * k * 40;
      var ty = my * k * 40 + sy * k * 0.5;
      el.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)';
    });
  }
  function queue() { if (!rafPending) { rafPending = true; requestAnimationFrame(applyParallax); } }
  if (photo && !reduce) {
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      queue();
    });
    window.addEventListener('scroll', function () {
      var r = photo.getBoundingClientRect();
      sy = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight * -1;
      queue();
    }, { passive: true });
  }

  /* ---- float tag idle bob ---- */
  if (!reduce) {
    var tags = [].slice.call(document.querySelectorAll('.float-tag[data-parallax]'));
    var t0 = performance.now();
    (function bob(now) {
      var dt = (now - t0) / 1000;
      tags.forEach(function (el, i) {
        el.style.marginTop = (Math.sin(dt * 1.1 + i * 1.7) * 5).toFixed(1) + 'px';
      });
      requestAnimationFrame(bob);
    })(t0);
  }

  /* ---- email copy ---- */
  var emailBtn = document.getElementById('emailBtn');
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      var email = emailBtn.getAttribute('data-email');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { showToast('이메일 주소를 복사했어요 ✓'); },
          function () { window.location.href = 'mailto:' + email; }
        );
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  }
})();
