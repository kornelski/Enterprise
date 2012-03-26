// bullets for the gun
Ownable.Ammo.DumDum = function(){
	Ownable.Ammo.call(this);
};
Ownable.Ammo.DumDum.prototype = $.extend(new Ownable.Ammo, {
	ammoClass: 'rockets', // class of ammo this ammo type belongs to
	ammoType: 'dumdum', // type of ammo ("subclass")
	inventoryIcon: 'img/ownables/ammo/dumdum_inv.png',
	count: 4, // number of bullets
	damage: 50, // how much damage does this bullet do on impact?
	penetrating: false, // does this bullet penetrate (ignore) armor?

	toString: function(){
		return Ownable.Ammo.prototype.toString.call(this)+"[dumdum]";
	},
	
0:0});
