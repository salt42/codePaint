define(function (require, exports, module) {
    "use strict";
     var CommandManager = brackets.getModule("command/CommandManager"),
        Menus           = brackets.getModule("command/Menus"),
        PanelManager    = brackets.getModule("view/PanelManager"),
        AppInit         = brackets.getModule("utils/AppInit");

    var manager = {};
    manager.codeManager         = require('./codeManager');
    manager.projectManager      = require('./projectManager');
    manager.viewManager         = require('./view/viewManager');


    var controller = function(){

    }

    controller.prototype.init = function(){

        manager.codeManager.init();
        console.log('init');
    };

    controller.prototype.do = function(){
        manager.codeManager.parseDocument();
        console.log('parsed');
    };
    controller.prototype.getManager = function(name){
        if(name in manager){
            return manager[name];
        }else{
            console.log('error: no manager '+name);
        }

    };
    module.exports = new controller();
});
