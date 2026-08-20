package tests;

import org.testng.annotations.Test;
import org.vega.configuration.LoadProperties;
import org.vega.pages.HomePage;

public class LoginTest extends TestBase {
    HomePage homePage;


    @Test(priority = 0)
    public void shouldLoginSuccessfully() {
        homePage = new HomePage(webDriver);
        homePage.login(LoadProperties.env.getProperty("ADMIN_EMAIL"), LoadProperties.env.getProperty("ADMIN_PASSWORD"));
        assertIsEqual(homePage.toastMsg,"Welcome back, Admin!");
        softAssert.assertAll();
    }
    @Test(priority = 0)
    public void shouldFailLoginWithInvalidCredentials() {
        homePage = new HomePage(webDriver);
        String invalidEmail = "invalid@vega.com";
        String invalidPassword = "invalidpassword";
        homePage.login(invalidEmail, invalidPassword);
        assertIsEqual(homePage.toastMsg,"Login failed. Please check your credentials.");
        softAssert.assertAll();
    }
}
