/* ============================================================
   main.js  — GSAP animations, parallax, nav, filters
   ============================================================ */

// ---- Footer year ----
document.getElementById('current-year').textContent = new Date().getFullYear();

// ---- Register GSAP ScrollTrigger ----
gsap.registerPlugin(ScrollTrigger);

// ---- Mobile hamburger ----
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Sticky nav background ----
const navbar = document.getElementById('navbar');

ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: 'bottom top',
  onLeave: () => navbar.classList.add('scrolled'),
  onEnterBack: () => navbar.classList.remove('scrolled'),
});

// Also handle page-load state (if page is loaded scrolled)
if (window.scrollY > 100) navbar.classList.add('scrolled');

// ---- Active nav link highlighting ----
const sections = document.querySelectorAll('section[id]');

sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onToggle: self => {
      if (self.isActive) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${section.id}`);
        });
      }
    },
  });
});

// ---- Scroll-reveal animations ----
const revealElements = document.querySelectorAll('.reveal');

revealElements.forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    }
  );
});

// ---- Staggered project cards ----
document.querySelectorAll('.projects-grid, .ai-apps-grid').forEach(grid => {
  const cards = grid.querySelectorAll('.project-card, .ai-card');
  gsap.fromTo(cards,
    { opacity: 0, y: 60, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
});

// ---- Timeline items stagger ----
const tlItems = document.querySelectorAll('.tl-item');
gsap.fromTo(tlItems,
  { opacity: 0, x: -40 },
  {
    opacity: 1,
    x: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  }
);

// ---- Stat counter animation ----
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

statNumbers.forEach(el => {
  const target = parseInt(el.dataset.count, 10);

  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val) + '+';
        },
      });
    },
  });
});

// ---- Hero parallax on mousemove ----
const heroShapes = document.querySelectorAll('.hero-shape[data-parallax]');

document.addEventListener('mousemove', e => {
  const cx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 to 1
  const cy = (e.clientY / window.innerHeight - 0.5) * 2;

  heroShapes.forEach(shape => {
    const speed = parseFloat(shape.dataset.parallax) * 100;
    gsap.to(shape, {
      x: cx * speed,
      y: cy * speed,
      duration: 1,
      ease: 'power2.out',
    });
  });
});

// ---- Hero entrance animation ----
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .from('.hero-greeting', { opacity: 0, y: 20, duration: 0.6 }, 0.2)
  .from('.hero-name', { opacity: 0, y: 30, duration: 0.7 }, 0.35)
  .from('.hero-title', { opacity: 0, y: 20, duration: 0.6 }, 0.55)
  .from('.hero-desc', { opacity: 0, y: 20, duration: 0.6 }, 0.7)
  .from('.hero-cta-row', { opacity: 0, y: 20, duration: 0.5 }, 0.85)
  .from('.hero-photo-ring', { opacity: 0, scale: 0.8, duration: 0.9 }, 0.3)
  .from('.hero-orbit', { opacity: 0, scale: 0.5, duration: 0.8, stagger: 0.15 }, 0.5)
  .from('.scroll-indicator', { opacity: 0, y: -10, duration: 0.5 }, 1.2);

// ---- Project filter buttons ----
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hide');
        gsap.fromTo(card,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
        );
      } else {
        card.classList.add('hide');
      }
    });
  });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
