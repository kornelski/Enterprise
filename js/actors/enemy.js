// an enemy looks like a player, for now
// x and y are unit sized initial position on the map
Actor.Enemy = function(x,y,config) {
	Test.assert(config, "expecting config for enemy (should be property of actors obj in maps.js)");
    Actor.call(this);
	this.setModel('player');
	this.setOrigin(x,y,0); // FIXME: read ground level?

    this.walkingSpeed = Config.enemyBaseWalkSpeed + Config.enemyBaseWalkSpeed*Math.random();

	// copy all properties from the config to this object
	// will fill in the api from the prototype
	$.extend(this, config);

	// TOFIX: ugly hack. should probably get its own model eventually
	this.model.src = this.getSpriteSrc();
	this.preload(); // actually get the image and set it to use for this obj
};

Actor.Enemy.prototype = $.extend(new Actor,{
	game: null, // set from Game.addActor
	cls: 'Enemy',

    height: 1.8, // how tall the enemy is

	enemyType: null, // sentry, patrol, random
	enemyState: null, // normal, agressive
	lastKnownClosestPlayerLocation: null, // whenever a player is close to this enemy it remembers the location and moves/fires to it
	lastKnownPositionTime: 0, // for the cooldown timer, how long ago was the enemy spotted?
	waypoints: null, // for patrol, an array of waypoints to move to. for sentry, the static point to stay at
	currentWaypoint: 0, // for patrol, an index on waypoints array while on patrol.
	minimalDistance: 10, // distance before going agro
	cooldownTime: 3000, // agro cooldown period

	attackPowerMelee: 5,

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
				this.lastKnownClosestPlayerLocation = {x:report.player.origin.x, y:report.player.origin.y, z:report.player.origin.z};
				this.lastKnownPositionTime = this.game.frameTimeStart;
				// skip regular duty. the next if will start agressive mode
			} else {
				// do normal duty

				// now do stuff for specific enemy types
				if (this.enemyType == 'patrol') {
					// walk to target waypoint

					if (vector.distance(this.waypoints[this.currentWaypoint], this.origin) < 1) {
						this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length; // next waypoint
					}
					// move to that waypoint
					this.walkTo(this.waypoints[this.currentWaypoint]);

				} else if (this.enemyType == 'sentry') {
					// maybe turn around? make sure you're near your sentry position
					if (vector.distance(this.waypoints[0], this.origin) > 1) this.walkTo(this.waypoints[0]);
				} else if (this.enemyType == 'random') {
					// walk to random position
					// either when you're close to the last target or when it's been too long
					// since you've updated the target (in case you get stuck) or when no target
					// is known (init)
					var now = this.game.frameTimeStart;
					if (!this.lastKnownClosestPlayerLocation ||
						vector.distance(this.lastKnownClosestPlayerLocation, this.origin) < 1 ||
						now - this.lastKnownPositionTime > 5000
					) {
						// create a new target, randomly up to 10 cells from current position
						this.lastKnownClosestPlayerLocation = {
							x:this.origin.x + (Math.random() * 20) - 10,
							y:this.origin.y + (Math.random() * 20) - 10
						};
						if (this.lastKnownClosestPlayerLocation.x < 0) this.lastKnownClosestPlayerLocation.x = 0;
						if (this.lastKnownClosestPlayerLocation.y < 0) this.lastKnownClosestPlayerLocation.y = 0;
						if (this.lastKnownClosestPlayerLocation.x >= this.game.map.width()) this.lastKnownClosestPlayerLocation.x = this.game.map.width();
						if (this.lastKnownClosestPlayerLocation.y >= this.game.map.height()) this.lastKnownClosestPlayerLocation.y = this.game.map.height();
						this.lastKnownPositionTime = now;
					}
					// and go to it
					this.walkTo(this.lastKnownClosestPlayerLocation);
				} else {
					Test.die("Unknown enemy type: "+this.enemyType);
				}
			}
		}

		if (!Config.invisibleMode && this.enemyState == 'agressive') {
			// is a player still nearby? if so, target the closest player
			if (report.distance < this.minimalDistance) {
				this.lastKnownClosestPlayerLocation = {x:report.player.origin.x, y:report.player.origin.y}; // make copy, the object is recycled
				this.lastKnownPositionTime = this.game.frameTimeStart;
			} else {
				// are still in cooldown period?
				if (this.game.frameTimeStart - this.lastKnownPositionTime < this.cooldownTime) {
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
		} else if (this.enemyState == 'agressive') {
			this.enemyState == 'normal';
		}
	},

	// returns the distance and player that's closest to this enemy
	closestPlayer: function(game){
		var min = Infinity;
		var player = null;
		for (var i=0; i<game.players.length; ++i) {
			var current = vector.distance(game.players[i].origin, this.origin);
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
                  this.velocity={x:0,y:0,z:0}
                  this.model.stopAnimator();
          } else {
              this.velocity = vector(this.origin,this.walkDestination,this.walkingSpeed);
          }
      }
  },

	collision: function(obj){
		if (obj instanceof Actor.Player) {
			// cant hit dead people
			// cant walk into them either...
			var pos = -1;
			if (obj.health <= 0) pos = this.game.toRemove.indexOf(obj);
			Test.assert(obj.health > 0 || pos > -1, "you cant touch dead people ["+obj+"] ["+obj.health+"]["+pos+"]");
			if (pos == -1) obj.damage(this.attackPowerMelee);
		}
	},


	walkTo: function(point){
	    if (this.state != 'walking') {
	    	this.state = 'walking';
			this.model.switchAnimator('walk');
      	}
	    this.walkDestination = {x:point.x,y:point.y,z:point.z||0}// FIXME: read ground level?
	},


