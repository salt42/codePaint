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
            runParser();
        }
    });
}


function scope(data, parent) {
    if(parent){
        console.log(data)
        var type = typeof data.type == 'undefined' ? 'Identifier' : data.type;
        this.domEl = $('<div></div>')
            .addClass(type+' framed')
            .append( $('<div></div>')
                .addClass('title')
                .append(type + '      | pos: ' + data.loc.l + ' / ' + data.loc.c));
        $(parent.domEl).append(this.domEl);
    }
    if(data) this.parseData(data);
}

scope.prototype.data = null;
scope.prototype.subScopes = [];
scope.prototype.domEl = null;

scope.prototype.addScope = function(data){
    var sub = new scope(data, this);
    this.subScopes.push(sub);
    return sub;
};

scope.prototype.parseData = function(data, parent){
    this.data = data;
    var parent = parent ? parent : this;
    //parse data for this scorpe
    switch(data.type){
        case 'FunctionDeclaration':
            var n = new scope(data.body, parent);
            this.subScopes.push(n);
            break;
        case 'VariableDeclaration':
            //if(data.declarations[0].init.type == 'ObjectExpression'){
                var n = new scope(data.declarations[0].init, parent);
                this.subScopes.push(n);
            //}
            break;
        case 'ObjectExpression':
            for(i=0;i<data.properties.length;i++){
                var n = new scope(data.properties[i], parent);
                this.subScopes.push(n);
            }
            break;
        case 'Property':
            var n = new scope(data.value, parent);
            this.subScopes.push(n);
            break;
        case 'FunctionExpression':
            var n = new scope(data.body, parent);
            this.subScopes.push(n);
            break;
        case 'BlockStatement2':
            for(i=0;i<data.body.length;i++){
                var n = new scope(data.body[i], parent);
                this.subScopes.push(n);
            }
            break;
        case 'Program':
            for(ii=0;ii<data.body.length;ii++){
                var n = new scope(data.body[ii], parent);
                this.subScopes.push(n);
            }
            break;
        default:
            if(data.kind == 'init'){
                var n = new scope(data.key, parent);
                var m = new scope(data.value, n);
                this.subScopes.push(n);
                this.subScopes.push(m);
            }
    }
    //parse childs and
    //set draw type :  class/propertie
};



function runParser(){
    var result = PEG.parse(testCode);
    /*
    var result = PEG.parse(testCode, {
        loc: true,
        range : false,
        raw : false,
        tokens : false,
        comment : false,
        tolerant : false
    });
    console.log(PEG.parse(testCode) )*/

    rootScope = new scope();
    rootScope.domEl = $('#canvas');
    rootScope.parseData(result)
    console.log(rootScope);
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


















