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
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});
