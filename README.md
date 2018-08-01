Protractor WebApp UI Automation FrameWork
===

# Prerequisites

### Install Node JS and Java on Windows

 https://www.guru99.com/download-install-node-js.html

 https://www.guru99.com/install-java.html

### Install Node Modules for the project
  Open command prompt or power shell and run the below commands in sequence.
  
     npm install -g grunt
     npm install -g typescript

# How to Run Tests?
   #### command to run tests :
  - Navigate to Project directory and run the below command

         cd protractor-jasmine-typescript-framework
         npm install
    
  - Command to run the required tests

         grunt runDesktopWebTests --baseUrl=<baseUrl(local/dev/qa)> --specFileName=<testCaseFileName> --browserName=<chrome/firefox>

    Ex: Command to execute Login page scenarios

         grunt runDesktopWebTests --baseUrl=https://www.landsend.com --specFileName=Login --browserName=chrome

  
    

### command line params:
   
  - #####--specFileName :
      Provide Spec File Name. Do not provide postfix "_TestCases.ts" to specFile. For running all testCases provide spec File Name as "allScenarios".
  
        Default value: allScenarios

  - #####--browserName :
       Can provide chrome/firefox/ie/edge.

        Default value: chrome

  - #####--baseUrl :
 
        Default value: https://www.landsend.com
        
   - #####--platform :

         Default value: windows
 
  - #####--browserVersion :
      Can provide specific browser version.

        Default value: ""
