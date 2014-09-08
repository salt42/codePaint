define(function (require, exports, module) {
    //lade 2 module
    //und in eim des andere laden ... des andere is singelton
    var krass = 'scheiß';
    var sing = require('sing');
    sing.set('nice');
    exports.say = function(){
        console.log(sing.get())
    };
});
