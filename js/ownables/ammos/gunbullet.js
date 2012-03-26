// bullets for the gun
Ownable.Ammo.GunBullet = function(){
	Ownable.Ammo.call(this);
};
Ownable.Ammo.GunBullet.prototype = $.extend(new Ownable.Ammo, {
	ammoClass: 'bullets', // class of ammo this ammo type belongs to
	ammoType: 'gunbullet', // type of ammo ("subclass")
	inventoryIcon: 'img/ownables/ammo/gunbullet_inv.png',
	count: 20, // number of bullets
	damage: 15, // how much damage does this bullet do on impact?
	penetrating: false, // does this bullet penetrate (ignore) armor?

	toString: function(){
		return Ownable.Ammo.prototype.toString.call(this)+"[GunBullet]";
	},
	
0:0});
