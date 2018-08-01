import { Utilities } from "../Library/Utils";
import { accountsPageObj } from "../PageObjects/AccountPageObj";

export class AccountsPage extends Utilities {

  private accountHeader: any = this.getElementLocator(accountsPageObj.accountHeader.locatorName, accountsPageObj.accountHeader.locatorValue, undefined);

  public getHeaderText = async () => {
    return this.getText(this.accountHeader, this.globalVariables.ElementWaitType.ISDISPLAYED, undefined);
  }
}