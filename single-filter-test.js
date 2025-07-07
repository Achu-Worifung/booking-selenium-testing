const { testCarFilter } = require("./filtertemplate");

// Test filtering by SUV vehicle type
(async () => {
    const result = await testCarFilter({
        url: "http://localhost:3000/car-search-results?pickup=New%20York&dropoff=Los%20Angeles&pickupDate=2025-07-08T10:00&dropoffDate=2025-07-10T18:00&minSeats=0&maxPrice=200&vehicleType=All",
        vehicleType: "SUV",
        expectedResultText: "SUV",
        testname: "single-suv-filter-test"
    });
    
    if (result) {
        console.log("🎉 Single filter test completed successfully!");
    } else {
        console.log("❌ Single filter test failed!");
    }
})();
