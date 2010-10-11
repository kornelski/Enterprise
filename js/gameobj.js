
var GameObj = function() {
	// DONT DO ANYTHING IN THIS CONSTRUCTOR THAT DOESNT ONLY AFFECT THIS OBJECT
	// thanks ^^
	
	/** read-only. use setOrigin */
    this.origin = {x:0,y:0};
    this.velocity = {x:0,y:0};
    
    // this is perf trick, see Game.objects
    this.screenZIndex=0; 
}

GameObj.prototype = {
    game: null,
	model: null, // animation state (graphic model)
	imgCache: {}, // for any sprite image source that's being encountered, one image object should be put in here. key is url
	
	solid: true, // hits walls
	
	opacity:1.0,
	
	collision: function() {
		
    },
	
	frame: function() {
	    // game logic per frame
	    // player overrides it	    
    },
	
    setOrigin: function(x,y) {
        this.screenZIndex = x+y;        // FIXME: mark objects as dirty for re-sort?
        this.origin.x=x;
		this.origin.y=y;
    },
   
    setModel: function(name) {
        this.model = new Model(Models[name]);
    },
	
0:0}
