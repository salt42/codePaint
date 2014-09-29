/*
renderManager

*/
define(function (require, exports, module) {
    "use strict";


    /*
     *  @param {$object} $container
     *  @param {editorController} controller
     */
    var createInstance = function(controller) {
        //private
        var _renderer,
			_$context;
        //public
        var renderManager = function() {}

        renderManager.prototype.init = function($context) {
			_$context = $context;
			_$context.attr('id', 'visumlizeCanvas');
			if(_renderer) {
				_renderer.init(_$context);
			}
        };
        /*
         *  @param {renderer} renderer obejct
         */
        renderManager.prototype.setRenderer = function(renderer) {
            _renderer = renderer;
			if(_$context) {
				_renderer.init(_$context);
			}
        };

        renderManager.prototype.render = function(project) {
            _renderer.render(_$context, project);
        };
		/*
         *  @param {string} color in css style
         */
		renderManager.prototype.setBackground = function(color) {
			_$context.css('background-color', color);
		};
        return new renderManager();
    }

    exports.createInstance = function(controller) {
        return createInstance(controller);
    };
});
