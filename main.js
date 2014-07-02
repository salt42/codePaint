define(function (require, exports, module) {

    "use strict";

    var codeManager     =            require('./src/codeManager'),
        AppInit         = brackets.getModule('utils/AppInit'),
        Menus           = brackets.getModule('command/Menus'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        CommandManager  = brackets.getModule('command/CommandManager');

    var makeButton = function(){
        var menu              = Menus.addMenu("visumlize", "VISUMLIZE_MENU", Menus.BEFORE, Menus.AppMenuBar.HELP_MENU),
            CURRDOC_CMD_ID   = "visumlize.currDoc";
        CommandManager.register("CurrDoc", CURRDOC_CMD_ID, codeManager.parseDocument);
        menu.addMenuItem(CURRDOC_CMD_ID, "Ctrl-Shift-V"); // SHORTCUT FÜR FUNKTIONSAUFRUF
    }


    AppInit.appReady(function(){
        console.log('####################\nAppInit.appReady fired\n####################');
        makeButton();
        codeManager.init();
    });

});
