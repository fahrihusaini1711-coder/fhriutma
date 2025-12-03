// Core interactivity: theme, nav, skills animation, back-to-top, contact form
(function () {
  'use strict';

  // Elements
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
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
  }
  const saved = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);
  themeToggle && themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // --- Mobile nav toggle ---
  navToggle && navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close mobile nav on link click
  navLinks.forEach(a => a.addEventListener('click', () => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }));

  // --- Back to top button ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backToTop.classList.add('show'); else backToTop.classList.remove('show');
  });
  backToTop && backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // --- Skill bars animation using IntersectionObserver ---
  if ('IntersectionObserver' in window && skillBars.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target;
          const value = Number(bar.dataset.value) || 0;
          const fill = bar.querySelector('.skill-fill');
          if (fill) {
            fill.style.width = value + '%';
            bar.setAttribute('aria-valuenow', String(value));
          }
          o.unobserve(bar);
        }
      });
    }, { threshold: 0.25 });

    skillBars.forEach(b => obs.observe(b));
  } else {
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
      const name = f.name.value.trim();
      const email = f.email.value.trim();
      const message = f.message.value.trim();
      if (!name || !email || !message) {
        alert('Mohon lengkapi semua field sebelum mengirim.');
        return;
      }
      // Demo behaviour: open mailto with prefilled content (user can configure backend later)
      const subject = encodeURIComponent('Pesan dari Portofolio: ' + (name || 'Pengunjung'));
      const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;
      // Optionally reset
      f.reset();
    });
  }

  // --- Set current year ---
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Accessibility: focus outline management (keeps keyboard outline)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.remove('no-focus-outline');
  });

})();