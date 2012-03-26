// shotgun shoots several small damage bullets
Ownable.Weapon.Shotgun = function(){
	Ownable.Weapon.call(this);
	Test.assert(this.canFire, "should inherit this method...");
};
Ownable.Weapon.Shotgun.prototype = $.extend(new Ownable.Weapon, {
	inventoryIcon: 'img/ownables/weapons/shotgun_inv.png',
	ammoClass: 'hagel',
	ammoType: 'shotgunbullets',
	rof: 800, // fire once per two second
	damageModifier: 0, // just a gun
	speed: 0, // instant TODO: really?
	accuracy: 5.0, // shotguns have a very short range
	spread: 1.0,
	
	bulletsPerShot: 5,
	
	tearPerUsage: 0, // shotguns dont wear down (TOFIX)
	tear: 0,

	fire: function(start, point){
		// fire a couple of bullets
		var arr = [];
		if (this.canFire()) { // either it fires ten bullets or none at all
			var n = this.bulletsPerShot;
			while (n-- && this.hasAmmo()) {
				Test.assert(this.ammo, "If you have ammo, you should have ammo");
				Test.assert(this.ammo.count || Config.infiniteAmmoMode, "should have bullets left");
				var newPoint = this.applyAccuracy(start, point); // returns new point which (possibly) changes the vector slightly (or a lot)
				Test.assert(newPoint, "should return something viable...");
				Test.assert(newPoint !== point, "these objects should not be the same or you are messing the the same path repeatedly");
				--this.ammo.count;
				arr.push({start:start, point:newPoint});
			}
			this.lastFire = Date.now ? Date.now() : +new Date;
		}
		return arr;
	},

	toString: function(){
		return Ownable.Weapon.prototype.toString.call(this)+"[Shotgun]";
	},
	

0:0});
