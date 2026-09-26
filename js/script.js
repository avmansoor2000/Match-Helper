/**
 * Wedding Profile / Marriage Introduction Website
 * Vanilla JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Sticky Navbar Transition & ScrollSpy Helper
     ========================================================================== */
  const navbar = document.querySelector('.navbar-custom');
  const backToTopBtn = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.querySelector('.navbar-collapse');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Navbar background blur/solid transition
    if (scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run on page load

  // Close mobile navigation menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse?.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // Back to Top smooth scroll
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================================================
     2. Scroll Reveal Animations (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unavailable
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     3. Bootstrap Carousels Touch & Swipe Support
     ========================================================================== */
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carouselEl => {
    // Initialize standard bootstrap carousel instance with 4s auto interval
    const bsCarousel = new bootstrap.Carousel(carouselEl, {
      interval: 4000,
      pause: 'hover',
      wrap: true,
      touch: true
    });

    // Touch swipe handler for enhanced mobile gestures
    let touchStartX = 0;
    let touchEndX = 0;

    carouselEl.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselEl.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          bsCarousel.next();
        } else {
          bsCarousel.prev();
        }
      }
    };
  });

  /* ==========================================================================
     4. Gallery Filter & Lightbox Engine
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightboxModal = document.getElementById('galleryLightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxPrevBtn = document.getElementById('lightboxPrev');
  const lightboxNextBtn = document.getElementById('lightboxNext');

  let currentFilteredItems = [...galleryItems];
  let currentImageIndex = 0;
  let bsLightboxModal = null;

  if (lightboxModal) {
    bsLightboxModal = new bootstrap.Modal(lightboxModal);
  }

  // Filter Categories
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 30);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });

      // Update current active filtered list for lightbox navigation
      if (filterValue === 'all') {
        currentFilteredItems = [...galleryItems];
      } else {
        currentFilteredItems = galleryItems.filter(item => item.getAttribute('data-category') === filterValue);
      }
    });
  });

  // Open Lightbox
  const openLightbox = (index) => {
    if (!currentFilteredItems.length || index < 0 || index >= currentFilteredItems.length) return;
    currentImageIndex = index;
    const activeItem = currentFilteredItems[currentImageIndex];
    const imgElement = activeItem.querySelector('img');
    const category = activeItem.getAttribute('data-category-label') || activeItem.getAttribute('data-category');
    const title = activeItem.getAttribute('data-caption') || 'Memorable Moment';

    if (lightboxImg && imgElement) {
      lightboxImg.src = imgElement.src;
      lightboxImg.alt = imgElement.alt || title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;
    if (lightboxCounter) lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentFilteredItems.length}`;

    bsLightboxModal?.show();
  };

  const showNextLightbox = () => {
    currentImageIndex = (currentImageIndex + 1) % currentFilteredItems.length;
    openLightbox(currentImageIndex);
  };

  const showPrevLightbox = () => {
    currentImageIndex = (currentImageIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length;
    openLightbox(currentImageIndex);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const activeIdx = currentFilteredItems.indexOf(item);
      if (activeIdx !== -1) {
        openLightbox(activeIdx);
      }
    });
  });

  lightboxNextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextLightbox();
  });

  lightboxPrevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevLightbox();
  });

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal?.classList.contains('show')) {
      if (e.key === 'ArrowRight') {
        showNextLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrevLightbox();
      }
    }
  });

  /* ==========================================================================
     5. Smooth Scroll Navigation for Anchor Links
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  console.log('Wedding & Personal Marriage Profile loaded successfully.');
});
