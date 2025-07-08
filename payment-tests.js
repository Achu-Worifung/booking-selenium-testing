const { testCarPayment } = require("./purchaseTemplate");

// Example booking URL - replace with actual car booking URL
const BASE_BOOKING_URL = "http://localhost:3000/car-booking/1?pickup=New%20York&dropoff=Los%20Angeles&pickupDate=2025-07-08T10:00&dropoffDate=2025-07-10T18:00";

const paymentTestCases = [
    // Valid booking test
    {
        url: BASE_BOOKING_URL,
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
        testName: "valid-booking-basic-insurance"
    },
    
    // Premium insurance test
    {
        url: BASE_BOOKING_URL,
        fname: "Jane",
        lname: "Smith",
        email: "jane.smith@example.com",
        phone: "+1987654321",
        address: "456 Oak Avenue",
        city: "Los Angeles",
        zip: "90210",
        country: "USA",
        coverage: "premium",
        cardName: "Jane Smith",
        cardNumber: "4111111111111111",
        expdate: "06/26",
        csv: "456",
        expectedResult: "Booking Confirmed",
        testName: "valid-booking-premium-insurance"
    },
    
    // Full coverage test
    {
        url: BASE_BOOKING_URL,
        fname: "Bob",
        lname: "Johnson",
        email: "bob.johnson@example.com",
        phone: "+1555123456",
        address: "789 Pine Road",
        city: "Chicago",
        zip: "60601",
        country: "USA",
        coverage: "full",
        cardName: "Bob Johnson",
        cardNumber: "4111111111111111",
        expdate: "03/27",
        csv: "789",
        expectedResult: "Booking Confirmed",
        testName: "valid-booking-full-coverage"
    },
    
    // Test with minimal required fields only
    {
        url: BASE_BOOKING_URL,
        fname: "Alice",
        lname: "Brown",
        email: "alice.brown@example.com",
        phone: "+1444555666",
        // No optional fields (address, city, zip, country)
        coverage: "basic",
        cardName: "Alice Brown",
        cardNumber: "4111111111111111",
        expdate: "09/25",
        csv: "321",
        expectedResult: "Booking Confirmed",
        testName: "minimal-required-fields"
    },
    
    // Test with invalid email
    {
        url: BASE_BOOKING_URL,
        fname: "Invalid",
        lname: "Email",
        email: "invalid-email", // Invalid email format
        phone: "+1333444555",
        coverage: "basic",
        cardName: "Invalid Email",
        cardNumber: "4111111111111111",
        expdate: "12/25",
        csv: "111",
        expectedResult: "error", // Should show validation error
        testName: "invalid-email-format"
    },
    
    // Test with invalid card number
    {
        url: BASE_BOOKING_URL,
        fname: "Invalid",
        lname: "Card",
        email: "invalid.card@example.com",
        phone: "+1222333444",
        coverage: "basic",
        cardName: "Invalid Card",
        cardNumber: "1234567890123456", // Invalid card number
        expdate: "12/25",
        csv: "123",
        expectedResult: "error", // Should show card validation error
        testName: "invalid-card-number"
    },
    
    // Test with expired card
    {
        url: BASE_BOOKING_URL,
        fname: "Expired",
        lname: "Card",
        email: "expired.card@example.com",
        phone: "+1111222333",
        coverage: "basic",
        cardName: "Expired Card",
        cardNumber: "4111111111111111",
        expdate: "01/20", // Expired date
        csv: "123",
        expectedResult: "error", // Should show expiry validation error
        testName: "expired-card-date"
    },
    
    // Test with missing required fields
    {
        url: BASE_BOOKING_URL,
        // Missing required fields: fname, lname, email, phone
        coverage: "basic",
        cardName: "Missing Fields",
        cardNumber: "4111111111111111",
        expdate: "12/25",
        csv: "123",
        expectedResult: "error", // Should show required field validation
        testName: "missing-required-fields"
    }
];

// Run payment tests sequentially
async function runAllPaymentTests() {
    console.log(`Starting ${paymentTestCases.length} payment test cases...\n`);
    
    let passedTests = 0;
    let failedTests = 0;
    
    for (let i = 0; i < paymentTestCases.length; i++) {
        const testCase = paymentTestCases[i];
        console.log(`\n=== Running Payment Test ${i + 1}/${paymentTestCases.length}: ${testCase.testName} ===`);
        
        try {
            const result = await testCarPayment(testCase);
            if (result) {
                passedTests++;
                console.log(`✅ Payment test "${testCase.testName}" passed.\n`);
            } else {
                failedTests++;
                console.log(`❌ Payment test "${testCase.testName}" failed.\n`);
            }
        } catch (error) {
            failedTests++;
            console.error(`❌ Error in payment test "${testCase.testName}":`, error.message);
        }
        
        // Add a delay between tests to prevent browser issues
        if (i < paymentTestCases.length - 1) {
            console.log("Waiting 3 seconds before next test...");
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    
    console.log("\n=== Payment Test Summary ===");
    console.log(`Total tests: ${paymentTestCases.length}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log("=== All payment tests completed ===");
}

// Start the payment test execution
runAllPaymentTests().catch(error => {
    console.error("Fatal error in payment test execution:", error);
    process.exit(1);
});
