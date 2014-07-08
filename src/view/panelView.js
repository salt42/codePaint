define(function (require, panelView, module) {
    "use strict";
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Menus           = brackets.getModule("command/Menus"),
        PanelManager    = brackets.getModule("view/PanelManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        panelRenderer   = require("./panelRenderer");
    var ExtensionUtils  = brackets.getModule('utils/ExtensionUtils');
    //add stylesheet
    ExtensionUtils.addLinkedStyleSheet(ExtensionUtils.getModuleUrl(module, 'layout/style.css'));

    var $panel;
    var $quickButton;
    panelView.init = function(){
        $panel = PanelManager.createBottomPanel('visumlize-bottomPanel', $("<div id='visumlize-bottomPanel' class='bottom-panel'>HTML for my panel<div id='visumlize-panelContent'>content</div></div>"),200);

        $quickButton = $('<a id="visumlize-toolbar" title="visumlize" href="#">UML</a>');
        $("#main-toolbar").find("#toolbar-go-live").after($quickButton);
        $($quickButton).click(togglePanel);

    };

    function togglePanel() {
        if($panel.isVisible()) {
            $panel.hide();
        } else {
            //get focused document
            //var doc = visUMLize.getManager('projectManager').getCurrentDoc();
            //test
            //var bracketsDoc = DocumentManager.getCurrentDocument();
            //visUMLize.getManager('codeManager').parse(bracketsDoc.getText());
            //bracketsDoc.getText()
            var scope = visUMLize.getManager('codeManager').parseDocument();
            panelRenderer.draw(scope, '#visumlize-panelContent');

           // .html()
            //render doc
            //panelRenderer.draw();
            $panel.show();
        }
    }
});
