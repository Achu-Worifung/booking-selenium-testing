const { Builder, By, until } = require("selenium-webdriver");

async function testCarFilter({
    url, // URL to navigate to (should be a car-search-results URL with existing search params)
    vehicleType = null,
    maxPrice = null,
    minSeats = null,
    expectedResultText, // Text to expect in results after filtering
    excludedVehicleTypes = [],
    testname = "default-test"
}) {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
    
    try {
        console.log(`\n🔍 Starting filter test: ${testname}`);
        
        // Navigate to the URL (should be a search results page)
        await driver.get(url);
        console.log(" Loaded search results page successfully");
        
        // Wait for the page to load and filters to be available
        await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Filters')]")), 10000);
        
        // Select vehicle type filter
        if (vehicleType !== null) {
            try {
                const vehicleTypeSelect = await driver.wait(
                    until.elementLocated(By.id("vehicleType")), 
                    5000
                );
                
                // Use JavaScript to select the option by value
                await driver.executeScript(`
                    const select = arguments[0];
                    select.value = arguments[1];
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                `, vehicleTypeSelect, vehicleType);
                
                console.log(` Selected vehicle type: ${vehicleType}`);
            } catch (error) {
                console.log(` Failed to select vehicle type: ${error.message}`);
            }
        }

        // Set maximum price filter (slider)
        if (maxPrice !== null) {
            try {
                const maxPriceSlider = await driver.wait(
                    until.elementLocated(By.id("maxPrice")), 
                    5000
                );
                
                // Use JavaScript to set slider value and trigger React state update
                await driver.executeScript(`
                    const slider = arguments[0];
                    const value = arguments[1];
                    
                    // Set the value using React-compatible approach
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(slider, value);
                    
                    // Trigger events that React recognizes
                    const inputEvent = new Event('input', { bubbles: true });
                    slider.dispatchEvent(inputEvent);
                    
                    const changeEvent = new Event('change', { bubbles: true });
                    slider.dispatchEvent(changeEvent);
                `, maxPriceSlider, String(maxPrice));
                
                // Verify the value was set
                const actualValue = await driver.executeScript("return arguments[0].value;", maxPriceSlider);
                console.log(` Set maximum price: $${maxPrice} (actual: $${actualValue})`);
            } catch (error) {
                console.log(` Failed to set maximum price: ${error.message}`);
            }
        }

        // Set minimum seats filter
        if (minSeats !== null) {
            try {
                const minSeatsSelect = await driver.wait(
                    until.elementLocated(By.id("minSeats")), 
                    5000
                );
                
                // Use JavaScript to select the option by value
                await driver.executeScript(`
                    const select = arguments[0];
                    select.value = arguments[1];
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                `, minSeatsSelect, String(minSeats));
                
                console.log(` Selected minimum seats: ${minSeats === 0 ? 'Any' : minSeats + '+'}`);
            } catch (error) {
                console.log(` Failed to select minimum seats: ${error.message}`);
            }
        }

        // Apply filters by clicking the Apply Filters button
        try {
            const applyButton = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(text(), 'Apply Filters')]")), 
                5000
            );
            
            await driver.executeScript("arguments[0].click();", applyButton);
            console.log(" Clicked Apply Filters button");
        } catch (error) {
            console.log(" Failed to click Apply Filters button:", error.message);
            throw error;
        }

        // Wait for results to update
        await driver.sleep(4000);

        // Get the results section and check for expected text
        try {
            const resultsSection = await driver.wait(
                until.elementLocated(By.xpath("//div[contains(@class, 'lg:w-3/4')]")), 
                10000
            );
            
            const resultsText = await resultsSection.getText();
            // console.log('here is the returned text:', resultsText); 
            if (maxPrice !== null) {
                const prices = extractPricesFromResults(resultsText);
                if (prices.length > 0) {
                    const maxPriceFound = Math.max(...prices);
                    if (maxPriceFound > maxPrice) {
                        console.log(`❌ Filter test failed: Found vehicles with price $${maxPriceFound}, which exceeds the maximum price of $${maxPrice}`);
                        await driver.takeScreenshot().then((image) => {
                            require("fs").writeFileSync(`${testname}-failed.png`, image, "base64");
                        });
                        return false;
                    } else {
                        console.log(`✅ All vehicle prices are within the maximum price of $${maxPrice}`);
                    }
                } else {
                    console.log("No prices found in results");
                }
            }

            if (minSeats !== null) {
                const seats = extractSeatsFromResults(resultsText);
                if (seats.length > 0) {
                    const minSeatsFound = Math.min(...seats);
                    if (minSeatsFound < minSeats) {
                        console.log(`❌ Filter test failed: Found vehicles with ${minSeatsFound} seats
, which is less than the minimum required of ${minSeats}`);
                        await driver.takeScreenshot().then((image) => {
                            require("fs").writeFileSync(`${testname}-failed.png`, image, "base64");
                        });
                        return false;
                    } else {
                        console.log(`✅ All vehicle seats are at least ${minSeats}`);
                    }
                } else {
                    console.log("No seats found in results");
                }
            }
            if (excludedVehicleTypes.length > 0) {
                const allExcluded = checkAllOtherVehicleTypesExcluded(resultsText, excludedVehicleTypes);
                if (allExcluded) {
                    console.log(`✅ All other vehicle types are excluded`);
                } else {
                    console.log(`❌ Filter test failed: Found vehicles of other types`);
                    await driver.takeScreenshot().then((image) => {
                        require("fs").writeFileSync(`${testname}-failed.png`, image, "base64");
                    });
                    return false;
                }
            }
            if (expectedResultText) {
                if (resultsText.includes(expectedResultText)) {
                    console.log(`✅ Filter test passed: Found expected text "${expectedResultText}" in results`);
                } else {
                    console.log(`❌ Filter test failed: Expected text "${expectedResultText}" not found in results`);
                    await driver.takeScreenshot().then((image) => {
                        require("fs").writeFileSync(`${testname}-failed.png`, image, "base64");
                    });
                    return false;
                }
            } else {
                console.log("No expected result text to check");
            }
            return true;
            
        } catch (error) {
            console.log(` Failed to get results section: ${error.message}`);
            await driver.takeScreenshot().then((image) => {
                require("fs").writeFileSync(`${testname}-failed.png`, image, "base64");
            });
            return false;
        }
        
    } catch (err) {
        console.error(`❌ Filter test failed: An error occurred in "${testname}":`, err.message);
        try {
            await driver.takeScreenshot().then((image) => {
                require("fs").writeFileSync(`${testname}-error.png`, image, "base64");
            });
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

module.exports = { testCarFilter };



// extract the price of each vehicle from the return result

//make it return an array of all the numbers extracted from the prices
function extractPricesFromResults(resultsText) {
    const priceStrings = resultsText.match(/\$\d+/g);
    return priceStrings ? priceStrings.map(priceString => {
        const match = priceString.match(/\$(\d+)/);
        return match ? parseInt(match[1]) : null;
    }) : [];
}

function checkAllOtherVehicleTypesExcluded(resultsText, excludedVehicleTypes) {
    for (const type of excludedVehicleTypes) {
        if (resultsText.includes(type)) {
            console.log(`❌ Filter test failed: Found unexpected vehicle type "${type}" in results`);
            return false;
        }
    }
    console.log("✅ All other vehicle types are correctly excluded");
    return true;
}


//extract the vehicle seats from the result text and return an array of numbers
// the patter for seat goes number space seat  
function extractSeatsFromResults(resultsText) {
    const seatStrings = resultsText.match(/(\d+) seat/g);
    return seatStrings ? seatStrings.map(seatString => parseInt(seatString)) : [];
}