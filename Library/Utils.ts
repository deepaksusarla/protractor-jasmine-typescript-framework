/**
 * Created by Deepak on 06/02/18.
 */
import * as fs from "fs";
import {browser, by, element, ElementArrayFinder, ElementFinder, protractor} from "protractor";
import {error, isNullOrUndefined, isUndefined} from "util";
import {Constants} from "./Constants";

const logger: any = Constants.log4js.getLog("Utils");
let elementWait: number = Constants.elementToWait;

export class Utilities {
  public globalVariables: any = Constants;

  /*
   * Highlighting the element
   * @type: element
   */
  public static highlightElement = (el: any) => {
    
    try {
      let needHightElement: boolean;
      if (browser.params.highLightElement !== undefined) {
        needHightElement = browser.params.highLightElement;
      } else {
        needHightElement = Constants.prop.getPropValue("HighLightElement");
      }
      if (needHightElement) {
        return browser.driver.executeScript(
          "arguments[0].style.border='2px solid green'", el.getWebElement())
          .then(() => {
            browser.sleep(100);
            Utilities.unlitElement(el);
          }, (error: Error) => {
            logger.error("error is :" + error);
          });
      }
    } catch (e) {
      logger.error("highlight error :" + e.stack);
    }
  };
  
  /*
   * Un lighting the element
   * @type : element
   */
  private static unlitElement = (el: any) => {
    return browser.driver.executeScript("arguments[0].style.border=''",
      el.getWebElement()).then(() => {
        return el;
      }, (err: Error) => {
        logger.error("error is :" + err);
      });
  };

  /*
   * Waiting for an element to be present
   * @type : element
   * @type : Wait time (optional)
   * @return : returns true if element present
   */
  public waitUntilReady = async (element: ElementFinder, elementWaitType: string, wait: number, isIndvidual: boolean) => {
    
    if (!isUndefined(wait) || wait > 99) {
      elementWait = wait;
    }
    const _retryOnErr: any = () => {
      logger.debug("wait... retrying for element " + element.locator());
      return false;
    };
    switch (elementWaitType) {
    case "present" :
      return browser.driver.wait(() => {
        return element.isPresent().then((isPresent: boolean) => {
          if (isPresent) {
            Utilities.highlightElement(element);
            logger.info("waitUntilReady:-", "Element '", element.locator(), "' is Present.");
            return true;
          } else {
            return _retryOnErr();
          }
        }, _retryOnErr(error));
      }, elementWait).then((waitRetValue: any) => {
        return waitRetValue; // usually just `true`
      }, (err: Error) => { 
        if (isIndvidual) {
          return false;
        } else {
          const desc: string = "Element '" + element.locator() + "' Not Present. ";
          logger.error(err);
          logger.error(desc + err.message);
        }
        
      });

    case "display" :
      return browser.driver.wait(() => {
        return element.isDisplayed().then((isDisplayed: boolean) => {
          if (isDisplayed) {
            Utilities.highlightElement(element);
            logger.info("waitUntilReady:-", "Element '", element.locator(), "' is Displayed.");
            return true;
          }
          if (!isDisplayed) {
            logger.warn("wait... Element '", element.locator(), "' found but hidden.");
            // return false;
          }
        }, _retryOnErr(error));
      }, elementWait).then((waitRetValue: any) => {
        return waitRetValue; // usually just `true`
      }, async (err: Error) => {
        if (isIndvidual) {
          return false;
        } else {
          const desc: string = "Element --'" + element.locator() + "' Not Displayed. ";
          logger.error(err);
          logger.error(desc + err.message);
        }
        
      });

    case "enabled" :
      return browser.driver.wait(() => {
        return element.isEnabled().then((isEnabled: boolean) => {
          if (isEnabled) {
            Utilities.highlightElement(element);
            logger.info("waitUntilReady:-", "Element '", element.locator(), "' is Enabled.");
            return true;
          } else {
            return _retryOnErr();
          }
          
        }, _retryOnErr(error));
      }, elementWait).then((waitRetValue: any) => {
        return waitRetValue; // usually just `true`
      }, async (err: Error) => {
        if (isIndvidual) {
          return false;
        } else {
          const desc: string = "Element --'" + element.locator() + "' Not Enabled. ";
          logger.error(err);
          logger.error(desc + err.message);
        }
        
      });
    default :
      logger.error("Currently '" + elementWaitType + "' Not implemented.");
      break;
    }
  };
  
