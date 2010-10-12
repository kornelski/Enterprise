// base class for any object in the game

var GameObj = function() {
	// DONT DO ANYTHING IN THIS CONSTRUCTOR THAT DOESNT ONLY AFFECT THIS OBJECT
	// thanks ^^
	
	// read-only. use setOrigin
	// (why is this read only?)
  this.origin = {x:0,y:0};
  // should the velocity be read-only as well?
  this.velocity = {x:0,y:0};
  // and the friction...?
  this.friction = {x:0,y:0};
}

GameObj.prototype = {
  game: null, // reference to governing game
  screenZIndex: 0, // this is perf trick, see Game.objects
	
	origin: null, // position of this object
	velocity: null, // speed of this object
	friction: null, // multiplier to the velocity (usually friction, but could just as well be accelleration)
  
	model: null, // animation state (graphic model)
	imgCache: {}, // for any sprite image source that's being encountered, one image object should be put in here (prototype). key is url
	
	solid: true, // other solids collide with this object
	
	opacity: 1.0, // fully visible
	decayRate: 1.0, // the speed at which the opacity drops (multiplier to the opacity!)
	
	ttl: 0, // time until the object should disappear
	
	collision: function(obj) {
		// when this object collides with another object
  },
	
	frame: function() {
    // game logic per frame
    // subclasses overrides it	    
  },
	
  setOrigin: function(x,y) {
  	if (typeof x == 'object') { // if object, assume {x:x,y:y}
  		Test.assert(arguments.length == 1, "why two arguments if the first is an object?");
  		this.origin.x = x.x;
  		this.origin.y = x.y;
  	} else {
  		Test.assert(typeof x == 'number' && typeof y == 'number', "parameter type fail");
	    this.origin.x=x;
			this.origin.y=y;
		}
    this.screenZIndex = this.origin.x + this.origin.y; // FIXME: mark objects as dirty for re-sort?
  },
 
  setModel: function(name) {
		this.model = new Model(Models[name]);
  },
	
0:0}
