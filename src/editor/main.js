/*
EditorController

*/
define(function (require, exports, module) {
    "use strict";
    var Toolbar = require('./toolbar'),
        CommandManager = require('./commandHandler'),
        RenderManager = require('./renderManager'),
        DefaultDiagram = require('./diagrams/default'),
		QuickCreateDiagram = require('./diagrams/quickCreate/main'),
        Diagrams = {};
        Diagrams['default'] = DefaultDiagram;
		Diagrams['quickCreate'] = QuickCreateDiagram



    /*
     *  @return {editorController} controller
     */
    var createInstance = function($container) {
        //private controller
        var _toolbar,
            _commandManager,
            _renderManager,
            _activeDiagramType = 'quickCreate';


//        var switchDiagramType = function(type) {
////            Diagrams[type];
//            _toolbar.setTools(Diagrams[type].tools);
//        };


        //public editorController && editor instance API
        var editorController = function() {
			this.document = null;
            //create html bones
            var $toolbar = $('<div class="toolbar" style="width:100%; height:20px;"></div>');
            var $canvas = $('<div id="visumlizeCanvas" style="width:100%; height: calc(100% - 20px);"></div>');
            $container.append($toolbar);
            $container.append($canvas);

			_toolbar = Toolbar.createInstance($toolbar, this);
			_renderManager = RenderManager.createInstance($canvas, this);
			_commandManager = CommandManager.createInstance(this);

			var diagram = Diagrams[_activeDiagramType];
			diagram.load({
				registerRenerder : function(renderer) {
					_renderManager.setRenderer(renderer);
				},
				registerCommands : function(commands) {
					_commandManager.setCommands(commands)
				},
				registerTools : function(tools) {
					_toolbar.setTools(tools);
				}
			});



        }
		/*
		 *	@param {document} array of ast's
		 */
        editorController.prototype.loadDocument = function(document) {
            //load document with ast('s) and additional editor data like scope tree, objects etc
            this.document = document;
        };
        editorController.prototype.unloadDocument = function() {
            document = null;
        };
        editorController.prototype.getDocument = function() {
            return document;
        };
        editorController.prototype.getCommandManager = function() {
            return _commandManager;
        };
        editorController.prototype.getRenderManager = function() {
            return _renderManager;
        }
        return new editorController();
    }

    //static editor API
    /*
     *  @param {jQuery object} html container
     *  @return {editorController} controller
     */
    exports.createInstance = function($container) {
        return createInstance($container)
    };
});
