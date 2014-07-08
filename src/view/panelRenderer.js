define(function (require, renderer, module) {
    "use strict";


    renderer.init = function(){
        //set dom container
    };
    renderer.draw = function(scope){
        //draw scope
        var html = '';
        for(var i = 0; i < scope.childs.length; i++){
            //scope.childs[i];
            html = '<div>'+ scope.childs[i].type;
            html += this.draw(scope.childs[i]);
            html += '</div>';

        }
        return html;
    };

});
