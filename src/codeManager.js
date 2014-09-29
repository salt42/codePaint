define(function (require, codeManager, module) {
    "use strict";

    var DocumentManager = brackets.getModule('document/DocumentManager'),
        FileSystem      = brackets.getModule('filesystem/FileSystem'),
        ProjectManager  = brackets.getModule('project/ProjectManager'),
		ExtensionUtils 	= brackets.getModule("utils/ExtensionUtils"),
		Esprima 		= require('../lib/esprima');

    codeManager.getCurrentDocument = function(cb){
        //var currDoc = DocumentManager.getCurrentDocument().file;
//		var path = 'C:/Program Files (x86)/Brackets/www/extensions/default/codePaint/test.js';//ExtensionUtils.getModulePath(module)+'../test.js';
		var path = 'C:/Program Files (x86)/Brackets/www/extensions/default/codePaint/src/editor/diagrams/quickCreate/main.js';//ExtensionUtils.getModulePath(module)+'../test.js';

        var currDocContent = FileSystem.getFileForPath(path);
		currDocContent.read(function(e, content){
			var ast = Esprima.parse(content, { loc: true });
			cb(ast);
		});
		//C:/Users/bla/AppData/Roaming/Brackets/extensions/user/codePaint/test.js
    };
});










