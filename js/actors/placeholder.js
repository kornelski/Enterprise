// this placeholder is an object to allow animations of removed actors
// like death animations or corpses. the object doesnt interact with
// the environment should maybe be merged with particle

var Placeholder = function(origin, modelName, animatorName) {
	Actor.call(this);
	Test.assert(typeof modelName == 'string', 'model should be a string');
	Test.assert(typeof origin == 'object', 'origin should be an object');

	this.setOrigin(origin);
	this.setModel(modelName);
	// start the animation
	if (animatorName) this.model.switchAnimator(animatorName);
};

Placeholder.prototype = $.extend(new Actor,{
	cls: 'Placeholder',
	solid: false,
0:0});
