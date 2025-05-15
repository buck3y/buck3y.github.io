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



// Enhanced Search Functionality - Add to your existing main.js or enhanced-features.js

class EnhancedSearch {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.services = this.getAllServices();
    this.suggestionsList = null;
    this.currentSuggestionIndex = -1;
    this.init();
  }

  init() {
    this.createSuggestionsContainer();
    this.bindEvents();
  }

  createSuggestionsContainer() {
    // Create suggestions container if it doesn't exist
    const suggestionsContainer = document.getElementById('search-suggestions') || document.createElement('div');
    suggestionsContainer.id = 'search-suggestions';
    suggestionsContainer.className = 'search-suggestions';
    
    // Position it after the search input
    if (!document.getElementById('search-suggestions')) {
      this.searchInput.parentNode.appendChild(suggestionsContainer);
    }
  }

  bindEvents() {
    // Show suggestions on focus
    this.searchInput.addEventListener('focus', () => {
      if (this.searchInput.value) {
        this.showSuggestions(this.searchInput.value);
      }
    });

    // Hide suggestions on click outside
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !document.getElementById('search-suggestions').contains(e.target)) {
        this.hideSuggestions();
      }
    });

    // Handle input
    this.searchInput.addEventListener('input', (e) => {
      this.showSuggestions(e.target.value);
    });

    // Handle keyboard navigation
    this.searchInput.addEventListener('keydown', (e) => {
      const suggestionsContainer = document.getElementById('search-suggestions');
      const suggestions = suggestionsContainer.children;

      if (suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.currentSuggestionIndex = Math.min(this.currentSuggestionIndex + 1, suggestions.length - 1);
          this.highlightSuggestion();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.currentSuggestionIndex = Math.max(this.currentSuggestionIndex - 1, -1);
          this.highlightSuggestion();
          break;
        case 'Enter':
          e.preventDefault();
          if (this.currentSuggestionIndex >= 0) {
            suggestions[this.currentSuggestionIndex].click();
          } else if (this.searchInput.value) {
            this.searchAndNavigate(this.searchInput.value);
          }
          break;
        case 'Escape':
          this.hideSuggestions();
          this.searchInput.blur();
          break;
      }
    });
  }

  getAllServices() {
    const services = [];
    document.querySelectorAll('.service').forEach(service => {
      const name = service.querySelector('.service-name').textContent;
      const url = service.href;
      const category = service.closest('.category').querySelector('.category-title').textContent;
      services.push({ name, url, category });
    });
    return services;
  }

  showSuggestions(query) {
    if (!query || query.length < 2) {
      this.hideSuggestions();
      return;
    }

    const matches = this.services.filter(service =>
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const suggestionsContainer = document.getElementById('search-suggestions');
    suggestionsContainer.innerHTML = '';

    if (matches.length === 0) {
      // Show "search with Google" option
      const searchItem = document.createElement('div');
      searchItem.className = 'search-suggestion-item';
      searchItem.innerHTML = `
        <div class="suggestion-icon">🔍</div>
        <div class="suggestion-text">Search for "${query}" with Google</div>
      `;
      searchItem.addEventListener('click', () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        this.hideSuggestions();
      });
      suggestionsContainer.appendChild(searchItem);
    }

    matches.forEach((match, index) => {
      const item = document.createElement('div');
      item.className = 'search-suggestion-item';
      item.innerHTML = `
        <div class="suggestion-icon">${this.getServiceIcon(match.name)}</div>
        <div class="suggestion-text">
          <div class="suggestion-name">${match.name}</div>
          <div class="suggestion-category">${match.category}</div>
        </div>
      `;
      
      item.addEventListener('click', () => {
        window.open(match.url, '_blank');
        this.hideSuggestions();
      });
      
      suggestionsContainer.appendChild(item);
    });

    suggestionsContainer.classList.add('show');
    this.currentSuggestionIndex = -1;
  }

  hideSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    suggestionsContainer.classList.remove('show');
    this.currentSuggestionIndex = -1;
  }

  highlightSuggestion() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    const suggestions = suggestionsContainer.children;
    
    // Remove previous highlights
    Array.from(suggestions).forEach(item => item.classList.remove('highlighted'));
    
    // Highlight current suggestion
    if (this.currentSuggestionIndex >= 0) {
      suggestions[this.currentSuggestionIndex].classList.add('highlighted');
    }
  }

  getServiceIcon(serviceName) {
    // Return appropriate emoji based on service name
    const iconMap = {
      'YouTube': '▶️',
      'Gmail': '✉️',
      'GitHub': '🐙',
      'Bitwarden': '🔐',
      'Jellyfin': '📺',
      'Tutanota': '✉️',
      'Disroot': '📬',
      'Catbox': '🐱',
      'Real-Debrid': '⚡',
      'Seedbox': '📦',
      'Soulseek': '🎵',
      'ProtonMail': '🔒',
      'VS Code': '💻',
      'Notion': '📝',
      'LibGen': '📚',
      'Udemy': '🎯',
      'IP Location': '🌐',
      'RSS': '📡'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (serviceName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return '🔗'; // Default icon
  }

  searchAndNavigate(query) {
    // Try to find a direct match first
    const directMatch = this.services.find(service => 
      service.name.toLowerCase() === query.toLowerCase()
    );
    
    if (directMatch) {
      window.open(directMatch.url, '_blank');
    } else {
      // Fall back to Google search
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
    this.hideSuggestions();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedSearch();
});

// Slash key to focus search
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && e.target.tagName !== 'INPUT') {
    e.preventDefault();
    document.getElementById('search-input').focus();
  }
});
