/*
comandManager

*/
define(function (require, exports, module) {
    "use strict";


    /*
     *  @param {$object} $container
     *  @param {editorController} controller
     */
    var createInstance = function($container, controller) {

        //private
        var _comands = {};
        //public
        var comandManager = function() {

        }
        /*
         *  @param {Object} diagram tools obejct
         */
        comandManager.prototype.execute = function(comandName, param1, param2) {
            for(name in _comands){
                _camands[name].execute.apply();
                return;
            }
        };

        return new comandManager();
    }

    exports.createInstance = function($container, controller) {
        return createInstance($container, controller);
    };
});