  /*
   * Returns element of the specified lcoator
   * @type : locator
   * @type : Wait time (optional)
   */
  public getElement = async (locator: ElementFinder) => {
    return element(locator);
  };

  /*
   * Returns elements of the specified lcoator
   * @type : locator
   * @type : Wait time (optional)
   */
  public getElements = async (locator: ElementFinder) => {
    return element.all(locator);
  };

  /*
   * Returns element of the specified lcoator
   * @type : locator
   * @type : Wait time (optional)
   */
  public getWebElement1 = async (webElement: ElementFinder, locator: ElementFinder) => {
    return webElement.element(locator);
  };

  /*
   * Returns elements of the specified lcoator
   * @type : locator
   * @type : Wait time (optional)
   */
  public getInnerElements = async (webElement: any, locator: ElementFinder) => {
    return webElement.all(locator);
  };

  /*
   * Returns elements of the specified lcoator
   * @type : locator
   * @type : Wait time (optional)
   */
  public getInnerElement = async (webElement: any, locator: ElementFinder) => {
    return webElement.element(locator);
  };
  
  /*
   * Returns current browser title
   * @return : text
   */
  public getTitle = () => {
    browser.sleep(2000);
    return browser.driver.getTitle().then((text: string) => {
      return text;
    });
  };

  /*
   * refresh's the current page
   */
  public refreshPage = async () => {
    await browser.refresh();
  };

  /*
   * browser back/forward from current page
   */
  public navigateTo = async (value: string) => {
    if (value === "back") {
      await browser.navigate().back();
    }
    if (value === "forward") {
      await browser.navigate().forward();
    }
  };

   /*
   * Returns locator
   * @type : string
   * @type : string
   * @type : string
   */
  public getElementLocator = (locatorName: string, locatorValue: string, value: string) => {
    switch (locatorName.toLowerCase()) {
    case "id": 
      return by.id(locatorValue);
    case "name":
      return by.name(locatorValue);
    case "classname":
      return by.className(locatorValue);
    case "xpath":
      return by.xpath(locatorValue);
    case "model":
      return by.model(locatorValue);
    case "repeater":
      return by.repeater(locatorValue);
    case "binding":
      return by.binding(locatorValue);
    case "lintext":
      return by.linkText(locatorValue);
    case "partiallinktext":
      return by.partialLinkText(locatorValue);
    case "css":
      return by.css(locatorValue);
    case "csscontainingtext":
      return by.cssContainingText(locatorValue, value);
    case "tagname":
      return by.tagName(locatorValue);
    case "options":
      return by.options(locatorValue);
    case "buttontext":
      return by.buttonText(locatorValue);
    case "partialbuttontext":
      return by.partialButtonText(locatorValue);
    default:
      logger.error("Currently '" + locatorName + "' Not available.");
      break;
    }
  };

  /*
   * Opens url on the specified browser
   * @type : string
   * @type : boolean
   */
  public openUrl = async (baseUrl: string) => {
    browser.driver.manage().window().maximize();
    await browser.get(baseUrl);
    await browser.waitForAngular();
  };

  /*
   * closes the entire webdriver.
   */
  public closeWebDriver = async () => {
    await browser.quit();
  }

