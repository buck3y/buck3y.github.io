// Animated Chooch Smoke Effect - Add to js/smoke-effect.js

class ChoochSmokeEffect {
  constructor() {
    this.particles = [];
    this.maxParticles = 15;
    this.canvas = null;
    this.ctx = null;
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    this.createCanvas();
    this.bindEvents();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.7;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.createParticle();
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }

    this.particles.push({
      x: this.mouse.x + (Math.random() - 0.5) * 20,
      y: this.mouse.y + (Math.random() - 0.5) * 20,
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * -2 - 1,
      alpha: 1,
      decay: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.5 ? '#00ff41' : '#4ade80'
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.alpha -= particle.decay;
      particle.size += 0.1;
      
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
        return;
      }
      
      // Create gradient for smoke effect
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${particle.color}00`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Enhanced particle system for ambient effects
class AmbientParticles {
  constructor() {
    this.particles = [];
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.init();
  }

  init() {
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.3;
    `;
    document.body.appendChild(this.canvas);
    this.resize();
    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.5 ? '#00ff41' : '#22d3ee',
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      this.ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new ChoochSmokeEffect();
  new AmbientParticles();
});
