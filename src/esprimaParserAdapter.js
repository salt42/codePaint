define(function (require, exports, module) {

    var esprima = require('../lib/esprima'),
          Scope = require('src/scope');

    var init = function(){
        prepareScope();
    };
    var parse = function(code){
        // esprima parse code
        var esprimaRaw = esprima.parse(code, { loc: true });
        return esprimaRaw;
    };

    function prepareScope(){
        Scope.prototype.updateChilds = function(node, replace){
            if(replace)this.removeChildScopes();
            console.log(node);
            switch(node.type){
                case 'Program':
                    if(node.body.length > 0){
                        for(var i = 0; i < node.body.length; i++){
                            s = new Scope(node.body[i].type);
                            s.updateChilds(node.body[i]);

                            this.addChildScope(s);
                        }
                    }
                    break;
                case 'FunctionDeclaration':
                    s = new Scope(node.body.type);
                    //s.updateChilds(node.body);
                    this.addChildScope(s);
                case 'BlockStatement':
                    if(node.body.length > 0){
                        for(var i = 0; i < node.body.length; i++){
                            s = new Scope();
                            s.updateChilds(node.body[i]);
                            this.addChildScope(s);
                        }
                    }
                    break;
                case 'VariableDeclaration':

                    break;
                case 'ObjectExpression':

                    break;
                case 'FunctionExpression':
                    //addChild(node.body);
                    break;
                default:
                    break;
            }
            this.addChildScope(s);
            //parse data "recursive" through scope tree
            //first create a new scope

        }

    }
    exports.init = init;
    exports.parse = parse;
});
