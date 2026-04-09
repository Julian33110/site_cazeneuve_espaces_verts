/* ===========================
   HEADER SCROLL
=========================== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ===========================
   BURGER MENU
=========================== */
const burger = document.getElementById('nav-burger');
const menu   = document.getElementById('nav-menu');

burger?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
menu?.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu?.classList.contains('open')) {
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  }
});

/* ===========================
   ACTIVE NAV LINK
=========================== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  link.classList.toggle('active', href === currentPage);
});

/* ===========================
   COOKIE BANNER
=========================== */
const banner        = document.getElementById('cookie-banner');
const cookieAccept  = document.getElementById('cookie-accept');
const cookieRefuse  = document.getElementById('cookie-refuse');

if (banner) {
  const consent = localStorage.getItem('cookie-consent');
  if (consent) {
    banner.classList.add('hidden');
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.classList.add('hidden');
    // Init analytics here if accepted
  });

  cookieRefuse?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'refused');
    banner.classList.add('hidden');
  });
}

/* ===========================
   FOOTER YEAR
=========================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===========================
   SCROLL REVEAL (lightweight)
=========================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .about__image, .about__content').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
