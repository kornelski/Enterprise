// smoke, fire, explosions, whatever. like from rockets
// particles are side effects, cannot be touched and do not interact
// they slowly disappear over time

var Particle = function(origin, velocity, decaySpeed, friction, modelName) {
  GameObj.call(this);
  
  Test.assert(typeof modelName == 'string', 'model should be a string');
  Test.assert(typeof origin == 'object', 'origin should be an object');
  Test.assert(typeof velocity == 'object', 'velocity should be an object');
  Test.assert(typeof decaySpeed == 'number', 'decayspeed should be an object');
  Test.assert(typeof friction == 'object', 'friction should be an object');
  
	this.setModel(modelName);
	this.setOrigin(origin);
	// TODO: can i safely replace the object? or wot
	this.velocity.x = velocity.x;
	this.velocity.y = velocity.y;
	this.decaySpeed = decaySpeed;
	this.friction.x = friction.x;
	this.friction.y = friction.y;
}

Particle.prototype = $.extend(new GameObj,{
	solid: false,
	
  frame: function() {
    this.opacity *= this.decaySpeed;
    this.velocity.x *= this.friction.x;
    this.velocity.y *= this.friction.y;
    // TODO: should this be a callback to determine whether this should be removed?
    // just speed doesnt seem to cut it :p maybe opacity is much better. or, the callback.
    if (Math.abs(this.velocity.x) + Math.abs(this.velocity.y) < 0.3) {
      this.game.removeObject(this);
    }
  },
  
0:0});
