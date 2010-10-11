// properties of a single map
// including size, tiles to use, positions of sprites, entry
// point, "theme" (if any), etc

// config api:
// name: The name of the map
// width: number of tiles wide
// height: number of tiles high
// tiles: double array containing the names of the tile to load at some xy

var MapLayout = function(config){
	// todo: verification of config object (api?)
	Test.assert(config.name && typeof config.name == 'string', "Every map should have a name");
	Test.assert(config.width > 0, "Every map should have a width");
	Test.assert(config.height > 0, "Every map should have a height");
	Test.assert(config.name == "random" || (config.tiles && config.tiles instanceof Array), "Every map should have a set of tiles");
	
	this.config = config;
};

MapLayout.prototype = {
	
	// return the value of a property
	get: function(name){
		Test.assert(name in this.config, "The requested property should exist");
		return this.config[name];
	},
	
	// return the name of the tile at given coordinate
	getTileName: function(x,y){
	    
	    if (!this.config.tiles) {
		    // return a random tile, for now
    		// TOFIX: remove when edwin finishes
    		var t = ["tree","tree","tree","dirt0", "dirt1", "dirt2", "wall", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"dirt0", "dirt1", "dirt2", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"dirt0", "dirt1", "dirt2", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"dirt0", "dirt1", "dirt2", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"dirt0", "dirt1", "dirt2", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"dirt0", "dirt1", "dirt2", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"dirt0", "dirt1", "dirt2", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"dirt0", "dirt1", "dirt2", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"dirt0", "dirt1", "dirt2", "dirt3", "dirt4","dirt5","dirt6","dirt7",
    		"brick0","brick1","cactus"];
    		return t[Math.floor(Math.random()*t.length)];
	    }
		Test.assert(this.config.tiles[x], "config should have enough tiles x");
		Test.assert(this.config.tiles[x][y], "tile should exist");
		Test.assert(typeof this.config.tiles[x][y], "tiles should only contain strings (name of tiles)");
		return this.config.tiles[x][y];
	},
	
	toString: function(){
		return "MapLayout["+this.config.name+" (etc)]";
	},

0:0};

