/*
EditorController

*/
define(function (require, exports, module) {
    "use strict";
    var Toolbar = require('./toolbar'),
        CommandManager = require('./commandHandler'),
        RenderManager = require('./renderManager'),
        DefaultDiagram = require('./diagrams/default'),
		ScopeDiagram = require('./diagrams/scopes'),
		QuickCreateDiagram = require('./diagrams/quickCreate/main'),
        Diagrams = {};
        Diagrams['default'] = DefaultDiagram;
		Diagrams['scopes'] = ScopeDiagram;
		Diagrams['quickCreate'] = QuickCreateDiagram;


    /*
     *  @return {editorController} controller
     */
    var createInstance = function(__con) {
        //private controller
        var _toolbar,
            _commandManager,
            _renderManager,
            _activeDiagramType = 'quickCreate',
			_activeApi,
			_$context = __con,
			_$wrapper,
			_$toolbar,
            _$canvas;
//        var switchDiagramType = function(type) {
////            Diagrams[type];
//            _toolbar.setTools(Diagrams[type].tools);
//        };


        //public editorController && editor instance API
        var editorController = function() {
			this.project;
            //create html bones
			_$wrapper = $('<div class="visumlize"></div>');
            _$toolbar = $('<div class="toolbar" style="width:100%; height:20px;"></div>');
            _$canvas = $('<div id="visumlizeCanvas" style="width:100%; height: calc(100% - 20px);"></div>');


			_$wrapper.append(_$toolbar);
            _$wrapper.append(_$canvas);
			_$context.append(_$wrapper);

			_toolbar = Toolbar.createInstance(this);
			_renderManager = RenderManager.createInstance(this);
			_commandManager = CommandManager.createInstance(this);
			this.init();
			this.changeDiagram(this.getDiagramTypes()[2]);
		}
		editorController.prototype.init = function() {
			_toolbar.init(_$toolbar);
			_renderManager.init(_$canvas);
		};
		editorController.prototype.getDiagramTypes = function() {
			var types = [];
			for(var k in Diagrams) {
				types.push(k);
			}
			return types;
		};
		/*
		 *	@param {string} type name
		 */
		editorController.prototype.changeDiagram = function(type) {
			var self = this;
			if(type in Diagrams){
				//save and clear
				_toolbar.setTools({});
				$('#visumlizeCanvas', _$context).html('');
				//diagram module api

				var Api = function(){};
				Api.prototype = Object.create({
					listener : {},
					trigger : function() {
						var name = [].splice.call(arguments, 0, 1);
						var args = [].splice.call(arguments, 0);
						if(name in this.listener){
							for(i=0;i<this.listener[name].length;i++) {
								this.listener[name][i].apply(null, args);
							}
						}
					},
					bind : function(name, cb) {
						if(!(name in this.listener)) this.listener[name] = [];
						this.listener[name].push(cb);
					},
					getDocument : function() {
						return self.project;
					},
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
				_activeApi = new Api();
				Diagrams[type].load(_activeApi);
				if(this.project) _renderManager.render(this.project);
			}
		};
		/*
		 *	@param {object} project object @todo
		 */
        editorController.prototype.loadDocument = function(project) {
            //load project with ast('s) and additional editor data like scope tree, objects etc
            this.project = project;
			_activeApi.trigger('projectLoaded', this.project);
        };
        editorController.prototype.unloadDocument = function() {
            this.project = null;
        };
        editorController.prototype.getDocument = function() {
            return this.project;
        };
        editorController.prototype.getCommandManager = function() {
            return _commandManager;
        };
        editorController.prototype.getRenderManager = function() {
            return _renderManager;
        };
		editorController.prototype.registerCommand = function(com) {
			_commandManager.registerCommand(com);
		};
		editorController.prototype.registerTool = function(tool) {
			_toolbar.registerTool(tool);
		};
		editorController.prototype.changeContext = function($context) {
			_$wrapper.detach();
			_$context = $context;
			$(_$wrapper).appendTo($context)
		};
        return new editorController();
    }

    //static editor API
    /*
     *  @param {jQuery object} html container
     *  @return {editorController} controller
     */
    exports.createInstance = function($container) {
        return createInstance($container);
    };
});
