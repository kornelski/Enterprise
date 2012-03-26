// Any item that can be found or used in the game is an Ownable
// This is an interface class that implements certain generic
// traits for these items. Item was a too generic sounding name,
// but could have been the name for this class :)
// This class is subclassed by (at least) Ownable.Weapon
var Ownable = function(){
	// this constructor may only do stuff that affects this object directly!
};
Ownable.prototype = {
	owner: null, // player or enemy to own this object
	inventoryIcon: null, // set by sub-sub class. represents this item in the inventory (backpack). 25x25px

	toString: function(){
		return "Ownable";
	},
0:0};
