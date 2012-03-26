// weapon is the class that defines a weapons behavior.
// it is not meant to be the class that gets drawn on screen
// for that, we should use a generic class like Usables which
// spawn specific classes as objects. It is not an Actor! This object is
// Inventoryable, Holdable or Ownable or whatever the interface will be called
// The weapon class is probably a super class implementing some
// generic things for weapons, whereas subclass defines behavior
// and models specific to that weapon.

Ownable.Weapon = function(){ // extends Ownable
	// this constructor may only do stuff that affects this object directly!
	Ownable.call(this);


};

Ownable.Weapon.prototype = $.extend(new Ownable,{
	// override in weapon subclass
	ammoType: '', // what kind of ammo can this weapon fire? if this contains the name of a superclass (ammoClass), this weapon fires all bullets for that class.
	damageModifier: 0, // modifies the damage of the ammo being used (see also ammo.damage, see also the modifiers for this weapon)
	rof: 0, // what's the delay between shots? (in ms)
	speed: 0, // how fast do bullets move? (0 = instant), in cell units
	accuracy: 0, // distance at which spread should be applied (shorter is less accurate). TODO: maybe weapon tear could influence this?
	spread: 0, // trajectory changer. when firing, the given vector is changed course by this much randomness at length=accuracy of the vector TODO: maybe weapon tear could influence this?
	tearPerUsage: 0, // (?) how much damage does this weapon take when you use it?
	tear: 0, // (?) mimic wear and tear. influenced by tearPerUsage and when the owner takes damage. more tear means worse weapon.

	// interface
	lastFire: 0, // the last time this weapon was fired (to throttle for rof)
	fire: null, // when the owner fires, this gets called with two points; start and point. it should return an array containing zero or more objects with vector (bullet trajectories)
	ammo: null, // the container responsible for tracking ammo (current ammo left is checked by asking this container)
	heat: 0, // TODO: a weapon should be less accurate as it gets warmer (with an upper limit). this can be important for high rof weapons like machine guns
	modifiers: null, // array of Modifier-s that modify this weapon to influence properties (

	// change vector by applying accuracy and spread
	applyAccuracy: function(start, point){ // TOFIX: it's not properly taking the length for distance. i kept screwing up the A^2+B^2=C^2 stuff somehow. This works but it's less "accurate" forasfar as the distance at which the spread is applied.
		// accuracy tells us at which distance from point spread should be applied
		// first get the point so the length of start-point is accuracy
		var dx = point.x - start.x;
		var dy = point.y - start.y;

		// now given the coefficient (dx,dy), where would point accuracy be?
		var accPoint;
		if (this.accuracy != 0 && this.spread != 0) {
			Test.assert(this.accuracy != 0, "accuracy cannot be zero at this point");
			var unit = (this.accuracy)/(Math.abs(dx)+Math.abs(dy));
			var px = (Math.abs(unit * dx)) * (dx<0?-1:1);
			var py = (Math.abs(unit * dy)) * (dy<0?-1:1);
			accPoint = {x:start.x+px, y:start.y+py};
			// spread tells us how much the path may change, pending the random factor
			// this.spread is the radius, can be positive or negative
			Test.assert(this.spread != 0, "spread may not be zero at this point");
			accPoint.x += (Math.random()*(this.spread*2))-this.spread;
			accPoint.y += (Math.random()*(this.spread*2))-this.spread;
		} else {
			accPoint = {x:point.x, y:point.y}; // create new object
		}
		// now return the new point, which will be different from where you clicked
		// the path will be, at least at start, be minorly changed from tue original
		// the further away from the start you get, the more changed the path becomes

		return accPoint;
	},

	setAmmo: function(ammo){
		Test.assert(ammo instanceof Ownable.Ammo, "ammo should be ammo");
		var old;
		if (this.ammo && this.ammo.hasAmmo()) old = this.ammo; // preserve current ammo if it has bullets left, discard it if all bullets are gone
		this.ammo = ammo;
		return old;
	},
	hasAmmo: function(){
		if (this.ammo) {
			return this.ammo.hasAmmo();
		}
		// TODO: check modifier that may tell weapon it never runs out of ammo?
		return false;
	},
	removeAmmo: function(){
		var ammo = this.ammo;
		this.ammo = null;
		return ammo;
	},

	canFire: function(){ // TOFIX: now could be passed on as argument, preventing +new date. or use a "global" frame start time
		if (Config.noRateOfFire) return true;
		// a weapon can fire if the time passed since last shot
		// is more than the rof for this weapon
		var now = Date.now ? Date.now() : +new Date;
		return ((now - this.lastFire) > this.rof);
	},

	currentDamage: function(){
		var dmg = 0;
		if (this.ammo) {
			dmg = this.ammo.damage;
			// TODO: apply weapon/modifier modifiers
		}
		return dmg;
	},

	penetratesArmor: function(){
		return this.ammo && this.ammo.penetrating;
	},

	toString: function(){
		return Ownable.prototype.toString.call(this)+"[Weapon]";
	},

0:0});

// which of the two given weapons is better?
Ownable.Weapon.best = function(x,y){
	if (!x) return y;
	if (!y) return x;
	// TOFIX: return the best weapon according to some factor. damage seems most obvious, but rof and bullets per shot make dot (damage over time) more important.
	return x;
};
