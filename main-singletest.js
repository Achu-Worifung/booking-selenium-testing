const { testCarSearchForm } = require("./template-testing");

(async () => await testCarSearchForm({
    pickuplocation: "New York",
    dropofflocation: "Los Angeles",
    pickupdate: "2025-07-07",
    dropoffdate: "2025-10-10",
    passcase: "Car Rental Results",
    testname:'single-test',
    changePage: true
}))();


