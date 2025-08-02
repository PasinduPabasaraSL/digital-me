document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

document.querySelector('.contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('.submit-btn');
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

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'all 0.6s ease';
  observer.observe(section);
});

document.querySelector('.hero').style.opacity = '1';
document.querySelector('.hero').style.transform = 'translateY(0)';

const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('active');
});

const projectCardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.project-card').forEach(card => projectCardObserver.observe(card));

const aboutObserver = new IntersectionObserver((entries) => {
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
