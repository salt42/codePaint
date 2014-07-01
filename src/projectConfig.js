define(function (require, exports, module) {

    "use strict";

    var fs = brackets.getModule('filesystem/FileSystem');
    var projectConfig = {
        monitoredFiles: [],
        parsedFiles: [],
        loadProjectConf: function(path) {
            console.log('projectConfig.loadProjectConfig(), path: '+path);
            // if file not exists
                //create
            //merge config
        }
    }

    exports.projectConfig = projectConfig;
});
