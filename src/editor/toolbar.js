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
        /*
         *  @param {Object} diagram tools obejct
         */
        Toolbar.prototype.setTools = function(tools) {
            _tools = tools;
            this.buildHtml();
        };
        Toolbar.prototype.buildHtml = function() {
            $container.html('');
            for(name in _tools) {
                switch(_tools[name].type){
                    case 'button':
                        //create button html
                        var button = $('<div class="button">'+name+'</div>').click(function(){
                            //on click exute comand
							controller.getCommandManager().createAndExecuteCommand(_tools[name].command);

                        });

                        $container.append(button);
                        break;
                }


            }
        };
        return new Toolbar();
    }

    exports.createInstance = function($container, controller) {
        return createInstance($container, controller);
    };
});
