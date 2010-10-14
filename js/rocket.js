
var Rocket = function() {
  GameObj.call(this);
	this.setModel('rocket');
}

Rocket.prototype = $.extend(new GameObj,{

  ttl: 100, // if the rocket doesn't explode within this time, knife it
  
  frame: function() {
	this.ttl--;
	if (!this.ttl) {
		this.explode();
	} else if (Math.random() > 0.3) { // show puff?
		var len = 0.2+Math.random()/2;
		var velocity = {x:-this.velocity.x*len+Math.random()/4, y:-this.velocity.y*len+Math.random()/4};
		var origin = {x:this.origin.x+velocity.x*2+Math.random()/2, y:this.origin.y+velocity.y*2+Math.random()/2};
		var friction = {x:0.90, y:0.90};
		var decaySpeed = 0.90;
		var p = new Particle(origin, velocity, decaySpeed, friction, 'smoke');
		this.game.addObject(p);
		Test.assert(p.game, "should have game...");
	}
  },
  
  collision: function(o) {
  	if (o && o instanceof Enemy) {
		o.damage(20);
	}
    this.explode();
  },
  
  explode: function() {
    for(var i=0; i < 10; i++) {
		var velocity = {x:this.velocity.x/4+Math.random()*1, y:this.velocity.y/4+Math.random()*1};
		var origin = {x:this.origin.x + velocity.x, y:this.origin.y + velocity.y};
		var decaySpeed = 0.78 + Math.random() * 0.06;
		var friction = {x:0.8, y:0.8};
		var modelName = (Math.random() > 0.2) ? 'explosion' : 'smoke';
    	var p = new Particle(origin, velocity, decaySpeed, friction, modelName);
    	this.game.addObject(p);
    	Test.assert(p.game, "should have game...");
    }
    // remove the rocket. only particles are left now
    this.game.removeObject(this);
  },
    
0:0});
