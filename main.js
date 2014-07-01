define(function (require, exports, module) {

    "use strict";

    console.clear()
    var codeManager     = require('./src/codeManager').codeManager,
        AppInit         = brackets.getModule('utils/AppInit'),
        Menus           = brackets.getModule('command/Menus'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        CommandManager  = brackets.getModule('command/CommandManager'),
        ProjectManager  = brackets.getModule('project/ProjectManager');


    function makeButton(){
        var menu              = Menus.addMenu("visumlize", "VISUMLIZE_MENU", Menus.BEFORE, Menus.AppMenuBar.HELP_MENU),
            COMMAND_CURRDOC   = "visumlize.currDoc";
        CommandManager.register("CurrDoc", COMMAND_CURRDOC, codeManager.parseDocument);
        menu.addMenuItem(COMMAND_CURRDOC);
    }


    AppInit.appReady(function(){
        console.clear();
        makeButton();
        codeManager.init(ProjectManager);
    });

});
