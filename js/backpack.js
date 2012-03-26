var Backpack = function(type){
	Test.assert(type, "should receive a type");
	Test.assert(Backpack[type], "Backpack should exist");
	Test.assert(Backpack[type].name, "Backpack should have a name");
	// DONT DO ANYTHING IN THIS CONSTRUCTOR THAT DOESNT ONLY AFFECT THIS OBJECT
	// thanks ^^
	var bp = Backpack[type];
	Test.assert(bp, 'bp exists');
	Test.assert(bp.name, 'bp has name');
	Test.assert(bp.area, 'bp is 2d');
	Test.assert('weight' in bp, 'bp has weight');
	Test.assert('maxItems' in bp, 'bp can only hold this many items');
	Test.assert('maxWeight' in bp, 'bp can only hold this much weight');
	// ok. copy properties
	$.extend(this, bp);
	
	this.maxCells = bp.area.width*bp.area.height;
	this.items = new Array(this.maxCells); // actual container
	for (var i=0; i<this.maxCells; ++i) this.items[i] = null; // init (indexOf does strict type checking, we check for null and not undefined)
};
Backpack.prototype = {
	name: '', // name also determines url of img to use
	area: '', // actual area in image usable as backpack
	weight: 0, // how heavy is the bag itself?
	maxItems: 0, // how many items may this backpack contain?
	maxWeight: 0, // how many weight units may this backpack contain?
	maxCells: 0, // number of cells this backpack has (same as maxItems..? probably. but never less than maxItems)
	
	// last position of backpack
	x:10,
	y:10,
	
	area:null, // area of usable content within image
	
	items: null, // array with holes! length is always this.maxCells, but some cells may be null. this is the actual storage, left to right, top to bottom.
	
	add: function(ownable){
		Test.assert(ownable instanceof Ownable, "you can only own ownables; "+ownable);
		Test.assert(this.hasRoom(), "should have room for it");
		var index = this.pos(null);
		this.items[index] = ownable;
	},
	remove: function(ownable){
		Test.assert(ownable, "you can only remove ownables");
		Test.assert(this.has(ownable), "You can only remove that which you have");
		var index = this.items.indexOf(ownable);
		this.items[index] = null;
	},
	
	hasRoom: function(){
		return this.has(null);
	},
	has: function(ownable){
		var pos = this.pos(ownable);
		return pos >= 0 && pos < this.area.width * this.area.height;
	},
	pos: function(ownable){
		return this.items.indexOf(ownable);
	},
	
	getBestWeapon: function(){
		var lastWeapon = null;
		for (var i=0; i<this.items.length; ++i) {
			if (this.items[i] && this.items[i] instanceof Ownable.Weapon) {
				lastWeapon = Ownable.Weapon.best(lastWeapon, this.items[i]);
			}
		}
		return lastWeapon;
	},
	getBestAmmo: function(ammoClass){ // only return ammo of given class
		var lastAmmo = null;
		for (var i=0; i<this.items.length; ++i) {
			if (this.items[i] && this.items[i] instanceof Ownable.Ammo && this.items[i].ammoClass == ammoClass) {
				lastAmmo = Ownable.Ammo.best(lastAmmo, this.items[i]);
			}
		}
		return lastAmmo;
	},
	
0:0};

Backpack.standard = {
	name:'standard',
	imgUrl:'img/backpacks/standard.png',
	area: {x:53,y:120,width:6,height:6},
	weight:3,
	maxItems:10,
	maxWeight:20
};
Backpack.army = {
	name:'army',
	imgUrl:'img/backpacks/army.png',
	area: {x:73,y:43,width:6,height:13},
	weight:5,
	maxItems:20,
	maxWeight:50
};
Backpack.hike = {
	name:'hike',
	imgUrl:'img/backpacks/hike.png',
	area: {x:102,y:22,width:7,height:15},
	weight:1,
	maxItems:5,
	maxWeight:10
};
	