  /*
   * Type text on the specified element
   * @type : locator
   * @type : value
   * @type : Wait time (optional)
   */
  public type = async (locator: ElementFinder, value: any, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    await element(locator).clear();
    return element(locator).sendKeys(value.trim().toString()).then(() => {
      logger.info(value +  " entered successfully...");
      return true;
    }, (err: Error) => {
      logger.error("error. Unable to enter value..." + err.message);
      return false;
    });
  };
 
  /*
   * Type text on the specified element
   * @type : locator
   * @type : value
   * @type : Wait time (optional)
   */
  public typeByTagName = async (locator: ElementFinder, tagName: string, name: string, value: any, needToClear: boolean, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    const ele: ElementFinder = element(locator);
    let isEnteredValue: boolean;
    await ele.all(by.tagName(tagName)).filter((ele1: ElementFinder, index: number) => {
      return ele1.getText().then((text: string) => {
        if (text.trim() === name) {
          return true;
        } else {
          isEnteredValue = false;
        }
      });
    }).each(async (ele1: ElementFinder) => {
      Utilities.highlightElement(ele1);
      if (needToClear === true) {
        await ele1.clear();
      }
      ele1.sendKeys(value).then(() => {
        logger.info(value +  " entered successfully...");
        isEnteredValue = true;
      }, (err: Error) => {
        logger.error("error. Unable to enter value..." + err.message);
        isEnteredValue = false;
      });
    });
    return isEnteredValue;
  };

  /*
   * Clicks the specified element
   * @type : locator
   * @type : Wait time (optional)
   */
  public click = async (locator: ElementFinder, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    return element(locator).click().then(() => {
      logger.info( "Locator " + locator + " clicked successfully...");
      return true;
    }, (err: Error) => {
      logger.error("error. Unable to click..." + err.message);
      return false;
    });
    
  };

  /*
   * Clicks the specified element using tagName
   * @param : locator
   * @param : tagName
   * @param : Text
   * @param : Wait time (optional)
   */
  public clickByTagName = async (locator: ElementFinder, tagName: string, name: string, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    const ele: ElementFinder = element(locator);
    let isClicked: boolean;
    await ele.all(by.tagName(tagName)).filter((ele1: ElementFinder, index: number) => {
      return ele1.getText().then((text: string) => {
        if (text.trim() === name) {
          return true;
        } else {
          isClicked = false;
        }
      });
    }).each((ele1: ElementFinder) => {
      Utilities.highlightElement(ele1);
      ele1.click().then(() => {
        logger.info("Element " + ele1.locator() + " clicked successfully..");
        isClicked = true;
      }, (err: Error) => {
        logger.error("error.e Unable to click.." + err.message);
        isClicked = false;
      });
    });
    return isClicked;
  };

   /*
   * selects the specified date
   */
  public selectDate = async (value: string) => {
    const date: string[] = value.split("/");
    const calendarObj: any = await this.isGivenCurrentMonth(this.getMonthName(date[0]));
    if (calendarObj.isCurrentMonth === true) {
      await this.selectValue(calendarObj.calendarRowCount, calendarObj.calendarRow, date[1]);
    } else {
      await calendarObj.calendarCol.get(0).click();
      await this.selectValue(calendarObj.calendarRowCount, calendarObj.calendarRow, date[0]);
      await this.selectValue(calendarObj.calendarRowCount, calendarObj.calendarRow, date[1]);
    }
  }

  /*
   * Returns text of the specified element
   * @type : locator
   * @type : Wait time (optional)
   * @return : text
   */
  public getText = async (locator: ElementFinder, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    return element(locator).getText().then((text: string) => {
      logger.info("text is :" + text);
      return text.toString().trim();
    }, (err: Error) => {
      logger.error("error. Unable to getText..." + err.message);
      return false;
    });
  };

  /*
   * Returns text of the specified element
   * @type : locator
   * @type : Wait time (optional)
   * @return : text
   */
  public getAllText = async (locator: ElementFinder, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    return element.all(locator).getText().then((text: string) => {
      logger.info("All text is :" + text);
      return text.toString();
    }, (err: Error) => {
      logger.error("error. Unable to getText..." + err.message);
    });
  };

