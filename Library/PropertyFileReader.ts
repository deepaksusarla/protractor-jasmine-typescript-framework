/**
 * Created by Deepak on 07/02/18.
 */
import {isNullOrUndefined} from "util";
import {Constants} from "./Constants";

const propertiesReader: any = require("properties-reader");
let propFile: any = "";

export class PropertyFileReader {
  private static pfReader: PropertyFileReader;
  // private logger: any = Constants.log4js.getLog(this.constructor.name);

  private constructor() {
  }

  public static getInstance = () => {
    if (!PropertyFileReader.pfReader) {
      PropertyFileReader.pfReader = new PropertyFileReader();
    }
    return PropertyFileReader.pfReader;
  };

  public setPropertyFile = (fileName: string) => {
    propFile = propertiesReader(fileName);
  };

  public getPropValue = (propName: string) => {
    let propValue: any;
    try {
      if (!isNullOrUndefined(propName)) {
        propValue = propFile.get(propName);
       // console.log("property value for '" + propName + "' :", propValue);
      } else {
        console.error("Please provide valid property name.");
      }
      return propValue;
    } catch (e) {
      console.error("error is :" + e.stack);
    }
  };

}