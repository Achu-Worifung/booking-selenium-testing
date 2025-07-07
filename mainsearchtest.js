const { testCarSearchForm } = require("./template-testing");


const testCases = [
    //testing with valid inputs
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        passcase: "Car Rental Results",
        changePage: true,
        testname: "valid-inputs"
    },

    //testing with passed pickup date
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2024-07-07T10:00", // past date
        dropoffdate: "2025-10-10T18:00", //past date
        passcase: "please enter a valid date",
        changePage: false, //remaining in the search form
        testname: "invalid-pickup-date"
    }, 
    //testing with passed dropoff date
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2024-10-10T18:00", // past date
        passcase: "please enter a valid date",
        changePage: false, //remaining in the search form
        testname: "invalid-dropoff-date"
    },
    //testing with both invalid pickup and dropoff dates
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2024-10-10T10:00",
        dropoffdate: "2024-07-07T18:00", // pickup date after dropoff date
        passcase: "please enter a valid date",
        changePage: false, //remaining in the search form
        testname: "pickup-date-after-dropoff-date"
    },
    //testing with dropoff date before pickup date
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-10-10T10:00",
        dropoffdate: "2025-07-07T18:00", // dropoff date before pickup date
        passcase: "please enter a valid date",
        changePage: false, //remaining in the search form
        testname: "dropoff-date-before-pickup-date"
    },
    //invalid pickup location
    {
        pickuplocation: "Invalid Location",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        passcase: "please enter a valid pickup location",
        changePage: false,
        testname: "invalid-pickup-location"
    }
    ,
    //invalid dropoff location
    {
        pickuplocation: "New York",
        dropofflocation: "Invalid Location",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        passcase: "please enter a valid dropoff location",
        changePage: false,
        testname: "invalid-dropoff-location"
    },
    //invalid pickup and dropoff locations
    {
        pickuplocation: "Invalid Location",
        dropofflocation: "Invalid Location",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        passcase: "please enter a valid pickup location",
        changePage: false,
        testname: "invalid-pickup-and-dropoff-locations"
    },
   

    // ---------------------------FILTERING TEST CASES---------------------------------
    //testing with minimum seats (kind of useless so i will not test the other seats filters)
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        vehicletype: "SUV",
        maxprice: "1000",
        passcase: "Car Rental Results",
        changePage: true,
        testname: "2-plus-min-seats"
    },

    //testing with vehicle type (SUV)
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        vehicletype: "SUV",
        maxprice: "1000",
        passcase: "SUV",
        changePage: true,
        testname: "suv-vehicle-type"
    },
    //testing vehicle type economy
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        vehicletype: "Economy",
        maxprice: "1000",
        passcase: "Economy",
        changePage: true,
        testname: "economy-vehicle-type"
    },
    //testing vehicle type sport
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        vehicletype: "Sports",
        maxprice: "1000",
        passcase: "Sports",
        changePage: true,
        testname: "sport-vehicle-type"
    },

    //testing max price 
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        maxprice: "1000",
        passcase: "1000",
        changePage: true,
        testname: "1000-max-price"
    },
    //testing max price with a value that is too low
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        maxprice: "0",
        passcase: "0 vehicles found matching your criteria",
        changePage: true,
        testname: "0-max-price"
    },
    
     
]


// Run tests sequentially to avoid memory leaks and browser conflicts
async function runAllTests() {
    console.log(`Starting ${testCases.length} test cases...\n`);
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n=== Running Test ${i + 1}/${testCases.length}: ${testCase.testname} ===`);
        
        try {
            await testCarSearchForm(testCase);
            console.log(`✅ Test case "${testCase.testname}" completed successfully.\n`);
        } catch (error) {
            console.error(`❌ Error in test case "${testCase.testname}":`, error.message);
        }
        
        // Add a small delay between tests to prevent browser issues
        if (i < testCases.length - 1) {
            console.log("Waiting 2 seconds before next test...");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log("\n=== All tests completed ===");
}

// Start the test execution
runAllTests().catch(error => {
    console.error("Fatal error in test execution:", error);
    process.exit(1);
});