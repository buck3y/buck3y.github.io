// Fixed Smoke Reveal Effect - js/smoke-reveal.js

class SmokeRevealEffect {
  constructor() {
    if (!sessionStorage.getItem('smoke-shown')) {
      this.createSmokeReveal();
      sessionStorage.setItem('smoke-shown', 'true');
    }
  }

  createSmokeReveal() {
    // Create smoke canvas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      pointer-events: none;
      background: #000;
    `;
    
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Smoke parameters - more subtle and flowing
    const smokeParams = {
      particles: [],
      numParticles: 150, // Reduced for performance
      animationFrame: 0,
      totalFrames: 240 // 4 seconds at 60fps
    };
    
    // Create initial smoke from left
    for (let i = 0; i < smokeParams.numParticles; i++) {
      smokeParams.particles.push(this.createParticle(-100, i));
    }
    
    const animate = () => {
      if (smokeParams.animationFrame >= smokeParams.totalFrames) {
        // Fade out
        canvas.style.transition = 'opacity 0.8s ease-out';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 800);
        return;
      }
      
      // Clear with fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add new particles from left
      if (smokeParams.animationFrame < 120) { // First 2 seconds
        if (smokeParams.animationFrame % 2 === 0) { // Every other frame
          smokeParams.particles.push(this.createParticle(-50, smokeParams.particles.length));
        }
      }
      
      // Clean up dead particles
      smokeParams.particles = smokeParams.particles.filter(particle => particle.age < particle.maxAge);
      
      // Update and draw particles
      smokeParams.particles.forEach(particle => {
        // Age particle
        particle.age++;
        
        // Move particle - simple horizontal movement with slight variations
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Add some organic movement
        particle.vy += Math.sin(particle.x * 0.01 + smokeParams.animationFrame * 0.1) * 0.1;
        particle.vx += Math.cos(particle.y * 0.01 + smokeParams.animationFrame * 0.1) * 0.05;
        
        // Slight upward drift
        particle.vy -= 0.05;
        
        // Apply air resistance
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        // Grow size
        if (particle.size < particle.maxSize) {
          particle.size += 0.5;
        }
        
        // Calculate opacity
        const ageRatio = particle.age / particle.maxAge;
        const fadeIn = Math.min(1, particle.age / 30); // Fade in over first 30 frames
        const fadeOut = 1 - Math.pow(ageRatio, 2);
        particle.currentOpacity = particle.opacity * fadeIn * fadeOut;
        
        if (particle.currentOpacity > 0.01) {
          this.drawParticle(ctx, particle);
        }
      });
      
      smokeParams.animationFrame++;
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  createParticle(startX, index) {
    return {
      x: startX + Math.random() * 50,
      y: Math.random() * window.innerHeight,
      vx: 1.5 + Math.random() * 2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 20 + 10,
      maxSize: 60 + Math.random() * 80,
      opacity: 0.3 + Math.random() * 0.4,
      currentOpacity: 0,
      age: 0,
      maxAge: 120 + Math.random() * 60,
      seed: Math.random() * 1000
    };
  }
  
  drawParticle(ctx, particle) {
    // Simple gradient - no complex effects
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size
    );
    
    const alpha = particle.currentOpacity;
    gradient.addColorStop(0, `rgba(200, 200, 200, ${alpha * 0.8})`);
    gradient.addColorStop(0.4, `rgba(150, 150, 150, ${alpha * 0.6})`);
    gradient.addColorStop(0.7, `rgba(100, 100, 100, ${alpha * 0.3})`);
    gradient.addColorStop(1, `rgba(50, 50, 50, 0)`);
    
    // Simple blend mode
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new SmokeRevealEffect();
});
