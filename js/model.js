
var Model = function(spriteState) {
    
    if (!spriteState.img) {
        spriteState.img = new Image();
        spriteState.img.src = spriteState.src;
    }
    
    // just copy properties from the sprite (uses it as a prototype)
	// see models.js for exact properties being copied
    for(prop in spriteState) {
        this[prop] = spriteState[prop];
    }
    
    Test.assert(this.img, "must have img");
}

Model.prototype = {
    
    stopAnimation: function() {
        if (!this.currentAnimation) return;
        
        Test.assert(this.currentAnimation in this.animations,this.currentAnimation+" missing?");
        Test.assert('function' == typeof this.animations[this.currentAnimation],"anim == function");
        
        this.animations[this.currentAnimation].call(this, 'stop');
        this.currentAnimation=null;
    },

    playAnimation: function(name) {
        Test.assert(name in this.animations,name+" missing?");
        Test.assert('function' == typeof this.animations[name],"anim == function (for "+name+")");
        
        this.currentAnimation = name;
        this.animations[name].call(this, 'init');
    },
	
	switchAnimation: function(name){
		Test.assert(name, "we need an animator");
		if (this.currentAnimation && this.currentAnimation != name) this.stopAnimation();
		if (this.currentAnimation != name) this.playAnimation(name);
	},

	toString: function(){
		return "Model["+this.spriteSrc+"]";
	},
0:0};