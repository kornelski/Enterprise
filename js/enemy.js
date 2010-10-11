// an enemy looks like a player, for now
// x and y are unit sized initial position on the map
var Enemy = function(x,y) {
    GameObj.call(this);
	this.setModel('player');
	this.setOrigin(x,y);
}

Enemy.prototype = $.extend(new GameObj,{
    
	
	
0:0});
