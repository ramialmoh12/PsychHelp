const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');
const scrollTopBtn = document.querySelector('.scroll-top');
const sections = document.querySelectorAll('main section[id], footer[id]');

const closeMobileMenu = () => {
  navToggle.classList.remove('open');
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
};

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  navMenu.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('no-scroll', isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileMenu();
});

const handleScroll = () => {
  const isScrolled = window.scrollY > 24;
  header.classList.toggle('scrolled', isScrolled);
  scrollTopBtn.classList.toggle('show', window.scrollY > 600);
};

window.addEventListener('scroll', handleScroll);
handleScroll();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const countUp = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1400;
  const startTime = performance.now();

  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(easedProgress * target);
    element.textContent = target === 98 ? `${value}%` : `${value}+`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target === 98 ? '98%' : `${target}+`;
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const activeLinkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0,
  }
);

sections.forEach((section) => activeLinkObserver.observe(section));

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
