// TDD Tests for Theme Management
describe('Theme Management', () => {
    let travelLog;
    let originalLocalStorage;
    let originalDocumentElement;
    let originalMatchMedia;

    beforeEach(() => {
        travelLog = new TravelLog();
        
        // Mock localStorage for isolated testing
        originalLocalStorage = window.localStorage;
        originalDocumentElement = document.documentElement;
        originalMatchMedia = window.matchMedia;
        
        // Simple mock objects
        const mockLocalStorage = {
            getItem: () => null,
            setItem: () => {},
            clear: () => {}
        };
        
        const mockDocumentElement = {
            setAttribute: () => {}
        };
        
        window.localStorage = mockLocalStorage;
        document.documentElement = mockDocumentElement;
        window.matchMedia = () => ({ matches: false });
    });

    describe('getInitialTheme', () => {
        it('should return saved theme from localStorage if valid', () => {
            window.localStorage.getItem = (key) => {
                if (key === 'travelLogTheme') return 'dark';
                return null;
            };
            
            const theme = travelLog.getInitialTheme();
            expect(theme).toBe('dark');
        });

        it('should return saved brutalist theme from localStorage', () => {
            window.localStorage.getItem = (key) => {
                if (key === 'travelLogTheme') return 'brutalist';
                return null;
            };
            
            const theme = travelLog.getInitialTheme();
            expect(theme).toBe('brutalist');
        });

        it('should ignore invalid themes from localStorage', () => {
            window.localStorage.getItem = (key) => {
                if (key === 'travelLogTheme') return 'invalid-theme';
                return null;
            };
            
            const theme = travelLog.getInitialTheme();
            expect(theme).toBe('mono'); // Should fallback to mono default
        });

        it('should return mono theme as default when no saved theme', () => {
            window.localStorage.getItem = () => null;
            
            // Mock matchMedia to avoid dark mode detection
            window.matchMedia = () => ({ matches: false });
            
            const theme = travelLog.getInitialTheme();
            expect(theme).toBe('mono');
        });

        it('should detect dark mode preference when no saved theme', () => {
            window.localStorage.getItem = () => null;
            
            // Mock matchMedia to simulate dark mode preference
            window.matchMedia = (query) => ({
                matches: query === '(prefers-color-scheme: dark)'
            });
            
            const theme = travelLog.getInitialTheme();
            expect(theme).toBe('dark');
        });
    });

    describe('toggleTheme', () => {
        it('should cycle from light to dark', () => {
            travelLog.theme = 'light';
            travelLog.toggleTheme();
            expect(travelLog.theme).toBe('dark');
        });

        it('should cycle from dark to brutalist', () => {
            travelLog.theme = 'dark';
            travelLog.toggleTheme();
            expect(travelLog.theme).toBe('brutalist');
        });

        it('should cycle from brutalist to light', () => {
            travelLog.theme = 'brutalist';
            travelLog.toggleTheme();
            expect(travelLog.theme).toBe('light');
        });

        it('should handle unknown theme by defaulting to next in sequence', () => {
            travelLog.theme = 'unknown';
            travelLog.toggleTheme();
            expect(travelLog.theme).toBe('light'); // indexOf returns -1, -1 + 1 = 0 % 3 = 0
        });
    });

    describe('applyTheme', () => {
        it('should set data-theme attribute on document element', () => {
            let setAttributeCalled = false;
            let actualTheme = null;
            
            document.documentElement.setAttribute = (attr, value) => {
                if (attr === 'data-theme') {
                    setAttributeCalled = true;
                    actualTheme = value;
                }
            };
            
            travelLog.theme = 'dark';
            travelLog.applyTheme();
            
            expect(setAttributeCalled).toBeTruthy();
            expect(actualTheme).toBe('dark');
        });

        it('should save theme to localStorage', () => {
            let setItemCalled = false;
            let savedTheme = null;
            
            window.localStorage.setItem = (key, value) => {
                if (key === 'travelLogTheme') {
                    setItemCalled = true;
                    savedTheme = value;
                }
            };
            
            travelLog.theme = 'brutalist';
            travelLog.applyTheme();
            
            expect(setItemCalled).toBeTruthy();
            expect(savedTheme).toBe('brutalist');
        });

        it('should work with all valid themes', () => {
            const themes = ['light', 'dark', 'brutalist'];
            const appliedThemes = [];
            
            document.documentElement.setAttribute = (attr, value) => {
                if (attr === 'data-theme') {
                    appliedThemes.push(value);
                }
            };
            
            themes.forEach(theme => {
                travelLog.theme = theme;
                travelLog.applyTheme();
            });
            
            expect(appliedThemes).toEqual(themes);
        });
    });

    describe('theme integration', () => {
        it('should complete a full theme cycle', () => {
            travelLog.theme = 'light';
            
            // Light -> Dark
            travelLog.toggleTheme();
            expect(travelLog.theme).toBe('dark');
            
            // Dark -> Brutalist
            travelLog.toggleTheme();
            expect(travelLog.theme).toBe('brutalist');
            
            // Brutalist -> Light
            travelLog.toggleTheme();
            expect(travelLog.theme).toBe('light');
        });
    });
});