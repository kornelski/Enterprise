// whenever these methods are invoked, they should be invoked in context of the current game
// eg. hud.init.call(game);

var Hud = function(){
	var self = this;
	var $chars = $('.character').click(function(){
		Test.assert(this.id.length == 2, "assuming c#");
		var id = +this.id[1]; // so the actual id of the panel clicked can be found in the id in the dom
		Test.assert(id in {1:1,2:1,3:1,4:1}, "assuming the id's are one of 1234");
		
		// needs to be a switch (1,2,4,8)
		if (id == 3) id = 4;
		else if (id == 4) id = 8;
		 
		self.game.selectedCharacter ^= id; // xorring the selected character flag toggles the selection for this char
		if (self.game.selectedCharacter & id) this.className = 'selected character';
		else this.className = 'character';
	});

	$('#moreCowbell').click(function(){
	    self.game.paused = !self.game.paused;
	});
	
	$('#toggleAll').click(function(){
		if (self.game.selectedCharacter == (1|2|4|8)) {
			// deselect all
			$chars.click();
		} else {
			// select any unselected
			if ((self.game.selectedCharacter & 1) == 0) $chars.filter(':nth-child(1)').click(); 
			if ((self.game.selectedCharacter & 2) == 0) $chars.filter(':nth-child(2)').click(); 
			if ((self.game.selectedCharacter & 4) == 0) $chars.filter(':nth-child(3)').click(); 
			if ((self.game.selectedCharacter & 8) == 0) $chars.filter(':nth-child(4)').click();
		} 
	});

	this.lastHealth = [0,0,0,0];
};
Hud.prototype = {
	lastHealth: null, // players health at last update (prevents useless paints)
	
	game: null, // a hook to the active game

	setGame: function(game){
		this.game = game;
	},

	/**
	 *
	 * @param c int chararcter (0..3)
	 * @param s int status (0..99)
	 */
	updateStatus: function(c, s) {
		$('#c'+(c+1)+'-status').text(s+'%')
		$('#c'+(c+1)+'-progress').width(s * 0.76);
	},

	/**
	 * Called on each frame to make updates to the hud.
	 * Do take care, updating the hud on every frame is a serious performance issue.
	 * Only update changed data, like health or stance
	 */
	frame: function(){
		for (var i=0; i<4; ++i) {
			if (this.game.players[i] && this.lastHealth[i] != this.game.players[i].health) {
				this.lastHealth[i] = this.game.players[i].health;
				$('#c'+(i+1)+'-status').html(this.game.players[i].health.toFixed(0)+'%');
			}
		}
	},

0:0};
