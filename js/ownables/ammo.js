// bullet containers. subclass of Ownable. Subclassed by various
// bullet objects. defines type, damage, (armor) penetration
// and number of bullets left. can be owned as an item or as part
// of a weapon (in which case it won't take up an additional
// inventory slot).

Ownable.Ammo = function(){
	// this constructor may only do stuff that affects this object directly!
	Ownable.call(this);
};
Ownable.Ammo.prototype = $.extend(new Ownable, {
	inventoryIcon: null, // http://antrepo4.com/image/iconFull3.jpg
	ammoClass: '', // class of ammo this ammo type belongs to
	ammoType: '', // type of ammo ("subclass")
	count: 0, // number of bullets
	damage: 0, // how much damage does this bullet do on impact?
	penetrating: false, // does this bullet penetrate (ignore) armor?

	hasAmmo: function(){
		return Config.infiniteAmmoMode || this.count > 0;
	},

	toString: function(){
		return Ownable.prototype.toString.call(this)+"[Ammo]";
	},
0:0});
// which of two given ammo's is considered better?
Ownable.Ammo.best = function(x,y){
	if (!x) return y;
	if (!y) return x;
	Test.assert(x instanceof Ownable.Ammo, "comparing ammo");
	Test.assert(y instanceof Ownable.Ammo, "comparing ammo");
	// TOFIX: of the two ammo's, return the best according to some criteria
	return x;
};
