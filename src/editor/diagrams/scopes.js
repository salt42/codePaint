define(function (require, exports, module) {
	var estraverse = require('../lib/estraverse');


	exports.load = function(api) {
		var _project = null;
		api.registerRenerder({
			init : function($container) {
				var self = this;
				api.bind('projectLoaded', function(project){
					_project = project;
					self.render($container, project);
				});
			},
			render : function($container, project) {
				console.log('render scopes')
				$container.html('');
				//es_traverse over data and select scopes

				var colors = ['#f00','#070','#00f','#880','#088','#808','#499','#994','#949'];
				var cc = 0;
				var $parents = [$container];
				console.log(project.documents[0]);
				estraverse.traverse(project.documents[0].ast, {
					enter: function (node, parent) {
						if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
							var type = 'Scope';
							if(node.type == 'ObjectExpression')
								type = 'ObjIteral';
							var $new = $('<div style="width:50px;hight:50px;background-color:'+ colors[cc] +';margin-left:'+ $parents.length*10 +'px;">'+type+'</div>');
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
				});
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
