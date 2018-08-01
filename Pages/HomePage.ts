import { browser } from "protractor";
import { Utilities } from "../Library/Utils";
import { homePageObj } from "../PageObjects/HomePageObj";

export class HomePage extends Utilities {

  private myAccount: any = this.getElementLocator(homePageObj.myAccount.locatorName, homePageObj.myAccount.locatorValue, undefined);

  private myAccountList: any = this.getElementLocator(homePageObj.myAccountList.locatorName, homePageObj.myAccountList.locatorValue, undefined);

  private signInText: any = this.getElementLocator(homePageObj.signInText.locatorName, homePageObj.signInText.locatorValue, undefined);

  private closePopup: any = this.getElementLocator(homePageObj.closePopup.locatorName, homePageObj.closePopup.locatorValue, undefined);

  private signUpclosePopup: any = this.getElementLocator(homePageObj.SignUpclosePopup.locatorName, homePageObj.SignUpclosePopup.locatorValue, undefined);

  public navigateToPage = async (pageName: string) => {
    await this.click(this.closePopup, this.globalVariables.ElementWaitType.ISDISPLAYED, undefined);
    await this.click(this.signUpclosePopup, this.globalVariables.ElementWaitType.ISDISPLAYED, undefined);
    await this.click(this.myAccount, this.globalVariables.ElementWaitType.ISDISPLAYED, undefined);
    await this.clickByTagName(this.myAccountList, "li", pageName, this.globalVariables.ElementWaitType.ISDISPLAYED, undefined);
  }

  public getSignInText = async () => {
    return await this.getText(this.signInText, this.globalVariables.ElementWaitType.ISDISPLAYED, undefined);
  }
}