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

Tile.cache = {};
Tile.get = function(name){
	if (name in Tile.cache) return Tile.cache[name];

	var data = Tiles[name];

	if (!data) {
	    data = {
			src:'img/tiles/tile' + name + '.png'
		};
    }

	var tile = Tile.cache[name] = new Tile(data.width, data.height, data.src);
	// preload that image
	// tofix: load queue
	tile.img = new Image();
	tile.name = name;
	tile.img.src = data.src;
	tile.collides = data.collides;

	return tile;
};
