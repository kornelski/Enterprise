// actually just state for one map

function Game() {
	// the game starts at level 1 - 1
	this.map = Map.get("1 - 1");
	var objects = this.map.objects;
	for (var i=0; i<objects.length; ++i) {
		var obj = objects[i];
		switch (obj.type) {
			case 'enemy': this.objects.push(new Enemy(obj.x, obj.y)); break;
			default: Test.die("Unknown object type: "+obj.type);
		}
	}
	
	this.addPlayer(new Player());
	
	Test.assert('spawnPoint' in this.map, "map must have spawn point "+this.map);
	Test.assert(this.map.spawnPoint.x > 0 || this.map.spawnPoint.y > 0, "spawn point 0,0 is useless");
	
	this.movePlayers(this.map.spawnPoint);
}

Game.prototype = {
    map: null, // the map object for the active game
    
    players: [], // players are both in objects and players
    
    /** all gameobj-derived objects (sprites)
     * 
     * NB! Objects in this array must be sorted by screen y-coordinate 
     * to ensure proper "z-index" when painted
     * every object has this.screenZIndex for sorting
     * keeping this array sorted is perf improvement
     */
    objects: [], 
    
	selectedCharacter: 0, // the currently active character(s), flags (0,1,2,4)
	
    movePlayers: function(point) {
        for(var i=0; i < this.players.length; i++) {
            this.players[i].setOrigin(point.x, point.y);
        }
    },
    
    addPlayer: function(player) {
        this.objects.push(player);
        this.players.push(player);
    },

    // all stuff happens here
    frame: function() {
        var o,end = this.objects.length;
        for(var i=0; i < end; i++) {
            // "physics"
            o = this.objects[i];
            
            o.setOrigin(o.origin.x + o.velocity.x, o.origin.y + o.velocity.y);    
        }
    },
    
	toString: function(){
		return "Game["+this.objects.length+"objs]";
	},

0:0};