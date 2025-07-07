const {Builder, By, until} = require("selenium-webdriver");

async function testCarSearchForm({pickuplocation, dropofflocation, pickupdate, dropoffdate, minseats = null, vehicletype = null, maxprice=100, passcase, changePage= true, testname= "test"}) {
    //using the chrome driver to test the car search form
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate to the main page
    await driver.get("http://localhost:3000/");
    console.log("Loaded the page successfully");

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
    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Book Your Ride')]")), 10000);
    
    // Fill pickup location
    const pickupFromInput = await driver.wait(until.elementLocated(By.id("pickup-location")), 15000);
    await pickupFromInput.sendKeys(pickuplocation);
    
    // Fill dropoff location
    const pickupToInput = await driver.wait(until.elementLocated(By.id("dropoff-location")), 5000);
    await pickupToInput.sendKeys(dropofflocation);

    // Fill pickup date
    const pickupFromDateInput = await driver.wait(until.elementLocated(By.id("pickup-from pickup-date")), 5000);
    await pickupFromDateInput.sendKeys(pickupdate);

    // Fill dropoff date
    const pickupToDateInput = await driver.wait(until.elementLocated(By.id("pickup-to")), 5000);
    await pickupToDateInput.sendKeys(dropoffdate);

    // Fill minimum seats
    if (minseats !== null) {
        await driver.wait(until.elementLocated(By.id("minSeats")), 5000);
           const minSeatsSelect = await driver.findElement(By.id("minSeats"));
           await minSeatsSelect.click();
           const seatsOption = await driver.findElement(
             By.xpath(`//option[text()='${minseats}']`)
           );
           await seatsOption.click();
    }

    // Select vehicle type
    if( vehicletype !== null) {
    const vehicleTypeSelect = await driver.findElement(By.id("vehicleType"));
        await vehicleTypeSelect.click();
        const suvOption = await driver.findElement(
          By.xpath(`//option[text()='${vehicletype}']`)
        );
        await suvOption.click();
    }
    // Fill maximum price
    const maxPriceInput = await driver.wait(until.elementLocated(By.id("maxPrice")), 5000);
    await maxPriceInput.sendKeys(maxprice);

    // submitting the form
    const searchButton = await driver.findElement(By.id("search-vehicles-button"));
    await searchButton.click();
    console.log("Clicked search button");

    //waiting for the result to appear

    //if we are meant to chagne the page
    if (changePage)
    {
        const resultSection = await driver.wait(until.elementLocated(By.id("car-search-results")), 10000);
        
        //get all the text in the result section
        const resultTxt = await resultSection.getText();

        if (resultTxt.includes(passcase))
        {
            console.log("Test passed: Found search results");
            await driver.takeScreenshot().then((image) => {
              require("fs").writeFileSync(testname + "-passed.png", image, "base64");
            });
        }
        else
        {
            console.log("Test failed: passed condition not found ->", resultTxt);
            await driver.takeScreenshot().then((image) => {
              require("fs").writeFileSync(testname + "-failed.png", image, "base64");
            });

        }
    }else 
    {
        //not navigating the the result page

        //getting the vehicle search form to identify warning being displayed
        const vehicleSearchForm = await driver.wait(until.elementLocated(By.id("vehicle-search-form")), 10000);
        const searchFormtxt = await vehicleSearchForm.getText();

        //if the warning msg is being displayed
        if (searchFormtxt.includes(passcase)) {
            console.log("Test passed: Found search results");
            await driver.takeScreenshot().then((image) => {
              require("fs").writeFileSync(testname + "-passed.png", image, "base64");
            });
        } else {
            console.log("Test failed: Unexpected output ->", searchFormtxt);
            await driver.takeScreenshot().then((image) => {
              require("fs").writeFileSync(testname + "-failed.png", image, "base64");
            });
        }
    }
    }catch (err)
    {
        console.error("Test failed: An error occurred ->", err);
        await driver.takeScreenshot().then((image) => {
          require("fs").writeFileSync(testname + "-error.png", image, "base64");
        });
    }
    //code runs regardless of the outcome
    finally {
        await driver.quit();
    }
}

module.exports = { testCarSearchForm };


