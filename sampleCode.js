//1111111111111111111111111
var superHuman = {
    superPower: 'servus',
    usePower: function () {
        console.log(this.superPower + "!");
    },
    go: function () {

    }
};
//22222222222222222222
function superAnt(){
    this.superPower = 'kraft';
}
superAnt.prototype.superPower = 'nix';
superAnt.prototype.usePower = function(){
    console.log(this.superPower + "!");
}

/* vererbung
var banshee = Object.create(superHuman, {
    name: { value: "Silver Banshee" },
    superPower: { value: "sonic wail" }
});
*/

var superHuman = new Object();
