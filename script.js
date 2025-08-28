// Travel Log Application
class TravelLog {
    // Configuration Constants
    static SEARCH_HISTORY_LIMIT = 5;
    static SEARCH_DEBOUNCE_DELAY = 200;
    static HIGHLIGHT_DURATION = 2000;
    static SEARCH_RESULTS_LIMIT = 10;
    static ENTRY_DETAILS_PREVIEW_LENGTH = 50;
    
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.data = {};
        this.searchHistory = [];
        this.selectedSearchIndex = -1;
        this.searchDebounceTimer = null;
        this.theme = this.getInitialTheme();
        
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        this.init();
    }
    
    /**
     * Initializes Lucide icons if library is available
     * Centralized function to avoid duplication across the codebase
     */
    initializeLucideIcons() {
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    
    init() {
        this.loadData();
        this.applyTheme();
        this.setupEventListeners();
        this.renderMonthlyGrid();
        this.updateYearDisplay();
        
        // Initialize Lucide icons
        this.initializeLucideIcons();
    }
    
    // Data Management
    loadData() {
        const savedData = localStorage.getItem('travelLogData');
        if (savedData) {
            this.data = JSON.parse(savedData);
        }
        
        const savedHistory = localStorage.getItem('travelLogSearchHistory');
        if (savedHistory) {
            this.searchHistory = JSON.parse(savedHistory);
        }
    }
    
    saveData() {
        localStorage.setItem('travelLogData', JSON.stringify(this.data));
        localStorage.setItem('travelLogSearchHistory', JSON.stringify(this.searchHistory));
    }
    
    // Theme Management
    getInitialTheme() {
        const savedTheme = localStorage.getItem('travelLogTheme');
        if (savedTheme && ['light', 'dark', 'brutalist', 'mono'].includes(savedTheme)) {
            return savedTheme;
        }
        
        // Default to monochrome theme
        return 'mono';
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('travelLogTheme', this.theme);
    }
    
    toggleTheme() {
        const themes = ['light', 'dark', 'brutalist', 'mono'];
        const currentIndex = themes.indexOf(this.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.theme = themes[nextIndex];
        this.applyTheme();
        
        // Re-initialize Lucide icons after theme change
        this.initializeLucideIcons();
    }
    
    getYearData(year = this.currentYear) {
        if (!this.data[year]) {
            this.data[year] = {};
        }
        return this.data[year];
    }
    
    addEntry(year, month, location, details) {
        const yearData = this.getYearData(year);
        if (!yearData[month]) {
            yearData[month] = [];
        }
        
        const entry = {
            id: Date.now() + Math.random(),
            location,
            details,
            timestamp: new Date().toISOString()
        };
        
        yearData[month].push(entry);
        this.saveData();
        this.renderMonthlyGrid();
    }
    
    removeEntry(year, month, entryId) {
        const yearData = this.getYearData(year);
        if (yearData[month]) {
            yearData[month] = yearData[month].filter(entry => entry.id !== entryId);
            if (yearData[month].length === 0) {
                delete yearData[month];
            }
        }
        this.saveData();
        this.renderMonthlyGrid();
    }
    
    /**
     * Alias for removeEntry with parameter order expected by tests
     * @param {string|number} entryId - The ID of the entry to delete
     * @param {number} year - The year of the entry
     * @param {number} month - The month of the entry (0-11)
     */
    deleteEntry(entryId, year, month) {
        this.removeEntry(year, month, entryId);
    }
    
    // UI Rendering
    renderMonthlyGrid() {
        const grid = document.querySelector('.monthly-grid');
        const yearData = this.getYearData();
        
        grid.innerHTML = '';
        
        for (let month = 0; month < 12; month++) {
            const monthCard = this.createMonthCard(month, yearData[month] || []);
            grid.appendChild(monthCard);
        }
        
        // Re-initialize Lucide icons for new content
        this.initializeLucideIcons();
    }
    
    createMonthCard(month, entries) {
        const card = document.createElement('div');
        card.className = 'month-card fade-in';
        card.setAttribute('data-month', month);
        
        card.innerHTML = `
            <div class="month-header">
                <h3 class="month-name">${this.monthNames[month]}</h3>
                <button class="add-entry-btn" data-month="${month}" title="Add Entry">
                    <i data-lucide="plus"></i>
                </button>
            </div>
            <div class="travel-entries">
                ${entries.length > 0 ? 
                    entries.map(entry => this.createEntryHTML(month, entry)).join('') :
                    '<div class="empty-month">No travels yet</div>'
                }
            </div>
        `;
        
        return card;
    }
    
    createEntryHTML(month, entry) {
        return `
            <div class="travel-entry clickable" data-entry-id="${entry.id}" data-month="${month}">
                <div class="entry-location">
                    <i data-lucide="map-pin"></i>
                    ${this.escapeHtml(entry.location)}
                </div>
                <div class="entry-details">${this.escapeHtml(entry.details)}</div>
            </div>
        `;
    }
    
    updateYearDisplay() {
        document.querySelector('.current-year').textContent = this.currentYear;
    }
    
    // Event Listeners
    setupEventListeners() {
        this.setupNavigationListeners();
        this.setupInteractionListeners();
        this.setupModalListeners();
        this.setupSearchListeners();
        this.setupDataListeners();
        this.setupSystemThemeListener();
    }
    
    /**
     * Sets up year navigation event listeners
     */
    setupNavigationListeners() {
        document.querySelector('.prev-year').addEventListener('click', () => {
            this.currentYear--;
            this.updateYearDisplay();
            this.renderMonthlyGrid();
        });
        
        document.querySelector('.next-year').addEventListener('click', () => {
            this.currentYear++;
            this.updateYearDisplay();
            this.renderMonthlyGrid();
        });
    }
    
    /**
     * Sets up main interaction event listeners (add, delete, theme toggle)
     */
    setupInteractionListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-entry-btn') || e.target.closest('.add-entry-fab')) {
                const monthBtn = e.target.closest('.add-entry-btn');
                const month = monthBtn ? monthBtn.dataset.month : '';
                this.openTravelModal('add', { month: month });
            }
            
            if (e.target.closest('.travel-entry.clickable')) {
                const entryElement = e.target.closest('.travel-entry.clickable');
                const entryId = entryElement.dataset.entryId;
                const month = parseInt(entryElement.dataset.month);
                
                // Find the entry data
                const yearData = this.getYearData(this.currentYear);
                if (yearData[month]) {
                    const entry = yearData[month].find(e => e.id == entryId);
                    if (entry) {
                        this.openTravelModal('edit', {
                            id: entry.id,
                            month: month,
                            location: entry.location,
                            details: entry.details
                        });
                    }
                }
            }
            
            if (e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });
    }
    
    setupModalListeners() {
        const modal = document.getElementById('travelModal');
        const form = document.getElementById('travelForm');
        const deleteBtn = document.getElementById('deleteBtn');
        
        // Delete button handler
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this entry?')) {
                this.deleteCurrentEntry();
            }
        });
        
        // Close modal
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-close') || e.target.closest('.modal-cancel')) {
                this.closeModal();
            }
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const location = document.getElementById('entryLocation').value;
            const details = document.getElementById('entryDetails').value;
            
            if (location.trim()) {
                if (this.currentModalMode === 'edit' && this.currentEditingEntry) {
                    // Edit existing entry
                    const yearData = this.getYearData(this.currentYear);
                    const oldMonth = this.currentEditingEntry.month;
                    const newMonth = document.getElementById('entryMonth').value;
                    const entryId = this.currentEditingEntry.id;
                    
                    // If month changed, we need to move the entry
                    if (oldMonth != newMonth) {
                        // Remove from old month
                        if (yearData[oldMonth]) {
                            const oldIndex = yearData[oldMonth].findIndex(entry => entry.id === entryId);
                            if (oldIndex !== -1) {
                                const entry = yearData[oldMonth].splice(oldIndex, 1)[0];
                                
                                // Clean up empty month
                                if (yearData[oldMonth].length === 0) {
                                    delete yearData[oldMonth];
                                }
                                
                                // Add to new month with updated data
                                if (!yearData[newMonth]) {
                                    yearData[newMonth] = [];
                                }
                                yearData[newMonth].push({
                                    ...entry,
                                    location: location.trim(),
                                    details: details.trim(),
                                    timestamp: new Date().toISOString()
                                });
                            }
                        }
                    } else {
                        // Same month, just update in place
                        if (yearData[oldMonth]) {
                            const entryIndex = yearData[oldMonth].findIndex(entry => entry.id === entryId);
                            if (entryIndex !== -1) {
                                yearData[oldMonth][entryIndex] = {
                                    ...yearData[oldMonth][entryIndex],
                                    location: location.trim(),
                                    details: details.trim(),
                                    timestamp: new Date().toISOString()
                                };
                            }
                        }
                    }
                    this.saveData();
                    this.renderMonthlyGrid();
                } else {
                    // Add new entry
                    const month = document.getElementById('entryMonth').value;
                    if (month !== '') {
                        this.addEntry(this.currentYear, parseInt(month), location.trim(), details.trim());
                    }
                }
                this.closeModal();
                form.reset();
            }
        });
        
        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (modal.classList.contains('active')) {
                    this.closeModal();
                }
            }
        });
    }
    
    setupSearchListeners() {
        const searchTrigger = document.querySelector('.search-trigger');
        const commandBar = document.getElementById('commandBar');
        const searchInput = document.getElementById('searchInput');
        const escapeButton = document.getElementById('escapeButton');
        
        // Open search with button or Cmd+K
        searchTrigger.addEventListener('click', () => this.openSearch());
        
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            if (e.key === 'Escape' && commandBar.classList.contains('active')) {
                this.closeSearch();
            }
        });
        
        // Close search when clicking escape button
        if (escapeButton) {
            escapeButton.addEventListener('click', () => this.closeSearch());
            escapeButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.closeSearch();
                }
            });
        }
        
        // Close search when clicking outside
        commandBar.addEventListener('click', (e) => {
            if (e.target === commandBar) {
                this.closeSearch();
            }
        });
        
        // Search input handling
        searchInput.addEventListener('input', (e) => {
            this.debounceSearch(e.target.value);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            this.handleSearchKeyboard(e);
        });
        
        // Search result clicking
        document.addEventListener('click', (e) => {
            if (e.target.closest('.search-result')) {
                const result = e.target.closest('.search-result');
                this.handleSearchSelection(result);
            }
        });
    }
    
    setupDataListeners() {
        const exportBtn = document.querySelector('.export-btn');
        const importBtn = document.querySelector('.import-btn');
        const fileInput = document.getElementById('importFileInput');
        
        exportBtn.addEventListener('click', () => this.exportData());
        importBtn.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importData(file);
            }
        });
        
        // Trip details modal setup is now part of unified modal system
    }
    
    // Removed setupTripDetailsModal - functionality moved to unified modal system
    
    // Removed duplicate openTripDetails - now handled by unified modal system
    
    // Removed duplicate save/delete functions - now handled by unified modal system
    
    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only change theme if user hasn't manually set a preference
                const savedTheme = localStorage.getItem('travelLogTheme');
                if (!savedTheme) {
                    this.theme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                    
                    // Re-initialize Lucide icons after theme change
                    this.initializeLucideIcons();
                }
            });
        }
    }
    
    // Modal Functions
    openTravelModal(mode = 'add', data = {}) {
        const modal = document.getElementById('travelModal');
        const modalTitle = document.getElementById('modalTitle');
        const monthSelect = document.getElementById('entryMonth');
        const deleteBtn = document.getElementById('deleteBtn');
        
        // Store current mode and data
        this.currentModalMode = mode;
        this.currentEditingEntry = data;
        
        // Clear form
        document.getElementById('travelForm').reset();
        
        if (mode === 'add') {
            modalTitle.textContent = 'Add Entry';
            deleteBtn.style.display = 'none';
            
            // Pre-select month if provided
            if (data.month !== undefined) {
                monthSelect.value = data.month;
            }
        } else if (mode === 'edit') {
            modalTitle.textContent = 'Edit Entry';
            deleteBtn.style.display = 'flex';
            
            // Populate form with existing data
            document.getElementById('entryLocation').value = data.location || '';
            document.getElementById('entryDetails').value = data.details || '';
            
            // Set the month for the entry being edited
            if (data.month !== undefined) {
                monthSelect.value = data.month;
            }
        }
        
        modal.classList.add('active');
        document.getElementById('entryLocation').focus();
        
        // Re-initialize Lucide icons
        this.initializeLucideIcons();
    }
    
    closeModal() {
        const modal = document.getElementById('travelModal');
        modal.classList.remove('active');
        this.currentModalMode = null;
        this.currentEditingEntry = null;
    }
    
    deleteCurrentEntry() {
        if (!this.currentEditingEntry || !this.currentEditingEntry.id) return;
        
        const yearData = this.getYearData(this.currentYear);
        const month = this.currentEditingEntry.month;
        
        if (yearData[month]) {
            yearData[month] = yearData[month].filter(e => e.id !== this.currentEditingEntry.id);
            
            // Remove month if empty
            if (yearData[month].length === 0) {
                delete yearData[month];
            }
            
            this.saveData();
            this.renderMonthlyGrid();
            this.closeModal();
        }
    }
    
    // Search Functions
    openSearch() {
        const commandBar = document.getElementById('commandBar');
        const searchInput = document.getElementById('searchInput');
        
        commandBar.classList.add('active');
        searchInput.value = '';
        this.selectedSearchIndex = -1;
        this.renderSearchResults([]);
        
        // Focus with slight delay to ensure element is visible after CSS transition
        setTimeout(() => {
            searchInput.focus();
        }, 50);
    }
    
    closeSearch() {
        document.getElementById('commandBar').classList.remove('active');
        this.clearHighlights();
    }
    
    debounceSearch(query) {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, TravelLog.SEARCH_DEBOUNCE_DELAY);
    }
    
    performSearch(query) {
        if (!query.trim()) {
            this.renderSearchResults([]);
            return [];
        }
        
        const results = this.searchEntries(query);
        this.renderSearchResults(results);
        this.selectedSearchIndex = -1;
        return results;
    }
    
    searchEntries(query) {
        const results = [];
        const normalizedQuery = query.toLowerCase().trim();
        
        // Parse natural language queries
        const yearMatch = normalizedQuery.match(/\b(19|20)\d{2}\b/);
        const monthMatch = this.parseMonth(normalizedQuery);
        const seasonMatch = this.parseSeason(normalizedQuery);
        
        // Search through all years
        Object.keys(this.data).forEach(year => {
            const yearInt = parseInt(year);
            const yearData = this.data[year];
            
            // Year filter
            if (yearMatch && yearInt !== parseInt(yearMatch[0])) {
                return;
            }
            
            Object.keys(yearData).forEach(month => {
                const monthInt = parseInt(month);
                const entries = yearData[month];
                
                // Month filter
                if (monthMatch !== null && monthInt !== monthMatch) {
                    return;
                }
                
                // Season filter
                if (seasonMatch && !seasonMatch.includes(monthInt)) {
                    return;
                }
                
                entries.forEach(entry => {
                    const score = this.calculateSearchScore(entry, normalizedQuery);
                    if (score > 0) {
                        results.push({
                            type: 'entry',
                            year: yearInt,
                            month: monthInt,
                            entry,
                            score,
                            icon: 'map-pin'
                        });
                    }
                });
            });
        });
        
        // Add year navigation results
        if (!yearMatch) {
            Object.keys(this.data).forEach(year => {
                if (year.includes(normalizedQuery)) {
                    results.push({
                        type: 'year',
                        year: parseInt(year),
                        score: year.length === normalizedQuery.length ? 100 : 50,
                        icon: 'calendar'
                    });
                }
            });
        }
        
        // Add month navigation results
        if (!monthMatch && !yearMatch) {
            this.monthNames.forEach((monthName, index) => {
                if (monthName.toLowerCase().includes(normalizedQuery)) {
                    results.push({
                        type: 'month',
                        month: index,
                        score: monthName.toLowerCase() === normalizedQuery ? 100 : 50,
                        icon: 'clock'
                    });
                }
            });
        }
        
        // Sort by score and return top results
        return results.sort((a, b) => b.score - a.score).slice(0, TravelLog.SEARCH_RESULTS_LIMIT);
    }
    
    /**
     * Calculates a relevance score for a search query against a travel entry
     * Uses exact matches, partial matches, and fuzzy matching for comprehensive scoring
     * 
     * @param {Object} entry - The travel entry to score
     * @param {string} entry.location - Location name of the entry
     * @param {string} entry.details - Details text of the entry
     * @param {string} query - The normalized search query (lowercase)
     * @returns {number} Relevance score (higher = more relevant)
     * 
     * Scoring algorithm:
     * - Exact location match: 100 points (if query matches location exactly) or 50 points (partial)
     * - Details match: 25 points
     * - Fuzzy location match: up to 30 points (based on character sequence matching)
     * - Fuzzy details match: up to 15 points
     */
    calculateSearchScore(entry, query) {
        let score = 0;
        const location = entry.location.toLowerCase();
        const details = entry.details.toLowerCase();
        
        // Exact matches get highest score
        if (location.includes(query)) {
            score += query.length === location.length ? 100 : 50;
        }
        if (details.includes(query)) {
            score += 25;
        }
        
        // Fuzzy matching
        score += this.fuzzyMatch(location, query) * 30;
        score += this.fuzzyMatch(details, query) * 15;
        
        return Math.round(score);
    }
    
    /**
     * Implements fuzzy string matching algorithm
     * Finds the longest common subsequence of characters in order
     * 
     * @param {string} text - The text to search within
     * @param {string} query - The query pattern to match
     * @returns {number} Match ratio between 0 and 1 (1 = perfect sequence match)
     * 
     * Algorithm:
     * - Iterates through text and query simultaneously
     * - Tracks how many query characters are found in sequence
     * - Returns ratio of matched characters to total query length
     * - Example: fuzzyMatch('paris', 'prs') = 1.0 (all chars found in order)
     * - Example: fuzzyMatch('london', 'prs') = 0 (sequence not found)
     */
    fuzzyMatch(text, query) {
        if (!text || !query) return 0;
        
        const textLength = text.length;
        const queryLength = query.length;
        
        if (queryLength === 0) return 0;
        if (queryLength > textLength) return 0;
        
        let score = 0;
        let queryIndex = 0;
        
        for (let i = 0; i < textLength && queryIndex < queryLength; i++) {
            if (text[i] === query[queryIndex]) {
                score++;
                queryIndex++;
            }
        }
        
        return queryIndex === queryLength ? score / queryLength : 0;
    }
    
    /**
     * Parses natural language month references from search queries
     * Supports full month names, abbreviations, and case variations
     * 
     * @param {string} query - The search query to parse
     * @returns {number|null} Month index (0-11) or null if no month found
     * 
     * Supported formats:
     * - Full names: 'January', 'February', etc. (case insensitive)
     * - Abbreviations: 'Jan', 'Feb', 'Mar', etc.
     * - Special cases: 'Sept' and 'Sep' both resolve to September
     * - Within text: 'I traveled in June' -> returns 5
     */
    parseMonth(query) {
        const monthKeywords = {
            'january': 0, 'jan': 0, 'february': 1, 'feb': 1, 'march': 2, 'mar': 2,
            'april': 3, 'apr': 3, 'may': 4, 'june': 5, 'jun': 5,
            'july': 6, 'jul': 6, 'august': 7, 'aug': 7, 'september': 8, 'sep': 8, 'sept': 8,
            'october': 9, 'oct': 9, 'november': 10, 'nov': 10, 'december': 11, 'dec': 11
        };
        
        const lowercaseQuery = query.toLowerCase();
        
        for (const [keyword, month] of Object.entries(monthKeywords)) {
            if (lowercaseQuery.includes(keyword)) {
                return month;
            }
        }
        
        return null;
    }
    
    /**
     * Parses seasonal references from search queries into month arrays
     * Enables searching by season rather than specific months
     * 
     * @param {string} query - The search query to parse
     * @returns {number[]|null} Array of month indices or null if no season found
     * 
     * Season mappings:
     * - Spring: [2, 3, 4] (March, April, May)
     * - Summer: [5, 6, 7] (June, July, August) 
     * - Fall/Autumn: [8, 9, 10] (September, October, November)
     * - Winter: [11, 0, 1] (December, January, February)
     */
    parseSeason(query) {
        const seasons = {
            'spring': [2, 3, 4],
            'summer': [5, 6, 7],
            'fall': [8, 9, 10],
            'autumn': [8, 9, 10],
            'winter': [11, 0, 1]
        };
        
        for (const [season, months] of Object.entries(seasons)) {
            if (query.includes(season)) {
                return months;
            }
        }
        
        return null;
    }
    
    renderSearchResults(results) {
        const container = document.getElementById('searchResults');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-search">
                    <p>No results found</p>
                    <p class="search-tips">Try searching for locations, years, or months</p>
                </div>
            `;
            return;
        }
        
        // Group results by type
        const grouped = {
            year: results.filter(r => r.type === 'year'),
            month: results.filter(r => r.type === 'month'),
            entry: results.filter(r => r.type === 'entry')
        };
        
        let html = '';
        
        if (grouped.year.length > 0) {
            html += '<div class="search-category">Years</div>';
            grouped.year.forEach((result, index) => {
                html += this.createSearchResultHTML(result, index);
            });
        }
        
        if (grouped.month.length > 0) {
            html += '<div class="search-category">Months</div>';
            grouped.month.forEach((result, index) => {
                html += this.createSearchResultHTML(result, grouped.year.length + index);
            });
        }
        
        if (grouped.entry.length > 0) {
            html += '<div class="search-category">Travel Entries</div>';
            grouped.entry.forEach((result, index) => {
                html += this.createSearchResultHTML(result, grouped.year.length + grouped.month.length + index);
            });
        }
        
        container.innerHTML = html;
        
        // Re-initialize Lucide icons
        this.initializeLucideIcons();
    }
    
    createSearchResultHTML(result, index) {
        let title, subtitle;
        
        switch (result.type) {
            case 'year':
                title = `Go to ${result.year}`;
                subtitle = `View all travels from ${result.year}`;
                break;
            case 'month':
                title = `${this.monthNames[result.month]} travels`;
                subtitle = `View all ${this.monthNames[result.month]} entries`;
                break;
            case 'entry':
                title = result.entry.location;
                subtitle = `${this.monthNames[result.month]} ${result.year} • ${result.entry.details.slice(0, TravelLog.ENTRY_DETAILS_PREVIEW_LENGTH)}${result.entry.details.length > TravelLog.ENTRY_DETAILS_PREVIEW_LENGTH ? '...' : ''}`;
                break;
        }
        
        return `
            <div class="search-result" data-index="${index}" data-type="${result.type}" data-year="${result.year || ''}" data-month="${result.month || ''}" data-entry-id="${result.entry?.id || ''}">
                <i class="search-result-icon" data-lucide="${result.icon}"></i>
                <div class="search-result-content">
                    <div class="search-result-title">${this.escapeHtml(title)}</div>
                    <div class="search-result-subtitle">${this.escapeHtml(subtitle)}</div>
                </div>
            </div>
        `;
    }
    
    handleSearchKeyboard(e) {
        const results = document.querySelectorAll('.search-result');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedSearchIndex = Math.min(this.selectedSearchIndex + 1, results.length - 1);
                this.updateSearchSelection();
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                this.selectedSearchIndex = Math.max(this.selectedSearchIndex - 1, -1);
                this.updateSearchSelection();
                break;
            
            case 'Enter':
                e.preventDefault();
                if (this.selectedSearchIndex >= 0 && results[this.selectedSearchIndex]) {
                    this.handleSearchSelection(results[this.selectedSearchIndex]);
                }
                break;
        }
    }
    
    updateSearchSelection() {
        const results = document.querySelectorAll('.search-result');
        
        results.forEach((result, index) => {
            result.classList.toggle('selected', index === this.selectedSearchIndex);
        });
        
        // Scroll selected item into view
        if (this.selectedSearchIndex >= 0 && results[this.selectedSearchIndex]) {
            results[this.selectedSearchIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    handleSearchSelection(resultElement) {
        const type = resultElement.dataset.type;
        const year = parseInt(resultElement.dataset.year);
        const month = parseInt(resultElement.dataset.month);
        const entryId = resultElement.dataset.entryId;
        
        // Add to search history
        const query = document.getElementById('searchInput').value;
        this.addToSearchHistory(query);
        
        this.closeSearch();
        
        switch (type) {
            case 'year':
                this.currentYear = year;
                this.updateYearDisplay();
                this.renderMonthlyGrid();
                break;
            
            case 'month':
                this.scrollToMonth(month);
                break;
            
            case 'entry':
                this.currentYear = year;
                this.updateYearDisplay();
                this.renderMonthlyGrid();
                setTimeout(() => {
                    this.highlightEntry(entryId);
                    this.scrollToMonth(month);
                }, 100);
                break;
        }
    }
    
    scrollToMonth(month) {
        const monthCard = document.querySelector(`[data-month="${month}"]`);
        if (monthCard) {
            monthCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
    
    highlightEntry(entryId) {
        this.clearHighlights();
        const entry = document.querySelector(`[data-entry-id="${entryId}"]`);
        if (entry) {
            entry.classList.add('highlighted');
            setTimeout(() => {
                entry.classList.remove('highlighted');
            }, TravelLog.HIGHLIGHT_DURATION);
        }
    }
    
    clearHighlights() {
        document.querySelectorAll('.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });
    }
    
    addToSearchHistory(query) {
        if (!query.trim()) return;
        
        this.searchHistory = this.searchHistory.filter(h => h !== query);
        this.searchHistory.unshift(query);
        this.searchHistory = this.searchHistory.slice(0, TravelLog.SEARCH_HISTORY_LIMIT);
        this.saveData();
    }
    
    // Export/Import Functions
    exportData() {
        const dataToExport = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: this.data
        };
        
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `travel-log-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    async importData(file) {
        try {
            const text = await file.text();
            const importedData = JSON.parse(text);
            
            if (importedData.data) {
                const confirmImport = confirm('This will merge the imported data with your existing data. Continue?');
                if (confirmImport) {
                    // Merge data
                    Object.keys(importedData.data).forEach(year => {
                        if (!this.data[year]) {
                            this.data[year] = {};
                        }
                        
                        Object.keys(importedData.data[year]).forEach(month => {
                            if (!this.data[year][month]) {
                                this.data[year][month] = [];
                            }
                            
                            this.data[year][month] = this.data[year][month].concat(
                                importedData.data[year][month]
                            );
                        });
                    });
                    
                    this.saveData();
                    this.renderMonthlyGrid();
                    alert('Data imported successfully!');
                }
            } else {
                alert('Invalid file format');
            }
        } catch (error) {
            alert('Error importing file: ' + error.message);
        }
        
        // Reset file input
        document.getElementById('importFileInput').value = '';
    }
    
    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TravelLog();
});