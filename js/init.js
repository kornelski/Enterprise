// init the game. loads all required resources and starts the game ui

// firefox et.al. dont always have console available
if (!window.console) window.console = {log:function(){}};

// scripts in one group are loaded serially.
// script groups are loaded in parallel.
new LoadQueue(
	[{name: "core",
	files: [
		'js/tools/vector.js',
		'js/game.js',
		'js/ui.js',
		'js/hud.js'
	]},
	{name: "actors",
	files: [
		'js/actor.js',
		'js/backpack.js',
		'js/actors/model.js',
		'js/actors/player.js',
		'js/actors/enemy.js',
		'js/actors/particle.js',
		'js/actors/placeholder.js',
		'js/actors/rocket.js'
	]},
	{name: "map",
	files: [
		'js/map.js',
		'js/maps/maplayout.js',
		'js/maps/tile.js',
		'js/maps/mapui.js',
		'js/maps/cell.js'
	]},
	{name: "ownables",
	files: [
		'js/ownable.js',
		'js/ownables/weapon.js',
		'js/ownables/weapons/gun.js',
		'js/ownables/weapons/shotgun.js',
		'js/ownables/weapons/rocketlauncher.js',
		'js/ownables/ammo.js',
		'js/ownables/ammos/gunbullet.js',
		'js/ownables/ammos/shotgunbullet.js',
		'js/ownables/ammos/dumdum.js'
	]},
	{name: "data",
	files: [
		'js/data/tiles.js',
		'js/data/models.js',
		'js/data/maps.js'
	]},
	{name: "libs",
	files: [
		'js/lib/jquery/jquery.mousewheel.min.js',
		/* dragndrop: http://interface.eyecon.ro/demos/drag.html */
		//'js/lib/jquery/idrag.js',
		//'js/lib/jquery/iutil.js',
		'js/lib/jquery/draggable.js',
		/* A* path finding */
		'js/lib/astar/graph.js',
		'js/lib/astar/astar.js'
	]},
	{name: "imagery",
	files: [
		'img/characters/character.png',
		'img/characters/enemy-sentry.png',
		'img/characters/enemy.png',
		'img/characters/enemy-patrol.png',
		'img/characters/selected.png',
		'img/hud.jpg',
		'img/hudplayer.jpg',
		'img/bag.png',
		'img/maps/minimap.png',
		'img/roundbutton.png',
		'img/button.png',
		'img/tiles/water.png',
		'img/hover_blue.png',
		'img/hover_red.png',
		// 'img/gun.png',
		// 'img/gunbullet.png',
		// 'img/shotgun.png',
		// 'img/shotgunbullet.png',
		'img/characters/smoke.png', // TOFIX: more logical position?
		'img/characters/explosion.png',
		'img/characters/rocket.png',
		'img/backpacks/army.png',
		'img/backpacks/hike.png',
		'img/backpacks/standard.png',
		'img/skull.png'
	]}
	], {
		init: function(count){
			$('#count').html(0+" of "+count);
		},
		loading: function(group,file){
			// TOFIX: make this better looking
			$('#files').prepend("<div>loading ["+group.name+"]: "+file+"</div>");
		}, 
		loaded: function(group,file){
			// TOFIX: make this better looking
			$('#files').prepend("<div>loaded ["+group.name+"]: "+file+"</div>");
			$('#count').html(this.loaded+" of "+this.toLoad);
		},
		finished: function(){
			// TOFIX: make this better looking / smooth transition
			$('#files').prepend("<div>Finished loading</div>"); // hmm
			// give some time to catch up
			setTimeout(function(){
				$('#loader').hide();
				$('#ui').show();
				new UI(new Game, $('#enterprise'));
			},1);
		} 
	},
	6
);
