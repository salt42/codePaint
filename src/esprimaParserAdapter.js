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
                    for(var i = 0; i < node.body.length; i++){
                        this.updateChilds(node.body[i]);
                    }
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
                    var s = new Scope(node.expression.type, node.expression.loc);
                    s.updateChilds(node.expression);
                    this.addChildScope(s);
                    break;
                case 'VariableDeclaration':
                    var s = new Scope(node.type, node.loc);
                    this.addChildScope(s);
                    break;
                case 'ObjectExpression':

                    break;
                case 'FunctionExpression': // params
                    var s = new Scope(node.type, node.loc);
                    s.updateChilds(node.body);
                    this.addChildScope(s);
                    break;
                case 'CallExpression': // callee
                    for(var i = 0; i < node.arguments.length; i++){
                        this.updateChilds(node.arguments[i]);
                    }
                    break;
                case 'AssignmentExpression':
                    this.updateChilds(node.left);
                    this.updateChilds(node.right);
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
