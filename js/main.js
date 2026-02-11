/* ============================================
   PartyInsiders - Main JavaScript
   Navigation, Scroll Effects, Animations
   ============================================ */

(function () {
  'use strict';

  // ---- DOM Elements ----
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = navMenu ? navMenu.querySelectorAll('.nav__link') : [];

  // ---- Navigation: Scroll Effect ----
  let lastScrollY = 0;
  let ticking = false;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  }, { passive: true });

  // ---- Navigation: Mobile Menu ----
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.contains('active');

      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', !isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu when a link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ---- Scroll Reveal (Intersection Observer) ----
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Staggered reveal for grid children ----
  function initStaggeredReveal() {
    var grids = document.querySelectorAll(
      '.nightarc__timeline, .pii__cities, .enter__grid, .for__grid, .routes__list, .faq__list'
    );

    grids.forEach(function (grid) {
      var children = grid.querySelectorAll('.reveal');
      children.forEach(function (child, index) {
        child.style.transitionDelay = (index * 0.08) + 's';
      });
    });
  }

  // ---- Smooth scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = nav ? nav.offsetHeight : 0;
          var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ---- Parallax effect on hero background ----
  function initHeroParallax() {
    var heroBgImg = document.querySelector('.hero__bg-img');
    if (!heroBgImg) return;

    // Only on desktop
    if (window.innerWidth < 768) return;

    var heroSection = document.querySelector('.hero');

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.scrollY;
          var heroHeight = heroSection.offsetHeight;

          if (scrollY < heroHeight) {
            var translateY = scrollY * 0.3;
            heroBgImg.style.transform = 'scale(1.05) translateY(' + translateY + 'px)';
          }
        });
      }
    }, { passive: true });
  }

  // ---- FAQ accordion smooth animation ----
  function initFaqAnimation() {
    var faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(function (item) {
      var summary = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');

      if (!summary || !answer) return;

      summary.addEventListener('click', function (e) {
        e.preventDefault();

        var isOpen = item.hasAttribute('open');

        // Close all other items
        faqItems.forEach(function (other) {
          if (other !== item && other.hasAttribute('open')) {
            other.removeAttribute('open');
          }
        });

        if (isOpen) {
          item.removeAttribute('open');
        } else {
          item.setAttribute('open', '');
        }
      });
    });
  }

  // ---- Ticker pause on hover ----
  function initTickerPause() {
    var ticker = document.querySelector('.ticker');
    var track = document.querySelector('.ticker__track');

    if (!ticker || !track) return;

    ticker.addEventListener('mouseenter', function () {
      track.style.animationPlayState = 'paused';
    });

    ticker.addEventListener('mouseleave', function () {
      track.style.animationPlayState = 'running';
    });
  }

  // ---- Initialize everything ----
  function init() {
    initScrollReveal();
    initStaggeredReveal();
    initSmoothScroll();
    initHeroParallax();
    initFaqAnimation();
    initTickerPause();

    // Trigger nav scroll check on load
    handleNavScroll();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
