// actually just state for one map

var Game = function() {
	this.toAdd = []; // actors to be added end of frame
	this.toRemove = []; // actors to be removed at the end of the next frame

	// init these here, prototype will share their instances. future proofing.
	this.actors = [];
	this.players = [];
	this.enemies = [];

	this.map = Map.get(window.location.hash.length>4 ? "random" : Config.startMap);
	var actors = this.map.actors;
	for (var i=0; i<actors.length; ++i) {
		var obj = actors[i];
		switch (obj.type) {
			case 'enemy':
				this.addEnemy(new Actor.Enemy(obj.x, obj.y, obj.config));
				break;
			default: Test.die("Unknown object type: "+obj.type);
		}
	}

	Test.assert('spawnPoint' in this.map, "map must have spawn point "+this.map);
	Test.assert(this.map.spawnPoint.x > 0 || this.map.spawnPoint.y > 0, "spawn point 0,0 is useless");
	var size = this.map.squadSize;
	Test.assert(size >= 1 && size <= 4, "squad size is 1~4");
	for (var i=0; i<4; i++) {
		if (i < size) {
			this.addPlayer(new Actor.Player(i)); // create player
			$('#c'+(i+1))[0].className = 'selected character'; // show as selected
		} else {
			$('#c'+(i+1))[0].style.display = 'none';
		}
	}

	//this.walkPlayers(this.map.spawnPoint);
};

