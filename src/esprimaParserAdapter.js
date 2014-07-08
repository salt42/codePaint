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
        Scope.prototype.updateChilds = function(node){

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
                    var items = node.body.body;
                    var subs = [];
                    for(i=0;i<items.length;i++){
                        if(items[i].type == 'ExpressionStatement' && items[i].expression.type == 'AssignmentExpression'){
                            if(items[i].expression.left.object.type == 'ThisExpression'){
                                if(items[i].expression.right.type = 'FunctionExpression'){
                                    var sc = new Scope('Function', items[i].expression.right.loc, items[i].expression.left.property.name);
                                    subs.push(sc);
                                }
                            }
                        }
                    }
                    var s = new Scope('Function', node.loc, node.id.name);
                    if(subs.length > 0) s.type = 'Object';
                    for(i=0;i<subs.length;i++){
                        s.addChildScope(subs[i]);
                    }

                    //s.updateChilds(node.body);
                    //if "this" deklaration

                    this.addChildScope(s);
                    break;
                case 'BlockStatement':
                    for(var i = 0; i < node.body.length; i++){
                        //this.updateChilds(node.body[i]);
                    }
                    break;
                case 'ExpressionStatement':
                    //prototype check
                    if(node.expression.left.type == 'MemberExpression' && node.expression.left.object.type == 'MemberExpression'){
                        if(node.expression.left.object.property.name == 'prototype'){
                            //is prototype
                            //node.expression.left.object.object.name  //object name
                            if(node.expression.right.type == 'FunctionExpression'){
                                var parent = this.getChildByName(node.expression.left.object.object.name);
                                if(parent){ parent.type = 'Object';
                                }else{ parent = this; }
                                var s = new Scope('Function', node.loc, node.expression.left.property.name);
                                parent.addChildScope(s);
                            }

                        }
                    }

                    //var s = new Scope(node.type, node.loc);
                    //this.addChildScope(s);
                    break;
                case 'VariableDeclaration':
                    //if(node.declarations.length > 1) //multi declaration
                    if(node.declarations[0].init.type == 'FunctionExpression'){
                        var s = new Scope('Function', node.loc, node.declarations[0].id.name);
                        this.addChildScope(s);
                    }

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
