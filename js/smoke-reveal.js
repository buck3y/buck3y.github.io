// Ultra Realistic Smoke Screen Reveal - js/smoke-reveal.js

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
    
    // Smoke particle system with enhanced realism
    const particles = [];
    const numParticles = 300;
    let animationFrame = 0;
    const totalFrames = 360; // 6 seconds
    
    // Create initial smoke wall from left
    for (let i = 0; i < numParticles; i++) {
      particles.push(this.createParticle(-200, i));
    }
    
    // Noise function for organic movement (simplified Perlin noise)
    const noise = (x, y, t) => {
      return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) * 0.5;
    };
    
    const animate = () => {
      if (animationFrame >= totalFrames) {
        setTimeout(() => {
          canvas.style.transition = 'opacity 1s ease-out';
          canvas.style.opacity = '0';
          setTimeout(() => canvas.remove(), 1000);
        }, 500);
        return;
      }
      
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add new particles from left edge
      if (animationFrame < 180) { // First 3 seconds
        for (let i = 0; i < 3; i++) {
          particles.push(this.createParticle(-100, particles.length));
        }
      }
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        // Age particle
        particle.age++;
        if (particle.age > particle.maxAge) {
          particles.splice(index, 1);
          return;
        }
        
        // Enhanced physics for realistic smoke
        const time = animationFrame * 0.1;
        
        // Add noise for organic movement
        particle.vx += noise(particle.x, particle.y, time) * 0.1;
        particle.vy += noise(particle.y, particle.x, time + 1000) * 0.1;
        
        // Apply forces
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Turbulence and swirling
        const turbulence = Math.sin(time + particle.seed) * 0.5;
        particle.vy += turbulence * 0.02;
        particle.vx += Math.cos(time + particle.seed * 2) * 0.03;
        
        // Friction and buoyancy
        particle.vx *= 0.998;
        particle.vy *= 0.998;
        particle.vy -= 0.01; // Slight upward drift
        
        // Size growth
        particle.size += particle.growth;
        if (particle.size > particle.maxSize) {
          particle.growth *= 0.95;
        }
        
        // Calculate opacity with multiple falloffs
        const ageRatio = particle.age / particle.maxAge;
        const edgeFade = Math.min(1, particle.x / 200); // Fade in from left
        const centerFade = 1 - Math.abs((particle.x - canvas.width/2) / (canvas.width/2));
        particle.currentOpacity = particle.opacity * (1 - Math.pow(ageRatio, 1.5)) * edgeFade;
        
        if (particle.currentOpacity > 0.01) {
          this.drawParticle(ctx, particle, time);
        }
      });
      
      // Add "CHOOCH.NET" reveal effect
      if (animationFrame > 120) {
        this.drawRevealText(ctx, animationFrame - 120);
      }
      
      animationFrame++;
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  createParticle(startX, index) {
    return {
      x: startX + Math.random() * 200,
      y: Math.random() * window.innerHeight,
      vx: 2 + Math.random() * 3,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 20 + 10,
      maxSize: 80 + Math.random() * 120,
      growth: 0.3 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.5,
      currentOpacity: 0,
      age: 0,
      maxAge: 200 + Math.random() * 150,
      seed: Math.random() * 1000,
      density: Math.random() // For layering effect
    };
  }
  
  drawParticle(ctx, particle, time) {
    // Create complex gradient for ultra-realistic smoke
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size
    );
    
    // Multiple color stops for depth
    const baseOpacity = particle.currentOpacity;
    gradient.addColorStop(0, `rgba(220, 220, 220, ${baseOpacity * 0.8})`);
    gradient.addColorStop(0.1, `rgba(200, 200, 200, ${baseOpacity * 0.7})`);
    gradient.addColorStop(0.3, `rgba(180, 180, 180, ${baseOpacity * 0.6})`);
    gradient.addColorStop(0.5, `rgba(160, 160, 160, ${baseOpacity * 0.5})`);
    gradient.addColorStop(0.7, `rgba(140, 140, 140, ${baseOpacity * 0.3})`);
    gradient.addColorStop(0.9, `rgba(120, 120, 120, ${baseOpacity * 0.1})`);
    gradient.addColorStop(1, `rgba(100, 100, 100, 0)`);
    
    // Apply different blend modes for layering
    if (particle.density > 0.7) {
      ctx.globalCompositeOperation = 'screen';
    } else if (particle.density > 0.4) {
      ctx.globalCompositeOperation = 'lighten';
    } else {
      ctx.globalCompositeOperation = 'normal';
    }
    
    // Draw the particle with slight deformation
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.scale(1 + Math.sin(time + particle.seed) * 0.1, 1 + Math.cos(time + particle.seed * 2) * 0.1);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add wispy edges
    ctx.globalCompositeOperation = 'normal';
    const edgeGradient = ctx.createRadialGradient(0, 0, particle.size * 0.7, 0, 0, particle.size * 1.3);
    edgeGradient.addColorStop(0, 'transparent');
    edgeGradient.addColorStop(0.5, `rgba(255, 255, 255, ${baseOpacity * 0.1})`);
    edgeGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = edgeGradient;
    ctx.beginPath();
    ctx.arc(0, 0, particle.size * 1.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
  }
  
  drawRevealText(ctx, frame) {
    const progress = Math.min(1, frame / 120);
    const alpha = Math.sin(progress * Math.PI) * 0.8;
    
    // Reveal effect for text
    ctx.globalCompositeOperation = 'destination-out';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    
    // Create text reveal mask
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
    
    // Animate text appearance
    const revealWidth = progress * 800;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(textX - revealWidth/2, textY - 60, revealWidth, 120);
    
    ctx.globalCompositeOperation = 'source-over';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new SmokeRevealEffect();
});
