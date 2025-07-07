import { testCarSearchForm } from "./template-testing";


const testCases = [
    //testing with valid inputs
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        passcase: "Search results found",
        changePage: true,
        testname: "valid-inputs"
    },

    //testing with passed pickup date
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2024-07-07", // past date
        dropoffdate: "2025-10-10", //past date
        passcase: "please enter a valid date",
        changePage: false, //remaining in the search form
        testname: "invalid-pickup-date"
    }, 
    //testing with passed dropoff date
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07",
        dropoffdate: "2024-10-10", // past date
        passcase: "please enter a valid date",
        changePage: false, //remaining in the search form
        testname: "invalid-dropoff-date"
    },
    //testing with both invalid pickup and dropoff dates
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2024-10-10",
        dropoffdate: "2024-07-07", // pickup date after dropoff date
        passcase: "please enter a valid date",
        changePage: false, //remaining in the search form
        testname: "pickup-date-after-dropoff-date"
    },
    //testing with dropoff date before pickup date
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-10-10",
        dropoffdate: "2025-07-07", // dropoff date before pickup date
        passcase: "please enter a valid date",
        changePage: false, //remaining in the search form
        testname: "dropoff-date-before-pickup-date"
    },
    //invalid pickup location
    , {
        pickuplocation: "Invalid Location",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        passcase: "please enter a valid pickup location",
        changePage: false,
        testname: "invalid-pickup-location"
    }
    ,
    //invalid dropoff location
    {
        pickuplocation: "New York",
        dropofflocation: "Invalid Location",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        passcase: "please enter a valid dropoff location",
        changePage: false,
        testname: "invalid-dropoff-location"
    },
    //invalid pickup and dropoff locations
    {
        pickuplocation: "Invalid Location",
        dropofflocation: "Invalid Location",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        passcase: "please enter a valid pickup location",
        changePage: false,
        testname: "invalid-pickup-and-dropoff-locations"
    },
   

    // ---------------------------FILTERING TEST CASES---------------------------------
    //testing with minimum seats (kind of useless so i will not test the other seats filters)
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        minseats: "2+",
        vehicletype: "SUV",
        maxprice: "1000",
        passcase: "Search results found",
        changePage: true,
        testname: "2-plus-min-seats"
    },

    //testing with vehicle type (SUV)
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
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
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
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
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        minseats: "2+",
        vehicletype: "Sport",
        maxprice: "1000",
        passcase: "Sport",
        changePage: true,
        testname: "sport-vehicle-type"
    },

    //testing max price 
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        minseats: "2+",
        vehicletype: "SUV",
        maxprice: "1000",
        passcase: "1000",
        changePage: true,
        testname: "1000-max-price"
    },
    //testing max price with a value that is too low
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        minseats: "2+",
        vehicletype: "SUV",
        maxprice: "0",
        passcase: "please enter a valid max price",
        changePage: true,
        testname: "0-max-price"
    },
    //tsting negative max price
    {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-07",
        dropoffdate: "2025-10-10",
        minseats: "2+",
        vehicletype: "SUV",
        maxprice: "-1000",
        passcase: "please enter a valid max price",
        changePage: true,
        testname: "negative-max-price"
    }
     
]