define(function (require, exports, module) {

    "use strict";

    var projectPath,
        DocumentManager = brackets.getModule('document/DocumentManager'),
        FileSystem      = brackets.getModule('filesystem/FileSystem'),
        ProjectManager  = brackets.getModule('project/ProjectManager'),
        //ProjectConfig   =            require('src/projectConfig'),
        Parser          =            require('src/esprimaParserAdapter'),
        Scope           =            require('src/scope');

    var updateQueue     = [];

    var init = function(){
        projectPath = ProjectManager.getProjectRoot()._path;
        //ProjectConfig.loadProjectConf(projectPath);
        Parser.init();
    }

    var parseDocument = function() {
        var currDoc = DocumentManager.getCurrentDocument().file;
        // check if file is part of project
        if(currDoc._path.indexOf(projectPath) < 0){
            throw new Error('###### ERROR: FILE '+currDoc._path+' NOT IN PROJECT!');
            return;
        // check if document is in WorkingSet
        }else if(DocumentManager.findInWorkingSet(currDoc._path) < 0 ){
            console.log('FILE NOT IN WORKING SET!');
            console.log('adding '+currDoc._path+' to workingSet');
            // if not opened: add to WorkingSet
            DocumentManager.addToWorkingSet(currDoc);
        }
        var currDocContent = FileSystem.getFileForPath(currDoc._path)._contents;

        var syntaxTree = Parser.parse(currDocContent);
        console.log(syntaxTree);
        var root = new Scope('root');
        root.updateChilds(syntaxTree);
        return root;


    }

    exports.init = init;
    exports.parseDocument = parseDocument;

});
