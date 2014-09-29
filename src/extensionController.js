/*
extensionController | controlls the program flow between editor, projectManager and codeManager
*/
define(function (require, exports, module) {
    "use strict";
	var Editor = require('./editor/main'),
        PanelManager = brackets.getModule("view/PanelManager"),
        CodeManager = require('./codeManager'),
		ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
		testEditor,
		_win,
		$panel;

    exports.init = function () {
        //desselbe mit nem neuen window
        $panel = PanelManager.createBottomPanel('visumlize-bottomPanel', $("<div id='visumlize-bottomPanel' class='bottom-panel'></div>"), 200);

        var $quickButton = $('<a id="visumlize-panelswitch" title="visumlize" href="#">:)</a>');
        $("#main-toolbar").find("#toolbar-go-live").after($quickButton);
        $($quickButton).click(function () {
            if ($panel.isVisible()) {
                $panel.hide();
            } else {
				if (_win) {
					switchContext();
				} else {
					$panel.show();
				}
            }
        });


        testEditor = Editor.createInstance($panel.$panel);
		$('head').append('<link rel="stylesheet" type="text/css" href="C:/Program Files (x86)/Brackets/www/extensions/default/codePaint/src/editor/diagrams/quickCreate/css.css">');

//		openWindow();
//        var $windowMainDiv = $('<div id="main"></div>');
//		$('body', _win.document).append($windowMainDiv);
//		testEditor = Editor.createInstance($windowMainDiv);
//		$('head', _win.document).append('<link rel="stylesheet" type="text/css" href="C:/Users/bla/AppData/Roaming/Brackets/extensions/user/codePaint/src/editor/diagrams/quickCreate/css.css">');


		testEditor.registerTool({
			id : 'changeView',
			type : 'button',
			command : 'changeView'
		});
		testEditor.registerCommand({
			type : 'changeView',
			execute : function () {
				switchContext();
			}
		});

		CodeManager.getCurrentDocument(function(ast){
			var project = {
				name : 'visumlize',
				desc : 'visUMLize test project',
				path : 'c:/bla/bla/visumlize',
				documents : [
					{
						path : 'main.js',
						ast : ast	//der editor/diagram braucht die äste und
						//kann hier und unten persistente daten speichern
					}
				]
				//hier speichert der editor/diagram persistente daten
			};

			testEditor.loadDocument(project);
		});



    };
	function switchContext() {
		if (_win) {
			//open panel
			testEditor.changeContext($panel.$panel);
			$panel.show();
			//close window
			_win.close();
			_win = null;
		} else {
			$panel.hide();
			openWindow(function () {
				var $container = _win.document.getElementById('#visumlize-bottomPanel');
				testEditor.changeContext($($container));
			});
		}
	}
    function openWindow(cb) {
        if (_win && _win.closed) _win = null;
        if (!_win) {
			var path = 'file:///C:/Program Files (x86)/Brackets/www/extensions/default/codePaint/src/window.html'
            _win = window.open(path);//'about:blank');
			_win.onload = function() {
				cb(_win);
			}
			_win.onbeforeunload = function(e) {
				switchContext();
			}
        } else {
            _win.close();
            _win = null;
        }
    }
});
