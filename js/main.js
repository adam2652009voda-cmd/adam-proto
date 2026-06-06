/**
 * Adam Abdalla Elseby — Portfolio
 * Main JavaScript
 */

(function () {
  'use strict';

  /* --- Language Toggle --- */
  const langToggle = document.getElementById('lang-toggle');
  const savedLang = localStorage.getItem('lang') || 'en';
  applyLanguage(savedLang);

  langToggle?.addEventListener('click', () => {
    const next = window.currentLang === 'ar' ? 'en' : 'ar';
    applyLanguage(next);
  });

  /* --- Theme Toggle --- */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === 'light' ? '#fafafa' : '#0a0a0a';
    }
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* --- Header Scroll Effect --- */
  const header = document.getElementById('header');

  function handleScroll() {
    header?.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- Mobile Navigation --- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu?.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      navToggle?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* --- Active Nav Link on Scroll --- */
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* --- Scroll Reveal Animation --- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* --- Project Filtering --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);

        if (show) {
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = '';
        }
      });
    });
  });

  /* --- Project Video Previews --- */
  const previewBtns = document.querySelectorAll('.project-card__preview');
  const cardVideos = document.querySelectorAll('.project-card__video');
  const videoModal = document.getElementById('video-modal');
  const videoModalBackdrop = document.getElementById('video-modal-backdrop');
  const videoModalClose = document.getElementById('video-modal-close');
  const videoModalPlayer = document.getElementById('video-modal-player');
  const videoModalTitle = document.getElementById('video-modal-title');

  cardVideos.forEach((video) => {
    const card = video.closest('.project-card');

    card?.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    card?.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.hidden = true;
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (videoModalPlayer) {
      videoModalPlayer.pause();
      videoModalPlayer.removeAttribute('src');
      videoModalPlayer.load();
    }
  }

  function openVideoModal(src, title) {
    if (!videoModal || !videoModalPlayer) return;
    videoModalTitle.textContent = title;
    videoModalPlayer.src = src;
    videoModal.hidden = false;
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    videoModalPlayer.play().catch(() => {});
  }

  previewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.video;
      const title = btn.closest('.project-card')?.querySelector('h3')?.textContent?.trim() || '';
      if (src) openVideoModal(src, title);
    });
  });

  videoModalClose?.addEventListener('click', closeVideoModal);
  videoModalBackdrop?.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && !videoModal.hidden) {
      closeVideoModal();
    }
  });

  /* --- Animated Counters --- */
  const statNumbers = document.querySelectorAll('.stat-card__number');
  let countersAnimated = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statNumbers.forEach(animateCounter);
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const experienceSection = document.getElementById('experience');
  if (experienceSection) counterObserver.observe(experienceSection);

  /* --- Testimonials Carousel --- */
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonials-dots');
  const slides = track?.querySelectorAll('.testimonial-card');

  if (track && slides?.length) {
    let currentSlide = 0;
    let autoplayInterval;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonials__dot');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer?.appendChild(dot);
    });

    const dots = dotsContainer?.querySelectorAll('.testimonials__dot');

    function goToSlide(index) {
      currentSlide = ((index % slides.length) + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      dots?.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    let touchStartX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        resetAutoplay();
      }
    }, { passive: true });

    startAutoplay();

    track.closest('.testimonials__slider')?.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });

    track.closest('.testimonials__slider')?.addEventListener('mouseleave', startAutoplay);
  }

  /* --- Contact Form → WhatsApp --- */
  const WHATSAPP_NUMBER = '201002157715';
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  function buildWhatsAppMessage({ name, email, subject, message }, lang) {
    if (lang === 'ar') {
      return (
        `*رسالة جديدة من الموقع*\n\n` +
        `*الاسم:* ${name}\n` +
        `*البريد الإلكتروني:* ${email}\n` +
        `*الموضوع:* ${subject}\n\n` +
        `*الرسالة:*\n${message}`
      );
    }
    return (
      `*New Portfolio Message*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Subject:* ${subject}\n\n` +
      `*Message:*\n${message}`
    );
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const subject = contactForm.querySelector('#subject');
    const message = contactForm.querySelector('#message');
    const fields = [name, email, subject, message];
    let valid = true;

    fields.forEach((field) => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          field.classList.add('error');
          valid = false;
        }
      }
    });

    if (!valid) return;

    const lang = window.currentLang || 'en';
    const text = buildWhatsAppMessage(
      {
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim()
      },
      lang
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');

    contactForm.reset();
    formSuccess.hidden = false;

    setTimeout(() => {
      formSuccess.hidden = true;
    }, 5000);
  });

  /* --- Smooth anchor offset for fixed header --- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
