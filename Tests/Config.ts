
 // tslint:disable
import {browser, Config } from "protractor";
import {CapHelper} from "../Library/BrowserCapabilitiesHelper";
import {Constants} from "../Library/Constants";
import {Utilities} from "../Library/Utils";

const q: any = require("q");
const browserProfile: any = new CapHelper();
const utils: any = new Utilities();
export let config: Config = {

  getMultiCapabilities: function() {
    const specFile: string = this.params.specFileName;
    const browserName: string = this.params.browserName;
    const platformName: string = this.params.platform;
    const browserVersion: string = this.params.browserVersion;
    const browserHeadless: boolean = this.params.headLess;
    
    return q.all(
                browserProfile.getBrowserProfile(browserName, platformName, 
                  browserVersion, specFile, browserHeadless)
            );
  },
  framework: "jasmine",
  jasmineNodeOpts: {
    onComplete: undefined,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 600000
  },
  "maxSessions": 1,
  allScriptsTimeout: Constants.testScriptWait,
  getPageTimeout:  90000,
  onPrepare: async () => {
   await utils.openUrl(utils.getBaseUrl());
  },
  onComplete: async () => {
    await utils.closeWebDriver();
  }
};