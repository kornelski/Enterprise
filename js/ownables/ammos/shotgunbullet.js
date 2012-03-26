// bullets for the gun
Ownable.Ammo.ShotgunBullet = function(){
	Ownable.Ammo.call(this);
};
Ownable.Ammo.ShotgunBullet.prototype = $.extend(new Ownable.Ammo, {
	ammoClass: 'hagel', // class of ammo this ammo type belongs to
	ammoType: 'shotgunbullet', // type of ammo ("subclass")
	inventoryIcon: 'img/ownables/ammo/shotgunbullet_inv.png',
	count: 100, // number of bullets
	damage: 5, // how much damage does this bullet do on impact?
	penetrating: false, // does this bullet penetrate (ignore) armor?

	toString: function(){
		return Ownable.Ammo.prototype.toString.call(this)+"[GunBullet]";
	},
	
0:0});
