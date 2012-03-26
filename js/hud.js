// whenever these methods are invoked, they should be invoked in context of the current game
// eg. hud.init.call(game);

var Hud = function(){
	var self = this;
	var $chars = $('.character').click(function(){
		Test.assert(this.id.length == 2, "assuming c#");
		var id = +this.id[1] - 1; // so the actual id of the panel clicked can be found in the id in the dom. in the dom, id's are 1-4 (whereas player.id is 0-3)
		Test.assert(id in {0:1,1:1,2:1,3:1}, "assuming the id's are one of 0123");
		var p = self.game.getPlayerById(id);
		if (!p) return; // dead player, dont select

		self.game.selectedCharacter ^= p.flag; // xorring the selected character flag toggles the selection for this char
		if (self.game.isSelected(p)) this.className = 'selected character';
		else this.className = 'character';
	});

	$('.release-info').html(Config.releaseInfo);

	$('#moreCowbell').click(function(){
	    self.game.paused = !self.game.paused;
	});

	$('#toggleAll').click(function(){
		self.game.toggleAllPlayers();
	});

	this.lastHealth = [0,0,0,0];
	this.lastSprite = [0,0,0,0];
	this.lastWeapon = [null,null,null,null];
	this.lastAmmo = [null,null,null,null];
	this.lastBackpack = [null, null, null, null];
};
Hud.prototype = {
	lastHealth: null, // players health at last update (prevents useless paints)
	lastSprite: null, // which sprite per was shown per character
	lastWeapon: null, // last known armed weapon
	lastAmmo: null, // last known used ammo
	lastBackpack: null, // last known used backpack

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
			var p = this.game.players[i];
			if (p) {
				var id = p.id; // 0..3
				if (this.lastHealth[id] != p.health) {
					this.lastHealth[id] = p.health;
					if (p.health > 0) {
						$('#c'+(id+1)+'-status').html(p.health.toFixed(0)+'%');
					}
				}
				if (this.lastSprite[id] != p.model.currentSprite) {
					this.lastSprite[id] = p.model.currentSprite;
					$('#c'+(id+1)+' > .img').css('background-position', (-(p.model.currentSprite * p.model.width)-12)+'px 0');
				}
				Test.assert('armed' in p, "we need easy access to currently armed weapon");
				if (this.lastWeapon[id] != p.armed) {
					this.lastWeapon[id] = p.armed;
					$('#c'+(id+1)+'-weapon').css({'background-image': p.armed ? 'url('+p.armed.inventoryIcon+')' : 'none'});
				}
				if ((p.armed && this.lastAmmo[id]) || this.lastAmmo[id] != p.armed.ammo) {
					this.lastAmmo[id] = p.armed && p.armed.ammo;
					$('#c'+(id+1)+'-ammo').css({'background-image': p.armed && p.armed.ammo ? 'url('+p.armed.ammo.inventoryIcon+')' : 'none' });
				}
				if (this.lastBackpack[id] != p.backpack.name) {
					this.lastBackpack[id] = p.backpack.name;
					$('#c'+(id+1)+'-backpack').html('<img src="'+p.backpack.imgUrl+'"/>');
				}
			}
		}

		$('#details').html(
			'actors:'+this.game.actors.length
		);
	},

0:0};
