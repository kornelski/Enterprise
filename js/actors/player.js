
Actor.Player = function(id) {
    Actor.call(this);
	this.setModel('player');
	this.id = id; // 0..3
	// flags are 1,2,4,8. used for selection
	this.flag = id+1;
	if (this.flag == 3) this.flag = 4;
	else if (this.flag == 4) this.flag = 8;
};

Actor.Player.prototype = $.extend(new Actor,{
	game: null, // set from Game.addActor
	cls: 'Player',
    id: null, // id of this player (tied to hud), 0..3
    flag: null, // flag for this player for selection, 1,2,4,8

    height: 1.8, // how tall the player is

	health: 100,

	state: null, // movement state
    walkingSpeed: Config.playerWalkSpeed,
    walkDestination: null,
    walkPath: [],

	backpack: null, // inventory of player. see Backpack
	openedBackpack: false, // is the backpack open on screen?
	armed: null, // currently armed Ownable, should not be in your inventory
	firedAt: null, // point where you last clicked to shoot during last frame

    frame: function() {
        if ('walking' == this.state) {

            if (Math.abs(this.origin.x - this.walkDestination.x) <= this.walkingSpeed &&
                Math.abs(this.origin.y - this.walkDestination.y) <= this.walkingSpeed) {
                if (this.walkPath.length) {
                    this.walkToNextPathWaypoint();
                }

                if (Math.abs(this.origin.x - this.walkDestination.x) <= this.walkingSpeed &&
                    Math.abs(this.origin.y - this.walkDestination.y) <= this.walkingSpeed) {
                    this.state = null;
                    this.velocity={x:0,y:0,z:0}
                    this.model.stopAnimator();
                    return;
                }
            }
            this.velocity = vector(this.origin,this.walkDestination,this.walkingSpeed);
        }

		// fired yer weapon?
		if (this.firedAt) {
			// first get the line of fire, simply two vectors (position and clicked point)
			var start = {x:this.origin.x,y:this.origin.y,z:this.origin.z};
			var point = this.firedAt;
			if (Config.drawShootLines) this.game.linesToDraw.push({start:start,end:point,color:"yellow"});
			// get the armed weapon to make it fire
			var weapon = this.armedWeapon();
			if (weapon) {
				Test.assert(weapon instanceof Ownable.Weapon, "this.armedWeapon should have made sure the returned object is a Ownable.Weapon instance");
				// the weapon will then take the targeted path and
				// apply spread (accuracy). it will return an array with
				// zero or more projectile trajectories.
				// an empty array means the weapon could not fire a
				// bullet. This could have various reasons like
				// - has no bullets
				// - still cooling down (rof)
				// - jammed
				// certain weapons fire multiple bullets (shotgun,
				// machinegun, etc). one bullet path, with individual
				// precision, will be returned per projectile to be fired.
				var bulletPaths = weapon.fire(start, point); // returns an array with the trail (start, point) current ammo should follow, or actors to spawn
				Test.assert(bulletPaths && bulletPaths instanceof Array, "expecting an array with zero or more bullet trajectories or actors to spawn");
				// now process these trajectories and handle results
				if (bulletPaths.length) {
					var dmg = weapon.currentDamage();
					var pen = weapon.penetratesArmor();
					for (var i=0; i<bulletPaths.length; ++i) {
						var path = bulletPaths[i];
						if (path instanceof Actor) {
							// spawn the actor, it will take care of impact
							path.power = dmg; // set the amount of damage this rocket deals on impact
						    this.game.addActor(path);
						} else {
							// fire the bullet and check for impact
							Test.assert(path.start && path.point, "expecting start and target for projectile path");
							this.game.fireProjectile(path.start, path.point, dmg, pen);
						}
					}
				}
			}
			this.firedAt = null;
		}
    },

	addToInventory: function(ownable){
		Test.assert(this.backpack, "has backpack");
		Test.assert(ownable instanceof Ownable, "only ownables can be inventorized");
		console.log(this.toString(), "addToInventory", ownable.toString());
		this.backpack.add(ownable);
	},
	removeFromInventory: function(ownable){
		this.backpack.remove(ownable);
	},
	
	armBestWeapon: function(){
		// request best weapon from backpack
		var weapon = this.backpack.getBestWeapon();
		if (weapon) this.armWeapon(weapon);
		console.log(this.toString(), "Armed best weapon: "+weapon);
		return !!weapon;
	},
	armWeapon: function(weapon){
		Test.assert(weapon instanceof Ownable.Weapon, "only arm weapons");
		Test.assert(this.backpack.has(weapon), "only arm weapons you own");
		this.backpack.remove(weapon);
		this.armed = weapon; // TOFIX: left/right?
	},
	armedWeapon: function(){
		var wep = this.armed;
		Test.assert(!wep || wep instanceof Ownable.Weapon, "Only weapons are armable");
		return wep;
	},
	disarmWeapon: function(){
		if (this.armed) {
			Test.assert(this.backpack.hasRoom(), "you need room for the disarmed weapon");
			this.backpack.add(this.armed);
			this.armed = null;	
		}
	},
	reloadArmedWeapon: function(){
		console.log(this.toString(), "Reloading weapon");
		// if armed a weapon (re)load its ammo.
		var weapon = this.armedWeapon();
		if (weapon) {
			var old = weapon.removeAmmo();
			var ammo = this.backpack.getBestAmmo(weapon.ammoClass);
			var best = Ownable.Ammo.best(old, ammo);
			console.log(this.toString(), "Best ammo: "+best, old, ammo, weapon.ammoClass);
			if (best) {
				if (best == old) {
					weapon.setAmmo(best);
					// nothing changes, no ammo is fetched/stored into the backpack
				} else {
					this.backpack.remove(ammo);
					if (old) this.backpack.add(old);
					weapon.setAmmo(best);
				}
			}
		}
	},

	walkTo: function(point){
	    if (this.state != 'walking') {
	        this.state = 'walking';
			this.model.switchAnimator('walk');
        }
        var grid = this.game.map.cellGrid;
        var endCell = grid[Math.round(point.y)][Math.round(point.x)];
        var startCell = grid[Math.round(this.origin.y)][Math.round(this.origin.x)];

        this.walkPath = astar.search(grid, startCell, endCell);

        this.walkToNextPathWaypoint();
	},

	walkToNextPathWaypoint: function() {
	    var cell = this.walkPath.pop();
	    this.walkDestination = cell ? {x:cell.x+0.5, y:cell.y+0.5, z:this.origin.z} : this.origin;// FIXME: read ground level?
    },

	damage: function(dmg){
		if (!Config.godMode) {
			this.health -= dmg;
			if (this.health <= 0) this.die();
		}
	},

	die: function(){
		// add this object to trash. we wont use it anymore
		// will be removed at the end of this frame
		this.game.removeActor(this);
		// replace by placeholder that doesnt do anything but the
		// death animation and painting the corpse afterwards
		this.game.addActor(new Placeholder(this.origin, 'player', 'death'));
		// show skull, update mini status, show updated health and deselect
		$('#c'+(this.id+1)+'-status').html('0%');
		$('#c'+(this.id+1)+' > .img').css('background-position', (-(this.model.deathSprite * this.model.width)-12)+'px 0');
		$('#c'+(this.id+1)).css({
			'background-image': 'url(img/skull.png)',
			'background-position': '15px 20px'
		});
		if (this.flag & this.game.selectedCharacter) $('#c'+(this.id+1)).click();
	},

	fire: function(point) {
		this.firedAt = point;
    },

	toString: function(){
		return Actor.prototype.toString.call(this)+"["+this.id+"]";
	},

0:0});
