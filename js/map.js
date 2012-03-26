// map instance, loads a MapLayout

var Map = function(mapLayout){
	this.mapLayout = mapLayout; // config of map
	this.load(mapLayout);

	Test.assert(this.unitsX > 0, "A map needs tiles X");
	Test.assert(this.unitsY > 0, "A map needs tiles Y");

	this.initGrid();

};

Map.prototype = {
	// copies everything from mapLayout (see maps.js)
	width: 0,
	height: 0,
	spawnPoint: null,
	tiles: null,
	name: '',
	squadSize: 0,
	actors: null,
	collisions: null,

	mapLayout: null, // just a reference, try not to use it...

	// see load
	cellGrid: null, // two dimensional array containing the tiles (references to Tile objects) to be drawn

	load: function(mapLayout){
		this.name = mapLayout.get("name");
		this.unitsX = mapLayout.get("width");
		this.unitsY = mapLayout.get("height");
		this.spawnPoint = mapLayout.get("spawnPoint");
		this.actors = mapLayout.get("actors");
		this.squadSize = mapLayout.get("squadSize");
	},

	initGrid: function(){
		var mapLayout = this.mapLayout;

		var grid = this.cellGrid = [];
		for (var y=0, ny=this.unitsY; y<ny; ++y) {
			grid[y] = [];
			for (var x=0, nx=this.unitsX; x<nx; ++x) {
				var tile = grid[y][x] = new Cell(x,y,Tile.get(mapLayout.getTileName(y,x)));
				Test.assert(grid[y][x], "Expecting a cell with a tile");
				Test.assert(grid[y][x] instanceof Cell, "expecting a real tile");
				Test.assert(grid[y][x].tile instanceof Tile, "expecting a real tile");
			}
		}
	},

	getCell: function(cellpos, y) { // either an object literal, {x,y}, or an x and y as arguments
		var x = cellpos.x;
		if (typeof x != 'number') x = cellpos;
		else y = cellpos.y;

	    Test.assert(Math.round(x) == x, "coords must be integer");
	    Test.assert(Math.round(y) == y, "coords must be integer");
	    if (x < 0 || x >= this.unitsX || y < 0 || y >= this.unitsY) {
	        // TOFIX: static oob tile
			return null;
        }

	    Test.assert('undefined' != typeof this.cellGrid[y], "row doesn't exist"+y);
	    Test.assert('undefined' != typeof this.cellGrid[y][x], "col doesn't exist"+x);

	    return this.cellGrid[y][x];
    },

    getTile: function(cellpos) {
        var cell = this.getCell(cellpos);
        if (!cell) return Tile.get('water');

		if (Config.showCollisionTiles && cell.tile.collides) return Tile.get('wall');

        return cell.tile;
    },

    // how's that different from mapLayout.get("width") and unitX?
	width: function(){
		return this.mapLayout.width;
	},
	height: function(){
		return this.mapLayout.height;
	},

	toString: function(){
		return "Map["+this.name+", "+this.unitsX+","+this.unitsY+"]";
	},

0:0};

Map.get = function(name){
	return new Map(new MapLayout(Maps[name]));
};

