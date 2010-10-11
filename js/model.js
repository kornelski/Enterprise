
var Model = function(spriteState) {
    
    if (!spriteState.img) {
        spriteState.img = new Image();
        spriteState.img.src = spriteState.src;
    }
    
    // just copy properties from the sprite (uses it as a prototype)
	// see models.js for exact properties being copied
    $(this).extend(spriteState);
}

Model.prototype = {
    
    stopAnimation: function() {
        Test.assert(this.currentAnimation in this.animations,this.currentAnimation+" missing?");
        Test.assert('Function' == typeof this.animations[this.currentAnimation],"anim == function");
        
        this.animations[this.currentAnimation](false,false,true);
    },

	toString: function(){
		return "Model["+this.spriteSrc+"]";
	},
0:0}