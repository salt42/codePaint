/*
toolbar

*/
define(function (require, exports, module) {
    "use strict";


    /*
     *  @param {$object} $container
     *  @param {editorController} controller
     */
    var createInstance = function($container, controller) {

        //private
        var _tools = {};
        //public
        var Toolbar = function() {

        }
        Toolbar.prototype.init = function() {
			$container.append('<div class="moduleTools"></div>');
			$container.append('<div class="defaultTools" style="float:right;"></div>');

			var $select = $('<select name="diagramTypes" id="diagramTypes"></select>');
			$select.append('<option value="default">default</option>');
			$select.append('<option value="scopes">scopes</option>');
			$select.append('<option value="quickCreate">quickCreate</option>');
//  '<optgroup label="Scripts">'
//  '</optgroup>'
			$('.defaultTools', $container).append($select);
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
        Toolbar.prototype.buildHtml = function() {
            $('.moduleTools', $container).html('');
			//diagramm defined tools
            for(name in _tools) {
                switch(_tools[name].type){
                    case 'button':
                        //create button html
                        var button = $('<div class="button">'+name+'</div>').click(function(){
                            //on click exute comand
							controller.getCommandManager().createAndExecuteCommand(_tools[name].command);

                        });

                        $('.moduleTools', $container).append(button);
                        break;
                }
            }
        };
		var n = new Toolbar();
		n.init();
        return n;
    }

    exports.createInstance = function($container, controller) {
        return createInstance($container, controller);
    };
});
