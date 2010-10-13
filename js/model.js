// models contain meta data for objects
// namely, they contain animators and sprite data

var Model = function(spriteState) {
	Test.assert(spriteState.src, "the model should have a sprite");

	$.extend(this, spriteState);
};

Model.prototype = {
	src: null, // set from json ("spriteState")
    img: null, // set from gameObj.prototype.preload, using src

	animators: null, // an array with animators
	currentAnimator: null, // the current playing animator, if any
	currentSprite: null, // sprite index
	lastAnimator: null, // last time animator was called
	width: 0, // size of each sprite
	height: 0,

    stopAnimator: function() {
        if (!this.currentAnimator) return;

        Test.assert(this.currentAnimator in this.animators,this.currentAnimator+" missing?");
        Test.assert('function' == typeof this.animators[this.currentAnimator],"anim == function");

        this.animators[this.currentAnimator].call(this, 'stop');
        this.currentAnimator = null;
    },

    playAnimator: function(name) {
        Test.assert(name in this.animators,name+" missing?");
        Test.assert('function' == typeof this.animators[name],"anim == function (for "+name+")");

        this.currentAnimator = name;
        this.animators[name].call(this, 'init');
    },

	switchAnimator: function(name){
		Test.assert(name, "we need an animator");
		if (this.currentAnimator && this.currentAnimator != name) this.stopAnimator();
		if (this.currentAnimator != name) this.playAnimator(name);
	},

	toString: function(){
		return "Model["+this.spriteSrc+"]";
	},
0:0};
