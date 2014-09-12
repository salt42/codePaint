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
        //public
        var commandHandler = function() {

        }
        /*
         *  @param {Object} diagram tools obejct
         */
        commandHandler.prototype.execute = function(commandName, data) {
            for(name in _commands){
                _commands[name].execute.apply(controller, []);
                return;
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
        return new commandHandler();
    }

    exports.createInstance = function(controller) {
        return createInstance(controller);
    };
});
