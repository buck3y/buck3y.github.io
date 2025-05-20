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
