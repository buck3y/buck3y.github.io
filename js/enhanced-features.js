updateStats() {
    // Count total services
    this.stats.totalServices = document.querySelectorAll('.service').length;
    
    // Count active services (with online status)
    this.stats.activeServices = document.querySelectorAll('.service-status.online, .service-status:not(.offline)').length;
    
    // Simulate response time check
    this.checkResponseTime();
    
    // Update UI
    this.displayStats();
  }

  async checkResponseTime() {
    const startTime = performance.now();
    try {
      // Simulate a quick check to one of your services
      await fetch('https://tv.room300.net', { method: 'HEAD', mode: 'no-cors' });
    } catch (error) {
      // Ignore CORS errors, we just want to measure timing
    }
    const endTime = performance.now();
    this.stats.responseTime = Math.round(endTime - startTime);
  }

  displayStats() {
    document.getElementById('total-services').textContent = this.stats.totalServices;
    document.getElementById('active-services').textContent = this.stats.activeServices;
    document.getElementById('response-time').textContent = `${this.stats.responseTime}ms`;
  }
}

// Enhanced Service Interactions
class ServiceInteractions {
  constructor() {
    this.setupServiceHovers();
    this.setupServiceAnalytics();
  }

  setupServiceHovers() {
    document.querySelectorAll('.service').forEach(service => {
      service.addEventListener('mouseenter', (e) => {
        this.showServicePreview(e.target);
      });

      service.addEventListener('mouseleave', (e) => {
        this.hideServicePreview(e.target);
      });

      service.addEventListener('click', (e) => {
        this.trackServiceClick(e.target);
      });
    });
  }

  showServicePreview(service) {
    const serviceName = service.querySelector('.service-name').textContent;
    const tooltip = document.createElement('div');
    tooltip.className = 'service-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-content">
        <h4>${serviceName}</h4>
        <p>Click to open</p>
        <div class="tooltip-stats">
          <span>Last used: ${this.getLastUsed(serviceName)}</span>
        </div>
      </div>
    `;
    
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '1000';
    tooltip.style.background = 'var(--bg-tertiary)';
    tooltip.style.padding = 'var(--space-sm)';
    tooltip.style.borderRadius = 'var(--border-radius)';
    tooltip.style.border = '1px solid var(--border-color)';
    tooltip.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    tooltip.style.backdropFilter = 'blur(10px)';
    
    const rect = service.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 80) + 'px';
    
    document.body.appendChild(tooltip);
    service._tooltip = tooltip;
  }

  hideServicePreview(service) {
    if (service._tooltip) {
      service._tooltip.remove();
      delete service._tooltip;
    }
  }

  trackServiceClick(service) {
    const serviceName = service.querySelector('.service-name').textContent;
    const usage = JSON.parse(localStorage.getItem('service-usage') || '{}');
    
    usage[serviceName] = {
      count: (usage[serviceName]?.count || 0) + 1,
      lastUsed: new Date().toISOString()
    };
    
    localStorage.setItem('service-usage', JSON.stringify(usage));
  }

  getLastUsed(serviceName) {
    const usage = JSON.parse(localStorage.getItem('service-usage') || '{}');
    const lastUsed = usage[serviceName]?.lastUsed;
    
    if (!lastUsed) return 'Never';
    
    const date = new Date(lastUsed);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }

  setupServiceAnalytics() {
    // Show most used services
    setInterval(() => {
      this.updatePopularServices();
    }, 60000); // Update every minute
  }

  updatePopularServices() {
    const usage = JSON.parse(localStorage.getItem('service-usage') || '{}');
    const popular = Object.entries(usage)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 3);
    
    // Optional: Show popular services indicator
    popular.forEach(([serviceName]) => {
      const service = Array.from(document.querySelectorAll('.service')).find(s => 
        s.querySelector('.service-name').textContent === serviceName
      );
      if (service && !service.classList.contains('featured')) {
        service.style.border = '2px solid var(--accent-secondary)';
      }
    });
  }
}

// Dynamic Theme Suggestions
class ThemeManager extends ThemeManager {
  constructor() {
    super();
    this.autoThemeEnabled = JSON.parse(localStorage.getItem('auto-theme') || 'false');
    this.setupAutoTheme();
  }

  setupAutoTheme() {
    if (this.autoThemeEnabled) {
      this.checkTimeBasedTheme();
      setInterval(() => this.checkTimeBasedTheme(), 60000); // Check every minute
    }
  }

  checkTimeBasedTheme() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 18) {
      // Daytime
      this.setTheme('light');
    } else if (hour >= 18 && hour < 22) {
      // Evening
      this.setTheme('cyberpunk');
    } else {
      // Night
      this.setTheme('matrix');
    }
  }

  enableAutoTheme() {
    this.autoThemeEnabled = true;
    localStorage.setItem('auto-theme', 'true');
    this.checkTimeBasedTheme();
  }

  disableAutoTheme() {
    this.autoThemeEnabled = false;
    localStorage.setItem('auto-theme', 'false');
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: 0
    };
    this.startTime = performance.now();
    this.init();
  }

  init() {
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now() - this.startTime;
      this.logMetrics();
    });

    // Monitor rendering performance
    this.observeRendering();
    
    // Monitor interaction performance
    this.observeInteractions();
  }

  observeRendering() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'measure') {
          this.metrics.renderTime = entry.duration;
        }
      });
    });
    observer.observe({ entryTypes: ['measure'] });
  }

  observeInteractions() {
    document.addEventListener('click', () => {
      const startTime = performance.now();
      requestAnimationFrame(() => {
        this.metrics.interactionTime = performance.now() - startTime;
      });
    });
  }

  logMetrics() {
    console.log('Performance Metrics:', this.metrics);
    
    // Show performance notification if slow
    if (this.metrics.loadTime > 2000) {
      const notification = new NotificationSystem();
      notification.show('Site loaded slowly. Consider optimizing.', 'warning');
    }
  }
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedHub();
  new ServiceInteractions();
  new PerformanceMonitor();
});

// Add CSS for tooltip and other enhancements
const additionalStyles = `
  .service-tooltip {
    animation: tooltip-fade 0.2s ease-out;
  }
  
  @keyframes tooltip-fade {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .tooltip-content h4 {
    margin: 0 0 var(--space-xs) 0;
    color: var(--text-primary);
  }
  
  .tooltip-content p {
    margin: 0 0 var(--space-xs) 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }
  
  .tooltip-stats {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
  
  .notification.success {
    border-left: 4px solid var(--accent-secondary);
  }
  
  .notification.warning {
    border-left: 4px solid var(--accent-tertiary);
  }
  
  .notification.error {
    border-left: 4px solid #ef4444;
  }
  
  .suggestion-category {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    margin-top: var(--space-xs);
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
