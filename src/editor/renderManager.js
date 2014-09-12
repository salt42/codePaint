/*
renderManager

*/
define(function (require, exports, module) {
    "use strict";


    /*
     *  @param {$object} $container
     *  @param {editorController} controller
     */
    var createInstance = function($container, controller) {
        //private
        var _renderer;
        //public
        var renderManager = function() {
            //prepare $container
        }
        /*
         *  @param {renderer} renderer obejct
         */
        renderManager.prototype.setRenderer = function(renderer) {
            _renderer = renderer;
        };

        renderManager.prototype.render = function(data) {
            _renderer.render($container, data);
        };
		/*
         *  @param {string} color in css style
         */
		renderManager.prototype.setBackground = function(color) {
			$container.css('background-color', color);
		};
        return new renderManager();
    }

    exports.createInstance = function($container, controller) {
        return createInstance($container, controller);
    };
});
