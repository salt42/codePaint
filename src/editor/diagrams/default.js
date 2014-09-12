define(function (require, exports, module) {
	var estraverse = require('');


	exports.load = function(api) {

		api.registerRenerder({
			render : function($container, data) {
				//es_traverse over data and select scopes
				//var scope = new Scope(...) - scope.render($parentContainer);
			},
		});
		api.registerCommands([
			{
				type : 'changeBgColor',
				execute : function() {
					//this == commandManager
					this.getRenderManager().setBackground('rgb(0, 0, 255)');


				}
			}

		] );
		api.registerTools({
			changeBgColor : {
				type : 'button',
				icon : 'bal.png',
				command : 'changeBgColor',
			}
		});
	};


    /*
    *  -renderer
    *  -comands
    *  -tools
    *
    */
    exports.renderer = {
        render : function($container, data){
			console.log($container);
			$container.html('<h1>diagram canvas</h1>');
		},
    };
    exports.comands = {
        changeBgColor : {
			/*
			 *	@param {editorController} controller
			 */
            execute : function(controller) {
				controller.getRenderManager().setBackground('#f00');

                //execute comand
                //change bg color
            },
        }
    };
    exports.tools = {
        changeBgColor : {
            type : 'button',
            icon : 'bal.png',
            command : 'changeBgColor',
        },
    };
});
