// Load Sample Travel Data
function loadSampleData() {
    const sampleTrips = [
        // 2025 trips
        { location: "London, GB", details: "August 9-15, 2025", year: 2025, month: 7 },
        { location: "Milan, IT", details: "July 13-20, 2025", year: 2025, month: 6 },
        { location: "Charleston, SC", details: "June 8-12, 2025", year: 2025, month: 5 },
        { location: "Mexico City, MX", details: "April 11-16, 2025", year: 2025, month: 3 },
        { location: "Los Angeles, CA", details: "March 11-17, 2025", year: 2025, month: 2 },
        { location: "Los Angeles, CA", details: "February 12-18, 2025", year: 2025, month: 1 },
        { location: "Bridgetown, BB", details: "January 26-31, 2025", year: 2025, month: 0 },
        
        // 2024 trips
        { location: "Puerto Vallarta, MX", details: "November 9, 2024", year: 2024, month: 10 },
        { location: "Milan, IT", details: "October 8-14, 2024", year: 2024, month: 9 },
        { location: "Copenhagen, DK", details: "September 7-12, 2024", year: 2024, month: 8 },
        { location: "London, GB", details: "July 9-16, 2024", year: 2024, month: 6 },
        { location: "Palma Mallorca, ES", details: "June 7-12, 2024", year: 2024, month: 5 },
        { location: "Nice, FR", details: "May 9-15, 2024", year: 2024, month: 4 },
        { location: "Miami, FL", details: "April 24-30, 2024", year: 2024, month: 3 },
        { location: "Tenerife, ES", details: "April 10-16, 2024", year: 2024, month: 3 },
        { location: "Miami, FL", details: "March 10-14, 2024", year: 2024, month: 2 },
        { location: "Casablanca, MA", details: "January 28-February 3, 2024", year: 2024, month: 0 }
    ];

    // Initialize travel log data structure
    const travelData = {};
    
    sampleTrips.forEach(trip => {
        if (!travelData[trip.year]) {
            travelData[trip.year] = {};
        }
        
        if (!travelData[trip.year][trip.month]) {
            travelData[trip.year][trip.month] = [];
        }
        
        // Create entry with proper structure
        const entry = {
            id: Date.now() + Math.random(),
            location: trip.location,
            details: trip.details,
            timestamp: new Date().toISOString()
        };
        
        travelData[trip.year][trip.month].push(entry);
    });

    // Save to localStorage
    localStorage.setItem('travelLogData', JSON.stringify(travelData));
    
    console.log('✅ Sample travel data loaded successfully!');
    console.log(`📊 Loaded ${sampleTrips.length} trips across ${Object.keys(travelData).length} years`);
    
    // Display summary by year
    Object.keys(travelData).sort().forEach(year => {
        const yearTrips = Object.values(travelData[year]).flat().length;
        console.log(`   ${year}: ${yearTrips} trips`);
    });
    
    return travelData;
}

// Auto-load on script execution
if (typeof window !== 'undefined') {
    loadSampleData();
}