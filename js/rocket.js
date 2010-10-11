
var Rocket = function() {
    GameObj.call(this);
	this.setModel('rocket');
}

Rocket.prototype = $.extend(new GameObj,{

    ttl: 100,
    
    frame: function() {
        this.ttl--;
        if (!this.ttl) {
            this.explode();
        } else if (Math.random() > 0.3) {
            var particle = new GameObj();
            particle.setModel('smoke');
            particle.solid = false;
            var len = 0.2+Math.random()/2;
            var v = {x:-this.velocity.x*len+Math.random()/4, y:-this.velocity.y*len+Math.random()/4};
            particle.velocity = v;
            particle.setOrigin(this.origin.x+v.x*2+Math.random()/2, this.origin.y+v.y*2+Math.random()/2);
            particle.frame = function(){
                this.opacity *= 0.9;
                this.velocity.x *= 0.88;
                this.velocity.y *= 0.88;
                if (Math.abs(this.velocity.x) + Math.abs(this.velocity.y) < 0.3) {
                    this.game.removeObject(this);
                }
            }
            
            this.game.addObject(particle);
        }
    },
    
    collision: function() {
        this.explode();
    },
    
    explode: function() {
                    
        for(var i=0; i < 10; i++) {
            var particle = new GameObj();
            particle.setModel((Math.random() > 0.2) ? 'explosion' : 'smoke');
            particle.velocity = {x:this.velocity.x/4+Math.random()*1, y:this.velocity.y/4+Math.random()*1}
            particle.setOrigin(this.origin.x + particle.velocity.x, this.origin.y + particle.velocity.y);
            var decayRate = 0.78 + Math.random()*0.06;
            particle.frame = function(){
                this.opacity *= decayRate;
                this.velocity.x *= 0.8;
                this.velocity.y *= 0.8;
                if (Math.abs(this.velocity.x) + Math.abs(this.velocity.y) < 0.001) {
                    this.game.removeObject(this);
                }
            }
            this.game.addObject(particle);
        }

        this.game.removeObject(this);

    },
    
0:0});
