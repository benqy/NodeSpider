(function (global) {
  'use strict';
  var adv = global.adv = angular.module('adv', ['adv.filters', 'adv.directives']),
      fs = require('fs'),
      baseModuleDir = './app/modules/';

  adv.extend = function (obj) {
    Object.keys(obj).forEach(function (key) {
      adv[key] = obj[key];
    });
  };

  adv.regModule = function (name, reqModule) {
    adv[name] = angular.module('adv.' + name, reqModule || []);
    adv[name].moduleName = name;
    adv[name].dataPath = adv.storeDir + '\\' + adv[name].moduleName;
    fs.readdirSync(baseModuleDir + name)
      .forEach(function (file) {
        if (~file.indexOf('.js')) {
          document.write('<script src="modules/' + name + '/' + file + '"></script>');
        }
      });
  };

  adv.extend({      
    storeDir: require('nw.gui').App.dataPath
  });

  window.ondragover = function (e) { e.preventDefault(); return false; };
  window.ondrop = function (e) { e.preventDefault(); return false; };

  
  //require('nw.gui').Shell.openItem('AdStudioFlush.exe');
  process.on('uncaughtException', function(err) {
    console.log('un catch error' + err);
  });
  
})(this);