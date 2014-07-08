var visUMLize = {};
define(function (require, exports, module) {
    "use strict";
     var CommandManager = brackets.getModule("command/CommandManager"),
        Menus           = brackets.getModule("command/Menus"),
        PanelManager    = brackets.getModule("view/PanelManager"),
        AppInit         = brackets.getModule("utils/AppInit");
    var test = 'nice';
/*    var _manager = {};
    manager.codeManager         = require('./codeManager');
    manager.projectManager      = require('./projectManager');
    manager.viewManager        = require('./view/viewManager');*/


    var controller = function(){
        this.manager = {};
        this.manager.codeManager    = require('./codeManager');
        this.manager.projectManager = require('./projectManager');
        this.manager.viewManager    = require('./view/viewManager');
    }

    controller.prototype.init = function(){

        this.manager.codeManager.init();
        this.manager.viewManager.init();
    };

    controller.prototype.do = function(){
        this.manager.codeManager.parseDocument();
    };
    controller.prototype.getManager = function(name){
        if(name in this.manager){
            return this.manager[name];
        }else{
            console.log('error: no manager '+name);
        }

    };
    var instance = new controller();
    module.exports = instance;
    visUMLize = instance;
});
