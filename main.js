/* ==========================================================================
   Country Condo's Ltd — Saila Bhoomi
   Site behaviour: nav, scroll state, reveals, FAQ, gallery, filters, forms
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Mobile navigation ------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primaryNav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('nav-open'));
    });

    // Close after tapping a real link
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link && !link.closest('.has-sub > .nav-link')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 920) setOpen(false);
    });
  }

  /* ---------- 2. Header scroll state ---------------------------------- */
  function initHeader() {
    var header = document.getElementById('siteHeader');
    if (!header || header.classList.contains('static')) return;

    var last = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      header.classList.toggle('is-stuck', y > 40);
      // Hide on downward scroll past the fold, show on the way back up
      var down = y > last && y > 400;
      header.classList.toggle('is-hidden', down && !document.body.classList.contains('nav-open'));
      last = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });

    update();
  }

  /* ---------- 3. Scroll reveals --------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. Count-up figures ------------------------------------- */
  function initCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.textContent = n.dataset.count + (n.dataset.suffix || ''); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var start = performance.now();
        var dur = 1100;

        (function step(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var value = target % 1 === 0
            ? Math.round(target * eased)
            : (target * eased).toFixed(1);
          el.textContent = value + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.5 });

    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 5. FAQ accordion ---------------------------------------- */
  function initFaq() {
    var buttons = document.querySelectorAll('.faq-q');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;

      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        // Single-open accordion
        buttons.forEach(function (other) {
          if (other === btn) return;
          var p = document.getElementById(other.getAttribute('aria-controls'));
          other.setAttribute('aria-expanded', 'false');
          if (p) p.style.height = '0px';
        });

        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        panel.style.height = isOpen ? '0px' : panel.scrollHeight + 'px';
      });
    });

    // Keep an open panel correctly sized on resize
    window.addEventListener('resize', function () {
      buttons.forEach(function (btn) {
        if (btn.getAttribute('aria-expanded') !== 'true') return;
        var p = document.getElementById(btn.getAttribute('aria-controls'));
        if (p) p.style.height = p.scrollHeight + 'px';
      });
    });
  }

  /* ---------- 6. Gallery lightbox ------------------------------------- */
  function initLightbox() {
    var shots = document.querySelectorAll('.shot');
    var box = document.getElementById('lightbox');
    if (!shots.length || !box) return;

    var stage = box.querySelector('.lightbox-art');
    var cap = box.querySelector('.lightbox-cap');
    var closeBtn = box.querySelector('.lightbox-close');
    var lastFocus = null;

    function open(shot) {
      var art = shot.querySelector('svg');
      var label = shot.querySelector('figcaption');
      lastFocus = shot;
      stage.innerHTML = art ? art.outerHTML : '';
      cap.textContent = label ? label.textContent.trim() : '';
      box.classList.add('open');
      box.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() {
      box.classList.remove('open');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    shots.forEach(function (shot) {
      shot.setAttribute('tabindex', '0');
      shot.setAttribute('role', 'button');
      shot.addEventListener('click', function () { open(shot); });
      shot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(shot); }
      });
    });

    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('open')) close();
    });
  }

  /* ---------- 7. Project filters -------------------------------------- */
  function initFilters() {
    var buttons = document.querySelectorAll('.filter');
    var cards = document.querySelectorAll('.project');
    if (!buttons.length || !cards.length) return;

    var empty = document.getElementById('noResults');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.filter;
        buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });

        var shown = 0;
        cards.forEach(function (card) {
          var match = key === 'all' || card.dataset.group === key;
          card.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });

        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  /* ---------- 8. Enquiry forms ---------------------------------------- */
  function initForms() {
    document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
      var ok = form.querySelector('.form-ok');

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        form.querySelectorAll('[required]').forEach(function (input) {
          var field = input.closest('.field') || input.closest('.consent');
          var good = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';

          if (good && input.type === 'email') {
            good = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
          }
          if (good && input.type === 'tel') {
            good = input.value.replace(/\D/g, '').length >= 10;
          }

          if (field) field.classList.toggle('invalid', !good);
          if (!good && valid) { input.focus(); }
          if (!good) valid = false;
        });

        if (!valid) return;

        // Static site: no backend. Hand the enquiry to the user's mail client
        // and confirm on screen so nothing is silently lost.
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (value, key) {
          if (key !== 'consent') lines.push(key + ': ' + value);
        });

        if (ok) {
          ok.classList.add('show');
          ok.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }

        var subject = 'Saila Bhoomi enquiry — ' + (data.get('name') || 'Website');
        window.location.href = 'mailto:info@countrycondos.co.in'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(lines.join('\n'));

        form.reset();
      });

      // Clear the error state as soon as the user corrects the field
      form.addEventListener('input', function (e) {
        var field = e.target.closest('.field') || e.target.closest('.consent');
        if (field) field.classList.remove('invalid');
      });
    });
  }

  /* ---------- 9. Back to top ------------------------------------------ */
  function initToTop() {
    var btn = document.getElementById('toTop');
    if (!btn) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle('show', window.scrollY > 700);
        ticking = false;
      });
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 10. Current year ---------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Boot ---------------------------------------------------- */
  function boot() {
    initNav();
    initHeader();
    initReveal();
    initCounters();
    initFaq();
    initLightbox();
    initFilters();
    initForms();
    initToTop();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
