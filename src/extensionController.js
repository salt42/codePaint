/*
extensionController | controlls the program flow between editor, projectManager and codeManager
*/
define(function (require, exports, module) {
    "use strict";
    var Editor = require('./editor/main'),
        PanelManager = brackets.getModule("view/PanelManager"),
        CodeManager = require('./codeManager');



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


		//test editor erstellen und css einbinden
        testEditor = Editor.createInstance($panel.$panel);
		var doc = CodeManager.getCurrentDocument();
		$('head').append('<link rel="stylesheet" type="text/css" href="C:/Users/bla/AppData/Roaming/Brackets/extensions/user/codePaint/src/editor/diagrams/quickCreate/css.css">');


		testEditor.loadDocument(doc);

    };
});