/*
	walkTo: function(point){
	    if (this.state != 'walking') {
	        this.state = 'walking';
			this.model.switchAnimator('walk');
        }
        var grid = this.game.map.cellGrid;
        if (grid[Math.round(point.y)] && grid[Math.round(this.origin.y)]) {
	        var endCell = grid[Math.round(point.y)][Math.round(point.x)];
	        var startCell = grid[Math.round(this.origin.y)][Math.round(this.origin.x)];

	        this.walkPath = astar.search(grid, startCell, endCell);

	        this.walkToNextPathWaypoint();
	    }
	},

	walkToNextPathWaypoint: function() {
	    var cell = this.walkPath.pop();
	    this.walkDestination = cell ? {x:cell.x+0.5, y:cell.y+0.5} : this.origin;
    },
*/
	fire: function(point) {
	    var rocket = new Rocket();
	    rocket.setOrigin(this.origin);
	    rocket.velocity = vector(this.origin,point,1.3+Math.random()/3);
	    this.game.addActor(rocket);
    },

	damage: function(dmg){
		this.health -= dmg;
		if (this.health <= 0) this.die();
	},

	die: function(){
		//this.model.switchAnimator('death');
		//this.solid = false;
		this.game.removeActor(this);
		// replace by placeholder that doesnt do anything but the
		// death animation and painting the corpse afterwards
		var p = new Placeholder(this.origin, 'player', 'death');
		p.model.src = this.getSpriteSrc();
		p.preload(); // actually get the image and set it to use for this obj
		this.game.addActor(p);
	},

	// get specific sprite for this type of enemy
	getSpriteSrc: function(){
		// TOFIX: ugly hack. should probably get its own model eventually
		if (this.enemyType == 'sentry') return 'img/characters/enemy-sentry.png';
		if (this.enemyType == 'patrol') return 'img/characters/enemy-patrol.png';
		return 'img/characters/enemy.png';
	},

	toString: function(){
		return "Enemy["+this.enemyType+","+this.health+"]";
	},

0:0});
