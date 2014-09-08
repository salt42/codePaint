define(function (require, exports, module) {
    /*
    *  -renderer
    *  -comands
    *  -tools
    *
    */
    exports.renderer = {
        render : function(){},
    }
    exports.comands = {
        changeBgColor : {
            execute : function() {
                //execute comand
                //change bg color
            },
        }
    };
    exports.tools = {
        changeBgColor : {
            type : 'button',
            icon : 'bal.png',
            comand : 'changeBgColor',
        },
    }
});
