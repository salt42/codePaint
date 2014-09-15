define(function (require, exports, module) {
	var estraverse = require('../lib/estraverse');


	exports.load = function(api) {

		api.registerRenerder({
			render : function($container, data) {
				$container.html('');
				//es_traverse over data and select scopes
				var colors = ['#f00','#0f0','#00f','#880','#088','#808'];
				var cc = 0;
				var parents = [$container];
				estraverse.traverse(data, {
					enter: function (node, parent) {
						if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {

							var scope = new Scope(...)
							scope.render($parentContainer);


							parents[parents.length-1].addChild(scope);
							parents.push($new);
						}
					},
					leave: function (node, parent) {
						if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
							parents.pop();
						}
					}
				});




/*
				var colors = ['#f00','#0f0','#00f','#880','#088','#808'];
				var cc = 0;
				var $parents = [$container];
				estraverse.traverse(data, {
					enter: function (node, parent) {
						if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {

							var $new = $('<div style="width:50px;hight:50px;background-color:'+ colors[cc] +';margin-left:'+ $parents.length*10 +'px;">Scope</div>');
							console.log($new)
							cc++;
							if(cc == colors.length)
								cc = 0;
							$parents[$parents.length-1].append($new);
							$parents.push($new);
						}
					},
					leave: function (node, parent) {
						if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
							$parents.pop();
						}
					}
				});*/
			},
		});
		api.registerCommands([
			{
				type : 'changeBgColor',
				execute : function() {
					//this == commandManager
					this.getRenderManager().render(this.document);


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
});