  /*
 * Returns text of the specified element which has multiple inner elements using tagName
 * @param : locator
 * @param : tagName
 * @param : Wait time (optional)
 * return : text
 */
  public getAllTextByTagName = async (locator: ElementFinder, tagName: string, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    const ele: ElementFinder = element(locator);
    return ele.all(by.tagName(tagName)).getText().then((text: string) => {
      const str: string[] = text.toString().split(",");
      logger.info("text is :" + str);
      return str;
    }, (err: Error) => {
      logger.error("error. Unable to get Text by TagName..." + err.message);
    });
  };
  
  /*
 * Returns text of the specified element which has multiple inner elements using tagName
 * @param : locator
 * @param : tagName
 * @param : Wait time (optional)
 * return : text
 */
  public getTextByTagName = async (locator: ElementFinder, tagName: string, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    const ele: ElementArrayFinder = element(locator).all(by.tagName(tagName));
    return ele.getText().then((text: string) => {
      logger.info("getTextByTagName: ", text)
      const str: string[] = text.toString().split(",").map((item: string) => item.trim());
      logger.info("text is :" + str);
      return str;
    }, (err: Error) => {
      logger.error("error. Unable to get Text by TagName..." + err.message);
    });
  };

  /*
* Returns text of the specified element which has multiple inner elements using tagName
* @param : locator
* @param : tagName
* @param : cssValue
* @param : elementWaitType
* @param : Wait time (optional)
* return : text
*/
  public getTextByTagNameAndCssValue = async (locator: ElementFinder, tagName: string, cssValue: string, elementWaitType: string, wait: number) => {
    try {
      const strValue: string[] = [];
      await this.waitUntilReady(element(locator), elementWaitType, wait, false);
      const ele: ElementFinder = element(locator);
      const eleArr: ElementArrayFinder = ele.all(by.tagName(tagName));
      const eleArrCount: number = await ele.all(by.tagName(tagName)).count();
      let j: number = 0;
      for (let i: number = 0; i < eleArrCount; i++) {
        const ele1: ElementFinder = eleArr.get(i);
        const cssText: any = await ele1.getCssValue(cssValue);
        if (cssText.trim() !== "none") {
          const linkText: string = await ele1.getText();
          strValue[j++] = linkText.toString().trim();
        }
      }
      logger.info("getTextByTagNameAndCssValue :", strValue);
      return strValue;
    } catch (e) {
      logger.error("getTextByTagNameAndCssValue error :" + e.stack);
    }

  };

  /*
   * Returns count of the specified element which has multiple inner elements
   * @param : locator
   * @param : Wait time (optional)
   * @return : value
  */
  public getCount = async (locator: ElementFinder, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    return element.all(locator).count().then((count: number) => {
      logger.info("count is :" + count);
      return count;
    }, (err: Error) => {
      logger.error("error. Unable to get Count..." + err.message);
    })
  };

  /*
   * Returns count of the specified element which has multiple inner elements using tagName
   * @param : locator
   * @param : tagName
   * @param : Wait time (optional)
   * @return : value
   */
  public getCountByTagName = async (locator: ElementFinder, tagName: string, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    const ele: ElementFinder = element(locator);
    
    return ele.all(by.tagName(tagName)).count().then((count: number) => {
      logger.info("count is :" + count);
      return count;
    }, (err: Error) => {
      logger.error("error. Unable to get count by TagName..." + err.message);
    })
  };

   /*
   * Returns cssValue of the specified element
   * @type : locator
   * @type : Wait time (optional)
   * @return : value
   */
  public getCss = async (locator: ElementFinder, cssType: string, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    return element(locator).getCssValue(cssType).then((cssValue: string) => {
      logger.info("getCss is :" + cssValue);
      return cssValue;
    });
  };
  
