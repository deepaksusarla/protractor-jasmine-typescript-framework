/**
 * Created by Deepak on 07/02/18.
 */


module.exports = function (grunt) {
  const path = require('path');
  let os=require('os');
  const ipAddr = grunt.option('ipAddr') === undefined ? '127.0.0.1' : grunt.option('ipAddr');
  const specFile = grunt.option('specFileName') === undefined ? 'allScenarios' : grunt.option('specFileName'); //scenarios
  const browserName = grunt.option('browserName') === undefined ? 'chrome' : grunt.option('browserName');
  const platform = grunt.option('platform') === undefined ? 'windows' : grunt.option('platform');
  const browserVersion = grunt.option('browserVersion') === undefined ? '' : grunt.option('browserVersion');
  const baseUrl = grunt.option('baseUrl');
  const cleanDrivers = grunt.option('cleanServer') === undefined ? false : grunt.option('cleanServer');
  const runHeadless = grunt.option('headLess') === undefined ? false : grunt.option('headLess');
  const highLightElement = grunt.option('highLightElement');

  const reportsDir = "TestReports";
  const reportsFileName = "TestResults";
  const jsonReports = process.cwd() + "/"+reportsDir+"/json";
  const htmlReports = process.cwd() + "/"+reportsDir+"/html";
  const targetJson = jsonReports + "/"+reportsFileName+".json";

  const seleniumAddr = "http://"+ipAddr+":4444/wd/hub";
  const configFilePath ="JSFiles/Tests/Config.js";

  // Project configuration.
  grunt.initConfig({
    clean: {
      reports: [reportsDir,'Logs', 'JSFiles'],
    },
    ts: {
      compileTypeScriptFiles : {
        options: {
          compile: true,
          module:"commonjs",
          sourceMap: false,
          declaration: false,
          noImplicitAny: false,
          inlineSourceMap:false,
          moduleResolution: "node",
          allowJs: true,
          target: "es6"
        },
        src: ["**/*.ts", "!node_modules/**"],
        outDir:"JSFiles"
      }
    },
    mkdir: {
      all: {
        options: {
          mode: 0755,
          create: [jsonReports]
        },
      },
    },
    shell: {
      cleanServer: {
        options: {
          stdout: true
        },
        command: "node " + path.resolve('node_modules/protractor/bin/webdriver-manager') + ' clean'
      },
      updateServer: {
        options: {
          stdout: true
        },
        command: "node " + path.resolve('node_modules/protractor/bin/webdriver-manager') + ' update'
      },
      updateIEDriver: {
        options: {
          stdout: true
        },
        command: "node " + path.resolve('node_modules/protractor/bin/webdriver-manager') + ' update --ie'
      },
      startServer: {
        options: {
          stdout: true,
          stdin: false,
          stderr: false,
          async: true
        },
        command: 'node ' + path.resolve('node_modules/protractor/bin/webdriver-manager') + ' start --standalone'
      }
    },
    protractor: {
      options: {
        configFile: configFilePath, // Protractor config file
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          params: {
            browser: browserName
          }
        }
      },
      desktopWeb: {
        options: {
          args: {
            params: {
              specFileName: specFile,
              browserName: browserName,
              browserVersion: browserVersion,
              baseUrl: baseUrl,
              headLess: runHeadless,
              highLightElement: highLightElement
            },
            seleniumAddress: seleniumAddr
          }
        }
      }
    }
  });
  
  // Load the plugin that provides the "runner" task.
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks("grunt-ts");
  
  grunt.registerTask('runDesktopWebTests', function () {
    if(ipAddr === '127.0.0.1'){
      if(cleanDrivers){
        grunt.task.run('shell:cleanServer');
      }
      if (browserName === 'edge') {
        grunt.task.run('shell:updateIEDriver');
      }
      else {
        grunt.task.run('shell:updateServer');
      }
      grunt.task.run('shell:startServer');
    }
    grunt.task.run('clean');
    grunt.task.run('mkdir:all');
    grunt.task.run('ts:compileTypeScriptFiles');
    grunt.task.run('protractor:desktopWeb');
    if(ipAddr === '127.0.0.1'){
    grunt.task.run('shell:startServer:kill');
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['runner']);
  
};
