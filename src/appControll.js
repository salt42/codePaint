define(function (require, exports, module) {
    "use strict";

    var codeManager      = require('./codeManager');
  //  global.projectManager   = require('./projectManager');
    var viewManager      = require('./view/viewManager');


    var controller = function(){

    }
    controller.prototype.init = function(){
        global.codeManager.init();
        console.log('init')
    };

    controller.prototype.do = function(){
        global.codeManager.parseDocument();
        console.log('parsed')
    };
    module.exports = new controller();
});
