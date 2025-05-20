// Animation Manager - Handles all visual effects and animations

class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.observeElements();
    this.addHoverEffects();
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
    document.querySelectorAll('.category-section').forEach(category => {
      observer.observe(category);
    });
  }

  addHoverEffects() {
    // Add ripple effect to action buttons
    document.querySelectorAll('.action-btn').forEach(action => {
      action.addEventListener('click', (e) => {
        this.createRippleEffect(e, action);
      });
    });

    // Add magnetic effect to action buttons
    document.querySelectorAll('.action-btn').forEach(action => {
      action.addEventListener('mousemove', (e) => {
        this.subtleMagneticEffect(e, action);
      });

      action.addEventListener('mouseleave', () => {
        action.style.transform = 'translateY(0) scale(1)';
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

  subtleMagneticEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    // Very subtle effect, just enough to be noticeable
    element.style.transform = `
      translateY(-1px) 
      scale(1.01) 
      rotateY(${deltaX * 2}deg) 
      rotateX(${-deltaY * 2}deg)
    `;
  }

  // Utility method to add custom animations
  addCustomAnimation(element, animationName, duration = '0.5s', timing = 'ease') {
    element.style.animation = `${animationName} ${duration} ${timing}`;
    element.addEventListener('animationend', () => {
      element.style.animation = '';
    });
  }
}

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
  new AnimationManager();
});
