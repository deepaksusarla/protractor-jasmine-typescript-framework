/**
 * Created by Deepak on 07/02/18.
 */

import {isNullOrUndefined} from "util";
import {PropertyFileReader} from "./PropertyFileReader";
const log4j: any = require("log4js");

const prop: any = PropertyFileReader.getInstance();
prop.setPropertyFile("Resources/Config.properties");

const logDir: string = prop.getPropValue("LogReportDir");
const fileName: string =  prop.getPropValue("LogFileName");
const date: string = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear();
const fullFileName: string = fileName + "-" + date + ".log";
let log: any = "";

export class Logger {

  private static logger: Logger;

  private constructor(private logLevel: string) {
    log4j.configure({
      appenders: {cheese: {type: "file", filename: logDir + fullFileName}, console: {type: "console"}},
      categories: {default: {appenders: ["cheese", "console"], level: logLevel}}
    });
  }

  public static getInstance = (logLevel: string) => {
    if (!Logger.logger) {
      Logger.logger = new Logger(logLevel);
    }
    return Logger.logger;
  };

  public getLog = (logFileName: string) => {
    if (isNullOrUndefined(logFileName)) {
      log = log4j.getLogger();
    } else {
      logFileName = "[" + logFileName + "]";
      log = log4j.getLogger(logFileName);
    }
    return log;
  };

}
