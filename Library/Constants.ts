/**
 * Created by Deepak on 07/02/18.
 */
import {Logger} from "./Logger";
import {PropertyFileReader} from "./PropertyFileReader";

export namespace Constants {
  export const logLevel: string = "DEBUG";
  export const log4js: any = Logger.getInstance(logLevel);
  export const prop: any = PropertyFileReader.getInstance();
  prop.setPropertyFile("Resources/Config.properties");
  export const elementToWait: number = 30000; // 30 secs;
  export const testScriptWait: number = 900000; // 15 mins or 900 secs
  export enum ElementWaitType {
    ISPRESENT = "present",
    ISDISPLAYED = "display",
    ISENABLED = "enabled"
  };
}