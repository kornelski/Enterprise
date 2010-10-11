// whenever these methods are invoked, they should be invoked in context of the current game
// eg. hud.init.call(game);

var Hud = function(){
	var self = this;
	$('.character').click(function(){
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
};
Hud.prototype = {

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

	selectCharacter: function(){
		
	},

0:0};
