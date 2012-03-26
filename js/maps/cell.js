// one cell of the map grid
// has a position and the tile (its background)
// in game, this tile is one unit high and wide
var Cell = function(x,y, tile){
	this.x = x;
	this.y = y;
	this.tile = tile
};
Cell.prototype = {
	toString: function() {
		return "Cell["+this.x+","+this.y+"]";
	},
	// used by astar.js
	isWall: function() {
	    return this.tile.collides;
    },

0:0};
