# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Travel Log application - a modern, interactive web app for logging and searching travel experiences. It's built with vanilla HTML, CSS, and JavaScript using a glassmorphism design pattern with light/dark theme support.

### Core Architecture

- **Client-side only**: No backend server required
- **Local storage**: Data persisted in browser localStorage with JSON format
- **Year-based organization**: Data structured by year for performance
- **Class-based JavaScript**: Single `TravelLog` class handles all functionality
- **Responsive design**: Mobile-first approach with glassmorphism styling

## Commands

### Development Server
```bash
# Run local development server
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### No Build Process
This project uses vanilla web technologies without build tools, bundlers, or transpilation.

## File Structure

```
travel-log/
├── index.html          # Main HTML structure and app shell
├── styles.css          # Complete styling with CSS variables and glassmorphism
├── script.js           # Single-class application logic (~1000+ lines)
└── README.md           # Feature documentation and usage guide
```

## Key Application Features

### Data Management
- **Storage**: localStorage with year-based JSON structure
- **Data Model**: `{ year: { month: [entries] } }` where entries contain `{id, location, details, timestamp}`
- **Export/Import**: JSON file download/upload functionality

### Search System
- **Command K Interface**: Keyboard shortcut (`Cmd+K`/`Ctrl+K`) opens search modal
- **Natural Language**: Supports queries like "Paris 2023", "summer travels", "December"
- **Fuzzy Matching**: Custom algorithm in `calculateFuzzyScore()` method
- **Search History**: Maintains last 5 searches in localStorage
- **Result Categories**: Groups by Year, Month, and Entry types

### Theme System
- **CSS Variables**: Complete light/dark theme using CSS custom properties
- **System Detection**: Respects `prefers-color-scheme` media query
- **Persistence**: Theme choice saved in localStorage

## Code Architecture Patterns

### Main Class Structure
The `TravelLog` class (`script.js:2-1000+`) handles:
- **Data management**: CRUD operations for travel entries
- **UI rendering**: Dynamic monthly grid and search results
- **Event handling**: Keyboard shortcuts, modal interactions
- **Search functionality**: Complex search parsing and matching
- **Theme management**: Light/dark mode switching

### Key Methods
- `init()`: Application initialization and setup
- `renderMonthlyGrid()`: Generates the 12-month calendar view
- `performSearch(query)`: Main search logic with fuzzy matching
- `addEntry(year, month, location, details)`: Creates new travel entries
- `exportData()`/`importData()`: JSON data exchange

### Search Implementation
- **Query Parsing**: Extracts years, months, seasons from natural language
- **Fuzzy Matching**: Custom scoring algorithm for flexible text matching
- **Result Ranking**: Scores and sorts results by relevance
- **Keyboard Navigation**: Arrow key navigation through search results

## Styling Architecture

### CSS Organization
- **CSS Variables**: Comprehensive theming system with light/dark variants
- **Glassmorphism**: Backdrop blur effects and semi-transparent backgrounds  
- **Responsive Design**: Mobile-first breakpoints and flexible layouts
- **Icon System**: Lucide icons loaded via CDN

### Theme Variables Pattern
```css
:root {
  --bg-primary-light: /* gradient */
  --bg-primary-dark: /* gradient */
  --bg-primary: var(--bg-primary-light); /* default */
}

[data-theme="dark"] {
  --bg-primary: var(--bg-primary-dark);
}
```

## Development Guidelines

### Code Conventions
- **Vanilla JavaScript**: No frameworks or build tools
- **Class-based**: Single main class with method organization
- **Event-driven**: Comprehensive event listener setup
- **Responsive**: Mobile-first CSS with progressive enhancement

### Data Handling
- **Immutable IDs**: Use `Date.now() + Math.random()` for entry IDs
- **Year-based storage**: Separate localStorage keys per year for performance
- **Defensive coding**: Always check for data existence before operations

### Search Development
- **Case-insensitive**: All search operations use lowercase normalization
- **Multi-criteria**: Support location, time-based, and fuzzy text matching
- **Performance**: Debounced search input with 300ms delay

## Claude Code Best Practices and Planning Guidelines

### Core Principles
- **Think Hard**: Prioritize deep understanding before generating code, especially for complex tasks
- **Context is Everything**: Leverage this `CLAUDE.md` file and the codebase itself
- **Reflective Loop**: Actively reflect on output and identify potential mistakes or better approaches
- **If the Overview is Wrong, Restart**: Use `/clear` if initial understanding is flawed

### Planning Phase Guidelines
1. **High-Level Conceptual Planning**: Focus on architecture, avoid immediate code generation
2. **Break Down Complex Tasks**: Split medium to large tasks into testable, deployable PR-sized chunks
3. **Function Descriptions**: Provide 1-3 sentence descriptions for each proposed function
4. **Test Descriptions**: Provide 5-10 word descriptions for specific behavior coverage
5. **Risk-Based Planning**: Take multiple iterations for high-risk tasks

### Context Management
- **Documentation Updates**: Update this `CLAUDE.md` file for significant architectural changes
- **Change Tracking**: Document what changes were made and why
- **Future Developer Advice**: Provide guidance for the next developer working on features

## Testing Framework

### TDD Implementation
A comprehensive Test-Driven Development setup is implemented with:
- **Custom Test Runner**: Lightweight vanilla JS testing framework (`test-runner.js`)
- **Test Suites**: Organized tests for Search, Theme, and Data management
- **Browser-Based Testing**: Run tests at `test.html` with visual output
- **Sample Data Loader**: Automated test data setup via `load-data.html`

### Key Test Files
- `test-runner.js`: Custom test framework with describe/it/expect API
- `tests/search.test.js`: Search functionality and fuzzy matching tests
- `tests/theme.test.js`: Theme cycling and preference management tests
- `tests/data.test.js`: CRUD operations and data persistence tests
- `test.html`: Browser test runner with console output
- `load-data.html`: Sample data management interface

### Running Tests
```bash
# Start development server
python3 -m http.server 8000

# Navigate to test runner
open http://localhost:8000/test.html

# Load sample data
open http://localhost:8000/load-data.html
```

### Test Coverage
- **Search Functions**: `fuzzyMatch()`, `parseMonth()`, `parseSeason()`, `performSearch()`
- **Theme Management**: 3-way theme cycling, localStorage persistence
- **Data Operations**: `addEntry()`, `deleteEntry()`, `getYearData()`
- **Edge Cases**: Empty inputs, invalid data, error handling

### General Guidance
- **Test-First Approach**: Always write failing tests before implementing features
- **Architectural Consistency**: Follow the established vanilla JS, class-based pattern
- **Self-Verification**: Use the comprehensive test suite to validate changes
- **Edit Existing Code**: Prefer editing existing methods over writing new ones
- **Continuous Testing**: Run tests after any significant changes