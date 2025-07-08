const { Builder, By, until } = require("selenium-webdriver");

async function testCarSearchForm({
  pickuplocation,
  dropofflocation,
  pickupdate,
  dropoffdate,
  minseats = null,
  vehicletype = null,
  maxprice = 100,
  passcase,
  changePage = true,
  testname = "test",
}) {
  //using the chrome driver to test the car search form
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().window().maximize();

  try {
    // Validate required parameters

    console.log(`\n🚗 Starting test: ${testname}`);

    // Navigate to the main page
    await driver.get("http://localhost:3000/");
    console.log(" Loaded the page successfully");

    // Change the URL hash to #Vehicles
    await driver.executeScript("window.location.hash = '#Vehicles'");
    // Wait for the page to load with the new hash
    await driver.sleep(2000);

    // Navigate to the Vehicles section
    const vehicleNav = await driver.findElement(By.id("vehicles"));
    await driver.wait(until.elementIsVisible(vehicleNav), 10000);
    await vehicleNav.click();
    console.log("Navigated to Vehicles section");

    // Wait for the vehicle search form to be visible
    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[contains(text(), 'Book Your Ride')]")
      ),
      10000
    );

    // Fill pickup location
    const pickupFromInput = await driver.wait(
      until.elementLocated(By.id("pickup-location")),
      15000
    );
    if (pickuplocation) {
      await pickupFromInput.sendKeys(String(pickuplocation));
      console.log(" Filled pickup location");
    }

    // Fill dropoff location
    const pickupToInput = await driver.wait(
      until.elementLocated(By.id("dropoff-location")),
      5000
    );
    if (dropofflocation) {
      await pickupToInput.sendKeys(String(dropofflocation));
      console.log(" Filled dropoff location");
    }

    // Fill pickup date
    const pickupFromDateInput = await driver.wait(
      until.elementLocated(By.id("pickup-from pickup-date")),
      5000
    );
    if (pickupdate) {
      // Set value using React-compatible approach
      await driver.executeScript(
        `
        const input = arguments[0];
        const value = arguments[1];
        
        // Set the value
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        
        // Trigger events that React recognizes
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        
        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      `,
        pickupFromDateInput,
        String(pickupdate)
      );

      // Verify the value was set
      const actualValue = await driver.executeScript(
        "return arguments[0].value;",
        pickupFromDateInput
      );
      console.log(
        ` Filled pickup date: ${pickupdate} (actual: ${actualValue})`
      );
    }

    // Fill dropoff date
    const pickupToDateInput = await driver.wait(
      until.elementLocated(By.id("pickup-to")),
      5000
    );
    if (dropoffdate) {
      // Set value using React-compatible approach
      await driver.executeScript(
        `
        const input = arguments[0];
        const value = arguments[1];
        
        // Set the value
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        
        // Trigger events that React recognizes
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        
        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      `,
        pickupToDateInput,
        String(dropoffdate)
      );

      // Verify the value was set
      const actualValue = await driver.executeScript(
        "return arguments[0].value;",
        pickupToDateInput
      );
      console.log(
        ` Filled dropoff date: ${dropoffdate} (actual: ${actualValue})`
      );
    }

    // Fill minimum seats
    if (minseats !== null) {
      try {
        await driver.wait(until.elementLocated(By.id("minSeats")), 5000);
        const minSeatsSelect = await driver.findElement(By.id("minSeats"));

        // Use JavaScript to select the option by text value
        await driver.executeScript(
          `
          const select = arguments[0];
          for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text === arguments[1]) {
              select.selectedIndex = i;
              select.dispatchEvent(new Event('change'));
              return;
            }
          }
        `,
          minSeatsSelect,
          minseats
        );

        console.log(" Selected minimum seats:", minseats);
      } catch (error) {
        console.log(" Failed to select minimum seats:", error.message);
      }
    }

    // Select vehicle type
    if (vehicletype !== null) {
      try {
        await driver.wait(until.elementLocated(By.id("vehicleType")), 5000);
        const vehicleTypeSelect = await driver.findElement(
          By.id("vehicleType")
        );

        // Use JavaScript to select the option by text value
        await driver.executeScript(
          `
          const select = arguments[0];
          for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text === arguments[1]) {
              select.selectedIndex = i;
              select.dispatchEvent(new Event('change'));
              return;
            }
          }
        `,
          vehicleTypeSelect,
          vehicletype
        );

        console.log("Selected vehicle type:", vehicletype);
      } catch (error) {
        console.log("Failed to select vehicle type:", error.message);
      }
    }

    // Fill maximum price
    try {
      const maxPriceInput = await driver.wait(
        until.elementLocated(By.id("maxPrice")),
        5000
      );

      // Use JavaScript to reliably clear and set the value
      await driver.executeScript(
        `
        const input = arguments[0];
        const value = arguments[1];
        
        // Set the value using React-compatible approach
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        
        // Trigger events that React recognizes
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        
        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
      `,
        maxPriceInput,
        String(maxprice)
      );

      // Verify the value was set
      const actualValue = await driver.executeScript(
        "return arguments[0].value;",
        maxPriceInput
      );
      console.log(` Set maximum price: ${maxprice} (actual: ${actualValue})`);
    } catch (error) {
      console.log(" Failed to set maximum price:", error.message);
    }

    // submitting the form
    try {
      await driver.sleep(1000); // Wait for any pending updates

      const searchButton = await driver.findElement(
        By.id("search-vehicles-button")
      );

      // Use JavaScript click as a more reliable method
      await driver.executeScript("arguments[0].click();", searchButton);
      console.log(" Clicked search button");
    } catch (error) {
      console.log(" Failed to click search button:", error.message);
      throw error; // Re-throw since this is critical for the test
    }

    //waiting for the result to appear

    //if we are meant to chagne the page
    if (changePage) {
      const resultSection = await driver.wait(
        until.elementLocated(By.id("car-search-results")),
        10000
      );

      //get all the text in the result section
      const resultTxt = await resultSection.getText();

      //have it sleep to display the no result message
      if (maxprice === 0) {
        await driver.sleep(2000);
      }

      if (resultTxt.includes(passcase)) {
        console.log("✅ Test passed: Found search results");
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(
            testname + "-passed.png",
            image,
            "base64"
          );
        });
        return true;
      } else {
        console.log("❌ Test failed: passed condition not found ->", resultTxt);
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(
            testname + "-failed.png",
            image,
            "base64"
          );
        });
        return false; // Indicate failure
      }
    } else {
      //not navigating the the result page

      //getting the vehicle search form to identify warning being displayed
      try {
        const elementWithText = await driver.wait(
          until.elementLocated(
            By.xpath(`//*[contains(text(), '${passcase}')]`)
          ),
          10000
        );
        console.log("✅ Test passed: Found search results");
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(
            `${testname}-passed.png`,
            image,
            "base64"
          );
        });
        return true; // Indicate success
      } catch (err) {
        console.log("❌ Test failed: Unexpected output ->", searchFormtxt);
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(
            `${testname}-failed.png`,
            image,
            "base64"
          );
        });
        return false; // Indicate failure
      }
    }
  } catch (err) {
    console.error(
      `❌ Test failed: An error occurred in "${testname}":`,
      err.message
    );

    try {
      await driver.takeScreenshot().then((image) => {
        require("fs").writeFileSync(`${testname}-error.png`, image, "base64");
      });
      console.log(`📸 Error screenshot saved as ${testname}-error.png`);
      return false;
    } catch (screenshotError) {
      console.error(
        "Could not take error screenshot:",
        screenshotError.message
      );
      return false;
    }
  } finally {
    try {
      await driver.quit();
      console.log("🔄 Browser closed");
    } catch (quitError) {
      console.error("Error closing browser:", quitError.message);
    }
  }
}

module.exports = { testCarSearchForm };
