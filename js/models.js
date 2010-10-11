// set of game objects

// that is not an MVC kind of model
var Models = {
    'player': {
		src: 'img/characters/character.png',
		currentAnimation: 'death',
		currentSprite: 0,
		lastAnimation: 0, // last time an animation was called (used by callbacks)
		width: 50,
		height: 50,
		animations: { // should be called with the object as this context (model.animations.death.call(model,...))
			'death': function(init,pause,stop){
				if (init) {
					// first death scene animation
					this.currentSprite = 6;
					this.lastAnimation = Date.now() || +new Date;
				} else if ((Date.now() || +new Date) - this.lastAnimation > 100) { // next frame (at least) every 100ms
					this.currentSprite += 1;
					if (this.currentSprite >= 8) {
						// last death scene animation. leave it at that
						this.currentAnimation = false;
					}
					this.lastAnimation = Date.now() || +new Date;
				}
			},
			'move': function(init,pause,stop){
				if (init) this.currentSprite = 0;
				else if (stop) this.currentSprite = 0;
				else if ((Date.now() || +new Date) - this.lastAnimation > 50) {
					if (pause) {}
					else this.currentSprite = (this.currentSprite + 1) % 2; // 1 or 2
					this.lastAnimation = Date.now() || +new Date;
				}
			}
		}
	}
};
