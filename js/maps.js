// contains all map meta data used by the game
// the object should be replaced by a json containing
// one object for every map that contains the meta
// data for that object, keyed by its (unique) name.
// replacement is done for fast access. this is only a 
// placeholder.

// API:
// object(
//   mapName: object{
//     (see config API in maplayout.js for specs)
//   },
//   ...
// )
var Maps = {
	"1 - 1": {
		name: "1 - 1",
		width: 50, // number of tiles
		height: 50,
		spawnPoint: {x:25, y:25}, // this is where player starts
		gameObjs: [
			{type: 'enemy', x:12, y:12},
			{type: 'enemy', x:20, y:20}
		], // scene props/enemies
		tiles: []
	}
};
