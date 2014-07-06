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
            if(node === undefined) return;
            switch(node.type){
                case 'Program':
                    var s = new Scope(node.type, node.loc);
                    for(var i = 0; i < node.body.length; i++){
                        s.updateChilds(node.body[i]);
                    }
                    this.addChildScope(s);
                    break;
                case 'FunctionDeclaration':
                    var s = new Scope(node.type, node.loc);
                    s.updateChilds(node.body);
                    this.addChildScope(s);
                    break;
                case 'BlockStatement':
                    for(var i = 0; i < node.body.length; i++){
                        this.updateChilds(node.body[i]);
                    }
                    break;
                case 'ExpressionStatement':
                    var s = new Scope(node.type, node.loc);
                    this.addChildScope(s);
                    break;
                case 'VariableDeclaration':
                    var s = new Scope(node.type, node.loc);
                    this.addChildScope(s);
                    break;
                case 'ObjectExpression':

                    break;
                case 'FunctionExpression':
                    //addChild(node.body);
                    break;
                case 'CallExpression':
                    //addChild(node.body);
                    break;
                default:
                    break;
            }
            //parse data "recursive" through scope tree
            //first create a new scope

        }

    }
    exports.init = init;
    exports.parse = parse;
});