  /*
   * Returns cssValue of the specified element
   * @type : locator
   * @type : Wait time (optional)
   * @return : value
   */
  public getCssByTagName = async (locator: ElementFinder, tagName: string, cssType: string, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    const ele: ElementFinder = element(locator);
    return ele.all(by.tagName(tagName)).getCssValue(cssType).then((cssValue: string) => {
      logger.info("getCssByTagName is :" + cssValue);
      return cssValue;
    });
  };

  /*
   * Returns Attribute value of the specified element
   * @param : locator
   * @param : AttributeName
   * @param : Wait time (optional)
   * @return : text
   */
  public getAttributeValue = async (locator: ElementFinder, attributeName: string, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    return element(locator).getAttribute(attributeName).then((text: string) => {
      return text;
    }, (err: Error) => {
      logger.error("error. Unable to get Attribute Value..." + err.message);
    })
  };

  /*
 * returns string by removing news lines and tabs.
 * @param : String
 */
  public stringEscape = (str: string) => {
    return str.replace(/\n/g, " ").replace(/\s{2,}/g, " ");
  };

  public stringArrayRemoveEmptySpaces = (str: string[]) => {
    return str.filter((e: string) => {
      return String(e).trim();
    });
  };
  
  public scrollTo = async (locator: ElementFinder, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    const ele: ElementFinder = element(locator);
    return browser.driver.executeScript("arguments[0].scrollIntoView(false);", ele.getWebElement()).then(async () => {
      return true;
    }, (err: Error) => {
      logger.error("error is :" + err);
    });
  }

  /*
   * Mouse overs on the specified element
   * @type : locator
   * @type : Wait time (optional)
   */
  public mouseHover = async (locator: ElementFinder, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    browser.actions().mouseMove(element(locator)).perform().then(() => {
      logger.info("mouseHover is successful");
    }, (err: Error) => {
      logger.error("error in mouseHover :" + err.message);
    });
  };
  
  /*
   * Mouse overs on the specified element
   * @type : locator
   * @type : Wait time (optional)
   */
  public mouseHoverJS = async (locator: ElementFinder, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    const code: string = "var fireOnThis = arguments[0];"
      + "var evObj = document.createEvent('MouseEvents');"
      + "evObj.initEvent( 'mouseover', true, true );"
      + "fireOnThis.dispatchEvent(evObj);";
    return browser.driver.executeScript(
      code, element(locator).getWebElement())
      .then(() => {
        logger.info(locator + " Mouse Hovered successfully...");
      }, (err: Error) => {
        const desc: string = "Element '" + element + "' Not Found. ";
        logger.error("error is :" + err);
      });
  };

  public moveMouseTo = async (locator: ElementFinder, elementWaitType: string, wait: number) => {
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    return browser.actions().mouseMove(element(locator)).perform().then ( () => {
      logger.info(locator + " Mouse Moved successfully...");
    }, (err: Error) => {
      const desc: string = "Element '" + element + "' Not Found. ";
      logger.error("error is :" + err);
    });
  };

  public getBrowserDetails = async (value: string) => {
    try {
      const capabilities: any = await browser.getCapabilities();
      return capabilities.get(value);
    } catch (e) {
      logger.error("Exception in get Browser Details method :" + e.stack);
      return undefined;
    }
  }

  public getBaseUrl = () => {
    const url: string = browser.params.baseUrl || Constants.prop.getPropValue("BaseUrl");
    return url;
  };

  public isImageLoaded = async (locator: ElementFinder, elementWaitType: string, wait: number) => {

    const jsCode: string = `return arguments[0].complete && 
      typeof arguments[0].naturalWidth != \"undefined\" && 
      arguments[0].naturalWidth > 0`;
    await browser.sleep(1000);
    await this.waitUntilReady(element(locator), elementWaitType, wait, false);
    return browser.driver.executeScript(
      jsCode, element(locator).getWebElement())
    .then(() => {
      logger.info(locator + " Image Loaded successfully...");
      return true;
    }, (err: Error) => {
      logger.error("error is :" + err);
    });
  };

