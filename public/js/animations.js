// animations.js - Enhanced Version
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all animations
  initDarkModeToggle();
  initScrollAnimations();
  initHoverEffects();
  initParallaxEffect();
  initAchievementCounters();
  initBackgroundColorChange();
  initButtonRippleEffect();
  initFloatingElements();
  initTypingEffect();
});

// ===== Dark Mode Toggle =====
function initDarkModeToggle() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  if (!darkModeToggle) return;

  // Check local storage for saved preference
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) document.body.classList.add('dark-mode');

  darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isNowDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isNowDarkMode);
      
      // Animate toggle button
      darkModeToggle.animate([
          { transform: 'rotate(0deg)' },
          { transform: 'rotate(360deg)' }
      ], {
          duration: 500,
          easing: 'ease-in-out'
      });
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              animateElement(entry.target);
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });

  // Observe all animate-on-scroll elements
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
  });
}

function animateElement(el) {
  const animationType = el.dataset.animation || 'fadeIn';
  const delay = el.dataset.delay || 0;
  
  el.style.animation = `
      ${animationType} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards
  `;
}

// ===== Hover Effects =====
function initHoverEffects() {
  // Service Card Hover
  document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
      });
  });

  // Project Card Scale Effect
  document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
          card.style.transform = 'scale(1.03)';
      });
      
      card.addEventListener('mouseleave', () => {
          card.style.transform = 'scale(1)';
      });
  });
}

// ===== Parallax Effect =====
function initParallaxEffect() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.3;
      hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
  });
}

// ===== Achievement Counters =====
function initAchievementCounters() {
  const counters = document.querySelectorAll('.achievement-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              animateCounter(entry.target);
          }
      });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.textContent);
  const duration = 2000;
  const startTime = Date.now();
  
  function updateCounter() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
          requestAnimationFrame(updateCounter);
      }
  }
  
  requestAnimationFrame(updateCounter);
}

// ===== Background Color Change =====
function initBackgroundColorChange() {
  const sections = document.querySelectorAll('section');
  const colors = ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'];

  window.addEventListener('scroll', () => {
      sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
              document.body.style.backgroundColor = colors[index % colors.length];
          }
      });
  });
}

// ===== Button Ripple Effect =====
function initButtonRippleEffect() {
  document.querySelectorAll('button, .btn').forEach(button => {
      button.addEventListener('click', (e) => {
          const ripple = document.createElement('span');
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          ripple.className = 'ripple';

          button.appendChild(ripple);

          setTimeout(() => ripple.remove(), 600);
      });
  });

  // Add ripple effect styles
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
      .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
      }
      @keyframes ripple {
          to {
              transform: scale(4);
              opacity: 0;
          }
      }
  `;
  document.head.appendChild(rippleStyle);
}

// ===== Floating Elements =====
function initFloatingElements() {
  document.querySelectorAll('.floating').forEach(el => {
      el.style.animation = 'float 3s ease-in-out infinite';
  });

  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
      @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
      }
  `;
  document.head.appendChild(floatStyle);
}

// ===== Typing Effect =====
function initTypingEffect() {
  const typingElements = document.querySelectorAll('.typing');
  typingElements.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      let index = 0;

      function type() {
          if (index < text.length) {
              el.textContent += text.charAt(index);
              index++;
              setTimeout(type, 100);
          }
      }

      type();
  });
}

// ===== Animation Presets =====
const animations = {
  fadeIn: `
      @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
      }
  `,
  slideInLeft: `
      @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
      }
  `,
  zoomIn: `
      @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
      }
  `,
  bounce: `
      @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
      }
  `,
  rotate: `
      @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
      }
  `
};

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = Object.values(animations).join('');
document.head.appendChild(styleSheet);