// Realistic Smoke/Vapor Cloud Effect - js/vapor-cloud.js

class VaporCloudEffect {
  constructor() {
    if (!sessionStorage.getItem('vapor-shown')) {
      this.createVaporCloud();
      sessionStorage.setItem('vapor-shown', 'true');
    }
  }

  createVaporCloud() {
    // Create fullscreen canvas for realistic smoke rendering
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Smoke particles system
    const particles = [];
    const numParticles = 200;
    let animationFrame = 0;
    const maxFrames = 300; // 5 seconds at 60fps
    
    // Create initial smoke burst from center
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * -2 - 1,
        size: Math.random() * 60 + 20,
        maxSize: Math.random() * 150 + 50,
        opacity: Math.random() * 0.8 + 0.2,
        age: 0,
        maxAge: 200 + Math.random() * 100,
        curl: Math.random() * 0.02 - 0.01, // For wispy movement
        curlOffset: Math.random() * Math.PI * 2
      });
    }
    
    const animate = () => {
      if (animationFrame >= maxFrames) {
        // Fade out the entire canvas
        canvas.style.transition = 'opacity 1s ease-out';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 1000);
        return;
      }
      
      // Clear with slight trail effect for more realism
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        // Age and fade particle
        particle.age++;
        if (particle.age > particle.maxAge) return;
        
        // Physics - wispy smoke movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Add curl/turbulence for realistic smoke flow
        particle.curlOffset += particle.curl;
        particle.x += Math.sin(particle.curlOffset) * 0.5;
        
        // Gravity and air resistance
        particle.vy += 0.01; // slight upward drift
        particle.vx *= 0.995; // air resistance
        particle.vy *= 0.995;
        
        // Expand size over time
        if (particle.size < particle.maxSize) {
          particle.size += 0.5;
        }
        
        // Calculate opacity based on age
        const ageRatio = particle.age / particle.maxAge;
        const currentOpacity = particle.opacity * (1 - ageRatio * ageRatio);
        
        if (currentOpacity > 0.01) {
          // Create gradient for each smoke puff
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          
          // Realistic smoke colors (white/gray with some variation)
          const baseOpacity = currentOpacity * 0.8;
          gradient.addColorStop(0, `rgba(255, 255, 255, ${baseOpacity})`);
          gradient.addColorStop(0.2, `rgba(240, 240, 240, ${baseOpacity * 0.7})`);
          gradient.addColorStop(0.5, `rgba(220, 220, 220, ${baseOpacity * 0.5})`);
          gradient.addColorStop(0.8, `rgba(200, 200, 200, ${baseOpacity * 0.3})`);
          gradient.addColorStop(1, `rgba(180, 180, 180, ${baseOpacity * 0.1})`);
          
          // Apply blend mode for realistic smoke interaction
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
      });
      
      // Add new particles for continuous effect (first 2 seconds)
      if (animationFrame < 120 && Math.random() < 0.3) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: canvas.height / 2 + (Math.random() - 0.5) * 200,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * -1.5 - 0.5,
          size: Math.random() * 30 + 10,
          maxSize: Math.random() * 100 + 40,
          opacity: Math.random() * 0.6 + 0.3,
          age: 0,
          maxAge: 150 + Math.random() * 100,
          curl: Math.random() * 0.02 - 0.01,
          curlOffset: Math.random() * Math.PI * 2
        });
      }
      
      animationFrame++;
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Add sound effect if you want
    // this.playVapeSound();
  }
  
  // Optional: Add a subtle vapor sound effect
  playVapeSound() {
    const audio = new Audio();
    audio.volume = 0.3;
    // You could add a subtle whoosh sound here
    // audio.src = 'path/to/vapor-sound.mp3';
    // audio.play().catch(() => {}); // Ignore if autoplay blocked
  }
}

// Alternative simpler CSS-based version
class SimpleVaporEffect {
  constructor() {
    if (!sessionStorage.getItem('vapor-shown')) {
      this.createCSSVapor();
      sessionStorage.setItem('vapor-shown', 'true');
    }
  }
  
  createCSSVapor() {
    const vaporContainer = document.createElement('div');
    vaporContainer.className = 'vapor-container';
    vaporContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.1);
    `;
    
    // Create multiple smoke clouds
    for (let i = 0; i < 8; i++) {
      const cloud = document.createElement('div');
      cloud.className = `vapor-cloud vapor-cloud-${i}`;
      cloud.style.cssText = `
        position: absolute;
        width: ${150 + Math.random() * 200}px;
        height: ${100 + Math.random() * 150}px;
        background: radial-gradient(ellipse, 
          rgba(255, 255, 255, 0.8) 0%,
          rgba(240, 240, 240, 0.6) 20%,
          rgba(220, 220, 220, 0.4) 40%,
          rgba(200, 200, 200, 0.2) 70%,
          transparent 100%
        );
        border-radius: 50% 60% 40% 70%;
        filter: blur(${4 + Math.random() * 8}px);
        left: ${window.innerWidth / 2 - 100 + (Math.random() - 0.5) * 300}px;
        top: ${window.innerHeight / 2 - 75 + (Math.random() - 0.5) * 200}px;
        animation: 
          vaporFloat ${3 + Math.random() * 2}s ease-out forwards,
          vaporRotate ${5 + Math.random() * 3}s linear forwards;
        animation-delay: ${i * 0.1}s;
      `;
      vaporContainer.appendChild(cloud);
    }
    
    document.body.appendChild(vaporContainer);
    
    // Auto remove after animation
    setTimeout(() => {
      vaporContainer.style.transition = 'opacity 1s ease-out';
      vaporContainer.style.opacity = '0';
      setTimeout(() => vaporContainer.remove(), 1000);
    }, 4000);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Use the canvas version for more realistic effect
  new VaporCloudEffect();
  // Or use SimpleVaporEffect for better performance
  // new SimpleVaporEffect();
});

// CSS animations for the simple version
const vaporStyles = `
  @keyframes vaporFloat {
    0% {
      transform: scale(0.3) translate(0, 0);
      opacity: 0.8;
    }
    30% {
      transform: scale(0.8) translate(0, -20px);
      opacity: 0.9;
    }
    100% {
      transform: scale(1.5) translate(var(--random-x, 50px), var(--random-y, -100px));
      opacity: 0;
    }
  }
  
  @keyframes vaporRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(var(--random-rotation, 15deg)); }
  }
  
  /* Add random values for each cloud */
  .vapor-cloud-0 { --random-x: 40px; --random-y: -80px; --random-rotation: 10deg; }
  .vapor-cloud-1 { --random-x: -30px; --random-y: -90px; --random-rotation: -15deg; }
  .vapor-cloud-2 { --random-x: 60px; --random-y: -70px; --random-rotation: 20deg; }
  .vapor-cloud-3 { --random-x: -50px; --random-y: -100px; --random-rotation: -10deg; }
  .vapor-cloud-4 { --random-x: 20px; --random-y: -85px; --random-rotation: 25deg; }
  .vapor-cloud-5 { --random-x: -40px; --random-y: -75px; --random-rotation: -20deg; }
  .vapor-cloud-6 { --random-x: 70px; --random-y: -95px; --random-rotation: 15deg; }
  .vapor-cloud-7 { --random-x: -20px; --random-y: -80px; --random-rotation: -25deg; }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = vaporStyles;
document.head.appendChild(styleSheet);
