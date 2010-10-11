// contains all tile meta data used by the game
// the object should be replaced by a json containing
// one object for every tile that contains the meta
// data for that object, keyed by its (unique) name.
// replacement is done for fast access. 

// API:
// object(
//   tileName: object{
//     src: (relative) url of image
//   },
//   ...
// )
var Tiles = {
	"grass": {
		src: 'img/tiles/grass.png'
	},
	"road": {
		src: 'img/tiles/road.png'
	},
	"road-left": {
		src: 'img/tiles/road-left.png'
	},
	"road-right": {
		src: 'img/tiles/road-right.png'
	},
	"water": {
		src: 'img/tiles/water.png'
	},
	"tree": {
		src: 'img/tiles/tree.png'
	}
};
