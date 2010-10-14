// an enemy looks like a player, for now
// x and y are unit sized initial position on the map
var Enemy = function(x,y,config) {
	Test.assert(config, "expecting config for enemy (should be property of gameobjs obj in maps.js)");
    GameObj.call(this);
	this.setModel('player');
	this.setOrigin(x,y);
    
    this.walkingSpeed = Config.enemyBaseWalkSpeed + Config.enemyBaseWalkSpeed*Math.random();
	
	// copy all properties from the config to this object
	// will fill in the api from the prototype
	$.extend(this, config);

	// TOFIX: ugly hack. should probably get its own model eventually
	this.model.src = this.getSpriteSrc();
	this.preload(); // actually get the image and set it to use for this obj
};

Enemy.prototype = $.extend(new GameObj,{
	game: null, // set from Game.addObject
	cls: 'Enemy',
	enemyType: null, // sentry, patrol, random
	enemyState: null, // normal, agressive
	lastKnownClosestPlayerLocation: null, // whenever a player is close to this enemy it remembers the location and moves/fires to it
	lastKnownPositionTime: 0, // for the cooldown timer, how long ago was the enemy spotted?
	waypoints: null, // for patrol, an array of waypoints to move to. for sentry, the static point to stay at
	currentWaypoint: 0, // for patrol, an index on waypoints array while on patrol.
	minimalDistance: 10, // distance before going agro
	cooldownTime: 3000, // agro cooldown period
	
	attackPowerMelee: 0.5,
	
    // do something magical.
	// basically, enemies are either on sentry duty (meaning they dont walk)
	// or they are on patrol duty (meaning they'll walk to certain waypoints)
	// unless they are "provoked", when an enemy is close, then they'll try to
	// chase the enemy. this has a cooldown timer, so if the enemy is out of
	// range for a while, the ai should return to duty and ignore dangers.
	ai: function(game){
		Test.assert(this.enemyState == 'agressive' || this.enemyState == 'normal', 'only two enemy states...');
		var report = this.closestPlayer(game);
		if (this.enemyState == 'normal') {
			// first check to make sure no player is nearby
			if (report.distance < this.minimalDistance) {
				// player is close by!
				this.enemyState = 'agressive';
				this.lastKnownClosestPlayerLocation = report.player.origin; // TOFIX: is that object immutable..?
				this.lastKnownPositionTime = Date.Now ? Date.now() : +new Date;
				// skip regular duty. the next if will start agressive mode
			} else {
				// do normal duty
				
				// now do stuff for specific enemy types
				if (this.enemyType == 'patrol') {
					// walk to target waypoint
					
					if (vector(this.waypoints[this.currentWaypoint], this.origin).length < 1) {
						this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length; // next waypoint
					}
					// move to that waypoint
					this.walkTo(this.waypoints[this.currentWaypoint]);
					
				} else if (this.enemyType == 'sentry') {
					// maybe turn around? make sure you're near your sentry position
					if (vector(this.waypoints[0], this.origin).length > 1) this.walkTo(this.waypoints[0]);
				} else if (this.enemyType == 'random') {
					// walk to random position
					// either when you're close to the last target or when it's been too long
					// since you've updated the target (in case you get stuck) or when no target
					// is known (init)
					var now = (Date.now ? Date.now() : +new Date);
					if (!this.lastKnownClosestPlayerLocation || 
						vector(this.lastKnownClosestPlayerLocation, this.origin).length < 1 ||
						now - this.lastKnownPositionTime > 5000
					) {
						// create a new target, randomly 5 cells from current position
						this.lastKnownClosestPlayerLocation = {
							x:this.origin.x + (Math.random() * 10) - 5, 
							y:this.origin.y + (Math.random() * 10) - 5
						};
						this.lastKnownPositionTime = now;
					}
					// and go to it
					this.walkTo(this.lastKnownClosestPlayerLocation);
				} else {
					Test.die("Unknown enemy type: "+this.enemyType);
				}
			}
		}
		if (this.enemyState == 'agressive') {
			// is a player still nearby? if so, target the closest player
			if (report.distance < this.minimalDistance) {
				this.lastKnownClosestPlayerLocation = report.player.origin; // TOFIX: is that object immutable..?
				this.lastKnownPositionTime = Date.Now ? Date.now() : +new Date;
			} else {
				// are still in cooldown period?
				if ((Date.now?Date.now():+new Date)-this.lastKnownPositionTime < this.cooldownTime) {
					// continue to move to target
				} else {
					// return to normal mode (next frame)
					this.enemyState = 'normal';
				}
			}
			// are we still agressive?
			if (this.enemyState == 'agressive') {
				// yes, good, move in for the kill
				// move to target and kill
				this.walkTo(this.lastKnownClosestPlayerLocation);
			}
		}
	},
	
	// returns the distance and player that's closest to this enemy
	closestPlayer: function(game){
		var min = Infinity;
		var player = null;
		for (var i=0; i<game.players.length; ++i) {
			var current = vector(game.players[i].origin, this.origin).length;
			if (current < min) {
				min = current;
				player = game.players[i];
			}
		}
		return {distance:min, player:player};
	},

	state: null, // movement state
	walkingSpeed: Config.enemyBaseWalkSpeed,
	walkDestination: null,
    
	health: 100, // specific enemies may have more or fewer hp :)
	
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
	
	collision: function(obj){
		if (obj instanceof Player) {
			// cant hit dead people
			// cant walk into them either...
			Test.assert(obj.health > 0, "you cant touch dead people");
			obj.damage(this.attackPowerMelee); 
		}
	},
    
	walkTo: function(point){
		if (point.x < 0) point.x = 0;
		if (point.y < 0) point.y = 0;
		// TODO: other bounds :p
		
	    if (this.state != 'walking') {
	    	this.state = 'walking';
			this.model.switchAnimator('walk');
      	}
	    this.walkDestination = {x:point.x,y:point.y}
	},
	
	fire: function(point) {
	    var rocket = new Rocket();
	    rocket.setOrigin(this.origin.x,this.origin.y);
	    rocket.velocity = vector(this.origin,point,1.3+Math.random()/3);
	    this.game.addObject(rocket);
    },

	damage: function(dmg){
		this.health -= dmg;
		if (this.health <= 0) this.die();
	},
	
	die: function(){
		//this.model.switchAnimator('death');
		//this.solid = false;
		this.game.removeObject(this);
		// replace by placeholder that doesnt do anything but the 
		// death animation and painting the corpse afterwards
		var p = new Placeholder(this.origin, 'player', 'death');
		p.model.src = this.getSpriteSrc();
		p.preload(); // actually get the image and set it to use for this obj
		this.game.addObject(p);
	},
	
	// get specific sprite for this type of enemy
	getSpriteSrc: function(){
		// TOFIX: ugly hack. should probably get its own model eventually
		if (this.enemyType == 'sentry') return 'img/characters/enemy-sentry.png';
		if (this.enemyType == 'patrol') return 'img/characters/enemy-patrol.png';
		return 'img/characters/enemy.png';
	},
	
0:0});
