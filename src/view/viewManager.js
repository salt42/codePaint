define(function (require, viewManager, module) {
    "use strict";
    var panelView = require("./panelView");


    viewManager.init = function(){

        panelView.init();
    };
});
