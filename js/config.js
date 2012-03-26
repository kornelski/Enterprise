// application configuration object

var Config = {
	releaseInfo: 'Enterprise vxxx',
	
	tileWidth: 52,
	tileHeight: 13,
	aiDelay: 300,

	playerWalkSpeed: 0.2,
	enemyBaseWalkSpeed: 0.05,

	/* general game settings */
	flyingCarpetMode: false, // wave every tile like the water
	showCollisionTiles: false, // show special tiles for collision tiles
	showHealthNumbered: true, // show health above players and enemies as number
	inputFrameLimited: true, // only process input once per frame, instead of when the event fires

	// debugging
	drawRectanglesForActors: false, // draw rectangles around actors (helps debugging)
	aiShowTarget: true, // show where AI wants to move to
	drawShootLines: true, // show laser like lines whenever you fire your gunz (red is bullet paths, yellow is aimed path)

	// cheats
	godMode: false, // players health wont drop, regardless
	invisibleMode: true, // ai ignores players
	infiniteAmmoMode: true, // ammo.hasAmmo always returns true
	noRateOfFire: false, // ignore the rof for weapons

	startMap: "first",
0:0};
