define(function (require, exports, modul) {
	'use strict';
	var estraverse = require('../../lib/estraverse');

	/*
	 *	@param {Object} inst
	 *	@param {array.<Object>} of
	 */
	var isInstanceOf = function(inst, of) {
		var key;
		for (key in of) {
			if (inst instanceof eval(of[key])) {
				return of[key];
			}
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
			this.$ele = $('<div class="entity expanded dragable"><div class="headline dragable">undefined</div></div>');
			this.childs = [];
			this.pos = { x : 0,
						 y : 0 };
			this.dropareas = [];
			this.parent = null;

			this.$ele.css('top', this.pos.y);
			this.$ele.css('left', this.pos.x);
			this.$ele.data('entity', this);
			this.$topButtons = $('<div class="top-buttons"></div>');
			this.$ele.append(this.$topButtons);
			var self = this;
			this.registerTopButtons('switchSize', '', function(e){
				self.switchSize('');
			});

		};
		/*
		 *	@param {function} callBack
		 */
		Entity.prototype.registerTopButtons = function(name, icon, callBack) {
			var $button = $('<span class="button" name="'+ name +'">icon</span>');
			this.$topButtons.append($button);
			$button.click(function(e) {
				callBack(e);
				console.log('aaaaaaaaaaaaaaaa',$(e.target).attr('name'));
			});
/*			this.topButtons[name] = {
				name : name,
				icon : icon,
				callBack : callBack,
				$button :
			}*/
		}
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
				this.$ele.removeClass('contracted');
				this.$ele.addClass('expanded');
				//set width and height
				return;
			}
			if(w == 'contracted'){
				this.$ele.removeClass('expanded');
				this.$ele.addClass('contracted');
			}else if(w == 'expanded'){
				this.$ele.removeClass('contracted');
				this.$ele.addClass('expanded');

			}
		};
		Entity.prototype.switchSize = function() {
			if(this.$ele.hasClass('contracted')){
				this.$ele.removeClass('contracted');
				this.$ele.addClass('expanded');
			} else {
				this.$ele.removeClass('expanded');
				this.$ele.addClass('contracted');
			}
		};
		/*
		 *	@param {Entity} child
		 */
		Entity.prototype.addChild = function(child, dropareaName) {
			if(child == this) { console.log('cant add entity as own child'); return false; }
			this.childs.push(child);
			child.setSize('contracted');
			if(dropareaName && dropareaName in this.dropareas) {
				this.dropareas[dropareaName].$ele.append(child.$ele);
			}else{
				for(i in this.dropareas) {
					this.dropareas[i].$ele.append(child.$ele);
					break;
				}
			}
		};
		/*
		 *	@param {Entity} child
		 */
		Entity.prototype.removeChild = function(child) {
			for(i=0;i<this.childs.length;i++) {
				if(this.childs[i] == child) break;
			}
			var removed = this.childs.splice(i,i+1);
			removed[0].$ele.detach();
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
//			return true;
		};
		/*
		 *	@param {obejct} e event object
		 */
		Entity.prototype.onMouseMove = function(e) {

		};
		/*
		 *	@param {obejct} e event object
		 */
		Entity.prototype.onMouseUp = function(e) {
			this.setSize('expanded');
			return false;
		};
		/*
		 *	@param {obejct} e event object
		 */
/*		Entity.prototype.onMouseOver = function(e) {
			if(this.mouse.drag){
				if( $(e.target).hasClass('droparea') ){
					var entity = ( $(e.target).hasClass('entity') )? $(e.target).data('entity') : $(e.target).parent('.entity').data('entity') ;
					entity.dragOver(this, $(e.target));
				}
			}
		};*/
		/*
		 *	@param {obejct} e event object
		 */
/*		Entity.prototype.onMouseOut = function(e) {
			if(this.mouse.drag){
				if( $(e.target).hasClass('droparea') ){
					var entity = ( $(e.target).hasClass('entity') )? $(e.target).data('entity') : $(e.target).parent('.entity').data('entity') ;
					entity.dragOut(this, $(e.target));
				}
			}
		};*/
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
		 *	@param {string} dropareaName
		 */
		Entity.prototype.onDrop = function(entity, dropareaName) {
			if(isInstanceOf(entity, this.dropareas[dropareaName].restrictions)) {
				return false;//error: Type not allowed here
			}
			entity.setSize('contracted');
			entity.changeParent(this);
			this.addChild(entity, dropareaName);
		};
		/*
		 *	@param {string} name inde
		 *	@param {$object} $element
		 *	@param {function} dropCB called when droping something allowed
		 *	@param {array} restrictions array with entity names that not allowed
		 */
		Entity.prototype.registerDroparea = function(name, $element, dropCB, restrictions) {
			this.dropareas[name] = {
				name : name,
				$ele : $element,
				callBack : dropCB,
				restrictions : restrictions || []
			};
			$element.data('dropareaName', name);
		};



	function FunctionEntity() {
		Entity.call(this);
		this.name = 'undefined';
	}
		FunctionEntity.prototype = Object.create(Entity.prototype);
		FunctionEntity.prototype.constructor = FunctionEntity;

		FunctionEntity.prototype.init = function() {
			Entity.prototype.init.apply(this, arguments);
			$('.headline', this.$ele).html('function '+this.name);
			var $childsDrop = $('<ul class="methodes droparea" style="width:100%;height:100px;margin-left:0px;"></ul>');
			this.$ele.append($childsDrop);
			this.registerDroparea('childs', $childsDrop, function(entity) {

			});
		};


	function ClassEntity() {
		Entity.call(this);
		this.name = 'undefined';
	}
		ClassEntity.prototype = Object.create(Entity.prototype);
		ClassEntity.prototype.constructor = ClassEntity;

		ClassEntity.prototype.init = function() {
			Entity.prototype.init.apply(this, arguments);
			$('.headline', this.$ele).html('Class '+ this.name);
			this.$ele.append('<div style="width:100%;height:20px;">methodes:</div>');
			var $methodesDrop = $('<ul class="methodes droparea" style="width:100%;height:100px;margin-left:0px;"></ul>');
			this.$ele.append($methodesDrop);
			this.registerDroparea('methodes', $methodesDrop, function(entity) {
			}, ['BracketsModulEntity', 'ClassEntity']);
		};


	function BracketsModulEntity() {
		Entity.call(this);
	}
		BracketsModulEntity.prototype = Object.create(Entity.prototype);
		BracketsModulEntity.prototype.constructor = BracketsModulEntity;

		BracketsModulEntity.prototype.init = function() {
			Entity.prototype.init.apply(this, arguments);
			$('.headline', this.$ele).html('brackets module');
			this.$ele.append('<div style="width:100%;height:20px;">privates:</div>');
			var $privateDrop = $('<ul class="privates droparea" style="width:100%;height:100px;margin-left:0px;"></ul>');
			this.$ele.append($privateDrop);
			this.$ele.append('<div style="width:100%;height:20px;">exports:</div>');
			var $exportsDrop = $('<ul class="exports droparea" style="width:100%;height:100px;margin-left:0px;"></ul>');
			this.$ele.append($exportsDrop);
			//register dropareas
			var self = this;
			this.registerDroparea('privates', $privateDrop, function(entity) {

			},['BracketsModulEntity']);
			this.registerDroparea('exports', $exportsDrop, function(entity) {
				//entity.ast //check 4 exports and change if needed
			});

		};
		BracketsModulEntity.prototype.onClick = function(x, y) {
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
		console.log('init quickCreate');
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
				var removed = this.childs.splice(i,i+1);
				removed[0].$ele.detach();
			},
			render : function() {
				for(k in this.childs) {
					this.$ele.append(this.childs[k].$ele);

				}
			},
		};
		this.entitys = entitys;
		//click, key handler

		$container.removeClass();
		$container.addClass('quickCreate');
		var qInput = new QuickInput($container);

		var mouse = {
			button : false,
			dragState : false, // ready4drag, dragging, false
			lastEvent : null,
			resetDrops : [],
		};
		var target = false;
		var startDragging = function(e) {
			if(!target.parent.$ele.hasClass('quickCreate')){
				target.setSize('expanded');
				var off = entitys.$ele.offset();
				target.setPos(e.clientX-off.left-10, e.clientY-off.top-5);
				target.changeParent(entitys);
				entitys.addChild(target);
			}
			target.$ele.addClass('dragging');
			mouse.dragState = 'dragging';
		};
		function stopDragging(e) {
			target.$ele.removeClass('dragging');
			//reset draging states
			for(var k in mouse.resetDrops) {
				mouse.resetDrops[k].$ele.removeClass('dragover-allow');
				mouse.resetDrops[k].$ele.removeClass('dragover-deny');
			}
			mouse.dragState = false;
		};

		$container.on('mousedown', function(e){
			mouse.button = e.button;
			var $target = $(e.target);
			if( $target.hasClass('entity') ) {
				target = $target.data('entity');
			}else{
				target = $target.parent('.entity').data('entity');
			}
			if(target){
				qInput.close();
				if(target.onMouseDown(e) != false) {
					if(e.button == 0 && $target.hasClass('dragable')) {
						mouse.dragState = 'ready4drag';
					}else if(e.button == 0 && $target.hasClass('droparea')) {
						//open quick input
						//qInput.open();
					}
				}
			}
			mouse.lastEvent = e;
		});
		$container.on('mousemove', function(e){
			if(target) {
				if(mouse.dragState == 'ready4drag') {
					//startup drag
					startDragging(e);
				}else if(mouse.dragState == 'dragging') {
					//drag target
					target.move(e.clientX - mouse.lastEvent.clientX, e.clientY - mouse.lastEvent.clientY);
				}else {
					target.onMouseMove(e);
				}
			}
			mouse.lastEvent = e;
		});
		//inCanvas flagg to know if a click goes in canvas or not
		var inCanvas = false;
		$container.on('mouseup', function(e){
			inCanvas = true;
			if(target){
				if(mouse.dragState == 'dragging') {
					if($(e.target).hasClass('droparea')) {
						var entity = ($(e.target).hasClass('entity'))?$(e.target).data('entity') : $(e.target).parent('.entity').data('entity');
						entity.onDrop(target, $(e.target).data('dropareaName'));
					}
					stopDragging();

				}else{
					target.onMouseUp(e);
				}
				target = false;
				qInput.close();
			}else if(e.target == this) {
				//show input on x y
				qInput.open(e.offsetX, e.offsetY, function(com) {
					//create entity on pos :)
					switch(com[0]){
						case 'class':
							var entity = new ClassEntity();
							entity.name = com[1] || 'undefined';
							console.log(e)
							entity.init();
							entity.setPos(e.offsetX, e.offsetY);
							entity.changeParent(entitys);
							entitys.addChild(entity);
							break;
						case 'module':
							if(typeof com[1] != 'string'){

								//default js module
							}else if(com[1] == 'brackets'){
								var entity = new BracketsModulEntity();
								entity.init();
								entity.setPos(e.offsetX, e.offsetY);

								entity.changeParent(entitys);
								entity.addChild(entitys);
							}
							break;
						case 'function':
							var entity = new FunctionEntity();
							entity.init();
							entity.setPos(e.offsetX, e.offsetY);
							entity.changeParent(entitys);
							entitys.addChild(entity);
							if (typeof com[1] == 'string') {
								entity.name = 'a';
							}
							//return false;
							break;
						case 'b':
							var entity = new BracketsModulEntity();
							entity.init();
							entity.setPos(e.offsetX, e.offsetY);
							entity.changeParent(entitys);
							entitys.addChild(entity);
							entity.name = 'b';
							//return false;
							break;
						default:
							var entity = new BracketsModulEntity();
							entity.init();
							entity.setPos(e.offsetX, e.offsetY);
							entity.changeParent(entitys);
							entitys.addChild(entity);
							entity.name = 'default';
							//return false;
							break;
					}
					return true;
				});
			}
		});
		$container.on('mouseover', function(e){
			if(mouse.dragState == 'dragging'){
				if($(e.target).hasClass('droparea')){
					var entity = ($(e.target).hasClass('entity'))? $(e.target).data('entity') : $(e.target).parent('.entity').data('entity');
					var areaName = $(e.target).data('dropareaName');
					//check type
					if(isInstanceOf(target, entity.dropareas[areaName].restrictions)) {
						entity.dropareas[areaName].$ele.addClass('dragover-deny');
					}else{
						entity.dropareas[areaName].$ele.addClass('dragover-allow');
					}
					mouse.resetDrops.push(entity.dropareas[areaName]);
				}
			}
		});
		$container.on('mouseout', function(e){
/*			if(mouse.dragState == 'dragging' && $(e.target).hasClass('quickCreate')) {
				stopDragging();
			}*/
		});
		$(document).on('click', function(e) {
			if(!inCanvas){
				qInput.close();
			}
			inCanvas = false;
		});
	};
	Renderer.prototype.render = function($context, project) {
		//parse data
		//create entity structure
	};
	Renderer.prototype.onProjectLoaded = function(project) {
		this.project = project;
		//check saved data

		//create new entitys for each file
		var b = true,
			entitys = this.entitys,
			parentEntityStack = [entitys],
			parentNodeStack = [],
			skipList = [];

		function generateEntitys() {
			estraverse.traverse(project.documents[0].ast, {
				enter: function (node, parent) {
					var k;
					if(b) {console.log(this);b=false;}
					if (k = skipList.indexOf(node) != -1) {
						//@todo splice skipList[k]
						this.skip();
					}
					switch(1){
						case 1:
							if(checkBracketsModule.call(this, node, parent)) break;
						case 1:
							if(checkFunction.call(this, node, parent)) break;
//						case 1:
//							if(checkFunction.call(this, node, parent)) break;
					}
					checkScopeForClass.call(this, node, parent);
				},
				leave: function (node, parent) {
					if(node == parentNodeStack[parentNodeStack.length-1]){
						parentEntityStack.pop();
						parentNodeStack.pop();
					}
				}
			});
			return parentEntityStack[0];
		}
		function checkFunction(node, parent) {
			if (node.type == 'FunctionExpression') {
				//find name
				var name = 'undefined';
				if (parent.type == 'VariableDeclarator') {
					name = parent.id.name;
				} else if(parent.type == 'AssignmentExpression') {
					name = parent.left.property.name;
				}
				//create function
				var nParent = parentEntityStack[parentEntityStack.length-1],
					nE = new FunctionEntity();

				nE.name = name;
				nE.init();
				nE.setPos(50, 50);
				nE.setSize('expanded');
				nE.changeParent(nParent);
				nParent.addChild(nE, 'privates');

				parentEntityStack.push(nE);
				parentNodeStack.push(node);
				return true;
			}
			return false;
		}
		function checkBracketsModule(node, parent) {
			if(node.type == 'FunctionExpression'
			   && parent.type == 'CallExpression'
			   && parent.callee.name == 'define') {
				//brackets module
				//set atributes as scope variables
				console.log('find brackets module')

				var nE = new BracketsModulEntity(),
					nParent = parentEntityStack[parentEntityStack.length-1];
				nE.init();
				nE.setPos(50, 50);
				nE.setSize('expanded');
				nE.changeParent(nParent);
				nParent.addChild(nE);

				parentEntityStack.push(nE);
				parentNodeStack.push(node);
				return true;
			}
			return false;
		}
		function checkScopeForClass(node) {
			if(node.type != 'Program' && node.type != 'FunctionExpression') return false;
			//console.log('fuckyou', node);
			//traverse childs
			var childs = (node.type == 'Program')? node.body : node.body.body,
				k,
				tmp,
				scopeVars = {},
				scopeProtos = {};
			for(k in childs) {
				//console.log(childs[k])
				if(childs[k].type == 'VariableDeclaration') {
					if(childs[k].declarations.length == 1
					   && childs[k].declarations[0].init
					   && childs[k].declarations[0].init.type == 'FunctionExpression') {
						//save function name
						scopeVars[childs[k].declarations[0].id.name] = childs[k];
					}
				} else if(childs[k].type == 'FunctionDeclaration') {
					scopeVars[childs[k].id.name] = childs[k];
				} else if(childs[k].type == 'ExpressionStatement'
						  && childs[k].expression.type == 'AssignmentExpression'
						  && childs[k].expression.left.type == 'MemberExpression'
						  && childs[k].expression.left.object.type == 'MemberExpression'
						  && childs[k].expression.left.object.property.name == 'prototype') {
					if(childs[k].expression.right.type == 'FunctionExpression') {
						//save expression root object name
						var funcName = childs[k].expression.left.property.name;//function name
						tmp = childs[k].expression.left.object.object.name//object name
						if(!(tmp in scopeProtos)) {
							scopeProtos[tmp] = {};
						}
						scopeProtos[tmp][funcName] = childs[k];

					}
				}
			}
			//console.log(scopeVars, scopeProtos);
			var objName,methodeName;
			for(objName in scopeVars) {
				//suche nach
				if(objName in scopeProtos) {
					console.log('find class named '+objName);
					//create class / add it to parent / add all funcs 2 skipList
					var classEntity = new ClassEntity(),
						nParent = parentEntityStack[parentEntityStack.length-1];
					classEntity.name = objName;
					classEntity.init();
					classEntity.setPos(50, 50);
					classEntity.setSize('expanded');
					classEntity.changeParent(nParent);
					nParent.addChild(classEntity, 'privates');


					for(methodeName in scopeProtos[objName]) {
						var nE = new FunctionEntity();
						nE.name = methodeName;
						nE.init();
						nE.setPos(50, 50);
						nE.setSize('expanded');
						nE.changeParent(classEntity);
						classEntity.addChild(nE, 'methodes');

						skipList.push(scopeProtos[objName][methodeName]);
					}
					skipList.push(scopeVars[objName]);
				}
			}
			return false;
		}
		generateEntitys();


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
