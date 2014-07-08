define(function (require, viewManager, module) {
    "use strict";
    var panelView = require("./panelView");
    var windowView = require("./windowView");

    viewManager.init = function(){
        panelView.init();
        windowView.init();
    };
});
