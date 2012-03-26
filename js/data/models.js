// set of game actors

// that is not an MVC kind of model
var Models = {
    'player': { // enemy uses the same model only a different sprite
		src: 'img/characters/character.png',
		currentAnimator: null,
		currentSprite: 0,
		deathSprite: 8, // what sprite denotes the death state? for hud
		lastAnimator: 0, // last time an animation was called (used by callbacks)
		width: 50,
		height: 50,
		animators: { // should be called with the object as this context (model.animators.death.call(model,...))
			'death': function(special){
				if (special == 'init') {
					// first death scene animation
					this.currentSprite = 6;
					this.lastAnimator = Date.now ? Date.now() : +new Date;
				} else if ((Date.now ? Date.now() : +new Date) - this.lastAnimator > 100) { // next frame (at least) every 100ms
					this.currentSprite += 1;
					if (this.currentSprite >= 8) {
						// last death scene animation. leave it at that
						this.currentAnimator = false;
						// animation finished callback (if set)
						if (this.animationFinished) {
							this.animationFinished();
							this.animationFinished = null;
						}
					}
					this.lastAnimator = Date.now ? Date.now() : +new Date;
				}
			},
			'walk': function(special){
				//console.log(special+": "+((Date.now ? Date.now() : +new Date) - this.lastAnimator > 50))
				if (special == 'init') {
					this.currentSprite = 0;
					this.lastAnimator = Date.now ? Date.now() : +new Date;
				} else if (special == 'stop') {
					this.currentSprite = 0;
					this.lastAnimator = Date.now ? Date.now() : +new Date;
				} else if ((Date.now ? Date.now() : +new Date) - this.lastAnimator > 50) {
					if (special == 'pause') {}
					else {
						this.currentSprite = (this.currentSprite + 1) % 2; // 1 or 2
						//console.log("switched");
					}
					this.lastAnimator = Date.now ? Date.now() : +new Date;
				}
			}
		}
	},
	'rocket': {
		src: 'img/characters/rocket.png',
		currentAnimator: null,
		currentSprite: 0,
		lastAnimator: 0,
		width: 80,
		height: 50,
		animators: {
			'fire': function(special){
				if (special == 'init') {
					// does nothing...?
				} else if (special == 'stop') {
					// TODO: remove rocket and start voodoo
				} else {
					// TOFIX: probably alternate with different fire as to give it some animation
				}
			}
		}
	},
	'smoke': {
		src: 'img/characters/smoke.png',
		currentAnimator: null,
		currentSprite: 0,
		lastAnimator: 0,
		width: 70,
		height: 67,
		animators: {
			'fire': function(special){
				if (special == 'init') {
					// does nothing...?
				} else if (special == 'stop') {
					// TODO: remove rocket and start voodoo
				} else {
					// TOFIX: probably alternate with different fire as to give it some animation
				}
			}
		}
	},
	'explosion': {
		src: 'img/characters/explosion.png',
		currentAnimator: null,
		currentSprite: 0,
		lastAnimator: 0,
		width: 80,
		height: 80,
		animators: {
			'fire': function(special){
				if (special == 'init') {
					// does nothing...?
				} else if (special == 'stop') {
					// TODO: remove rocket and start voodoo
				} else {
					// TOFIX: probably alternate with different fire as to give it some animation
				}
			}
		}
	}

};
