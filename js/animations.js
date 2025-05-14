// Animation Manager - Handles all visual effects and animations

class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.observeElements();
    this.addHoverEffects();
    this.initParallaxEffects();
  }

  observeElements() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, { threshold: 0.1 });

    // Observe categories for animation
    document.querySelectorAll('.category').forEach(category => {
      observer.observe(category);
    });
  }

  addHoverEffects() {
    // Add ripple effect to services
    document.querySelectorAll('.service').forEach(service => {
      service.addEventListener('click', (e) => {
        this.createRippleEffect(e, service);
      });
    });

    // Add magnetic effect to services
    document.querySelectorAll('.service').forEach(service => {
      service.addEventListener('mousemove', (e) => {
        this.magneticEffect(e, service);
      });

      service.addEventListener('mouseleave', () => {
        service.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = 20;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 1000;
    `;

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  magneticEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    element.style.transform = `
      translateY(-2px) 
      scale(1.02) 
      rotateY(${deltaX * 5}deg) 
      rotateX(${-deltaY * 5}deg)
    `;
  }

  initParallaxEffects() {
    // Simple parallax effect for header
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      header.style.transform = `translateY(${rate}px)`;
    });
  }

  // Utility method to add custom animations
  addCustomAnimation(element, animationName, duration = '0.5s', timing = 'ease') {
    element.style.animation = `${animationName} ${duration} ${timing}`;
    element.addEventListener('animationend', () => {
      element.style.animation = '';
    });
  }

  // Stagger animation for multiple elements
  staggerAnimation(elements, animationName, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.addCustomAnimation(element, animationName);
      }, index * delay);
    });
  }

  // Scroll-triggered animations
  initScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    scrollElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(50px)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.dataset.scroll;
          
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          element.style.transition = 'all 0.6s ease';
          
          if (animation) {
            element.classList.add(animation);
          }
        }
      });
    }, {
      rootMargin: '-100px 0px',
      threshold: 0.1
    });

    scrollElements.forEach(element => observer.observe(element));
  }
}

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
  new AnimationManager();
});
