document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href') || '';
      const isHash = href.startsWith('#');

      if (!isHash) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior: smooth, block: 'start' });

      history.pushState(null, '', href);

      const navList = document.querySelector('.nav-list');
      if (navList) navList.classList.remove('active');
    });
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('.submit-btn');
      if (!btn) return;

      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';

      setTimeout(() => {
        btn.textContent = 'Message Sent!';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.opacity = '1';
          this.reset();
        }, 2000);
      }, 1500);
    });
  }

  const sectionObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, sectionObserverOptions);

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    sectionObserver.observe(section);
  });

  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = '1';
    hero.style.transform = 'translateY(0)';
  }

  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');

  if (hamburger && navList) {
    const toggleMenu = () => navList.classList.toggle('active');
    hamburger.addEventListener('click', toggleMenu);

    hamburger.setAttribute('tabindex', '0');
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  const projectCardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });

  document.querySelectorAll('.project-card').forEach(card => {
    projectCardObserver.observe(card);
  });

  const aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.slide-left, .slide-right').forEach(el => {
    aboutObserver.observe(el);
  });

  const navLinks = Array.from(document.querySelectorAll('nav a'))
    .filter(a => (a.getAttribute('href') || '').startsWith('#'));

  if (navLinks.length) {
    const sectionMap = navLinks
      .map(a => ({ id: a.getAttribute('href'), link: a }))
      .filter(m => !!document.querySelector(m.id));

    const spyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = `#${entry.target.id}`;
        const item = sectionMap.find(m => m.id === id);
        if (!item) return;

        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          item.link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

    sectionMap.forEach(m => {
      const sec = document.querySelector(m.id);
      if (sec) spyObserver.observe(sec);
    });
  }
});
