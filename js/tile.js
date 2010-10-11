// one background tile
var Tile = function(width, height, src){
	this.width = width;
	this.height = height;
	this.src = src;
};

Tile.prototype = {
	img: null, // the actual Image object, created (in map.js) when loading a map that uses this tile
	
	toString: function(){
		return "Tile["+this.src+", loaded:"+(!!this.img)+"]";
	},

0:0};

Tile.get = function(name){
	var data = Tiles[name];
	return new Tile(data.width, data.height, data.src);
};
