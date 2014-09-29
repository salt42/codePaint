define(function (require, exports, modul) {
	'use strict';
	var ROOT;
	
	/*	helper, instanceof with array
	 *
	 */
	function isInstanceOf(inst, of) {
		var key;
		for (key in of) {
			if (inst instanceof eval(of[key])) return of[key];
		}
		return false;
	};
	
	
	function Entity() {

	}
		/*
		 *	@param {Entity} parent
		 *	@param {number} x
		 *	@param {number} y
		 */
		Entity.prototype.init = function() {
			this.$ele = $('<div class="entity box"><div class="headline">undefined scope</div></div>');
			this.childs = [];
			this.pos = { x : 0,
						 y : 0 };
			this.dropareas = [];
			this.parent = null;
			
			this.$ele.css('top', this.pos.y);
			this.$ele.css('left', this.pos.x);
			this.$ele.data('entity', this);
		};
		/*
		 *	@param {number} x pos of the top left corner
		 *	@param {number} y pos of the top left corner
		 */
		Entity.prototype.setPos = function(x, y) {
			this.pos.x = x;
			this.pos.y = y;
			this.$ele.css('top', this.pos.y+'px');
			this.$ele.css('left', this.pos.x+'px');
		};
		/*
		 *	@param {number} x length
		 *	@param {number} y length
		 */
		Entity.prototype.move = function(x, y) {
			this.setPos(this.pos.x+x, this.pos.y+y);
		};
		/*
		 *	@param {number} w width || {string} w type
		 *	@param {number} h height
		 */
		Entity.prototype.setSize = function(w, h) {
			if(typeof w == 'number'){
				this.$ele.removeClass('line');
				this.$ele.addClass('box');
				//set width and height
				return;
			}
			if(w == 'line'){
				this.$ele.removeClass('box');
				this.$ele.addClass('line');
			}else if(w == 'box'){
				this.$ele.removeClass('line');
				this.$ele.addClass('box');
				
			}
		};
		/*
		 *	@param {Entity} child
		 */
		Entity.prototype.addChild = function(child) {
			this.childs.push(child);
			child.setSize('line');
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
//			this.$ele.remove(removed.$ele);
		};
		/*
		 *	@param {Entity} parent
		 */
		Entity.prototype.changeParent = function(parent) {
			if(this.parent){
				this.parent.removeChild(this);
			}
			this.parent = parent;
		};
		/*
		 *	@param {obejct} e event object
		 */
		Entity.prototype.onMouseDown = function(e) {
			this.mouse = {
				button : e.button,
				drag : false,
				lastEvent : e,
			}
		};
		/*
		 *	@param {obejct} e event object
		 */
		Entity.prototype.onMouseMove = function(e) {
			if(this.mouse.button == 0){
				//if event.target = headline then drag
				if(!this.mouse.drag && $(e.target).hasClass('headline') ){
					//init drag - wenn parent nicht canvas dann parent change

					if(!this.parent.$ele.hasClass('quickCreate')){
						this.setSize('box');
						var off = ROOT.$ele.offset();
						this.setPos(e.clientX-off.left-10, e.clientY-off.top-5);
						this.changeParent(ROOT);
						ROOT.addChild(this);
					}
					this.$ele.addClass('dragging');
					this.mouse.drag = true;
				}else if(this.mouse.drag){
					//console.log(e);
					var x = e.pageX - this.mouse.lastEvent.pageX;
					var y = e.pageY - this.mouse.lastEvent.pageY;
					this.move(x,y);
				}
				this.mouse.lastEvent = e;
			}
		};
		/*
		 *	@param {obejct} e event object
		 */
		Entity.prototype.onMouseUp = function(e) {
			if(this.mouse.drag){
				this.$ele.removeClass('dragging');
				if( $(e.target).hasClass('droparea') ){
					var entity = ( $(e.target).hasClass('entity') )? $(e.target).data('entity') : $(e.target).parent('.entity').data('entity') ;
					this.changeParent(entity);
					entity.dragOut(this, $(e.target));
					entity.onDrop(entity, $(e.target));
					
				}
				this.mouse.drag = false;
			}
			this.mouse.button = false;
		};
		/*
		 *	@param {obejct} e event object
		 */
		Entity.prototype.onMouseOver = function(e) {
			if(this.mouse.drag){
				if( $(e.target).hasClass('droparea') ){
					var entity = ( $(e.target).hasClass('entity') )? $(e.target).data('entity') : $(e.target).parent('.entity').data('entity') ;
					entity.dragOver(this, $(e.target));
				}
			}
		};
		/*
		 *	@param {obejct} e event object
		 */
		Entity.prototype.onMouseOut = function(e) {
			if(this.mouse.drag){
				if( $(e.target).hasClass('droparea') ){
					var entity = ( $(e.target).hasClass('entity') )? $(e.target).data('entity') : $(e.target).parent('.entity').data('entity') ;
					entity.dragOut(this, $(e.target));
				}
			}
		};
		/*	
		 *	@param {Entity} entity
		 *	@param {$object} $target to identify drag container if there more than one
		 */
		Entity.prototype.dragOver = function(entity, $target) {
			
			for(var key in this.dropareas){
				if(this.dropareas[key].$ele[0] == $target[0]){
					if(isInstanceOf(entity, this.dropareas[key].restrictions) ){
						$target.addClass('dragover-deny');	
					}else{
						$target.addClass('dragover-allowed');
					}
				}
			}	
		};
		/*	
		 *	@param {Entity} entity
		 *	@param {$object} $target to identify drag container if there more than one
		 */
		Entity.prototype.dragOut = function(entity, $target) {
			for(var key in this.dropareas){
				this.dropareas[key].$ele.removeClass('dragover-allowed');
				this.dropareas[key].$ele.removeClass('dragover-deny');
			}
		};
		/*	
		 *	@param {Entity} entity
		 */
		Entity.prototype.onDrop = function(entity, $droparea) {
			for(var key in this.dropareas){
				if(this.dropareas[key].$ele[0] == $droparea[0]){
					this.dropareas[key].callBack(entity);
				}
			}
		};
		/*	
		 *	@param {$object} $element
		 *	@param {function} dropCB called when droping something allowed
		 *	@param {array} restrictions array with entity names that not allowed
		 */
		Entity.prototype.registerDroparea = function($element, dropCB, restrictions) {
			this.dropareas.push({
				$ele : $element,
				callBack : dropCB,
				restrictions : restrictions || []
			});
			
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
			$('.headline', this.$ele).html('brackets module');
			this.$ele.append('<div style="width:100%;height:20px;">privates:</div>');
			var $privateDrop = $('<ul class="privates droparea" style="width:100%;height:100px;margin-left:0px;">d</ul>');
			this.$ele.append($privateDrop);
			this.$ele.append('<div style="width:100%;height:20px;">exports:</div>');
			var $exportsDrop = $('<ul class="exports droparea" style="width:100%;height:100px;margin-left:0px;">d</ul>');
			this.$ele.append($exportsDrop);
			//register dropareas
			var self = this;
			this.registerDroparea($privateDrop, function(entity) {
				//add entity
//				self.addChild(entity);
				
			},['bracketsModulEntity']);
			this.registerDroparea($exportsDrop, function(entity) {
				//add entity
				console.log('exports drop')
			});
			
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
			$ele : $container,
			childs : [],
			addChild : function(child) {
				this.childs.push(child);
				this.$ele.append(child.$ele);
			},
			removeChild : function(child) {
				for(i=0;i<this.childs.length;i++) {
					if(this.childs[i] == child) break;
				}
				var removed = this.childs.slice(i,i);
				this.$ele.detach(removed.$ele);
			},
			render : function() {
				for(k in this.childs) {
					this.$ele.append(this.childs[k].$ele);

				}
			},
		};
		ROOT = entitys;
		this.entitys = entitys;
		//click, key handler

		$container.removeClass();
		$container.addClass('quickCreate');
		var qInput = new QuickInput($container);
		
		var mouse = false;
		var target = false;
		$container.on('mousedown', function(e){
			mouse = true;
			var $target = $(e.target);
			if( $target.hasClass('entity') ) {
				target = $target.data('entity');
			}else{
				target = $target.parent('.entity').data('entity');	
			}
			if(target){
				target.onMouseDown(e);
			}
		});
		$container.on('mousemove', function(e){
			if(target)
				target.onMouseMove(e);
		});
		//inCanvas flagg to know if a click goes in canvas or not
		var inCanvas = false;
		$container.on('mouseup', function(e){
			inCanvas = true;
			mouse = false;
			if(target){
				target.onMouseUp(e);
				target = false;
			}else if(e.target == this) {
				//show input on x y
				qInput.open(e.offsetX, e.offsetY, function(com) {
					//create entity on pos :)
					switch(com[0]){
						case 'scope':
							var entity = new ScopeEntity();
							entity.init(entitys, e.offsetX, e.offsetY);
							break;
						case 'module':
							if(typeof com[1] != 'string'){

								//default js module
							}else if(com[1] == 'brackets'){
								var entity = new bracketsModulEntity();
								entity.init();
								entity.setPos(e.offsetX, e.offsetY);

								entity.changeParent(entitys);
								entity.addChild(entitys);
							}
							break;
						default:
							var entity = new bracketsModulEntity();
							entity.init();
							entity.setPos(e.offsetX, e.offsetY);
							entity.changeParent(entitys);
							entitys.addChild(entity);
							//return false;
							break;
					}
					return true;
				});
			}
		});
		$container.on('mouseover', function(e){
			if(target)
				target.onMouseOver(e);
		});
		$container.on('mouseout', function(e){
			if(target)
				target.onMouseOut(e);
		});
		$(document).on('click', function(e) {
			if(!inCanvas)
				qInput.close();
			inCanvas = false;
		});
	};
	Renderer.prototype.render = function($context, project) {
		this.entitys.render();
	};
	Renderer.prototype.onProjectLoaded = function(project) {
		this.project = project;
		this.render(this.$container, project);
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
