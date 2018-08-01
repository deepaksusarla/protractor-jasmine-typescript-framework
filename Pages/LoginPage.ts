
import { Utilities } from "../Library/Utils";
import { loginPageObj } from "../PageObjects/LoginPageObj";
import { AccountsPage } from "./AccountsPage";

export class LoginPage extends Utilities {

  private usrName: any = this.getElementLocator(loginPageObj.usrName.locatorName, loginPageObj.usrName.locatorValue, undefined);

  private pass: any = this.getElementLocator(loginPageObj.pass.locatorName, loginPageObj.pass.locatorValue, undefined);

  private loginBtn: any = this.getElementLocator(loginPageObj.loginBtn.locatorName, loginPageObj.loginBtn.locatorValue, undefined);

  public login = async (usrName: string, key: string) => {
    await this.type(this.usrName, usrName, this.globalVariables.ElementWaitType.ISDISPLAYED, undefined);
    await this.type(this.pass, key, this.globalVariables.ElementWaitType.ISDISPLAYED, undefined);
    await this.click(this.loginBtn, this.globalVariables.ElementWaitType.ISENABLED, undefined);
  }
}