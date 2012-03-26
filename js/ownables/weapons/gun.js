// simple gun
Ownable.Weapon.Gun = function(){
	Ownable.Weapon.call(this);
};
Ownable.Weapon.Gun.prototype = $.extend(new Ownable.Weapon, {
	inventoryIcon: 'img/ownables/weapons/gun_inv.png',
	ammoClass: 'bullets',
	ammoType: 'gunbullets',
	rof: 300, // fire once per second
	damageModifier: 0, // just a gun
	speed: 0, // instant TODO: really?
	accuracy: 7, // guns dont have a very long range
	spread: 1.5, // but they do okay
	tearPerUsage: 0, // guns dont wear down
	tear: 0,

	fire: function(start, point){
		Test.assert(start && point, "need a vector");
		Test.assert("x" in start && "y" in start && "x" in point && "y" in point, "should be points");
		Test.assert(typeof start.x == 'number' && typeof start.y == 'number' && typeof point.x == 'number' && typeof point.y == 'number', "and they be numbers");
		// fire a single bullet
		if (this.canFire() && this.hasAmmo()) {
			Test.assert(this.ammo, "If you have ammo, you should have ammo");
			Test.assert(this.ammo.count || Config.infiniteAmmoMode, "should have bullets left");
			var newPoint = this.applyAccuracy(start, point); // returns new point which (possibly) changes the vector slightly (or a lot)

			Test.assert(newPoint, "should return something viable...");
			Test.assert("x" in newPoint && "y" in newPoint, "actually, it should return a new point");
			Test.assert(newPoint != point, "a _new_ point");
			--this.ammo.count;
			this.lastFire = Date.now ? Date.now() : +new Date;
			return [{start:start, point:newPoint}];
		}
		return [];
	},

	toString: function(){
		return Ownable.Weapon.prototype.toString.call(this)+"[Gun]";
	},
	
0:0});
