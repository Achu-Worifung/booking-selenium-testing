const { testCarSearchForm } = require("./searchtest.js");

// -----------------------------IMPORTANT-------------------------------------------
// make sure to update the dates when testing or the tests will fail 

const testCases = [
    //testing with valid inputs
    {
        pickuplocation: "Los Angeles, CA",
        dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
        dropoffdate: "2025-10-10T18:00",
        passcase: "Car Rental Results",
        changePage: true,
        testname: "valid-inputs"
    },

    //testing with passed pickup date
    {
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2024-08-08T10:00", // past date
        dropoffdate: "2025-10-10T18:00", //past date
        passcase: "Pickup date cannot be in the past",
        changePage: false, //remaining in the search form
        testname: "invalid-pickup-date"
    }, 
    //testing with passed dropoff date
    {
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
        dropoffdate: "2024-10-10T18:00", // past date
        passcase: "Dropoff date cannot be in the past",
        changePage: false, //remaining in the search form
        testname: "invalid-dropoff-date"
    },
    //testing with both invalid pickup and dropoff dates
    {
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2024-10-10T10:00",
        dropoffdate: "2024-07-07T18:00", // pickup date after dropoff date
        passcase: "Pickup date cannot be in the past",
        changePage: false, //remaining in the search form
        testname: "pickup-date-after-dropoff-date"
    },
    //testing with dropoff date before pickup date
    {
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-10-10T10:00",
        dropoffdate: "2025-08-08T18:00", // dropoff date before pickup date
        passcase: "Dropoff date cannot be before pickup date",
        changePage: false, //remaining in the search form
        testname: "dropoff-date-before-pickup-date"
    },
    //invalid pickup location
    {
        pickuplocation: "Invalid Location",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
        dropoffdate: "2025-10-10T18:00",
        passcase: "Please enter a valid pickup location",
        changePage: false,
        testname: "invalid-pickup-location"
    },
    //invalid dropoff location
    {
        pickuplocation: "Los Angeles, CA",
        dropofflocation: "Invalid Location",
        pickupdate: "2025-08-08T10:00",
        dropoffdate: "2025-10-10T18:00",
        passcase: "Please enter a valid dropoff location",
        changePage: false,
        testname: "invalid-dropoff-location"
    },
    //invalid pickup and dropoff locations
    {
        pickuplocation: "Invalid Location",
        dropofflocation: "Invalid Location",
        pickupdate: "2025-08-08T10:00",
        dropoffdate: "2025-10-10T18:00",
        passcase: "Please enter a valid pickup location",
        changePage: false,
        testname: "invalid-pickup-and-dropoff-locations"
    },
   

    // ---------------------------FILTERING TEST CASES---------------------------------
    //testing with minimum seats (kind of useless so i will not test the other seats filters)
    {
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
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
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
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
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
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
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
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
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        maxprice: "1000",
        passcase: "1000",
        changePage: true,
        testname: "1000-max-price"
    },
    //testing max price with a value that is too low
    {
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        maxprice: "0",
        passcase: "Max price cannot be less than $1",
        changePage: false,
        testname: "0-max-price"
    },
    
     
]


// Run tests sequentially to avoid memory leaks and browser conflicts
let passedTests = 0;
async function runAllTests() {
    console.log(`Starting ${testCases.length} test cases...\n`);
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n=== Running Test ${i + 1}/${testCases.length}: ${testCase.testname} ===`);
        
        try {
            const result = await testCarSearchForm(testCase);
            console.log(`✅ Test case "${testCase.testname}" completed successfully.\n`);
            if (result) {
                passedTests++;
            }
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
    console.log(`✅ ${passedTests} test cases passed.`);
    console.log(`❌ ${testCases.length - passedTests} test cases failed.`);
}

// Start the test execution
runAllTests().catch(error => {
    console.error("Fatal error in test execution:", error);
    process.exit(1);
});