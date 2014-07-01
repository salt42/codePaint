define(function (require, exports, module) {
    function scope(data, parent) {

    }

    scope.prototype.childs = [];

    scope.prototype.addChild = function(childScope){
        var sub = new scope(data, this);
        this.subScopes.push(sub);
        return sub;
    };
});
