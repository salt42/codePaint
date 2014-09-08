/*
EditorController

*/
define(function (require, exports, module) {
    "use strict";
    var Toolbar = require('./toolbar'),
        ComandManager = require('./comandManager'),
        RenderManager = require('./renderManager'),
        DefaultDiagram = require('./diagrams/default'),
        Diagrams = {};
        Diagrams['default'] = DefaultDiagram;



    /*
     *  @return {editorController} controller
     */
    var createEditorControllerInstance = function($container) {
        //private controller
        var _toolbar,
            _commandManager,
            _renderManager,
            _doc,
            _activeDiagramType = 'default';


//        var switchDiagramType = function(type) {
////            Diagrams[type];
//            _toolbar.setTools(Diagrams[type].tools);
//        };


        //public editorController && editor instance API
        var editorController = function() {
            //create html bones
            var $toolbar = $('<div class="toolbar"></div>');
            var $canvas = $('<div class="canvas"></div>');
            $container.append($toolbar);
            $container.append($canvas);

            _toolbar = Toolbar.createInstance($toolbar, this);
            _toolbar.setTools(Diagrams[_activeDiagramType].tools);

            _renderManager = RenderManager.createInstance($canvas, this);
            _renderManager.setRenderer(Diagrams[_activeDiagramType].renderer);

        }
		/*
		 *	@param {document} array of ast's
		 */
        editorController.prototype.loadDocument = function(document) {
            //load document with ast('s) and additional editor data like scope tree, objects etc
            _doc = document;
        };
        editorController.prototype.unloadDocument = function() {
            _doc = null;
        };
        editorController.prototype.getDocument = function() {
            return _doc;
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
        return createEditorControllerInstance($container)
    };
});