Game.prototype = {
    map: null, // the map object for the active game

    /** all actor-derived actors (sprites on screen)
     *
     * NB! Objects in this array must be sorted by screen y-coordinate
     * to ensure proper "z-index" when painted
     * every object has this.screenZIndex for sorting
     * keeping this array sorted is perf improvement
     */
    actors: null,
    players: null, // players are both in actors and players (note, not ordered by their id or flag! so the first player in array might be player #c3 in hud!)
	enemies: null, // like players, an array to track enemies (if it can be shot or killed or needs AI, it should go in here)

    toAdd: null, // array to hold elements to be added at the end of a frame
    toRemove: null, // array to hold elements to be removed at the end of a frame

	lastAiTime: 0, // last time the AI logic was called (we dont want to do this every frame)
	aiDelay: Config.aiDelay, // time between calls to the ai logic

	selectedCharacter: 1|2|4|8, // the currently active character(s), flags (1,2,4,8). all players selected by default at start (required or they're not placed on the map ;)

	crashTest: false, // testing whether game crashed between frames
	crashMessage: false, // shown crashed message?
	paused: false, // freeze the game?

	// queue of sounds to play
	sounds: [],

	// see Sound() constructor for details
	playSound: function(name, origin, velocity) {
	    Test.assert(name in Sounds,"unknown sound:"+name);

	    sounds.push(new Sound(Sounds[name], origin, velocity));
    },

	linesToDraw: [], // array of lines (in cell units) the game wants drawn (lasers, ai targets, debug, whatever). contains points (TODO: add colors?)

	getPlayerById: function(id){ // id is 0..3
		Test.assert(id >= 0 && id <= 3, "player id's range from 0 to 3, inclusive");
		if (this.players[0] && this.players[0].id == id) return this.players[0];
		if (this.players[1] && this.players[1].id == id) return this.players[1];
		if (this.players[2] && this.players[2].id == id) return this.players[2];
		if (this.players[3] && this.players[3].id == id) return this.players[3];

		return false;
	},

	toggleAllPlayers: function(){
		var alive = [];
		var selected = 0;
		// first get all living players and check how many of them are selected
		for (var i=0; i<this.players.length; ++i) {
			var p = this.players[i];
			if (p) { // dead players are removed so this player is alive
				alive.push(p);
				if (this.isSelected(p)) ++selected;
			}
		}
		// we select all polayers when not every player is currently selected, deselect otherwise
		var selectAll = selected != alive.length;
		// now de/select
		for (var i=0; i<alive.length; ++i) {
			var p = alive[i];
			// either we select all and the player is not selected,
			// or we deselect all and the player is selected (so x!=y)
			if (selectAll != this.isSelected(p)) $('#c'+(p.id+1)).click(); // click toggles
		}
	},

	isSelected: function(player){
		return !!(player.flag & this.selectedCharacter);
	},

	// instant
    movePlayers: function(point) {
        for(var i=0; i < this.players.length; i++) {
            if (this.isSelected(this.players[i])) this.players[i].setOrigin(point);
        }
    },

    // animated
    walkPlayers: function(point) {
        for (var i=0; i< this.players.length; ++i) {
			if (this.isSelected(this.players[i])) {
	            var row = Math.floor(i/4);

				this.players[i].walkTo({
				    x:point.x + (i&1 ? row*2*Math.random()+1.15 : 0),
				    y:point.y + (i&2 ? row*2*Math.random()+1.15 : 0)
				});
				//console.log("switching to walk now");
				this.players[i].model.switchAnimator('walk'); // will not switch if already doing this animation
			}
		}
    },
	// relative to current position
    walkPlayersRelative: function(vector) {
        for(var i=0; i < this.players.length; i++) {
			if (this.isSelected(this.players[i])) {
				var target = {x:this.players[i].origin.x+vector.x, y:this.players[i].origin.y+vector.y};
	            this.players[i].walkTo(target);
				this.players[i].model.switchAnimator('walk'); // will not switch if already doing this animation
			}
        }
    },

    allPlayersFire: function(point) {
        for (var i=0; i< this.players.length; ++i) {
			if (this.isSelected(this.players[i])) this.players[i].fire(point);
		}
    },

	// at frame time, this function actually fires the shot
	fireProjectile: function(start, point, damage, penetrating){
		// try to fire in the direction of point, relative from your current origin
		// determine map/edge impact point
		Test.assert(start && point, "need a line to fire");
		Test.assert("x" in start && "y" in start && "x" in point && "y" in point, "expecting two points");
		var end = this.firstTileCollision(start, point);
		end.z = start.z; // TODO: change z for true 3d stuff :)
		// determine victem, if any (runs through all enemies)
		var radius = 1;
		var target = this.firstEnemyOnLine(start, end, radius);
		// if target, deal damage
		if (target) target.damage(damage,penetrating);

		// add to lines to show...
		if (Config.drawShootLines) this.linesToDraw.push({start:start,end:end});
	},

    addPlayer: function(player) {
        this.players.push(player);
        this.addActor(player);
        player.setOrigin(this.map.spawnPoint.x+ Math.random(),this.map.spawnPoint.y + Math.random(),0); // FIXME: read ground level
        // TOFIX: proper inventory initialization
		var r = Math.random();
		var weapon, ammo;
		if (r < 0.3) {
			weapon = new Ownable.Weapon.Gun;
			ammo = new Ownable.Ammo.GunBullet;
		} else if (r < 0.6) {
			weapon = new Ownable.Weapon.RocketLauncher; // give the man a rocket launcher
			ammo = new Ownable.Ammo.DumDum;
		} else {
			weapon = new Ownable.Weapon.Shotgun; // give the man a shotgun ;)
			ammo = new Ownable.Ammo.ShotgunBullet;
		}
		player.addToInventory(weapon); // give the man a gun
		player.addToInventory(ammo); // and some ammo
		player.armBestWeapon(); // the gun will be armed
		player.reloadArmedWeapon(); // and loaded

		// temp...
		var objs = [Ownable.Weapon.Gun, Ownable.Weapon.Shotgun, Ownable.Weapon.RocketLauncher, Ownable.Ammo.GunBullet, Ownable.Ammo.DumDum, Ownable.Ammo.ShotgunBullet];
		for (var i=0; i<10; ++i) player.addToInventory(new objs[Math.floor(Math.random()*objs.length)]);
    },
	addEnemy: function(enemy){
		this.enemies.push(enemy);
		this.addActor(enemy);
	},

    addActor: function(obj){
        this.toAdd.push(obj);
        obj.game = this;
    },
    removeActor: function(obj){
    	// only remove once... actors can be removed multiple times in the same loop (like two enemies killing the same player)
    	if (this.toRemove.indexOf(obj) == -1) this.toRemove.push(obj);
    	// do not remove the game reference here, the actor might still be processed and would need it
    },

    // all stuff happens here (called from timer in ui.js)
    frame: function() {
		// should we call the ai logic?
		var now = this.frameTimeStart;
		var callAi = (now - this.lastAiTime > this.aiDelay);
		if (callAi) this.lastAiTime = now;

		var o, end = this.actors.length;
		for (var i=0; i < end; i++) {
			Test.assert(this.actors.length == end, "should only use addActor and removeActor to change the actors array...");
			o = this.actors[i];

            // ai
			if (callAi && o instanceof Actor.Enemy) o.ai(this);

			// "physics"
			if (o.velocity.x || o.velocity.y) {
		    	if (o.solid) {
					// move the object based on its velocity
					// dont allow it to move into solid cells
					var fromCellX = Math.floor(o.origin.x);
					var fromCellY = Math.floor(o.origin.y);
					var toCellX = Math.floor(o.origin.x + o.velocity.x);
					var toCellY = Math.floor(o.origin.y + o.velocity.y);

					Test.assert(this.map.cellGrid, "Seems to cause an error somehow...");
					if (
						!this.map.cellGrid[toCellY] ||
						!this.map.cellGrid[toCellY][toCellX] ||
					  	this.map.cellGrid[toCellY][toCellX].tile.collides
					) {
						Test.assert(this.map.cellGrid[fromCellY], "You are on this column...");
						//console.log("target blocked")
						// cell blocked, do something
						// we take away velocity in either direction
						if (!this.map.cellGrid[fromCellY][toCellX] || this.map.cellGrid[fromCellY][toCellX].tile.collides) o.velocity.x = 0;
						if (!this.map.cellGrid[toCellY] || !this.map.cellGrid[toCellY][fromCellX] || this.map.cellGrid[toCellY][fromCellX].tile.collides) o.velocity.y = 0;
						// in case only the diagonal target tile is taken, clear one direction anyways
						if (o.velocity.x && o.velocity.y) o.velocity.y = 0;

						toCellX = Math.floor(o.origin.x + o.velocity.x);
						toCellY = Math.floor(o.origin.y + o.velocity.y);
						//Test.reject(this.map.cellGrid[toCellY][toCellX].tile.collides, "the target should not be blocked anymore");
						if (this.map.cellGrid[toCellY][toCellX].tile.collides) continue;

	    				o.collision(); // tell object it has collided
					}
				}
			}

			var ground_level = 0;
			var fps = 25;
			var gravity = 9.78915942273/fps; // right?

			if (o.origin.z > ground_level) {
			    o.velocity.z -= gravity;
		    }

            Test.reject(isNaN(o.origin.z),"nan origin");
            Test.reject(isNaN(o.velocity.z),"nan velocity");
			var z = o.origin.z + o.velocity.z;
			if (z < ground_level) {
			    // if (o.bouncy) {o.velocity.z = 0-o.velocity.z; z = ground_level-z}
			    o.velocity.z = 0;
			    z = ground_level;
		    }

			o.setOrigin(o.origin.x + o.velocity.x, o.origin.y + o.velocity.y, z);

			// the active animator is called at mapui
			//console.log(o.velocity.x+","+o.velocity.y+" "+o.origin.x+","+o.origin.y)

			// enemy too close? and alive...? :)
			if (o instanceof Actor.Enemy && o.health > 0) {
				for (var j=0; j<4; ++j) {
					var p = this.players[j];
					if (p && vector.distance(o.origin, p.origin) < 1) {
						// boom!
						o.collision(p);
					}
				}
			}

			// rocket hitting anyone?
			if (o instanceof Rocket) {
				for (var j=0; j<this.actors.length; ++j) {
					var t = this.actors[j];
					if (t && t instanceof Actor.Enemy && t.solid && vector.distance(o.origin, t.origin) < 1) {
						// boom!
						o.collision(t);
					}
				}
			}

    	}
		Test.assert(this.actors.length == end, "should only use addActor and removeActor to change the actors array... (2)");

    	// cleanup
    	for (var i=0; i<this.toRemove.length; ++i) {
    		var t = this.toRemove[i];
    		Test.assert(this.toRemove.indexOf(t, i+1) == -1, "actors should only be removed once..."+i+" "+this.toRemove.indexOf(t, i+1));
    		var pos = this.actors.indexOf(t);
    		Test.assert(pos > -1, "object should be added to the pool");
    		// the lookup is required. you cannot put id's in the trash
    		// the id's will be ever changing.
    		var o = this.actors.splice(pos, 1)[0];
    		Test.assert(o === t, "this is what we were removing");
    		Test.assert(!(o instanceof Array), "splice returns an array, we want the removed object");
    		o.game = null; // remove reference
    		// remove player from players array
    		if (o instanceof Actor.Player) this.players.splice(this.players.indexOf(o), 1);
    		// and enemies from their array
    		else if (o instanceof Actor.Enemy) this.enemies.splice(this.enemies.indexOf(o), 1);

    		Test.assert(this.actors.indexOf(t) == -1, "every object should only be added to the pool once");
    	}
    	// and take out the trash
    	this.toRemove.length = 0;

    	// init
    	for (var i=0; i<this.toAdd.length; ++i) {
    		this.actors.push(this.toAdd[i]);
    	}
    	this.toAdd.length = 0;
    },

	// take a line and check, from the start, when the line collides with the map/edge. return that point.
	firstTileCollision: function(start,end){
		// inspired by http://valis.cs.uiuc.edu/~sariel/research/CG/compgeom/msg00927.html
		var cx = start.x;
		var cy = start.y;
		var tx = end.x;
		var ty = end.y;

		// distance
		var dx = tx-cx;
		var dy = ty-cy;
		// xy using abc
		var unit = 1/(Math.abs(dx)+Math.abs(dy));
		var px = unit * dx;
		var py = unit * dy;
		do {
			var cell = this.map.getCell(Math.round(cx),Math.round(cy));
			var bool = cell && !cell.isWall();
			if (bool) {
				cx += px;
				cy += py;
			}
		} while (bool);

		// TOFIX round towards wall
		return {x:cx,y:cy};
	},
	// returns array {enemy:Actor.Enemy, distance:float, nextTo:bool} and their distance to given line, and whether that enemy is "next to" the line
	enemyDistanceToLine: function(a, b){
		var
			n = this.enemies.length,
			x1 = a.x, y1 = a.y,
			x2 = b.x, y2 = b.y,
			px = x2-x1, // distance x
			py = y2-y1, // distance y
			something = ((px*px)+(py*py)), // precomputation
			arr = [];
		Test.assert(typeof x1 == 'number' && !isNaN(x1) && typeof x2 == 'number' && !isNaN(x2) && typeof px == 'number' && !isNaN(px) && typeof py == 'number' && !isNaN(py), "arguments are numbers");
		Test.assert(px||py, "zero length line? "+a.x+","+a.y+" , "+b.x+","+b.y+" : "+dx+" "+dy);
		while (n--) {
			var o = this.enemies[n];
			var x3 = o.origin.x;
			var y3 = o.origin.y;

			// http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment/2233538#2233538
			var u = (((x3-x1)*px)+((y3-y1)*py))/something;
			// if u is <0 or >1, the enemy is not "next to" the line.
			var nextTo = u<0||u>1;
			if (u > 1) u = 1;
			else if (u < 0) u = 0;
			var dx = (x1+(u*px))-x3;
			var dy = (y1+(u*py))-y3;

			// sqrt is opt if actual distance is not important
			var d = Math.sqrt((dx*dx)+(dy*dy));
			Test.reject(isNaN(dx), "dx NaN?");
			Test.reject(isNaN(dy), "dy NaN?");
			Test.reject(isNaN(d), "distance NaN?");
			arr.push({enemy:o,distance:d,nextTo:nextTo,d1:vector.distance(o.origin, a),d2:vector.distance(o.origin, b)});
		}

		return arr;
	},
	// returns the enemy (or null) closest to start, on the line start-end, that's no further than maxDistance away from it
	// derived from enemyDistanceToLine
	firstEnemyOnLine: function(start, end, maxRadius){
		var
			n = this.enemies.length,
			x1 = start.x, y1 = start.y,
			x2 = end.x, y2 = end.y,
			px = x2-x1, // distance x
			py = y2-y1, // distance y
			something = (px*px)+(py*py), // precomputation
			maxD = maxRadius || Infinity,
			maxE = false;

		Test.assert(typeof x1 == 'number' && !isNaN(x1) && typeof x2 == 'number' && !isNaN(x2) && typeof px == 'number' && !isNaN(px) && typeof py == 'number' && !isNaN(py), "arguments should be numbers");
		Test.assert(px||py, "zero length line? "+start.x+","+start.y+" , "+end.x+","+end.y+" : "+dx+" "+dy+" md:"+maxRadius); // still uncertain when or why this happens...
		while (n--) {
			var o = this.enemies[n];
			var x3 = o.origin.x;
			var y3 = o.origin.y;

			// http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment/2233538#2233538
			var u = (((x3-x1)*px)+((y3-y1)*py))/something;
			// if u is <0 or >1, the enemy is not "next to" the line.
			var nextTo = u<0||u>1;
			if (u > 1) u = 1;
			else if (u < 0) u = 0;
			var dx = (x1+(u*px))-x3;
			var dy = (y1+(u*py))-y3;

			// sqrt is opt if actual distance is not important
			var d = Math.sqrt((dx*dx)+(dy*dy));
			Test.reject(isNaN(dx), "dx NaN?");
			Test.reject(isNaN(dy), "dy NaN?");
			Test.reject(isNaN(d), "distance NaN?");

			if (d < maxD) {
				maxD = d;
				maxE = o;
			}
		}

		return maxE;
	},

	toString: function(){
		return "Game["+this.actors.length+" actors]";
	},

0:0};
