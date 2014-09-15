define(function (require, codeManager, module) {
    "use strict";

    var DocumentManager = brackets.getModule('document/DocumentManager'),
        FileSystem      = brackets.getModule('filesystem/FileSystem'),
        ProjectManager  = brackets.getModule('project/ProjectManager'),
		Esprima 		= require('../lib/esprima');

    codeManager.getCurrentDocument = function(){
        var currDoc = DocumentManager.getCurrentDocument().file;
        var currDocContent = FileSystem.getFileForPath(currDoc._path)._contents;

		return Esprima.parse(currDocContent, { loc: true });
    };
});
