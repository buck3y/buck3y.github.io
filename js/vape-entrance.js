// Enhanced Vape Cloud Entrance Effect - js/vape-entrance.js

class VapeEntranceEffect {
  constructor() {
    this.hasPlayed = sessionStorage.getItem('vape-entrance-played');
    if (!this.hasPlayed) {
      this.createVapeCloud();
      sessionStorage.setItem('vape-entrance-played', 'true');
    }
  }

  createVapeCloud() {
    // Create fullscreen canvas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.8);
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Vape cloud properties
    const clouds = [];
    const numClouds = 8;
    
    // Create multiple cloud layers
    for (let i = 0; i < numClouds; i++) {
      clouds.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        radius: 0,
        maxRadius: 150 + Math.random() * 100,
        alpha: 0.8 - (i * 0.1),
        speed: 2 + i * 0.3,
        angle: (Math.PI * 2 / numClouds) * i,
        timeOffset: i * 100
      });
    }
    
    let animationFrame = 0;
    const maxFrames = 180; // 3 seconds at 60fps
    
    const animate = () => {
      if (animationFrame >= maxFrames) {
        // Fade out the canvas
        canvas.style.transition = 'opacity 0.5s ease-out';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.remove(), 500);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fade background
      const bgAlpha = Math.max(0.8 - (animationFrame / maxFrames), 0);
      ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw clouds
      clouds.forEach(cloud => {
        const progress = (animationFrame + cloud.timeOffset) / maxFrames;
        
        // Expand cloud
        if (progress < 0.5) {
          cloud.radius = (progress * 2) * cloud.maxRadius;
        } else {
          cloud.radius = cloud.maxRadius;
        }
        
        // Move cloud
        cloud.x += Math.cos(cloud.angle) * cloud.speed;
        cloud.y += Math.sin(cloud.angle) * cloud.speed;
        
        // Fade out cloud
        const fadeProgress = Math.max(progress, 0);
        const currentAlpha = cloud.alpha * (1 - fadeProgress);
        
        // Create gradient for cloud
        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.radius
        );
        
        // Green vape colors
        gradient.addColorStop(0, `rgba(0, 255, 65, ${currentAlpha * 0.8})`);
        gradient.addColorStop(0.3, `rgba(0, 200, 50, ${currentAlpha * 0.6})`);
        gradient.addColorStop(0.6, `rgba(0, 150, 35, ${currentAlpha * 0.4})`);
        gradient.addColorStop(1, `rgba(0, 100, 20, ${currentAlpha * 0.1})`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some wispy edges
        ctx.fillStyle = `rgba(0, 255, 65, ${currentAlpha * 0.2})`;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Add "CHOOCH" text in the center
      if (animationFrame > 30 && animationFrame < 150) {
        const textAlpha = Math.sin((animationFrame - 30) / 120 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 255, 65, 0.5)';
        ctx.shadowBlur = 20;
        ctx.fillText('CHOOCH', window.innerWidth / 2, window.innerHeight / 2);
        ctx.shadowBlur = 0; // Reset shadow
      }
      
      animationFrame++;
      requestAnimationFrame(animate);
    };
    
    animate();
  }
}

// Super minimal version - just the cloud without text
class SimpleVapeCloud {
  constructor() {
    if (!sessionStorage.getItem('vape-shown')) {
      this.showCloud();
      sessionStorage.setItem('vape-shown', 'true');
    }
  }
  
  showCloud() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    // Create cloud container
    const cloudContainer = document.createElement('div');
    cloudContainer.innerHTML = `
      <div class="vape-cloud">
        <div class="cloud-layer cloud-1"></div>
        <div class="cloud-layer cloud-2"></div>
        <div class="cloud-layer cloud-3"></div>
        <div class="cloud-layer cloud-4"></div>
      </div>
    `;
    
    overlay.appendChild(cloudContainer);
    document.body.appendChild(overlay);
    
    // Auto remove after animation
    setTimeout(() => {
      overlay.style.transition = 'opacity 0.5s ease-out';
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 500);
    }, 2500);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Use SimpleVapeCloud for cleaner effect
  new SimpleVapeCloud();
});

// Add CSS for the vape cloud animation
const vapeStyles = `
  .vape-cloud {
    position: relative;
    width: 300px;
    height: 300px;
  }
  
  .cloud-layer {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 255, 65, 0.8) 0%, rgba(0, 200, 50, 0.6) 30%, rgba(0, 150, 35, 0.3) 60%, transparent 100%);
    animation: cloudExpand 2.5s ease-out forwards;
  }
  
  .cloud-1 {
    width: 200px;
    height: 200px;
    top: 50px;
    left: 50px;
    animation-delay: 0s;
  }
  
  .cloud-2 {
    width: 180px;
    height: 180px;
    top: 20px;
    left: 70px;
    animation-delay: 0.2s;
  }
  
  .cloud-3 {
    width: 220px;
    height: 220px;
    top: 40px;
    left: 30px;
    animation-delay: 0.4s;
  }
  
  .cloud-4 {
    width: 160px;
    height: 160px;
    top: 70px;
    left: 90px;
    animation-delay: 0.6s;
  }
  
  @keyframes cloudExpand {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    20% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.5) translate(var(--random-x, 10px), var(--random-y, -20px));
      opacity: 0;
    }
  }
  
  /* Add some randomness to each cloud */
  .cloud-1 { --random-x: 20px; --random-y: -30px; }
  .cloud-2 { --random-x: -15px; --random-y: -25px; }
  .cloud-3 { --random-x: 25px; --random-y: -15px; }
  .cloud-4 { --random-x: -20px; --random-y: -35px; }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = vapeStyles;
document.head.appendChild(styleSheet);
