define(function (require, exports, module) {

    var esprima = require('../lib/esprima'),
          scope = require('src/scope');

    //rong place
    var rootScope = new scope();

    var parse = function(code){
        // esprima parse code
        var esprimaRaw = esprima.parse(code, { loc: true });

        var result = parseRecur(esprimaRaw, rootScope);
        console.log(result)

    }

    var parseRecurOld = function(node, parentScope){
        // addChild is needlessly complicated
        var addChild = function(node){
            var n = new scope(node, parentScope);
            console.log('adding child of type: '+n.getContent().data.type);
            parentScope.addChildScope(n);
            parseRecur(node, n);
        }
        //WTF!?!? pointless redundant
        parentScope.addChildScope(new scope(node, parentScope));
        /*
         *  hier brauch ich deutsch :)
         *  ich hab mir die roh daten noch nich so genau angeschaut
         *  aber nicht jeder type bekommt auch nen eigenen scope
         *
         *  and more comments!! espacially in recusions
         */
        switch(node.type){
            case 'Program':

                if(node.body.length > 0){
                    for(var i = 0; i < node.body.length; i++){
                        addChild(node.body[i]);
                    }
                }
                break;
            case 'ExpressionStatement':
                switch(node.expression.type){
                    case 'CallExpression':
                        if(node.expression.arguments.length > 0){
                            for(var i = 0; i < node.expression.arguments.length; i++){
                                addChild(node.expression.arguments[i]);
                            }
                        }
                        break;
                }
                break;
            case 'BlockStatement':
                if(node.body.length > 0){
                    for(var i = 0; i < node.body.length; i++){
                        addChild(node.body[i]);
                    }
                }
                break;
            case 'VariableDeclaration':

                break;
            case 'ObjectExpression':

                break;
            case 'FunctionExpression':
                addChild(node.body);
                break;
            default:
                break;
        }
    }

    exports.rootScope = rootScope;
    exports.parse = parse;
});
