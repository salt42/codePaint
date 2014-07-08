define(function (require, windowView, module) {
    "use strict";
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Menus           = brackets.getModule("command/Menus"),
        FileSystem      = brackets.getModule('filesystem/FileSystem'),
        PanelManager    = brackets.getModule("view/PanelManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        panelRenderer   = require("./panelRenderer");
    var ExtensionUtils  = brackets.getModule('utils/ExtensionUtils');
    //add stylesheet
    //ExtensionUtils.addLinkedStyleSheet(ExtensionUtils.getModuleUrl(module, 'layout/style.css'));


    var $quickButton;
    var windowHtml;
    windowView.init = function(){
        $quickButton = $('<a id="visumlize-toolbar" title="visumlize" href="#">UML</a>');
        $("#main-toolbar").find("#toolbar-go-live").after($quickButton);
        $($quickButton).click(toggleWindow);
    };

    var r = null;
    function toggleWindow() {
        if(r && r.closed) r = null;
        if(!r) {
            var path = ExtensionUtils.getModulePath(module, 'layout/window.html');
            r = window.open(path);
            r.saveData = function(data){
                console.log(data)
            };
        } else {
            console.log(r.getData());
            r.close();
            r = null;
            //get focused document
            //var doc = visUMLize.getManager('projectManager').getCurrentDoc();
            //test
            //var bracketsDoc = DocumentManager.getCurrentDocument();
            //visUMLize.getManager('codeManager').parse(bracketsDoc.getText());
            //bracketsDoc.getText()
           // var scope = visUMLize.getManager('codeManager').parseDocument();
          //  panelRenderer.draw(scope, '#visumlize-panelContent');

        }
    }
});
