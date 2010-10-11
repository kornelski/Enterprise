
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
	model: null, // animation state (graphic model)
	imgCache: {}, // for any sprite image source that's being encountered, one image object should be put in here. key is url
	
    setOrigin: function(x,y) {
        this.screenZIndex = x+y;        // FIXME: re-sort
        this.origin.x=x;this.origin.y=y;
    },
   
    setModel: function(name) {
        this.model = new Model(Models[name]);
    },
    
0:0}
