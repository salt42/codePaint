/*
toolbar

*/
define(function (require, exports, module) {
    "use strict";


    /*
     *  @param {$object} $container
     *  @param {editorController} controller
     */
    var createInstance = function(controller) {

        //private
        var _$context,
			_tools = {},
			_affixedTools = {};

        //public
        var Toolbar = function() {

        }
        Toolbar.prototype.init = function($context) {
			_$context = $context;
			_$context.append('<div class="moduleTools"></div>');
			_$context.append('<div class="defaultTools" style="float:right;"></div>');

			var $select = $('<select name="diagramTypes" id="diagramTypes"></select>');
			$select.append('<option value="default">default</option>');
			$select.append('<option value="scopes">scopes</option>');
			$select.append('<option value="quickCreate">quickCreate</option>');
//  '<optgroup label="Scripts">'
//  '</optgroup>'
			$('.defaultTools', _$context).append($select);
			$select.change(function(e){
				controller.changeDiagram(this.value);
			});
        };
        /*
         *  @param {Object} diagram tools obejct
         */
        Toolbar.prototype.setTools = function(tools) {
            _tools = tools;
            this.buildHtml();
        };
		Toolbar.prototype.registerTool = function(tool) {
            _affixedTools[tool.id] = tool;
            this.buildHtml();
        };
        Toolbar.prototype.buildHtml = function() {
            $('.moduleTools', _$context).empty();
			//diagramm defined tools
            for(name in _tools) {
                switch(_tools[name].type){
                    case 'button':
                        //create button html
                        var button = $('<div class="button">'+name+'</div>').click(function(){
                            //on click exute comand
							controller.getCommandManager().createAndExecuteCommand(_tools[name].command);

                        });

                        $('.moduleTools', _$context).append(button);
                        break;
                }
            }

			$('.defaultTools', _$context).empty();
            for(name in _affixedTools) {
                switch(_affixedTools[name].type){
                    case 'button':
                        //create button html
                        var button = $('<div class="button">'+name+'</div>').click(function(){
                            //on click exute comand
							controller.getCommandManager().createAndExecuteCommand(_affixedTools[name].command);

                        });

                        $('.defaultTools', _$context).append(button);
                        break;
                }
            }
        };
        return new Toolbar();
    }

    exports.createInstance = function(controller) {
        return createInstance(controller);
    };
});
