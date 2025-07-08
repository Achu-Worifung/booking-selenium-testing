const { Builder, By, until } = require("selenium-webdriver");

async function testCarPayment({
  url,
  token = null, // for signed in users and sign out for testing
  fname,
  lname,
  email,
  phone,
  address,
  city,
  zip,
  country,
  coverage = "Basic Coverage", // "Basic Coverage", "Premium Coverage", or "Full Coverage"
  cardName,
  cardNumber,
  expdate,
  csv,
  expectedResult, // What to expect after completion
  testName,
}) {
  let driver = await new Builder().forBrowser("chrome").build();
  driver.maximizeWindow();
  
  try {
    console.log(`\n💳 Running payment test: ${testName}`);
    await driver.get(url); // going to the payment page

    // Wait for payment form to load
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Personal Information')]")),
      10000
    );
    console.log(" ✅ Booking page loaded successfully");

    // === STEP 1: Fill Personal Information ===
    console.log(" 📝 Filling personal information...");
    
    // Fill first name
    if (fname) {
      const firstNameInput = await driver.wait(until.elementLocated(By.id("firstName")), 5000);
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, firstNameInput, fname);
      console.log(`   ✅ First name: ${fname}`);
    }

    // Fill last name
    if (lname) {
      const lastNameInput = await driver.findElement(By.id("lastName"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, lastNameInput, lname);
      console.log(`   ✅ Last name: ${lname}`);
    }

    // Fill email
    if (email) {
      const emailInput = await driver.findElement(By.id("email"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, emailInput, email);
      console.log(`   ✅ Email: ${email}`);
    }

    // Fill phone
    if (phone) {
      const phoneInput = await driver.findElement(By.id("phone"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, phoneInput, phone);
      console.log(`   ✅ Phone: ${phone}`);
    }

    // Fill address (optional)
    if (address) {
      const addressInput = await driver.findElement(By.id("address"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, addressInput, address);
      console.log(`   ✅ Address: ${address}`);
    }

    // Fill city (optional)
    if (city) {
      const cityInput = await driver.findElement(By.id("city"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, cityInput, city);
      console.log(`   ✅ City: ${city}`);
    }

    // Fill ZIP code (optional)
    if (zip) {
      const zipInput = await driver.findElement(By.id("zipCode"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, zipInput, zip);
      console.log(`   ✅ ZIP: ${zip}`);
    }

    // Fill country (optional)
    if (country) {
      const countryInput = await driver.findElement(By.id("country"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, countryInput, country);
      console.log(`   ✅ Country: ${country}`);
    }

    // Select insurance coverage
    if (coverage) {
      try {
        // First scroll down to make sure insurance options are visible
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight / 2);");
        await driver.sleep(1000); // Wait for scroll to complete
        
        const coverageRadio = await driver.findElement(By.css(`input[value="${coverage}"]`));
        
        // Scroll the specific element into view
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", coverageRadio);
        await driver.sleep(1000); // Wait for scroll animation
        
        // Click the radio button
        await driver.executeScript("arguments[0].click();", coverageRadio);
        console.log(`   ✅ Insurance coverage: ${coverage}`);
        
        // Scroll back up to the top of the form
        await driver.executeScript("window.scrollTo({ top: 0, behavior: 'smooth' });");
        await driver.sleep(1000); // Wait for scroll back up
        
      } catch (error) {
        console.log(`   ⚠️ Failed to select insurance coverage: ${error.message}`);
      }
    }

    // Click "Continue to Payment" button
    const continueButton = await driver.findElement(By.xpath("//button[contains(text(), 'Continue to Payment')]"));
    await driver.executeScript("arguments[0].click();", continueButton);
    console.log(" ✅ Proceeded to payment step");

    // Wait for payment details form
    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Payment Details')]")),
      10000
    );

    // === STEP 2: Fill Payment Information ===
    console.log(" 💳 Filling payment information...");

    // Fill name on card
    if (cardName) {
      const nameOnCardInput = await driver.wait(until.elementLocated(By.id("nameOnCard")), 5000);
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, nameOnCardInput, cardName);
      console.log(`   ✅ Name on card: ${cardName}`);
    }

    // Fill card number
    if (cardNumber) {
      const cardNumberInput = await driver.findElement(By.id("cardNumber"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, cardNumberInput, cardNumber);
      console.log(`   ✅ Card number: ${cardNumber.substring(0, 4)}****`);
    }

    // Fill expiry date
    if (expdate) {
      const expiryInput = await driver.findElement(By.id("cardExpiry"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, expiryInput, expdate);
      console.log(`   ✅ Expiry date: ${expdate}`);
    }

    // Fill CVC
    if (csv) {
      const cvcInput = await driver.findElement(By.id("cardCvc"));
      await driver.executeScript(`
        const input = arguments[0];
        const value = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      `, cvcInput, csv);
      console.log(`   ✅ CVC: ***`);
    }

    // Check terms and conditions
    const termsCheckbox = await driver.findElement(By.css("input[name='agreeToTerms']"));
    if (!await termsCheckbox.isSelected()) {
      await driver.executeScript("arguments[0].click();", termsCheckbox);
      console.log("   ✅ Agreed to terms and conditions");
    }

    // Click "Complete Booking" button
    const completeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Complete Booking')]"));
    await driver.executeScript("arguments[0].click();", completeButton);
    console.log(" ✅ Submitted booking");

    // Wait for confirmation or error message
    await driver.sleep(3000);

    // Check for expected result
    try {
      const pageText = await driver.findElement(By.tagName("body")).getText();
      
      if (expectedResult && pageText.includes(expectedResult)) {
        console.log(`✅ Test passed: Found expected result "${expectedResult}"`);
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(`${testName}-passed.png`, image, "base64");
        });
        return true;
      } else if (pageText.includes("Booking Confirmed")) {
        console.log("✅ Test passed: Booking completed successfully");
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(`${testName}-passed.png`, image, "base64");
        });
        return true;
      } else if (pageText.includes("error") || pageText.includes("failed") || pageText.includes("invalid")) {
        console.log("❌ Test failed: Error occurred during booking");
        console.log("Page content:", pageText.substring(0, 500));
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(`${testName}-failed.png`, image, "base64");
        });
        return false;
      } else {
        console.log("⚠️ Test result unclear - check screenshot");
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(`${testName}-unclear.png`, image, "base64");
        });
        return false;
      }
    } catch (error) {
      console.log(`❌ Failed to verify result: ${error.message}`);
      await driver.takeScreenshot().then((image) => {
        require("fs").writeFileSync(`${testName}-error.png`, image, "base64");
      });
      return false;
    }

  } catch (err) {
    console.error(`❌ Payment test failed: An error occurred in "${testName}":`, err.message);
    try {
      await driver.takeScreenshot().then((image) => {
        require("fs").writeFileSync(`${testName}-error.png`, image, "base64");
      });
      console.log(`📸 Error screenshot saved as ${testName}-error.png`);
    } catch (screenshotError) {
      console.error("Could not take error screenshot:", screenshotError.message);
    }
    return false;
  } finally {
    try {
      await driver.quit();
      console.log("🔄 Browser closed");
    } catch (quitError) {
      console.error("Error closing browser:", quitError.message);
    }
  }
}

module.exports = { testCarPayment };
