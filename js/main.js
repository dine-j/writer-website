'use strict';

/* ─── NAV: scroll state ──────────────────────────────────── */

const nav = document.getElementById('nav');

function updateNav() {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── NAV: mobile toggle ─────────────────────────────────── */

const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navToggle.focus();
  }
});

/* ─── SCROLL-TRIGGERED FADE-INS ──────────────────────────── */

const fadeTargets = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fadeTargets.forEach(el => observer.observe(el));

/* ─── SMOOTH SCROLL: nav anchor clicks ───────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    const navHeight = nav.offsetHeight;
    const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

/* ─── ACTIVE NAV LINK highlighting ──────────────────────────
   Highlights the nav link whose section is in view.           */

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--text)'
          : '';
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach(s => sectionObserver.observe(s));
