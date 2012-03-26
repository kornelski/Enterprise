// base class for any object in the game

var Actor = function() {
	// DONT DO ANYTHING IN THIS CONSTRUCTOR THAT DOESNT ONLY AFFECT THIS OBJECT
	// thanks ^^

	// read-only. use setOrigin
	// (why is this read only?)
  this.origin = {x:0,y:0,z:0};
  // should the velocity be read-only as well?
  this.velocity = {x:0,y:0,z:0};
  // and the friction...?
  this.friction = {x:1,y:1,z:1};
  
  // give them a standard backpack
  this.setBackpack(new Backpack(Math.random()<.3?'hike':Math.random()<.5?'army':'standard'));
}

Actor.prototype = {
	cls: 'Actor',
	game: null, // reference to governing game, set from Game.addActor
	screenZIndex: 0, // this is perf trick, see Game.actors

	origin: null, // position of this object
	velocity: null, // speed of this object
	friction: null, // multiplier to the velocity (usually friction, but could just as well be accelleration)

	model: null, // animation state (graphic model)

	solid: true, // other solids collide with this object

	opacity: 1.0, // fully visible
	decayRate: 1.0, // the speed at which the opacity drops (multiplier to the opacity!)

	ttl: 0, // time until the object should disappear

	health: 0, // amount of damage this object can absorbs before it "dies"

	backpack: null, // backpack object for this actor. contains ownables for this character

	collision: function(obj) {
		// when this object collides with another object
  	},

	damage: function(dmg){
		Test.assert(typeof dmg == 'number', "damage should be a number");
		Test.assert(dmg >= 0, "i guess there's no such thing as negative damage?");
		// when something damages this object, this method is called with the amount of damage dealt
		this.health -= dmg;
		if (this.health <= 0) this.die();
	},

	die: function(){
		// when the hitpoints run out due to some event
	},

	frame: function() {
		// game logic per frame
		// subclasses overrides it
	},

	setOrigin: function(x,y,z) {
		if (typeof x == 'object') { // if object, assume {x:x,y:y}
			Test.assert(arguments.length == 1, "why two arguments if the first is an object?");
			this.origin.x = x.x;
			this.origin.y = x.y;
			this.origin.z = x.z;
		} else {
			Test.assert(typeof x == 'number' && typeof y == 'number' && typeof z == 'number', "parameter type fail");
			this.origin.x=x;
			this.origin.y=y;
			this.origin.z=z;
		}
		Test.reject(isNaN(this.origin.z),"no imaginary z please " + this.origin.z);

		this.screenZIndex = this.origin.x + this.origin.y; // FIXME: mark objects as dirty for re-sort?
	},

	setModel: function(name) {
		Test.assert(name in Models, "Model ["+name+"] does not exist...");
		this.model = new Model(Models[name]);
		this.preload(); // now cache and set image
	},

	// cache sprite from model
	// sets this.model.img to the sprite
	preload: function(){
		Test.assert(this.model, 'dont preload if no model is set');
		Test.assert(this.model.src, "every model needs a sprite");

		if (this.model.src in LoadQueue.imageCache) this.model.img = LoadQueue.imageCache[this.model.src];
		else Test.die("Image should have been preloaded: "+this.model.src+" "+LoadQueue.imageCache[this.model.src]);
		Test.assert(this.model.img, "expecting an image now");
	},

	setBackpack: function(bp){
		this.backpack = bp;
	},

	toString: function(){
		return "Actor["+this.cls+"]";
	},
0:0}
