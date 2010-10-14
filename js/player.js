
var Player = function(id) {
    GameObj.call(this);
	this.setModel('player');
	this.id = id;
	// flags are 1,2,4,8. used for selection
	this.flag = id+1;
	if (this.flag == 3) this.flag = 4;
	else if (this.flag == 4) this.flag = 8;
}

Player.prototype = $.extend(new GameObj,{
	cls: 'Player',
    id: null, // id of this player (tied to hud), 1-4
    flag: null, // flag for this player for selection, 1,2,4,8
    
	health: 100,
	
	state: null, // movement state
    walkingSpeed: Config.playerWalkSpeed,
    walkDestination: null,
    
    frame: function() {
        if ('walking' == this.state) {

            if (Math.abs(this.origin.x - this.walkDestination.x) <= this.walkingSpeed &&
                Math.abs(this.origin.y - this.walkDestination.y) <= this.walkingSpeed) {
                    this.state = null;
                    this.velocity={x:0,y:0}
                    this.model.stopAnimator();
            } else {
            
                this.velocity = vector(this.origin,this.walkDestination,this.walkingSpeed);
            }
        }
    },
    
	walkTo: function(point){
	    if (this.state != 'walking') {
	        this.state = 'walking';
			//console.log("switching to walking");
			this.model.switchAnimator('walk');
        }
	    this.walkDestination = {x:point.x,y:point.y}
	},
	
	damage: function(dmg){
		this.health -= dmg;
		if (this.health <= 0) this.die();
	},
	
	die: function(){
		this.model.switchAnimator('death');
		this.solid = false;
	},
	
	fire: function(point) {
	    var rocket = new Rocket();
	    rocket.setOrigin(this.origin.x,this.origin.y);
	    rocket.velocity = vector(this.origin,point,1.3+Math.random()/3);
	    this.game.addObject(rocket);
    },
	
	toString: function(){
		return GameObj.prototype.toString.call(this)+"["+this.id+"]";
	},
0:0});
