/*
extensionController | controlls the program flow between editor, projectManager and codeManager
*/
define(function (require, exports, module) {
    "use strict";
    var Editor = require('./editor/main'),
        PanelManager = brackets.getModule("view/PanelManager");
//        CodeManager = require('./editor/editorController'),
//        ProjectManager = require('./editor/editorController');





    var testEditor = null;

    exports.init = function() {
        //desselbe mit nem neuen window
        var $panel = PanelManager.createBottomPanel('visumlize-bottomPanel', $("<div id='visumlize-bottomPanel' class='bottom-panel'></div>"),200);

        var $quickButton = $('<a id="visumlize-panelswitch" title="visumlize" href="#">:)</a>');
        $("#main-toolbar").find("#toolbar-go-live").after($quickButton);
        $($quickButton).click(function(){
            if($panel.isVisible() ){
                $panel.hide();
            }else{
                $panel.show();
            }
        });


        testEditor = Editor.createInstance($panel.$panel);
        console.log(testEditor);
    };
});
