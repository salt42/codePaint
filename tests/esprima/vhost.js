/*var Parser = require("jison").Parser;
var fs = require('fs')


module.exports = {
    name : 'uml',
    routes: [
        '/go',
        '/user/:id/profile',
    ],
    routeFuncs : [
        function(req, res) {

            var grammar = fs.readFileSync(__dirname+'/grammar.jison', {encoding:'UTF-8'});

            var parser = new Parser(grammar);
           // parser.parse("function aaa(){return 1;}");
            var parserSource = parser.generate({moduleName: "jsParser"});


            res.send(parserSource)
        },
        function(req, res){
            console.log(req.params)
            res.send('go gogo go gogo!!!')

        },
    ],

};*/
