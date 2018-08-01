 // tslint:disable
import { AccountsPage } from "../Pages/AccountsPage";
import { HomePage } from "../Pages/HomePage";
import { LoginPage } from "../Pages/LoginPage";
const loginData: any = require("../../TestData/LoginTestData.json")
let homePage: HomePage;
let loginPage: LoginPage ;

describe("LandSend Login Scenario->", () => {

  beforeAll(async () => {

    homePage = new HomePage();
    loginPage = new LoginPage();
  });
  it("Navigation to Home Page", async () => {
    const homePageHeader: string = await homePage.getTitle();
    expect("Lands' End: Polo Shirts, Tees, Jeans, Khaki Pants, Chinos, Backpacks").toEqual(homePageHeader);
  });
  it("Navigating to Login Page", async () => {
    await homePage.navigateToPage("SIGN IN");
    const loginPageHeader: string =  await loginPage.getTitle();
    expect("Login | My Account | Lands' End").toEqual(loginPageHeader);
  });
  
  it("Successful Login and navigating to accounts page", async () => {
    await loginPage.login(loginData.usrName, loginData.pass);
    const homePageHeader: string = await homePage.getSignInText();
    expect("PROTRACTOR").toEqual(homePageHeader);
  });

});