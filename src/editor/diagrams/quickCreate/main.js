define(function(require, exports, modul) {

	function Entity() {

	}
		/*
		 *	@param {Entity} parent
		 */
		Entity.prototype.init = function(parent, x, y) {
			this.parent = parent;
			this.$ele = $('<div class="entity">undefined scope</div>');
			this.childs = [];
			this.pos = { x : x || 0,
						 y : y || 0 };
			this.$ele.css('top', this.pos.y);
			this.$ele.css('left', this.pos.x);
			parent.addChild(this);
			this.$ele.data('entity', this);
		};
		/*
		 *	@param {number} x pos of the top left corner
		 *	@param {number} y pos of the top left corner
		 */
		Entity.prototype.setPos = function(x, y) {
			this.pos.x = x;
			this.pos.y = y;
		};
		/*
		 *	@param {number} w width
		 *	@param {number} h height
		 */
		Entity.prototype.setSize = function(w, h) {

		};
		/*
		 *	@param {Entity} child
		 */
		Entity.prototype.addChild = function(child) {
			this.childs.push(child);
			this.$ele.append(child.$ele);
		};
		/*
		 *	@param {Entity} child
		 */
		Entity.prototype.removeChild = function(child) {
			for(i=0;i<this.childs.length;i++) {
				if(this.childs[i] == child)
					break;
			}
			var removed = this.childs.slice(i,i+1);
			this.$ele.remove(removed.$ele);
		};
		/*
		 *	@param {Entity} parent
		 */
		Entity.prototype.changeParent = function(parent) {
			this.parent.removeChild(this);
			this.parent = parent;
			this.parent.addChild(this);
		};
		/*
		 *	@param {number} x relative to this.pos
		 *	@param {number} y relative to this.pos
		 */
		Entity.prototype.onClick = function(x, y) {
			//ch
			//check for click on childs
			console.log('entity click');
		};

	function ScopeEntity() {
		Entity.call(this);
	}
		ScopeEntity.prototype = Object.create(Entity.prototype);
		ScopeEntity.prototype.constructor = ScopeEntity;

		ScopeEntity.prototype.init = function() {
			Entity.init.call(this, arguments);
			this.$ele.html('default Scope');
		};

	function bracketsModulEntity() {
		Entity.call(this);
	}
		bracketsModulEntity.prototype = Object.create(Entity.prototype);
		bracketsModulEntity.prototype.constructor = bracketsModulEntity;

		bracketsModulEntity.prototype.init = function() {
			Entity.prototype.init.apply(this, arguments);
			this.$ele.html('brackets module');
		};
		bracketsModulEntity.prototype.onClick = function(x, y) {
			////Entity.prototype.onClick.apply(this, arguments);
			////check for click on childs


			 //open input field
		};





	var QuickInput = function($context) {
		var self = this;
		var $ele = $('<div class="quickInput" style="position:absolute;top:50px;left:200px;"><input><div class="error">error</div></div>');
		var callBack = null;
		$context.append($ele);
		$ele.hide();

		$('input', $ele).keydown(function(e) {
			//on enter execute "command"
			if(e.keyCode == 13) {
				//enter
				var com = $(this).val();
				self.execute(com);
			}else if(e.keyCode == 27) {
				//esc
				self.close();
			}
		});
		this.clear = function() {
			$('input', $ele).val('');
		};
		this.open = function(x, y, cb) {
			callBack = cb;
			$ele.css('top', y+'px');
			$ele.css('left', x+'px');
			$ele.show();
			$('input', $ele).focus();
		};
		this.close = function() {
			$ele.hide();
			this.clear();
		};
		this.execute = function(comString) {
			comString = comString.toLowerCase();
			var com = comString.split(' ');
			if(callBack){
				var err = callBack(com);
				console.log(err);
				if(!err){
					self.showError();
				}else{
					self.close();
				}
			}else{
				self.close();
			}
		};
		this.showError = function() {
			console.log('error');
			var $error = $('.error', $ele);
			$error.html('command not found');
			$error.show();
			self.clear();
			setTimeout(function(){
				$error.fadeOut(1000,function(){

				});

			}, 2000);
		};
	};

	function Renderer() {
		this.project;
	}
	Renderer.prototype.init = function($container) {
		var self = this;
		this.$container = $container;
		var entitys = {
			childs : [],
			addChild : function(child) {
				this.childs.push(child);
				$container.append(child.$ele)
			},
			render : function() {
				for(k in this.childs) {
					$container.append(this.childs[k].$ele);

				}
			},
		};
		this.entitys = entitys;
		//click, key handler

		$container.removeClass();
		$container.addClass('quickCreate');
		var qInput = new QuickInput($container);

		$container.on('click', function(e) {
			if(e.target == this) {
				//show input on x y
				qInput.open(e.offsetX, e.offsetY, function(com) {
					//create entity on pos :)
					switch(com[0]){
						case 'scope':
							var entity = new ScopeEntity();
							entity.init(entitys, e.offsetX, e.offsetY);
							break;
						case 'module':
							if(typeof com[0] != 'string'){
								console.log('normal module');
								//default js module
							}else if(com[1] == 'brackets'){
								console.log('normal brackets');
								var entity = new bracketsModulEntity();
								entity.init(entitys, e.offsetX, e.offsetY);
							}
							break;
						default:
							return false;
					}
					return true;
				});
			}else if($(e.target).hasClass('entity')) {
				var entity = $(e.target).data('entity');
				entity.onClick(e.offsetX, e.offsetY);
			}
		});
	};
	Renderer.prototype.render = function($context, project) {
		this.entitys.render();
	};
	Renderer.prototype.onProjectLoaded = function(project) {
		this.project = project;
		this.render($container, project);
	};








	exports.load = function(api) {
		var _renderer = new Renderer();
		api.bind('projectLoaded', function(project){
			_renderer.onProjectLoaded(project);
		});
//		api.registerEventListener('onDocLoaded', function(data) {
//			_renderer.onDocLoaded(data);
//		});
		api.registerRenerder(_renderer);
//		api.registerCommands(new Commands());
//		api.registerTools([]);
	};
});
