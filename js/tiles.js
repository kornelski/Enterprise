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
	5: {
		src: 'img/tiles/tile5.png',
		collides: true
	},
	9: {
		src: 'img/tiles/tile9.png',
		collides: true
	},
	8: {
		src: 'img/tiles/tile8.png',
		collides: true
	},
	14: {
		src: 'img/tiles/tile14.png',
		collides: true
	},
	10: {
		src: 'img/tiles/tile10.png',
		collides: true
	},
	11: {
		src: 'img/tiles/tile11.png',
		collides: true
	},
	12: {
		src: 'img/tiles/tile12.png',
		collides: true
	},
	13: {
		src: 'img/tiles/tile13.png',
		collides: true
	},
	19: {
		src: 'img/tiles/tile19.png',
		collides: true
	},
	31: {
		src: 'img/tiles/tile31.png',
		collides: true
	},

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
		src: 'img/tiles/water.png',
		collides: true
	},
	"tree": {
		src: 'img/tiles/tree.png',
		collides: false
	},
	"blood": {
		src: 'img/tiles/blood.png'
	},

	"dirt0": {
		src: 'img/tiles/dirt0.png'
	},
	"dirt1": {
		src: 'img/tiles/dirt1.png'
	},
	"dirt2": {
		src: 'img/tiles/dirt2.png'
	},
	"dirt3": {
		src: 'img/tiles/dirt3.png'
	},
	"dirt4": {
		src: 'img/tiles/dirt4.png'
	},
	"dirt5": {
		src: 'img/tiles/dirt5.png'
	},
	"dirt6": {
		src: 'img/tiles/dirt6.png'
	},
	"dirt7": {
		src: 'img/tiles/dirt7.png'
	},
	"brick0": {
		src: 'img/tiles/brick0.png',
		collides: true
	},
	"brick1": {
		src: 'img/tiles/brick1.png',
		collides: true
	},
	"wall": {
		src: 'img/tiles/wall.png',
		collides: true
	},
	"cactus": {
		src: 'img/tiles/cactus.png',
		collides: true
	}

};
