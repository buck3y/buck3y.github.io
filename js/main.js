// Main JavaScript - Core functionality

// Search Functionality
class SearchManager {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.services = document.querySelectorAll('.service');
    this.categories = document.querySelectorAll('.category');
    this.init();
  }

  init() {
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clearSearch();
      }
    });
  }

  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      this.showAllServices();
      return;
    }

    this.services.forEach(service => {
      const serviceName = service.querySelector('.service-name').textContent.toLowerCase();
      const categoryName = service.closest('.category').querySelector('.category-title').textContent.toLowerCase();
      
      if (serviceName.includes(searchTerm) || categoryName.includes(searchTerm)) {
        service.style.display = 'flex';
        service.style.animation = 'fadeIn 0.3s ease';
      } else {
        service.style.display = 'none';
      }
    });

    this.updateVisibleCategories();
  }

  updateVisibleCategories() {
    this.categories.forEach(category => {
      const visibleServices = category.querySelectorAll('.service[style*="flex"]');
      if (visibleServices.length === 0) {
        category.style.display = 'none';
      } else {
        category.style.display = 'block';
      }
    });
  }

  showAllServices() {
    this.services.forEach(service => {
      service.style.display = 'flex';
    });
    this.categories.forEach(category => {
      category.style.display = 'block';
    });
  }

  clearSearch() {
    this.searchInput.value = '';
    this.showAllServices();
  }
}

// Service Status Checker
class StatusChecker {
  constructor() {
    this.statusItems = document.querySelectorAll('.status-item .status-indicator');
    this.serviceStatuses = document.querySelectorAll('.service-status');
    this.checkInterval = 30000; // 30 seconds
    this.init();
  }

  init() {
    this.checkAllStatuses();
    setInterval(() => this.checkAllStatuses(), this.checkInterval);
  }

  async checkAllStatuses() {
    // Simulate status checks for demo purposes
    const services = [
      { name: 'Jellyfin Server', url: 'https://tv.room300.net' },
      { name: 'Jukebox', url: 'https://jukebox.chooch.net' },
      { name: 'RSS Feed', url: 'https://rss.chooch.net' },
      { name: 'Seedbox', url: 'https://seedbox.chooch.net' }
    ];

    services.forEach((service, index) => {
      // Simulate random status for demo - replace with actual checks
      const isOnline = Math.random() > 0.2; // 80% online chance
      const indicator = this.statusItems[index];
      
      if (indicator) {
        indicator.classList.toggle('offline', !isOnline);
      }
    });
  }
}

// Keyboard Shortcuts
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = {
      '/': () => document.getElementById('search-input').focus(),
      'Escape': () => document.getElementById('search-input').blur(),
      't': () => document.getElementById('theme-toggle').click(),
      '1': () => this.openQuickAction(0),
      '2': () => this.openQuickAction(1),
      '3': () => this.openQuickAction(2),
      '4': () => this.openQuickAction(3)
    };
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      const key = e.key;
      if (this.shortcuts[key]) {
        e.preventDefault();
        this.shortcuts[key]();
      }
    });
  }

  openQuickAction(index) {
    const actions = document.querySelectorAll('.action-btn');
    if (actions[index]) {
      actions[index].click();
    }
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Monitor loading performance
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
      
      // Show performance indicator if slow
      if (loadTime > 1000) {
        this.showPerformanceWarning();
      }
    });
  }

  showPerformanceWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 10px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 1000;
    `;
    warning.textContent = 'Slow loading detected. Consider optimizing.';
    document.body.appendChild(warning);
    
    setTimeout(() => warning.remove(), 5000);
  }
}

// Service Worker for caching (optional)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.log('ServiceWorker registration failed: ', err);
  });
}

// Add dynamic favicons based on theme
function updateFavicon() {
  const theme = document.documentElement.getAttribute('data-theme');
  const favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.href = theme === 'dark' ? '/assets/favicon-dark.ico' : '/assets/favicon-light.ico';
    document.head.appendChild(newFavicon);
  } else {
    favicon.href = theme === 'dark' ? '/assets/favicon-dark.ico' : '/assets/favicon-light.ico';
  }
}

// Initialize core functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SearchManager();
  new StatusChecker();
  new KeyboardShortcuts();
  new PerformanceMonitor();
});
