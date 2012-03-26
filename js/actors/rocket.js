// TOFIX: rockets seem to go directly to the clicked point, rather then exploding when it collides (somethings bugged with their path, either way)
// TOFIX: collision detection with single tiles seems a little borked...
var Rocket = function() {
	Actor.call(this);
	this.setModel('rocket');
}

Rocket.prototype = $.extend(new Actor,{
	ttl: 20, // if the rocket doesn't explode within this time, knife it
	power: 20, // the damage this rocket deals. set from Ownable.Weapon.RocketLauncher
	frame: function() {
		this.ttl--;
		if (!this.ttl) {
			this.explode();
		} else if (Math.random() > 0.3) { // show puff?
			var len = 0.2+Math.random()/2;
			var velocity = {x:-this.velocity.x*len+Math.random()/4,
			                y:-this.velocity.y*len+Math.random()/4,
			                z:0};
			var origin = {x:this.origin.x+velocity.x*2+Math.random()/2,
			              y:this.origin.y+velocity.y*2+Math.random()/2,
			              z:this.origin.z};
			var friction = {x:0.90, y:0.90, z:0};
			var decaySpeed = 0.90;
			var p = new Particle(origin, velocity, decaySpeed, friction, 'smoke');
			this.game.addActor(p);
		}
	},

	collision: function(o) {
		if (o && o instanceof Actor.Enemy) o.damage(this.power);
		this.explode();
	},

	explode: function() {
		for(var i=0; i < 10; i++) {
			var velocity = {x:this.velocity.x/4+Math.random()*1, y:this.velocity.y/4+Math.random()*1, z:0};
			var origin = {x:this.origin.x + velocity.x, y:this.origin.y + velocity.y, z:this.origin.z};
			var decaySpeed = 0.78 + Math.random() * 0.06;
			var friction = {x:0.8, y:0.8, z:0.1};
			var modelName = (Math.random() > 0.2) ? 'explosion' : 'smoke';
			var p = new Particle(origin, velocity, decaySpeed, friction, modelName);
			this.game.addActor(p);
			Test.assert(p.game, "should have game...");
		}
		// remove the rocket. only particles are left now
		this.game.removeActor(this);
	},

0:0});
