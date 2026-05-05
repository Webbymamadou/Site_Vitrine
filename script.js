/**
 * IntelliRH — Système d'Intelligence des Gestions RH
 * Script principal · Projet ISI 2026
 * Fonctionnalités : scroll reveal, navbar, animations, navigation
 */

/* ============================================================
   1. NAVBAR — Effet au scroll
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ============================================================
   2. NAVIGATION RESPONSIVE — Menu mobile toggle
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navCta = document.querySelector('.nav-cta');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.style.display === 'flex';
  if (isOpen) {
    // Fermer le menu
    navLinks.style.display = 'none';
    navCta.style.display = 'none';
    navToggle.innerHTML = '<i class="ri-menu-3-line"></i>';
  } else {
    // Ouvrir le menu
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(248, 250, 255, 0.98)';
    navLinks.style.padding = '20px';
    navLinks.style.borderBottom = '1px solid var(--border)';
    navLinks.style.backdropFilter = 'blur(20px)';
    navCta.style.display = 'block';
    navCta.style.position = 'absolute';
    navCta.style.top = 'calc(100% + 90px)';
    navCta.style.left = '20px';
    navCta.style.right = '20px';
    navCta.style.zIndex = '999';
    navToggle.innerHTML = '<i class="ri-close-line"></i>';
  }
});

// Fermer le menu au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinks.style.display = 'none';
      navCta.style.display = 'none';
      navToggle.innerHTML = '<i class="ri-menu-3-line"></i>';
    }
  });
});

/* ============================================================
   3. SCROLL REVEAL — Apparition des éléments au défilement
   ============================================================ */

/**
 * Observer chaque élément avec la classe .reveal
 * Quand il entre dans le viewport → on ajoute .visible
 */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Délai progressif pour les enfants dans une grille
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      // Ne plus observer une fois visible (perf)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,       // déclenche quand 12% de l'élément est visible
  rootMargin: '0px 0px -40px 0px'  // légèrement avant le bas du viewport
});

// Appliquer l'observer à tous les éléments .reveal
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach((el, index) => {
  // Ajouter un délai progressif aux éléments dans une grille
  const parent = el.parentElement;
  const siblings = parent.querySelectorAll('.reveal');
  if (siblings.length > 1) {
    const sibIndex = Array.from(siblings).indexOf(el);
    el.dataset.delay = sibIndex * 100;
  }
  revealObserver.observe(el);
});

/* ============================================================
   4. BARRE DE PROGRESSION — Animation au scroll
   ============================================================ */
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.progress-fill');
      if (fill) {
        const targetWidth = fill.dataset.width || '70';
        setTimeout(() => {
          fill.style.width = targetWidth + '%';
        }, 400);
      }
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.advantage-main').forEach(el => {
  progressObserver.observe(el);
});

/* ============================================================
   5. SCROLL FLUIDE — Fonction utilitaire de navigation
   ============================================================ */

/**
 * Fait défiler la page vers la section cible
 * @param {string} sectionId - L'ID de la section cible
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const navHeight = navbar.offsetHeight;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionTop - navHeight - 20,
      behavior: 'smooth'
    });
  }
}

// Navigation active au scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(anchor => {
        anchor.classList.remove('active');
        if (anchor.getAttribute('href') === `#${id}`) {
          anchor.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(section => activeObserver.observe(section));

/* ============================================================
   6. EFFET PARALLAXE LÉGER — Shapes dans le hero
   ============================================================ */
const shapes = document.querySelectorAll('.shape');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  shapes.forEach((shape, i) => {
    const speed = (i + 1) * 0.15;
    shape.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

/* ============================================================
   7. EFFET HOVER — Cartes interactives
   ============================================================ */

/**
 * Ajoute un effet de lumière qui suit la souris sur les cartes
 */
const cards = document.querySelectorAll('.problem-card, .feature-card, .use-card, .team-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.background = `
      radial-gradient(circle at ${x}% ${y}%, rgba(37, 99, 235, 0.04) 0%, transparent 60%),
      var(--card-bg)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = 'var(--card-bg)';
  });
});

/* ============================================================
   8. COMPTEUR ANIMÉ — Stats du hero
   ============================================================ */

/**
 * Anime un nombre de 0 à sa valeur cible
 * @param {HTMLElement} el - L'élément contenant le nombre
 * @param {number} target - La valeur cible
 * @param {number} duration - Durée en ms
 */
function animateCounter(el, target, duration = 1500) {
  const isNumber = !isNaN(target);
  if (!isNumber) return; // Skip "IA" 

  let start = 0;
  const step = target / (duration / 16);
  const interval = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

// Observer pour les stats du hero
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(el => {
        const value = el.textContent;
        animateCounter(el, parseInt(value));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ============================================================
   9. INITIALISATION — S'exécute au chargement de la page
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Révéler immédiatement les éléments déjà dans le viewport
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => {
        el.classList.add('visible');
      }, parseInt(el.dataset.delay || 0));
    }
  });

  console.log('%c🧠 IntelliRH — Système chargé avec succès', 
    'color: #2563eb; font-size: 14px; font-weight: bold;');
  console.log('%c📌 Projet ISI 2026 — Membres A, B, C, D', 
    'color: #7c3aed; font-size: 12px;');
});

/* ============================================================
   10. STYLE LIEN ACTIF — Navigation
   ============================================================ */
// Ajouter le style actif dynamiquement
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--primary) !important;
    background: rgba(37, 99, 235, 0.08) !important;
  }
`;
document.head.appendChild(style);