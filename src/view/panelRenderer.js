define(function (require, renderer, module) {
    "use strict";


    renderer.init = function(){
        //set dom container
    };
    renderer.draw = function(Scope, dom){
        //draw scope
        console.log(Scope)
        var buildHtml = function(scope){
            var html = '';
            for(var i = 0; i < scope.childs.length; i++){

                html += '<div class="scope '+ scope.childs[i].type +'">'+ scope.childs[i].type;
                html += buildHtml(scope.childs[i]);
                html += '</div>';
            }
            return html;
        }

        $(dom).html(buildHtml(Scope));
    };

});
