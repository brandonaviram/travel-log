// TDD Tests for Data Management
describe('Data Management', () => {
    let travelLog;

    beforeEach(() => {
        travelLog = new TravelLog();
        // Start with clean data for each test
        travelLog.data = {};
        
        // Mock localStorage to avoid persistence during tests
        window.localStorage = {
            getItem: () => null,
            setItem: () => {},
            clear: () => {}
        };
    });

    describe('getYearData', () => {
        it('should return existing year data', () => {
            travelLog.data[2023] = { 5: [{ location: 'Paris' }] };
            const yearData = travelLog.getYearData(2023);
            expect(yearData).toEqual({ 5: [{ location: 'Paris' }] });
        });

        it('should create new year data if it does not exist', () => {
            const yearData = travelLog.getYearData(2024);
            expect(yearData).toEqual({});
            expect(travelLog.data[2024]).toEqual({});
        });

        it('should use current year as default', () => {
            const currentYear = new Date().getFullYear();
            const yearData = travelLog.getYearData();
            expect(travelLog.data[currentYear]).toEqual({});
        });
    });

    describe('addEntry', () => {
        it('should add entry to existing month', () => {
            travelLog.data[2023] = { 5: [] };
            
            travelLog.addEntry(2023, 5, 'Paris', 'Great trip');
            
            expect(travelLog.data[2023][5].length).toBe(1);
            expect(travelLog.data[2023][5][0].location).toBe('Paris');
            expect(travelLog.data[2023][5][0].details).toBe('Great trip');
        });

        it('should create month array if it does not exist', () => {
            travelLog.addEntry(2023, 5, 'Paris', 'Great trip');
            
            expect(travelLog.data[2023]).toBeTruthy();
            expect(travelLog.data[2023][5]).toBeTruthy();
            expect(travelLog.data[2023][5].length).toBe(1);
        });

        it('should generate unique IDs for entries', () => {
            travelLog.addEntry(2023, 5, 'Paris', 'Trip 1');
            travelLog.addEntry(2023, 5, 'London', 'Trip 2');
            
            const entries = travelLog.data[2023][5];
            expect(entries[0].id).toBeTruthy();
            expect(entries[1].id).toBeTruthy();
            expect(entries[0].id).not.toBe(entries[1].id);
        });

        it('should add timestamp to entries', () => {
            const beforeTime = new Date().getTime();
            travelLog.addEntry(2023, 5, 'Paris', 'Great trip');
            const afterTime = new Date().getTime();
            
            const entry = travelLog.data[2023][5][0];
            const entryTime = new Date(entry.timestamp).getTime();
            
            expect(entryTime).toBeGreaterThan(beforeTime);
            expect(entryTime).toBeLessThan(afterTime);
        });

        it('should handle multiple entries in same month', () => {
            travelLog.addEntry(2023, 5, 'Paris', 'Trip 1');
            travelLog.addEntry(2023, 5, 'London', 'Trip 2');
            travelLog.addEntry(2023, 5, 'Rome', 'Trip 3');
            
            expect(travelLog.data[2023][5].length).toBe(3);
            expect(travelLog.data[2023][5][0].location).toBe('Paris');
            expect(travelLog.data[2023][5][1].location).toBe('London');
            expect(travelLog.data[2023][5][2].location).toBe('Rome');
        });
    });

    describe('deleteEntry', () => {
        beforeEach(() => {
            // Setup test data
            travelLog.addEntry(2023, 5, 'Paris', 'Trip 1');
            travelLog.addEntry(2023, 5, 'London', 'Trip 2');
            travelLog.addEntry(2023, 8, 'Tokyo', 'Trip 3');
        });

        it('should delete entry by ID', () => {
            const entryId = travelLog.data[2023][5][0].id;
            
            travelLog.deleteEntry(entryId, 2023, 5);
            
            expect(travelLog.data[2023][5].length).toBe(1);
            expect(travelLog.data[2023][5][0].location).toBe('London');
        });

        it('should not affect other months when deleting', () => {
            const entryId = travelLog.data[2023][5][0].id;
            
            travelLog.deleteEntry(entryId, 2023, 5);
            
            expect(travelLog.data[2023][8].length).toBe(1);
            expect(travelLog.data[2023][8][0].location).toBe('Tokyo');
        });

        it('should handle deleting non-existent entry gracefully', () => {
            const originalLength = travelLog.data[2023][5].length;
            
            travelLog.deleteEntry('non-existent-id', 2023, 5);
            
            expect(travelLog.data[2023][5].length).toBe(originalLength);
        });

        it('should handle deleting from non-existent month gracefully', () => {
            expect(() => {
                travelLog.deleteEntry('any-id', 2023, 99);
            }).not.toThrow();
        });

        it('should delete all entries when called for each', () => {
            const entry1Id = travelLog.data[2023][5][0].id;
            const entry2Id = travelLog.data[2023][5][1].id;
            
            travelLog.deleteEntry(entry1Id, 2023, 5);
            travelLog.deleteEntry(entry2Id, 2023, 5);
            
            expect(travelLog.data[2023][5].length).toBe(0);
        });
    });

    describe('data persistence', () => {
        it('should call saveData when adding entry', () => {
            let saveCalled = false;
            travelLog.saveData = () => { saveCalled = true; };
            
            travelLog.addEntry(2023, 5, 'Paris', 'Great trip');
            
            expect(saveCalled).toBeTruthy();
        });

        it('should call saveData when deleting entry', () => {
            travelLog.addEntry(2023, 5, 'Paris', 'Great trip');
            const entryId = travelLog.data[2023][5][0].id;
            
            let saveCalled = false;
            travelLog.saveData = () => { saveCalled = true; };
            
            travelLog.deleteEntry(entryId, 2023, 5);
            
            expect(saveCalled).toBeTruthy();
        });
    });

    describe('data validation', () => {
        it('should handle empty location', () => {
            travelLog.addEntry(2023, 5, '', 'No location');
            
            const entry = travelLog.data[2023][5][0];
            expect(entry.location).toBe('');
            expect(entry.details).toBe('No location');
        });

        it('should handle empty details', () => {
            travelLog.addEntry(2023, 5, 'Paris', '');
            
            const entry = travelLog.data[2023][5][0];
            expect(entry.location).toBe('Paris');
            expect(entry.details).toBe('');
        });

        it('should handle invalid month numbers', () => {
            travelLog.addEntry(2023, -1, 'Paris', 'Invalid month');
            travelLog.addEntry(2023, 12, 'London', 'Valid month');
            travelLog.addEntry(2023, 13, 'Tokyo', 'Invalid month');
            
            expect(travelLog.data[2023][-1]).toBeTruthy();
            expect(travelLog.data[2023][12]).toBeTruthy();
            expect(travelLog.data[2023][13]).toBeTruthy();
        });
    });
});