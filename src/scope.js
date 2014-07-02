define(function (require, exports, module) {

    var scope = function(data, parent){

        var childs = [],
            content = {data: data, parent: parent};

        this.addChildScope = function(childScope){
            childs.push(childScope);
            return childScope;
        }

        this.getChildScopes = function(){
            return childs;
        }

        this.removeChildScope = function(child){
            var i = childs.indexOf(child);
            if(i > -1){
                childs.splice(i, 1);
            }
        }

        this.removeChildScopes = function(childsToBeRemoved){
            if(childsToBeRemoved.length > 0){
                childsToBeRemoved.forEach(this.removeChildScope);
            }
        }

        this.getType = function(){
            var type = '';
            return type;
        }

        this.getContent = function(){
            return content;
        }

        this.getLoc = function(){
            return content.loc;
        }

    }

    module.exports = scope;
});
