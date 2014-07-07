define(function (require, exports, module) {
    "use strict";
    var AppInit         = brackets.getModule('utils/AppInit'),
        Menus           = brackets.getModule('command/Menus'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        CommandManager  = brackets.getModule('command/CommandManager'),
        appController     = require('./src/appControll');



    var makeButton = function(){
        var menu = Menus.addMenu("visumlize", "VISUMLIZE_MENU", Menus.BEFORE, Menus.AppMenuBar.HELP_MENU),
            CURRDOC_CMD_ID = "visumlize.currDoc";
        CommandManager.register("CurrDoc", CURRDOC_CMD_ID, function(e){
            appController.do(e);
        });
        menu.addMenuItem(CURRDOC_CMD_ID, "Ctrl-Shift-V"); // SHORTCUT FÜR FUNKTIONSAUFRUF
    }
    AppInit.appReady(function(){
        appController.init();
        makeButton();
    });

});
