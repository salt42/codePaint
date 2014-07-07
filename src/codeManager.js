define(function (require, exports, module) {

    "use strict";

    var projectPath,
        DocumentManager = brackets.getModule('document/DocumentManager'),
        FileSystem      = brackets.getModule('filesystem/FileSystem'),
        ProjectManager  = brackets.getModule('project/ProjectManager'),
        ProjectConfig   =            require('src/projectConfig'),
        Parser          =            require('src/esprimaParserAdapter'),
        Scope           =            require('src/scope'),
        Renderer        =            require('src/renderer');

    var updateQueue     = [];

    var init = function(){
        projectPath = ProjectManager.getProjectRoot()._path;
        ProjectConfig.loadProjectConf(projectPath);
        Parser.init();
        Renderer.init();
    }

    var parseDocument = function() {
        var currDoc = DocumentManager.getCurrentDocument();
        if(currDoc.file._path.indexOf(projectPath) < 0){ // check if file is part of project
            throw new Error('###### ERROR: FILE '+currDoc.file._path+' NOT IN PROJECT!');
            return;
        }else if(DocumentManager.findInWorkingSet(currDoc.file._path) < 0 ){ // check if document is in WorkingSet; if not: add to WorkingSet
            console.log('FILE NOT IN WORKING SET!\nadding '+currDoc.file._path+' to workingSet');
            DocumentManager.addToWorkingSet(currDoc.file);
        }
        var syntaxTree = Parser.parse(currDoc.getText());
        var root = new Scope('root');
        root.updateChilds(syntaxTree);
        Renderer.render(root);
        console.log(root);

    }

    exports.init = init;
    exports.parseDocument = parseDocument;

});
