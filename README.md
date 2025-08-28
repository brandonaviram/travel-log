# Travel Log App

A modern, interactive travel logging application with powerful Command K search functionality.

## Features

### Core Functionality
- **Monthly Travel Tracking**: Organize your travels by year and month
- **Year Navigation**: Easy navigation between years with prev/next buttons
- **Add Travel Entries**: Modal dialog for adding location and details
- **Delete Entries**: Hover-to-show delete buttons for easy management
- **Data Persistence**: Automatic local storage by year
- **Export/Import**: JSON file export and import functionality

### Command K Search Bar
- **Instant Search**: Trigger with `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- **Natural Language Understanding**:
  - `"Paris"` → finds all Paris entries across years
  - `"2023 summer"` → finds Jun/Jul/Aug 2023 entries
  - `"December travels"` → finds all December entries
  - `"Japan 2022"` → finds Japan entries in 2022
- **Smart Results**: Categorized results with icons (Calendar, MapPin, Clock)
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select, ESC to close
- **Glassmorphism Design**: Beautiful blur effects and modern UI

### Enhanced Features
- **Search History**: Remembers your last 5 searches
- **Fuzzy Search**: Flexible matching algorithm
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Polished transitions and interactions
- **Auto-highlighting**: Found entries are highlighted when navigated to

## Usage

### Getting Started
1. Open `index.html` in your web browser
2. Start adding travel entries using the "+" button or the floating action button
3. Navigate between years using the arrow buttons
4. Use `Cmd+K`/`Ctrl+K` to search your travels

### Adding Entries
1. Click the "+" button on any month card or the floating action button
2. Select the month, enter location and details
3. Click "Add Entry" to save

### Searching
1. Press `Cmd+K`/`Ctrl+K` or click the search button
2. Type your search query (location, year, month, season)
3. Use arrow keys to navigate results
4. Press Enter or click to jump to the result

### Export/Import
- **Export**: Click the download button to save your data as JSON
- **Import**: Click the upload button to merge data from a JSON file

## Technical Details

### Dependencies
- **Lucide React Icons**: For beautiful, consistent iconography
- **No additional frameworks**: Pure HTML, CSS, and JavaScript

### Browser Compatibility
- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Mobile responsive design
- Progressive enhancement approach

### Data Storage
- Local storage for persistence
- JSON format for easy backup/restore
- Year-based organization for performance

## Keyboard Shortcuts

- `Cmd+K` / `Ctrl+K`: Open search
- `ESC`: Close search or modal
- `↑` / `↓`: Navigate search results
- `Enter`: Select search result

## Development

To run locally:
```bash
cd travel-log
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

## File Structure

```
travel-log/
├── index.html          # Main HTML structure
├── styles.css          # Glassmorphism styling and responsive design
├── script.js           # Core application logic and search functionality
└── README.md           # This file
```

## Future Enhancements

- Photo attachments for travel entries
- Map integration with location pins
- Travel statistics and insights
- Collaborative sharing features
- Mobile app version
- Cloud synchronization

Enjoy documenting your travels! ✈️🗺️