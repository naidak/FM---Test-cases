import { assert } from 'chai';
import { Builder, By, until } from 'selenium-webdriver';
import { describe, it, before, after } from 'mocha';

let driver;

describe("PetCity Login Tests", function () {
    this.timeout(30000); // Povećano vrijeme za sporije mreže

    // Setup
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts({ implicit: 5000 });
    });

    // Teardown
    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    // Testni slučajevi
    it("Step 1: Klikni na ikonicu 'Moj račun'", async function () {
        await driver.get("https://www.petcity.ba/");
        // await driver.sleep(1000); // Pauza od 1 sekunde
        // const accountIcon = await driver.findElement(By.css("a.a1"));
        // await accountIcon.click();

        await driver.get("https://www.petcity.ba/moj-racun/");
        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, "https://www.petcity.ba/moj-racun/", "URL nije ispravan!");
    });

    it("Step 2: Klikni na input polje 'Korisničko ime ili email adresa'", async function () {
        // Pronađite input polje
        const usernameField = await driver.findElement(By.id("username"));
        await usernameField.click();
    });

    it("Step 3: Unesi nepravilno korisničko ime ili email adresu",async function(){
        const usernameField = await driver.findElement(By.id("username"))
        await usernameField.sendKeys("test@gmail.com");

        const value = await usernameField.getAttribute("value");
        assert.equal(value, "test@gmail.com", "Tekst nije pravilno unesen!");
    })

    it("Step 4: Klikni na input polje 'Zaporka'", async function(){
        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.click();
    })

    it("Step 5: Unesi nepravilnu lozinku", async function(){
        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.sendKeys("test1234");

        const value = await passwordField.getAttribute("value");
        assert.equal(value, "test1234", "Nepravilno unesena lozinka!");
    })

    it("Step 6: Klikni na button 'Prijava'", async function () {
        const loginButton = await driver.findElement(By.css("button[name='login']")); // CSS selektor dugmeta
        await loginButton.click();
        const errorMessage = await driver.findElement(By.css(".woocommerce-error li")).getText(); // Selektor za grešku
        assert.include(
            errorMessage,
            "Nepoznata adresa e-pošte. Ponovno provjerite ili pokušajte svojim korisničkim imenom.",
            "Poruka o grešci nije ispravna!"
        );
        await driver.sleep(2000);
    });

    const waitForElementToBeClickable = async (element) => {
        await driver.wait(until.elementIsVisible(element), 5000);  // Wait until the element is visible
        await driver.wait(until.elementIsEnabled(element), 5000);  // Wait until the element is enabled
    };
    //Uklanjanje proizvoda iz korpe
    it("Step 1: Klikni na opciju 'Mačke' na izborniku", async function(){
        await driver.get("https://www.petcity.ba/");

        const categoryLink = await driver.findElement(By.css('a.has-submenu[href="https://www.petcity.ba/kategorija-proizvoda/macke/"]'));

        // Wait for the element to be clickable
        await waitForElementToBeClickable(categoryLink);

        await categoryLink.click();
        await categoryLink.click();

        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, "https://www.petcity.ba/kategorija-proizvoda/macke/", "Korisniku nije otvorena stranica sa mačkama!");

        //await driver.sleep(4000);
    });

    it("Step 2: Klikni na bilo koji proizvod", async function(){
        const firstProduct = await driver.findElement(By.css("a img.attachment-shop_catalog"));
        await firstProduct.click();
        const currentUrl = await driver.getCurrentUrl();
        assert.notEqual(currentUrl, "https://www.petcity.ba/kategorija-proizvoda/macke/", "Korisniku nije otvorena stranica sa detaljima proizvoda!");
        await driver.sleep(1000);
    })

    it("Step 3: Klikni na button 'Dodaj u košaricu'", async function () {
        const addToCartButton = await driver.findElement(By.css(".single_add_to_cart_button"));
        await addToCartButton.click();
        await driver.sleep(1000);

        const successMessage = await driver.findElement(By.css(".woocommerce-message"));
        const viewCartButton = await driver.findElement(By.css(".wc-forward"));

        const isSuccessMessageDisplayed = await successMessage.isDisplayed();
        const isViewCartButtonDisplayed = await viewCartButton.isDisplayed();

        assert.isTrue(isSuccessMessageDisplayed, "Poruka o uspješnom dodavanju proizvoda nije prikazana!");
        assert.isTrue(isViewCartButtonDisplayed, "Button 'Vidi košaricu' nije prikazan!");
    });

    it("Step 4: Klikni na button 'Vidi košaricu'", async function () {
        const viewCartButton = await driver.findElement(By.css(".wc-forward"));
        await viewCartButton.click();
        const currentUrl = await driver.getCurrentUrl();
        assert.notEqual(currentUrl, "https://www.petcity.ba/", "Korisniku nije prikazana stranica sa košaricom!");
    });

    it("Step 5: Klikni na ikonicu 'X' pored proizvoda", async function () {
        const removeProductButton = await driver.findElement(By.css(".remove"));
        await removeProductButton.click();
        const productInCart = await driver.findElements(By.css(".cart-product"));
        assert.equal(productInCart.length, 0, "Proizvod nije uklonjen iz košarice!");
    });

    //Dodavanje adrese
    //Klikni na ikonicu "Moj račun"
    it("Step 1: Klikni na ikonicu 'Moj račun'", async function(){
        const myAcc = await driver.findElement(By.css('a.a1[href="https://www.petcity.ba/moj-racun/"]'));
        await waitForElementToBeClickable(myAcc)
        await  myAcc.click();
        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, "https://www.petcity.ba/moj-racun/");
        // await driver.sleep(2000)
    })

    it("Step 2: Klikni na input polje \"Korisničko ime ili email adresa\" i unesi email\t\n", async function () {
        // Pronađite input polje
        const usernameField = await driver.findElement(By.id("username"));
        await usernameField.click();
        await usernameField.sendKeys("karabegnaida@gmail.com");

        const value = await usernameField.getAttribute("value");
        assert.equal(value, "karabegnaida@gmail.com", "Tekst nije pravilno unesen!");
    })

    it("Step 3: Klikni na input polje 'Zaporka'", async function(){
        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.click();
        await passwordField.sendKeys("naida123!");

        const value = await passwordField.getAttribute("value");
        assert.equal(value, "naida123!", "Uspješno logiranje!");
    })

    it("Step 4: Klikni na button \"Prijava\"\t\n", async function(){
        const loginBtn = await driver.findElement(By.css('.woocommerce-form-login__submit'));
        await waitForElementToBeClickable(loginBtn)
        await  loginBtn.click();
        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, "https://www.petcity.ba/moj-racun/");
    })

    it("Step 5: Klikni na ikonicu 'Moj račun'", async function(){
        const adresses = await driver.findElement(By.css('a[href="https://www.petcity.ba/moj-racun/edit-address/"]'));
        await waitForElementToBeClickable(adresses)
        await  adresses.click();
        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, "https://www.petcity.ba/moj-racun/edit-address/");
         //await driver.sleep(2000)
    })

    it("Step 6: Klikni na tekst \"Add Adresa za naplatu\" \t\n", async function(){
        const paymentAdress = await driver.findElement(By.css('a.edit[href="https://www.petcity.ba/moj-racun/edit-address/naplata/"]'));
        await waitForElementToBeClickable(paymentAdress)
        await  paymentAdress.click();
        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, "https://www.petcity.ba/moj-racun/edit-address/naplata/");
        await driver.sleep(2000)
    })

    it("Step 7: Popuni prikazanu formu \t\n", async function(){
        const firstName = await driver.findElement(By.id("billing_first_name"))
        await firstName.click();
        await firstName.clear();
        await firstName.sendKeys("Naida");

        const lastName = await driver.findElement(By.id("billing_last_name"))
        await lastName.click();
        await lastName.clear();
        await lastName.sendKeys("Karabeg");

        const adress = await driver.findElement(By.id("billing_address_1"))
        await adress.click();
        await adress.clear();
        await adress.sendKeys("Humilišani bb");

        const postcode = await driver.findElement(By.id("billing_postcode"))
        await postcode.click();
        await postcode.clear();
        await postcode.sendKeys("88208");

        const city = await driver.findElement(By.id("billing_city"))
        await city.click();
        await city.clear();
        await city.sendKeys("Mostar");

        const phone = await driver.findElement(By.id("billing_phone"))
        await phone.click();
        await phone.clear();
        await phone.sendKeys("063123456");

        const btnSave = await driver.findElement(By.className("button"))
        await btnSave.click();
        //https://www.petcity.ba/moj-racun/edit-address/
        const currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, "https://www.petcity.ba/moj-racun/edit-address/");
        await driver.sleep(2000)
    })

});
