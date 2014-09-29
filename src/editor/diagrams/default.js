define(function (require, exports, module) {
	var estraverse = require('../lib/estraverse');


	exports.load = function(api) {

		api.bind('eventName', function(){});

		api.registerRenerder({
			init : function() {},
			render : function($container, data) {},
		});
		api.registerCommands([
			{
				type : 'changeBgColor',
				execute : function() {
					//this == commandManager
					this.getRenderManager().render(this.project);
				}
			}

		] );
		api.registerTools({
			changeBgColor : {
				id : 'changeBgColor',
				type : 'button',
				command : 'changeBgColor',
			}
		});
	};
});
