// rocket launcher
Ownable.Weapon.RocketLauncher = function(){
	Ownable.Weapon.call(this);
};
Ownable.Weapon.RocketLauncher.prototype = $.extend(new Ownable.Weapon, {
	inventoryIcon: 'img/ownables/weapons/rocketlauncher_inv.png',
	ammoClass: 'rockets',
	ammoType: 'dumdum',
	rof: 2000,
	damageModifier: 0,
	speed: 0, // TOFIX: hrm
	accuracy: 0, // rockets just hit.
	spread: 0,
	tearPerUsage: 0,
	tear: 0,

	fire: function(start, point){
		Test.assert(start && point, "need a vector");
		Test.assert("x" in start && "y" in start && "x" in point && "y" in point, "should be points");
		Test.assert(typeof start.x == 'number' && typeof start.y == 'number' && typeof point.x == 'number' && typeof point.y == 'number', "and they be numbers");
		var arr = [];
		// fire a single rocket
		if (this.canFire() && this.hasAmmo()) {
			Test.assert(this.ammo, "If you have ammo, you should have ammo");
			Test.assert(this.ammo.count || Config.infiniteAmmoMode, "should have bullets left");
			var newPoint = this.applyAccuracy(start, point); // returns new point which (possibly) changes the vector slightly (or a lot)
			Test.assert(newPoint, "should return something viable...");
			Test.assert("x" in newPoint && "y" in newPoint, "actually, it should return a new point");
			Test.assert(newPoint != point, "a _new_ point");
			
			--this.ammo.count;
			// spawn a new rocket actor (TOFIX: let the ammo container do that)
		    var rocket = new Rocket;
		    rocket.setOrigin(start);
			point.z = 0; // TOFIX: (i think this needs to work as well?)
		    rocket.velocity = vector(start, point, 1.3+Math.random()/3);
			arr.push(rocket);
			// track rof
			this.lastFire = Date.now ? Date.now() : +new Date;
		}
		
		return arr;
	},

	toString: function(){
		return Ownable.Weapon.prototype.toString.call(this)+"[Rocket]";
	},
	
0:0});
