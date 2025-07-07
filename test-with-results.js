const { testCarSearchForm } = require("./searchtest");

(async () => await testCarSearchForm(  {
        pickuplocation: "New York",
        dropofflocation: "Los Angeles",
        pickupdate: "2025-07-08T10:00",
        dropoffdate: "2025-07-10T18:00",
        maxprice: 1000,
        passcase: "vehicles found matching your criteria",
        changePage: true,
        testname: "valid-search-with-results"
    }))();
