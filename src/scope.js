define(function (require, exports, module) {

    var Scope = function(type, loc){
        this.type = type;
        this.childs = [];
        this.loc = loc === undefined ? {start: {line: 0, column: 0}, end: {line: 0, column: 0}} : loc;
        console.log('new scope of type: '+this.type+', from  line: '+this.loc.start.line+' to line: '+this.loc.end.line);
    }
//    Scope.prototype.childs = [];
//    Scope.prototype.type = 'undefined';
//    Scope.prototype.loc = {};


    /*
     *  abstract updateChilds
     *  updatet oder erstellt neue childs
     *  @param  node        an syntax tree node
     *  @param  replace     flag if true first removeChilds
     */
    Scope.prototype.updateChilds = function(node, replace){};

    Scope.prototype.addChildScope = function(childScope){
        this.childs.push(childScope);
    };






    Scope.prototype.getChildScopes = function(){
        return this.childs;
    };

    Scope.prototype.removeChildScope = function(child){
        var i = this.childs.indexOf(child);
        if(i > -1){
            this.childs.splice(i, 1);
        }
    };

    Scope.prototype.removeChildScopes = function(childsToBeRemoved){
        if(childsToBeRemoved.length > 0){
            childsToBeRemoved.forEach(this.removeChildScope);
        }
    }

    Scope.prototype.getType = function(){
        var type = '';
        return type;
    };

    Scope.prototype.getContent = function(){
        return codeManager.getCodeAt(this.loc);
    };

    Scope.prototype.getLoc = function(){
        return this.loc;
    };



    module.exports = Scope;
});
