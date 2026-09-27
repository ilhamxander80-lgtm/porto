/* ============================================
   PORTOFOLIO ILHAM — SCRIPT.JS
   ============================================ */

'use strict';

/* ===== CUSTOM CURSOR ===== */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  /* Deteksi touch device — nonaktifkan cursor custom */
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    document.querySelectorAll('*').forEach(el => el.style.cursor = '');
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  /* Warna trail bergantian primary/accent */
  const trailColors = ['#3B82F6', '#06B6D4', '#818CF8', '#22D3EE'];
  let trailIndex = 0;
  let lastTrailX = 0, lastTrailY = 0;
  const TRAIL_DISTANCE = 12; /* px antar sparkle */

  /* Update posisi dot langsung (smooth pakai rAF untuk ring) */
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    spawnTrail(mouseX, mouseY);
  });

  /* Ring mengikuti dengan lag (lerp) */
  function animateRing() {
    const ease = 0.12;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Spawn sparkle trail */
  function spawnTrail(x, y) {
    const dx = x - lastTrailX;
    const dy = y - lastTrailY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < TRAIL_DISTANCE) return;

    lastTrailX = x;
    lastTrailY = y;

    const spark = document.createElement('div');
    spark.className = 'cursor-trail';
    spark.style.left = x + 'px';
    spark.style.top  = y + 'px';
    spark.style.background = trailColors[trailIndex % trailColors.length];
    trailIndex++;

    /* Ukuran sedikit acak agar natural */
    const size = 4 + Math.random() * 4;
    spark.style.width  = size + 'px';
    spark.style.height = size + 'px';

    document.body.appendChild(spark);

    /* Hapus setelah animasi selesai */
    spark.addEventListener('animationend', () => spark.remove(), { once: true });
  }

  /* Hover state */
  const hoverTargets = 'a, button, [role="button"], .filter-btn, .project-card, .skill-card, .social-link, .back-to-top, input, textarea, label';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  /* Click state */
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  /* Masuk/keluar window */
  document.addEventListener('mouseenter', () => {
    document.body.classList.remove('cursor-out');
  });
  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-out');
  });
})();


/* ===== NAVBAR — SCROLL & ACTIVE LINK ===== */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

function onScroll() {
  /* Scrolled style */
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Active nav link */
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });

  /* Back to top */
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });


/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

function toggleMenu() {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);

/* Close menu when a link is clicked */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* Close menu on outside click */
document.addEventListener('click', e => {
  if (
    navMenu.classList.contains('open') &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


/* ===== TYPING EFFECT ===== */
const typingEl = document.getElementById('typingText');
const phrases = [
  'TJKT Student',
  'Networking Enthusiast',
  'IoT Learner',
  'Web Developer',
  'Technology Explorer',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    typingEl.textContent = current.slice(0, charIndex);
  } else {
    charIndex++;
    typingEl.textContent = current.slice(0, charIndex);
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    speed = 1800; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400; // pause before next phrase
  }

  typingTimer = setTimeout(type, speed);
}

/* Start typing after short delay */
setTimeout(type, 800);


/* ===== FADE-IN ON SCROLL (Intersection Observer) ===== */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => fadeObserver.observe(el));


/* ===== PROJECT FILTER ===== */
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    /* Update active button */
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;

      const show =
        filter === 'all' ||
        category === filter ||
        category === 'all';

      if (show) {
        card.classList.remove('hidden');
        /* Re-trigger fade if already visible */
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = '';
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* ===== BACK TO TOP ===== */
const backToTop = document.getElementById('backToTop');

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  /* Basic validation */
  if (!name || !email || !message) {
    showNote('Semua field harus diisi.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showNote('Format email tidak valid.', 'error');
    return;
  }

  /* Build WhatsApp URL fallback (no backend needed) */
  const waNumber = '62'; // ganti dengan nomor WA Ilham, contoh: 6281234567890
  const waText   = encodeURIComponent(
    `Halo Ilham!\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`
  );
  const waURL    = `https://wa.me/${waNumber}?text=${waText}`;

  /* Show success feedback */
  showNote('Pesan berhasil dikirim! Terima kasih 🚀', 'success');
  contactForm.reset();

  /* Open WhatsApp after short delay */
  setTimeout(() => {
    window.open(waURL, '_blank', 'noopener,noreferrer');
  }, 800);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNote(msg, type) {
  formNote.textContent = msg;
  formNote.className   = `form-note ${type}`;
  clearTimeout(formNote._timer);
  formNote._timer = setTimeout(() => {
    formNote.textContent = '';
    formNote.className   = 'form-note';
  }, 5000);
}


/* ===== SMOOTH SCROLL for anchor links (fallback for older browsers) ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ===== HERO ENTRANCE ANIMATION ===== */
(function heroEntrance() {
  const heroText  = document.querySelector('.hero-text');
  const heroImage = document.querySelector('.hero-image');

  if (heroText) {
    heroText.style.opacity  = '0';
    heroText.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroText.style.opacity    = '1';
      heroText.style.transform  = 'translateY(0)';
    }, 200);
  }

  if (heroImage) {
    heroImage.style.opacity  = '0';
    heroImage.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroImage.style.opacity    = '1';
      heroImage.style.transform  = 'translateY(0)';
    }, 400);
  }
})();


/* ===== KEYBOARD ACCESSIBILITY — close menu on Escape ===== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }
});
