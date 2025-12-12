// Core interactivity: theme, nav, skills animation, back-to-top, contact form
(function () {
  'use strict';

  // Elements (may be null if HTML doesn't include them; guard before use)
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const backToTop = document.getElementById('backToTop');
  const skillBars = Array.from(document.querySelectorAll('.skill-bar'));
  const contactForm = document.getElementById('contactForm');
  const yearEl = document.getElementById('year');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  // --- Theme toggle (persist) ---
  const THEME_KEY = 'prefers-theme';

  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');

    // Safe set aria if toggle exists
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    // update body class for any legacy selectors (optional)
    if (theme === 'dark') document.body.classList.add('is-dark'); else document.body.classList.remove('is-dark');
  }

  // Determine saved preference; prefer localStorage, fallback to system preference
  const savedFromStorage = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedFromStorage ? savedFromStorage : (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore storage errors */ }
    });
  }

  // --- Mobile nav toggle ---
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Close mobile nav on link click (if navMenu exists)
  if (navMenu && navLinks.length) {
    navLinks.forEach(a => a.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    }));
  }

  // --- Back to top button (guarded) ---
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backToTop.classList.add('show'); else backToTop.classList.remove('show');
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --- Skill bars animation using IntersectionObserver ---
  if ('IntersectionObserver' in window && skillBars.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target;
          const value = Number(bar.dataset.value) || 0;
          const fill = bar.querySelector('.skill-fill');
          if (fill) {
            // Animate to value (use percent)
            requestAnimationFrame(() => {
              fill.style.width = value + '%';
            });
            bar.setAttribute('aria-valuenow', String(value));
          }
          o.unobserve(bar);
        }
      });
    }, { threshold: 0.25 });

    skillBars.forEach(b => obs.observe(b));
  } else if (skillBars.length) {
    // Fallback: set all immediately
    skillBars.forEach(bar => {
      const value = Number(bar.dataset.value) || 0;
      const fill = bar.querySelector('.skill-fill');
      if (fill) fill.style.width = value + '%';
      bar.setAttribute('aria-valuenow', String(value));
    });
  }

  // --- Contact form (local demo) ---
  if (contactForm) {
    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const f = ev.target;
      const name = (f.name && f.name.value) ? f.name.value.trim() : '';
      const email = (f.email && f.email.value) ? f.email.value.trim() : '';

      // Basic validation
      if (!name || !email) {
        alert('Tolong isi nama dan email Anda.');
        return;
      }

      // demo behaviour: show success and reset form
      const submitBtn = f.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Kirim';
        }
        alert('Pesan terkirim (demo). Terima kasih, ' + name + '!');
        f.reset();
      }, 900);
    });
  }

  // --- Year auto-update (if element exists) ---
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();