/*
comandManager

*/
define(function (require, exports, module) {
    "use strict";


    /*
     *  @param {editorController} controller
     */
    var createInstance = function(controller) {

        //private
        var _commands = {};
		var _affixedCommands = {};
        //public
        var commandHandler = function() {

        }
		//don't smoke 2 muche ... find the useless for loop ;)
        //commandHandler.prototype.execute = function(commandName, data) {
        //    for(name in _commands){
        //        _commands[name].execute.apply(controller, []);
        //        return;
        //    }
        //};
		//sec try
        /*
         *  @param {Object} diagram tools obejct
         */
        commandHandler.prototype.execute = function(commandName, data) {
        	if(commandName in _commands) {
				_commands[commandName].execute.apply(controller, []);
			} else if(commandName in _affixedCommands) {
				_affixedCommands[commandName].execute.apply(controller, []);
			} else {
				console.error('command "'+commandName+'" not found!');
			}
        };
        commandHandler.prototype.createAndExecuteCommand = function(commandName, data) {
			this.execute(commandName, data);
        };
		commandHandler.prototype.setCommands = function(commands) {
			_commands = {};
			for(i=0;i<commands.length;i++) {
				_commands[ commands[i].type ] = commands[i];
			}
		};
        /*
         *  @param {Object} command
         */
		commandHandler.prototype.registerCommand = function(command) {
			_affixedCommands[command.type] = command;
		};
        return new commandHandler();
    }

    exports.createInstance = function(controller) {
        return createInstance(controller);
    };
});
