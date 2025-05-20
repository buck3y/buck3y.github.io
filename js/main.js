// Main JavaScript - Core functionality

// Search Functionality
class SearchManager {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.actions = document.querySelectorAll('.action-btn');
    this.categories = document.querySelectorAll('.category-section');
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
      this.showAllItems();
      return;
    }

    this.actions.forEach(action => {
      const actionText = action.textContent.toLowerCase();
      const actionParent = action.closest('.category-section');
      const categoryTitle = actionParent ? 
        actionParent.querySelector('.category-title').textContent.toLowerCase() : '';
      
      if (actionText.includes(searchTerm) || categoryTitle.includes(searchTerm)) {
        action.style.display = 'flex';
        action.style.animation = 'fadeIn 0.3s ease';
        if (actionParent) {
          actionParent.style.display = 'block';
        }
      } else {
        action.style.display = 'none';
      }
    });

    this.updateVisibleCategories();
  }

  updateVisibleCategories() {
    this.categories.forEach(category => {
      const visibleActions = category.querySelectorAll('.action-btn[style*="flex"]');
      if (visibleActions.length === 0) {
        category.style.display = 'none';
      } else {
        category.style.display = 'block';
      }
    });
  }

  showAllItems() {
    this.actions.forEach(action => {
      action.style.display = 'flex';
    });
    this.categories.forEach(category => {
      category.style.display = 'block';
    });
  }

  clearSearch() {
    this.searchInput.value = '';
    this.showAllItems();
  }
}

// Status Checker
class StatusChecker {
  constructor() {
    this.statusItems = document.querySelectorAll('.status-item .status-indicator');
    this.checkInterval = 30000; // 30 seconds
    this.init();
  }

  init() {
    this.checkAllStatuses();
    setInterval(() => this.checkAllStatuses(), this.checkInterval);
  }

  async checkAllStatuses() {
    // Simulate status checks for demonstration purposes
    const services = [
      { name: 'GitHub', url: 'https://github.com/buck3y' },
      { name: 'Projects', url: '#projects' },
      { name: 'Blog', url: '#blog' },
      { name: 'APIs', url: '#apis' }
    ];

    services.forEach((service, index) => {
      // Simulate random status for demonstration - replace with actual checks
      const isOnline = Math.random() > 0.1; // 90% online chance
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
    const actions = document.querySelectorAll('.quick-actions .action-btn');
    if (actions[index]) {
      actions[index].click();
    }
  }
}

// Initialize core functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SearchManager();
  new StatusChecker();
  new KeyboardShortcuts();
});
