const { testCarSearchForm } = require("./searchtest");

(async () => await testCarSearchForm(  {
        pickuplocation: "Los Angeles, CA",
       dropofflocation: "Phoenix, AZ",
        pickupdate: "2025-08-08T10:00",
        dropoffdate: "2025-10-10T18:00",
        minseats: "2+",
        maxprice: "0",
        passcase: "Max price cannot be less than $1",
        changePage: false,
        testname: "0-max-price"
    }))();


