define(function (require, exports, module) {

    function runParser(){
        var result = esprima.parse(testCode, {
            loc: true,
            range : false,
            raw : false,
            tokens : false,
            comment : false,
            tolerant : false
        })
        rootScope = new scope();
        rootScope.domEl = $('#canvas');
        rootScope.parseData(result);

        $('#canvas div').each(function(key,value){
            value.addEventListener('mousedown', mouseDown, false);
        })
        var off = $('#canvas').offset();
        var mDown = false;
        var tOff = {x:0,y:0};
        var mTarget = null;
        function mouseDown(e){
            mDown = true;
            tOff.x = e.offsetX
            tOff.y = e.offsetY
            mTarget = this
            e.preventDefault()
        }
        document.onmousemove = function(e){
            if(mDown){
                var x = e.x-off.left-tOff.x
                var y = e.y-off.top-tOff.y

                $(mTarget).css('left', x+'px')
                $(mTarget).css('top', y+'px')
                //console.log('move: ',e)
            }

        }
        document.onmouseup = function(e){
            mDown = false;
            mTarget = null;
        }


        //parseRecur(result, rootScope)
        function parseRecur(node, parentScope){
                if(!node.body)return;
                var bmi = 0;
                do{
                    var childNode;
                    (!node.body.length)? childNode = node.body : childNode = node.body[bmi];
                    switch(childNode.type){
                        case 'VariableDeclaration':
                            declarations: Array[1]
                                id: Node
                                init: Node
                                loc: SourceLocation
                                type: "VariableDeclarator"

                            kind: "var"
                            loc: SourceLocation
                            type: "VariableDeclaration"

                            var subParent = parentScope.addScope(childNode);

                            var dec = childNode.declarations[0].init;
                            console.log(dec.type)
                            if(dec.type == 'ObjectExpression' || dec.type == 'FunctionExpression'){
                                var subScope = subParent.addScope(dec);
                                parseRecur(dec, subScope);
                            }
                            break;
                        case 'ObjectExpression':
                            //loc: SourceLocation
                            //properties: Array[2]
                            //type: "ObjectExpression"
                            break;
                        default:
                            var subScope = parentScope.addScope(childNode);
                            parseRecur(childNode, subScope);
                            break;
                    }
                    bmi++;
                }while(node.body.length && bmi < node.body.length);
                return;
        }
        return;


    }

    var esprima = require('../lib/esprima');



    // load concrete parser
    var parser = {

        parse : function(code){
            // esprima parse code
            var result = esprima.parse(code, {
                loc: true,
                range : false,
                raw : false,
                tokens : false,
                comment : false,
                tolerant : false
            });
            console.log(result);

            // rootScope = new scope();



            // return rootScope;
        },

    };

    exports.parser = parser;
});
