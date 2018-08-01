import * as fs from "fs";
import * as path from "path";

export class FileUtils {
  
  private static fileUtils: FileUtils;
  private constructor() {
  }

  public static getInstance = () => {
    if (!FileUtils.fileUtils) {
      FileUtils.fileUtils = new FileUtils();
    }
    return FileUtils.fileUtils;
  };

  public getAllFiles = (filePath: string) => {
    return fs.readdirSync(filePath);
  }

  public isFileExists = (filepath: string, filename: string) => {
    let status: boolean = false;
    if (fs.existsSync(path.join(filepath, filename))) {
      status = true;
    } else {
      console.error(filename + "-> not found...");
      status = false;
    }
    return status;
  };
    
  public writeFile = (filepath: string, filename: string, text: string) => {
    try {
      require("mkdirp").sync(filepath);
      fs.writeFileSync(path.join(filepath, filename), text);
    } catch (e) {
      console.log("Exception in write file method :" + e.stack);
    }
  }
    
  public readFile = (filePath: string, filename: string) => {
    return fs.readFileSync(path.join(filePath, filename), "utf8");
  };
    
  public deleteFile = (filePath: string) => {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.log("Exception in delete file method :" + e.stack);
    }
  }
}