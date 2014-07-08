function go(){
    this.testVar = 42; //solte eigentlich noch nich geparsed werden ... is auch kein scope
    this.testFunc = function(){};
}
go.prototype.init = function(){};
go.prototype.getVar = function(){};

var func2 = function(){

};

