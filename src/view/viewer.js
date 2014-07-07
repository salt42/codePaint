define(function (require, exports, module) {
    "use strict";

    function viewer(){
        this.panel = null;
    }

    viewer.prototype.init = function(){
        //set dom container

    };
    viewer.prototype.draw = function(){
        //draw scope
    };

    /*
    var HELLOWORLD_EXECUTE = "helloworld.execute";
    var panel;

    function handleHelloWorld() {
        console.log(panel.isVisible());
        if(panel.isVisible()) {
            panel.hide();
            CommandManager.get(HELLOWORLD_EXECUTE).setChecked(false);
        } else {
            panel.show();
            CommandManager.get(HELLOWORLD_EXECUTE).setChecked(true);
        }
    }

    //init
        CommandManager.register("Run HelloWorld", HELLOWORLD_EXECUTE, handleHelloWorld);
        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(HELLOWORLD_EXECUTE);
        panel = PanelManager.createBottomPanel(HELLOWORLD_EXECUTE, $("<div id="+ HELLOWORLD_EXECUTE +" class='bottom-panel'>HTML for my panel</div>"),200);

    */


    module.exports = viewer;
});
