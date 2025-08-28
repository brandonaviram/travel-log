// TDD Tests for Search Functionality
describe('Search Functionality', () => {
    let travelLog;

    // Setup before each test
    beforeEach(() => {
        travelLog = new TravelLog();
        // Mock localStorage to avoid persistence during tests
        travelLog.data = {};
        travelLog.searchHistory = [];
    });

    describe('fuzzyMatch', () => {
        it('should return 1.0 for exact matches', () => {
            const result = travelLog.fuzzyMatch('paris', 'paris');
            expect(result).toBe(1.0);
        });

        it('should return 0 for completely different strings', () => {
            const result = travelLog.fuzzyMatch('paris', 'tokyo');
            expect(result).toBe(0);
        });

        it('should handle partial matches correctly', () => {
            const result = travelLog.fuzzyMatch('paris france', 'paris');
            expect(result).toBe(1.0); // All query chars found in order
        });

        it('should return 0 for empty query', () => {
            const result = travelLog.fuzzyMatch('paris', '');
            expect(result).toBe(0);
        });

        it('should return 0 when query is longer than text', () => {
            const result = travelLog.fuzzyMatch('par', 'paris');
            expect(result).toBe(0);
        });

        it('should handle case sensitivity correctly', () => {
            const result = travelLog.fuzzyMatch('Paris', 'paris');
            expect(result).toBe(0); // Current implementation is case-sensitive
        });

        it('should score partial matches proportionally', () => {
            const result = travelLog.fuzzyMatch('prais', 'pars'); // 3 out of 4 chars match
            expect(result).toBe(0.75);
        });
    });

    describe('parseMonth', () => {
        it('should parse full month names', () => {
            expect(travelLog.parseMonth('january')).toBe(0);
            expect(travelLog.parseMonth('december')).toBe(11);
        });

        it('should parse abbreviated month names', () => {
            expect(travelLog.parseMonth('jan')).toBe(0);
            expect(travelLog.parseMonth('dec')).toBe(11);
        });

        it('should handle case insensitivity', () => {
            expect(travelLog.parseMonth('JANUARY')).toBe(0);
            expect(travelLog.parseMonth('Jan')).toBe(0);
        });

        it('should return null for invalid months', () => {
            expect(travelLog.parseMonth('invalid')).toBeNull();
            expect(travelLog.parseMonth('')).toBeNull();
        });

        it('should find month names within longer strings', () => {
            expect(travelLog.parseMonth('I went to paris in january')).toBe(0);
            expect(travelLog.parseMonth('summer june vacation')).toBe(5);
        });

        it('should handle september variations', () => {
            expect(travelLog.parseMonth('september')).toBe(8);
            expect(travelLog.parseMonth('sep')).toBe(8);
            expect(travelLog.parseMonth('sept')).toBe(8);
        });
    });

    describe('parseSeason', () => {
        it('should parse spring season', () => {
            expect(travelLog.parseSeason('spring')).toEqual([2, 3, 4]);
        });

        it('should parse summer season', () => {
            expect(travelLog.parseSeason('summer')).toEqual([5, 6, 7]);
        });

        it('should parse fall season', () => {
            expect(travelLog.parseSeason('fall')).toEqual([8, 9, 10]);
        });

        it('should parse autumn season', () => {
            expect(travelLog.parseSeason('autumn')).toEqual([8, 9, 10]);
        });

        it('should parse winter season', () => {
            expect(travelLog.parseSeason('winter')).toEqual([11, 0, 1]);
        });

        it('should return null for invalid seasons', () => {
            expect(travelLog.parseSeason('invalid')).toBeNull();
            expect(travelLog.parseSeason('')).toBeNull();
        });

        it('should find seasons within longer strings', () => {
            expect(travelLog.parseSeason('I love summer vacations')).toEqual([5, 6, 7]);
        });
    });

    describe('search integration', () => {
        beforeEach(() => {
            // Setup test data
            travelLog.addEntry(2023, 5, 'Paris', 'Amazing summer trip to Paris');
            travelLog.addEntry(2023, 8, 'Tokyo', 'Fall vacation in Japan');
            travelLog.addEntry(2022, 11, 'New York', 'Winter holiday shopping');
        });

        it('should find entries by location', () => {
            const results = travelLog.performSearch('paris');
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].type).toBe('entry');
            expect(results[0].entry.location.toLowerCase()).toContain('paris');
        });

        it('should find entries by year', () => {
            const results = travelLog.performSearch('2023');
            expect(results.length).toBeGreaterThan(0);
            const hasYearResult = results.some(r => r.type === 'year' && r.year === 2023);
            expect(hasYearResult).toBeTruthy();
        });

        it('should find entries by season', () => {
            const results = travelLog.performSearch('summer');
            expect(results.length).toBeGreaterThan(0);
            // Should find summer entries (months 5, 6, 7)
            const hasSummerEntry = results.some(r => 
                r.type === 'entry' && [5, 6, 7].includes(r.month)
            );
            expect(hasSummerEntry).toBeTruthy();
        });

        it('should combine year and season searches', () => {
            const results = travelLog.performSearch('2023 summer');
            expect(results.length).toBeGreaterThan(0);
            const hasMatch = results.some(r => 
                r.type === 'entry' && 
                r.year === 2023 && 
                [5, 6, 7].includes(r.month)
            );
            expect(hasMatch).toBeTruthy();
        });

        it('should return empty array for no matches', () => {
            const results = travelLog.performSearch('nonexistent');
            expect(results).toEqual([]);
        });
    });
});