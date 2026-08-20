package tests;

import org.testng.annotations.Test;
import org.vega.configuration.LoadProperties;
import org.vega.pages.AdminPanelPage;
import org.vega.pages.HomePage;

public class SignUpTest extends TestBase {

    HomePage homePage;
    AdminPanelPage adminPanelPage;

    String name = faker.name().fullName();
    String email = faker.internet().emailAddress();
    String password = faker.number().digits(6);
    String role = "User";


    @Test(priority = 0)
    public void checkThatSignUpScenarioWorkingSuccessfully()  {
        homePage = new HomePage(webDriver);
        homePage.signUp(name, email, password, password, role);
        assertIsEqual(homePage.toastMsg, "Registered successfully! Waiting for admin approval"); // assertion command about the showing success message of sign up
        softAssert.assertAll();

    }

    @Test(priority = 1)
    public void approveRegistrationRequest() {
        homePage = new HomePage(webDriver);
        adminPanelPage = new AdminPanelPage(webDriver);
        homePage.login(LoadProperties.env.getProperty("ADMIN_EMAIL"), LoadProperties.env.getProperty("ADMIN_PASSWORD"));
        homePage.openAdminPanel();
        assertIsEqual(adminPanelPage.adminPanelTitle, "ADMIN PANEL");
        assertIsEqual(adminPanelPage.email, email);
        assertIsEqual(adminPanelPage.roleNewAccount, role);
        assertIsEqual(adminPanelPage.name, name);
        adminPanelPage.approveSignUpRequest();
        softAssert.assertAll();
    }

}