  public getDateAndTime = (noOfDays: number, needFormat: boolean, formater: string, addTime: boolean) => {
    const date: number = new Date().getDate() + noOfDays;
    const month: number = new Date().getMonth() + 1;
    const year: number = new Date().getFullYear();
    const hrs: number = new Date().getHours();
    const mins: number = new Date().getMinutes();
    const secs: number = new Date().getSeconds();
    let dateAndTime: string;
    if (needFormat === true) {
      if (addTime ===  true) {
        dateAndTime = month.toString() + formater + date.toString() + formater + year.toString() +
         " " + hrs.toString() + ":" + mins.toString() + ":" + secs.toString();
      } else {
        dateAndTime = month.toString() + formater + date.toString() + formater + year.toString()
      }
      
    } else {
      dateAndTime = hrs.toString() + mins.toString() + secs.toString() + month.toString() + date.toString() +  year.toString();
    }
    return dateAndTime;
  }

  private getMonthName = (monthNumber: string) => {
    switch (monthNumber) {
    case "1": 
      return "Jan";
    case "2": 
      return "Feb";
    case "3": 
      return "Mar";
    case "4": 
      return "Apr";
    case "5": 
      return "May";
    case "6": 
      return "Jun";
    case "7": 
      return "Jul";
    case "8": 
      return "Aug";
    case "9": 
      return "Sep";
    case "10": 
      return "Oct";
    case "11": 
      return "Nov";
    case "12": 
      return "Dec";
      
    default : 
      return "null";
    }
  }

  private getCalendar = async () => {
    const calendar: ElementFinder = await element(by.className("md-calendar"));
    const fullCalendar: ElementArrayFinder = calendar.all(by.tagName("tbody"));
    const calendarCount: any = await fullCalendar.count();
    const gridRow: ElementFinder = fullCalendar.get(3);
    const calendarRow: ElementArrayFinder = gridRow.all(by.tagName("tr"));
    const calendarRowCount: any = await calendarRow.count();
    const calendarCols: ElementFinder = calendarRow.get(0);
    return {
      "calendarRowCount": calendarRowCount,
      "calendarRow": calendarRow,
      "calendarCols": calendarCols
    }
  }

  private selectValue = async (calendarRowCount: number, calendarRow: ElementArrayFinder, value: string) => {
    for (let j: number = 0; j < calendarRowCount; j++) {
      const calendarCols: ElementFinder = calendarRow.get(j);
      const calendarCol: ElementArrayFinder = calendarCols.all(by.tagName("td"));
      const calendarColCount: any = await calendarCol.count();
      for (let k: number = 0; k < calendarColCount; k ++) {
        const calendarColText: string = await calendarCol.get(k).getText();
        logger.debug("calendar col value :" + calendarColText + "---" + value);
        if (calendarColText === value) {
          await Utilities.highlightElement(calendarCol.get(k)); 
          await calendarCol.get(k).click();
          break;
        }
      }
    }
  }

  private isGivenCurrentMonth =  async (month: string) => {
    let isCurrentMonth: boolean;
    const calendarObj: any = await this.getCalendar();
    const calendarCol: ElementArrayFinder = calendarObj.calendarCols.all(by.tagName("td"));
    const calendarColText: string = await calendarCol.get(0).getText();
    const calendarMonthYear: string[] = calendarColText.split(" ");
    if (calendarMonthYear[0] === month) {
      isCurrentMonth = true;
    } else {
      isCurrentMonth = false;
    }
    return {
      "isCurrentMonth": isCurrentMonth,
      "calendarCol": calendarCol,
      "calendarRowCount": calendarObj.calendarRowCount,
      "calendarRow": calendarObj.calendarRow
    }
  }
}