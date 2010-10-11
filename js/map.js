// map instance, loads a MapLayout

var Map = function(mapLayout){
	this.mapLayout = mapLayout; // inside this class, when "cached", it will be named "config"
	this.load(mapLayout);
	
	Test.assert(this.unitsX > 0, "A map needs tiles X");
	Test.assert(this.unitsY > 0, "A map needs tiles Y");

	this.initGrid();
	
};

Map.prototype = {
	tileGrid: null, // two dimensional array containing the tiles (references to Tile objects) to be drawn
	
	load: function(mapLayout){
		this.name = mapLayout.get("name");
		this.unitsX = mapLayout.get("width");
		this.unitsY = mapLayout.get("height");
		this.spawnPoint = mapLayout.get("spawnPoint");
		this.objects = mapLayout.get("gameObjs");
		this.squadSize = mapLayout.get("squadSize");
	},
	
	initGrid: function(){
		var mapLayout = this.mapLayout;
		var tiles = Tiles; // Tiles is a global object literal, has tiles by name
		//var collisions = Tile.get('collisions');
		var grid = this.tileGrid = [];
		for (var y=0, ny=this.unitsY; y<ny; ++y) {
			grid[y] = [];
			for (var x=0, nx=this.unitsX; x<nx; ++x) {
				var tile = grid[y][x] = Tile.get(mapLayout.getTileName(y,x));
				Test.assert(grid[y][x], "Expecting a tile");
				Test.assert(grid[y][x] instanceof Tile, "expecting a real tile");
			}
		}
	},
	
	getTile: function(cell) {
	    if (cell.x < 0 || cell.x >= this.unitsX || cell.y < 0 || cell.y >= this.unitsY) {
	        // TOFIX: static oob tile
			return Tile.get('water');//tileGrid[0][0];
        }
	    Test.assert(Math.round(cell.x) == cell.x, "coords must be integer");
	    Test.assert(Math.round(cell.y) == cell.y, "coords must be integer");
	    Test.assert('undefined' != typeof this.tileGrid[cell.y], "row doesn't exist"+cell.y);
	    Test.assert('undefined' != typeof this.tileGrid[cell.y][cell.x], "col doesn't exist"+cell.x);

		if (this.tileGrid[cell.y][cell.x].collides && $('#collisions')[0].checked) return Tile.get('wall');
		//else Test.assert(this.tileGrid[cell.y][cell.x].)

	    return (this.tileGrid[cell.y] || this.tileGrid[0])[cell.x];
    },
	
	toString: function(){
		return "Map["+this.name+", "+this.unitsX+","+this.unitsY+"]";
	},

0:0};

Map.get = function(name){
	return new Map(new MapLayout(Maps[name]));
};

