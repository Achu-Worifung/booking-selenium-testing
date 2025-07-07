const { testCarFilter } = require("./filtertemplate");

// Base URL for search results (with some initial search parameters)
const BASE_SEARCH_URL = "http://localhost:3000/car-search-results?pickup=New%20York&dropoff=Los%20Angeles&pickupDate=2025-07-08T10:00&dropoffDate=2025-07-10T18:00&minSeats=0&maxPrice=500&vehicleType=All";

const filterTestCases = [
    // Test filtering by vehicle type
    {
        url: BASE_SEARCH_URL,
        vehicleType: "SUV",
        excludedVehicleTypes: ["Economy", "Sports", "Luxury", "Van", "Electric", "Minivan"],
        testname: "filter-by-suv"
    },
    {
        url: BASE_SEARCH_URL,
        vehicleType: "Economy",
        excludedVehicleTypes: ["SUV", "Sports", "Luxury", "Van", "Electric", "Minivan"],
        testname: "filter-by-economy"
    },
    {
        url: BASE_SEARCH_URL,
        vehicleType: "Sports",
        excludedVehicleTypes: ["SUV", "Economy", "Luxury", "Van", "Electric", "Minivan"],
        testname: "filter-by-sports"
    },
    {
        url: BASE_SEARCH_URL,
        vehicleType: "Luxury",
        excludedVehicleTypes: ["SUV", "Economy", "Sports", "Van", "Electric", "Minivan"],
        testname: "filter-by-luxury"
    },
    
    // Test filtering by minimum seats
    {
        url: BASE_SEARCH_URL,
        minSeats: 2,
        // expectedResultText: "vehicles found", // Should find vehicles with 2+ seats no need for expected result in this test
        testname: "filter-by-2-seats"
    },
    {
        url: BASE_SEARCH_URL,
        minSeats: 4,
        // expectedResultText: "vehicles found", // Should find vehicles with 4+ seats
        testname: "filter-by-4-seats"
    },
    {
        url: BASE_SEARCH_URL,
        minSeats: 8,
        // expectedResultText: "vehicles found", // May or may not find 8+ seat vehicles
        testname: "filter-by-8-seats"
    },
    
    // Test filtering by max price
    {
        url: BASE_SEARCH_URL,
        maxPrice: 50,
        // expectedResultText: "vehicles found", // Should find cheaper vehicles
        testname: "filter-by-price-50"
    },
    {
        url: BASE_SEARCH_URL,
        maxPrice: 0,
        // expectedResultText: "0 vehicles found", // Should find no vehicles
        testname: "filter-by-price-0"
    },
    {
        url: BASE_SEARCH_URL,
        maxPrice: 200,
        // expectedResultText: "vehicles found", // Should find vehicles up to $200
        testname: "filter-by-price-200"
    },
    {
        url: BASE_SEARCH_URL,
        maxPrice: 400,
        // expectedResultText: "vehicles found", // Should find vehicles up to $400
        testname: "filter-by-price-400"
    }, 
    
    // Test combining multiple filters
    {
        url: BASE_SEARCH_URL,
        vehicleType: "SUV",
        excludedVehicleType:["Economy", "Sports", "Luxury", "Van", "Electric", "Minivan"],
        minSeats: 4,
        maxPrice: 100,
        // expectedResultText: "vehicles found", // SUVs with 4+ seats under $100
        testname: "filter-suv-4seats-100price"
    },
    {
        url: BASE_SEARCH_URL,
        vehicleType: "Economy",
        excludedVehicleType:["SUV", "Sports", "Luxury", "Van", "Electric", "Minivan"],
        minSeats: 2,
        maxPrice: 50,
        // expectedResultText: "vehicles found", // Economy cars with 2+ seats under $50
        testname: "filter-economy-2seats-50price"
    },
    {
        url: BASE_SEARCH_URL,
        vehicleType: "Luxury",
        excludedVehicleType:["SUV", "Economy", "Sports", "Van", "Electric", "Minivan"],
        minSeats: 4,
        maxPrice: 25, // Very low price for luxury cars
        // expectedResultText: "0 vehicles found", // Should find no luxury cars this cheap
        testname: "filter-luxury-impossible-price"
    },
    
    
    

];

// Run filter tests sequentially
async function runAllFilterTests() {
    console.log(`Starting ${filterTestCases.length} filter test cases...\n`);
    
    let passedTests = 0;
    let failedTests = 0;
    
    for (let i = 0; i < filterTestCases.length; i++) {
        const testCase = filterTestCases[i];
        console.log(`\n=== Running Filter Test ${i + 1}/${filterTestCases.length}: ${testCase.testname} ===`);
        
        try {
            const result = await testCarFilter(testCase);
            if (result) {
                passedTests++;
                console.log(`✅ Filter test "${testCase.testname}" passed.\n`);
            } else {
                failedTests++;
                console.log(`❌ Filter test "${testCase.testname}" failed.\n`);
            }
        } catch (error) {
            failedTests++;
            console.error(`❌ Error in filter test "${testCase.testname}":`, error.message);
        }
        
        // Add a small delay between tests to prevent browser issues
        if (i < filterTestCases.length - 1) {
            console.log("Waiting 2 seconds before next test...");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log("\n=== Filter Test Summary ===");
    console.log(`Total tests: ${filterTestCases.length}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log("=== All filter tests completed ===");
}

// Start the filter test execution
runAllFilterTests().catch(error => {
    console.error("Fatal error in filter test execution:", error);
    process.exit(1);
});
