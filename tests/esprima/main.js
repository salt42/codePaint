var testCode = '';
var rootScope = null;
function onLoad(){
    /*
    rootScope = {
        domEl: $('#canvas'),
        subScopes: [],
        addScope: function(data){
            var sub = new scope(data, this);
            //position bestimmen
            var l = this.subScopes.length*200+50;
            $(sub.domEl).css('left', l+'px');
            this.subScopes.push(sub);
            return sub;
        }
    }*/
    $.ajax({
        type: "GET",
        url: "sampleCode.js",
        dataType: 'text',
        success: function(e){
            testCode = e;
            var ast = esprima.parse(testCode, {
                loc: true,
                range : false,
                raw : false,
                tokens : false,
                comment : false,
                tolerant : false
            })
            traverse(ast);
        }
    });
}
var scopeChain = [];
var assignments = [];
var globScope = new Scope('global', null)

function traverse(ast) {

    estraverse.traverse(ast, {
        enter: enter,
        leave: leave
    });
    setTimeout(function(){
        console.log(globScope)
    },1000);

}


/*
* @param {object} node ast node
* @param {object} node ast node
*/
function enter(node, parent){
    if (createsNewScope(node)){
        //check name default is anonymous
        var name = 'anonymous';
        if(parent && parent.type == 'VariableDeclarator'){
            name = parent.id.name;
        }else if(parent && parent.type == 'Property'){
            name = parent.key.name;
        }
        var parentScope = scopeChain[scopeChain.length-1] || null;
        var s = new Scope(node, parentScope);
        if(node.type == 'Program')
            globScope = s;
        if(parentScope)
            parentScope.declare(name, s);
        scopeChain.push(s);
  }
    if (node.type === 'VariableDeclarator'){
        var currentScope = scopeChain[scopeChain.length - 1];
        //currentScope.push(node.id.name);
        currentScope.declare(node.id.name, null)
  }
    if (node.type === 'AssignmentExpression'){
        assignments.push(node.left.name);
  }
}

function leave(node){
  if (createsNewScope(node)){
//    checkForLeaks(assignments, scopeChain);
    scopeChain.pop();
    assignments = [];
  }
}
function isVarDefined(varname, scopeChain){
  for (var i = 0; i < scopeChain.length; i++){
    var scope = scopeChain[i];
    if (scope.indexOf(varname) !== -1){
      return true;
    }
  }
  return false;
}
/*function checkForLeaks(assignments, scopeChain){
  for (var i = 0; i < assignments.length; i++){
    if (!isVarDefined(assignments[i], scopeChain)){
      console.log('Detected leaked global variable:', assignments[i]);
    }
  }
}*/
function createsNewScope(node){
  return node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'Program';
}



function Scope(node, parent) {
    this.node = node;
    this.parent = parent;
    this.variables = []
}
Scope.prototype.declare = function(name, s){
    this.variables[name] = s;
};




















function isFunction(form) {
  return form.type === "FunctionExpression" ||
    form.type === "FunctionDeclaration"
}

function isCatch(form) {
  return form.type === "CatchClause"
}

function isScope(form) {
  return form.type === "Program" ||
    isFunction(form) ||
    isCatch(form) ||
    form.type === "WithStatement"
}






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
    rootScope.parseData(result)

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
                        /*
                        declarations: Array[1]
                            id: Node
                            init: Node
                            loc: SourceLocation
                            type: "VariableDeclarator"

                        kind: "var"
                        loc: SourceLocation
                        type: "VariableDeclaration"
                        */
                        /*
                        var len = childNode.declarations.length;
                        for(i=0;i<len;i++){
                            var declarator = childNode.declarations[i].init;
                            if(declarator.type != 'Literal'){
                                var subScope = parentScope.addScope(declarator);
                                parseRecur(declarator, subScope);
                            }
                        }*/

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


















