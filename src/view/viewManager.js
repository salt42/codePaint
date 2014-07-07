define(function (require, exports, module) {
    var persist = 22;

module.exports.get = function(){
    console.log(persist)
}
module.exports.set = function(a){
    presist = a;
}
});
