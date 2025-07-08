const { testCarPayment } = require("./purchaseTemplate");

// Simple test to verify the payment template works
(async () => {
    const testResult = await testCarPayment({
        url: "http://localhost:3000/car-booking/1?pickup=New%20York&dropoff=Los%20Angeles&pickupDate=2025-07-08T10:00&dropoffDate=2025-07-10T18:00",
        fname: "John",
        lname: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "123 Main Street",
        city: "New York",
        zip: "10001",
        country: "USA",
        coverage: "basic",
        cardName: "John Doe",
        cardNumber: "4111111111111111",
        expdate: "12/25",
        csv: "123",
        expectedResult: "Booking Confirmed",
        testName: "single-payment-test"
    });
    
    if (testResult) {
        console.log("🎉 Single payment test completed successfully!");
    } else {
        console.log("❌ Single payment test failed!");
    }
})();
