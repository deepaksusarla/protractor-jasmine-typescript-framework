/**
 * Created by Deepak on 07/02/18.
 */
import path= require("path");
import q = require("q");
import {Profile} from "selenium-webdriver/firefox";
const desktopScenarios: any = require("../../Tests/AllScenarios.json");
const deferred: any = q.defer();
let multiCapabilities: any = [];
const testCaseExtension: string = "_TestCases.js";
const desktopWebTestsDirectory: string = "../Tests/";
let capabilities: any = "";

export class CapHelper {
  
  public getBrowserProfile = async (browserName: string, platformName: string, 
    browserVersion: string, specFileName: string, browserHeadless: boolean) => {
    
    try {
      if (specFileName.toLocaleLowerCase() !== "allscenarios") {
        const specFileNames: string[] = this.getSpecFileNames(specFileName);
        capabilities = await this.getBrowserCapabilities(browserName, browserVersion, 
          platformName, specFileNames, browserHeadless);
        multiCapabilities.push(capabilities);
        deferred.resolve(multiCapabilities);
        return deferred.promise;
      }
      if (specFileName.toLocaleLowerCase() === "allscenarios") {
        multiCapabilities = this.getAllBrowsersCapabilities(browserHeadless);
        deferred.resolve(multiCapabilities);
        return deferred.promise;
      }
    } catch (e) {
      console.error("Exception in getBrowserProfile method :" + e.stack);
    }
  };

  private getAllBrowsersCapabilities = (browserHeadless: boolean) => {
    let specFilesPath: string;
    let scenariosFile: any;
    specFilesPath = desktopWebTestsDirectory;
    scenariosFile = desktopScenarios;
    const browsersDetails: any = scenariosFile.browserDetails;
    const scenarios: any = scenariosFile.Scenarios;
    const fileNames: any = [];
    for (let i: number = 0; i < scenarios.length; i++) {
      const isExecutable: boolean = scenarios[i].isExecutable;
      if (isExecutable) {
        fileNames.push(path.join(specFilesPath, scenarios[i].fileName + testCaseExtension));
      }
    }
    for (let j: number = 0; j < browsersDetails.length; j++) {
      if (browsersDetails[j].RunOnThis) {
        const browserName: string = browsersDetails[j].browserName;
        const browserVersion: string = browsersDetails[j].browserVersion;
        const osName: string = browsersDetails[j].osName;
        capabilities = this.getBrowserCapabilities(browserName, browserVersion, osName, fileNames, browserHeadless);
        multiCapabilities.push(capabilities);
      }
      
    }
    
    return multiCapabilities;
  };

  private getBrowserCapabilities = async (browserName: string, browserVersion: string, 
    osName: string, specName: string[], browserHeadless: boolean) => {
    
    switch (browserName.toLocaleLowerCase()) {
    
    case "chrome":
      if (browserHeadless) {
        return this.getChromeHeadLessCapabilities(browserVersion, osName, specName);
      } else {
        return this.getChromeCapabilities(browserVersion, osName, specName);
      }
      
    case "firefox":
      if (browserHeadless) {
        return this.getFirefoxHeadLessCapabilities(browserVersion, osName, specName);
      } else {
        return this.getFirefoxCapabilities(browserVersion, osName, specName);
      }
      
    case "ie":
      return this.getIeOrEdgeCapabilities("IE", browserVersion, specName);
      
    case "edge":
      return this.getIeOrEdgeCapabilities("Edge", browserVersion, specName);
      
    default :
      console.error("Currently " + browserName + " Not available.");
      break;
    }
  };

  private getFirefoxCapabilities = (browserVersion: string, platformName: string, specName: string[]) => {
    
    return {
      "browserName": "Firefox",
      "os": platformName,
      "browser_version": browserVersion,
      "shardTestFiles": false,
      "specs": specName,
      "maxInstances": 1,
      "marionette": true,
      "acceptInsecureCerts": true
    };
  };

  private getFirefoxHeadLessCapabilities = (browserVersion: string, platformName: string, specName: string[]) => {
    
    return {
      "browserName": "Firefox",
      "os": platformName,
      "browser_version": browserVersion,
      "shardTestFiles": false,
      "specs": specName,
      "maxInstances": 1,
      "marionette": true,
      "acceptInsecureCerts": true,
      "moz:firefoxOptions": {
        "args": ["--headless", "--window-size=1366x768"]
      }
    };
  };

  private getChromeCapabilities = (browserVersion: string, platformName: string, specName: string[]) => {
    
    return {
      "browserName": "chrome",
      "os": platformName,
      "browser_version": browserVersion,
      "shardTestFiles": false,
      "specs": specName,
      "maxInstances": 1,
      "acceptInsecureCerts": true,
      "chromeOptions": {
        "args": ["--disable-infobars"]
      }
    };
  };

  private getChromeHeadLessCapabilities = (browserVersion: string, platformName: string, specName: string[]) => {
    
    return {
      "browserName": "chrome",
      "os": platformName,
      "browser_version": browserVersion,
      "shardTestFiles": false,
      "specs": specName,
      "maxInstances": 1,
      "acceptInsecureCerts": true,
      "chromeOptions": {
        "args": ["--no-sandbox", 
          "--headless", 
          "--window-size=1366x768",
          "--disable-infobars"]
      }
    };
  };

  private getIeOrEdgeCapabilities = (browserName: string, browserVersion: string, specName: string[]) => {
    return {
      "browserName": browserName,
      "os": "Windows",
      "os_version": "10",
      "browser_version": browserVersion,
      "shardTestFiles": false,
      "specs": specName,
      "maxInstances": 1,
      "acceptInsecureCerts": true,
      "javaScriptEnabled": true
    };
  };

  private getSpecFileNames = (specs: string) => {
    const specFileNames: string[] = [];
    let specFilesPath: string;
    specFilesPath = desktopWebTestsDirectory;
    if (specs.includes(",")) {
      const specFiles: string[] = specs.split(",");
      for (let i: number = 0; i < specFiles.length; i++) {
        specFileNames[i] = path.join(specFilesPath, specFiles[i] + testCaseExtension);
      }
    } else {
      specFileNames[0] = path.join(specFilesPath, specs + testCaseExtension);
    }
    return specFileNames;
  }
}