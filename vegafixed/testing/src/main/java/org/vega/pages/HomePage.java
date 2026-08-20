package org.vega.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class HomePage extends PageBase {
    public HomePage(WebDriver webDriver) {
        super(webDriver);
    }

   // This defines a locators for a Elements in a webpage.
    By signUpBtn = By.linkText("Sign Up");
    By loginBtn = By.linkText("Login");
    By nameField = By.name("name");
    By emailField = By.name("email");
    By passField = By.name("password");
    By confirmPassField = By.name("confirmPassword");
    By roleField = By.name("role");
    By signUpSubmitBtn = By.cssSelector("button.btn.btn-primary[type='submit']");
   public By toastMsg=By.cssSelector("[data-testid='toast']");
   By emailLoginField=By.name("email");
   By passwordLoginField=By.name("password");
   By loginSubmitBtn=By.xpath("//button[text()='Login']");
   By adminPanelModule=By.linkText("Admin");


    //Method to sign up a user with the provided information.
    public void signUp(String name , String email, String password, String confPassword, String role) {
    click(signUpBtn);
    type(nameField,name);
    type(emailField,email);
    type(passField,password);
    type(confirmPassField,confPassword);
    select(roleField,role);
    click(signUpSubmitBtn);
    }


    //Method to log in a user with the provided information.
    public void login(String email, String password){
        click(loginBtn);
        type(emailLoginField,email);
        type(passwordLoginField,password);
        click(loginSubmitBtn);
    }

    public void openAdminPanel(){
        click(adminPanelModule);
    }
}
