// Theme Manager - Handles theme switching and preferences

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = this.themeToggle.querySelector('.theme-icon');
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.themes = ['dark', 'light', 'cyberpunk', 'synthwave', 'matrix'];
    this.themeIndex = this.themes.indexOf(this.currentTheme);
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.watchSystemTheme();
    this.updateFavicon();
    
    // Add advanced theme controls
    this.addThemeSelector();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeIcon(theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
    this.updateFavicon();
    this.animateThemeTransition();
  }

  updateThemeIcon(theme) {
    const icons = {
      'dark': '☀️',
      'light': '🌙',
      'cyberpunk': '🤖',
      'synthwave': '🌊',
      'matrix': '💚'
    };
    this.themeIcon.textContent = icons[theme] || '🌙';
  }

  toggleTheme() {
    // Cycle through themes
    this.themeIndex = (this.themeIndex + 1) % this.themes.length;
    const newTheme = this.themes[this.themeIndex];
    this.setTheme(newTheme);
  }

  watchSystemTheme() {
    // Watch for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        if (!this.getStoredTheme()) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  updateFavicon() {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      if (this.currentTheme === 'dark') {
        favicon.href = '/assets/favicon-dark.ico';
      } else {
        favicon.href = '/assets/favicon-light.ico';
      }
    }
  }

  animateThemeTransition() {
    // Add a subtle flash effect when switching themes
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--accent-primary);
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(flash);
    
    // Quick flash animation
    flash.animate([
      { opacity: 0 },
      { opacity: 0.1 },
      { opacity: 0 }
    ], {
      duration: 200,
      easing: 'ease-out'
    }).onfinish = () => flash.remove();
  }

  addThemeSelector() {
    // Add right-click context menu for theme selection
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showThemeMenu(e.clientX, e.clientY);
    });
  }

  showThemeMenu(x, y) {
    // Remove existing menu if any
    const existingMenu = document.querySelector('.theme-menu');
    if (existingMenu) existingMenu.remove();

    // Create theme menu
    const menu = document.createElement('div');
    menu.className = 'theme-menu';
    menu.style.cssText = `
      position: fixed;
      top: ${y}px;
      left: ${x}px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 8px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    // Add theme options
    this.themes.forEach(theme => {
      const option = document.createElement('div');
      option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
      option.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.2s;
      `;
      
      if (theme === this.currentTheme) {
        option.style.background = 'var(--accent-primary)';
      }

      option.addEventListener('click', () => {
        this.setTheme(theme);
        this.themeIndex = this.themes.indexOf(theme);
        menu.remove();
      });

      option.addEventListener('mouseenter', () => {
        option.style.background = 'var(--bg-tertiary)';
      });

      option.addEventListener('mouseleave', () => {
        if (theme !== this.currentTheme) {
          option.style.background = 'transparent';
        }
      });

      menu.appendChild(option);
    });

    document.body.appendChild(menu);

    // Remove menu when clicking elsewhere
    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
  }

  // Auto theme switching based on time
  autoThemeSwitch() {
    const hour = new Date().getHours();
    if (hour >= 18 || hour <= 6) {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  // Get contrast ratio for accessibility
  getContrastRatio(color1, color2) {
    // Implementation for contrast ratio calculation
    // This helps ensure text remains readable
  }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});
