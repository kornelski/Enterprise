var UI = function(game,$container){
    var self=this;

    this.game = game;
    this.mapCanvas = $container.find('#map');
    this.mapUI = new MapUI(game, this.mapCanvas, this);

	// update the active game for the hud
	this.hud = new Hud;
	this.hud.setGame(game);

    this.mapCanvas.mousewheel(function(e){
        if ('wheelDeltaX' in e.originalEvent) {
            self.mapUI.scroll.x -= e.originalEvent.wheelDeltaX;
            self.mapUI.scroll.y -= e.originalEvent.wheelDeltaY;
        }
    });

    // TOFIX: map single finger single tap to left click, single finger double tap to doubleclick, double finger single tap to right mouse click
    var lastTouchPageX,lastTouchPageY;
    this.mapCanvas[0].addEventListener('touchstart',function(e){
        if (e.touches.length==1) {
            lastTouchPageX = e.touches[0].pageX;
            lastTouchPageY = e.touches[0].pageY;
        } else {
            var cell = self.mapUI.screenToCell(e.touches[0].clientX + self.mapUI.scroll.x,e.touches[0].clientY + self.mapUI.scroll.y)
            game.allPlayersFire(cell);
        }

    },false);

    this.mapCanvas[0].addEventListener('touchmove',function(e){
        if (e.touches.length==1) {
            self.mapUI.scroll.x += lastTouchPageX - e.touches[0].pageX;
            self.mapUI.scroll.y += lastTouchPageY - e.touches[0].pageY;
            lastTouchPageX = e.touches[0].pageX;
            lastTouchPageY = e.touches[0].pageY;
        }
        e.preventDefault();
    },false);

    this.mapCanvas[0].tabindex=0;
    this.mapCanvas.focus();

	this.mapCanvas.mousemove(function(e){
		// for showing coord and tile
        self.mapUI.mouse = {x: e.offsetX/self.mapUI.zoom, y:e.offsetY/self.mapUI.zoom};

		// gather details and save it
		var cell = self.mapUI.screenToCell(self.mapUI.mouse.x + self.mapUI.scroll.x,self.mapUI.mouse.y + self.mapUI.scroll.y)
    	self.lastKnownMousePosition = cell;

		// for debugging, show where your mouse is in cells
		$('#coord').html(cell.x.toPrecision(4)+" x "+cell.y.toPrecision(4));

		// get the tile (but be weary of OOB), just a hack, just for debugging
		var tile = game.map.cellGrid;
		if (tile) tile = tile[Math.round(cell.y)];
		if (tile) tile = tile[Math.round(cell.x)];
		if (tile) {
			$('#tilename').html(tile.tile.src);
			game.lastTileHover = tile;
		} else {
			$('#tilename').html("");
			cell = null;
		}
	});

    this.mapCanvas.click(function(e){
		var cell = self.mapUI.screenToCell(self.mapUI.mouse.x + self.mapUI.scroll.x,self.mapUI.mouse.y + self.mapUI.scroll.y)
    	var shiftKey = !!e.shiftKey;
    	var altKey = !!e.altKey;
    	var ctrlKey = !!e.ctrlKey;
		if (e.which == 1) self.lastLeftClick = {x:cell.x, y:cell.y, shift:shiftKey, alt:altKey, ctrl:ctrlKey};
		else if (e.which == 3) self.lastRightClick = {x:cell.x, y:cell.y, shift:shiftKey, alt:altKey, ctrl:ctrlKey};
		return false;
	});
    this.mapCanvas.dblclick(function(e){
		var cell = self.mapUI.screenToCell(self.mapUI.mouse.x + self.mapUI.scroll.x,self.mapUI.mouse.y + self.mapUI.scroll.y)
    	var shiftKey = !!e.shiftKey;
    	var altKey = !!e.altKey;
    	var ctrlKey = !!e.ctrlKey;
		self.lastLeftClick = {x:cell.x, y:cell.y, shift:shiftKey, alt:altKey, ctrl:ctrlKey};
		return false;
	});
	this.mapCanvas[0].oncontextmenu = function(e){
		var cell = self.mapUI.screenToCell(self.mapUI.mouse.x + self.mapUI.scroll.x,self.mapUI.mouse.y + self.mapUI.scroll.y)
    	var shiftKey = !!e.shiftKey;
    	var altKey = !!e.altKey;
    	var ctrlKey = !!e.ctrlKey;
		self.lastRightClick = {x:cell.x, y:cell.y, shift:shiftKey, alt:altKey, ctrl:ctrlKey};
		return false
	};

    // TOFIX: hardware keyboard delay should be bridged. maybe use sticky keys or something...
    // note: keypress does not support arrow keys, et. al.
    $(document.body).keydown(function(e){
    	var shiftKey = !!e.shiftKey;
    	var altKey = !!e.altKey;
    	var ctrlKey = !!e.ctrlKey;
    	var chr = e.keyCode;
    	// add the key to the input cache. it will be processed on each frame (+x converts to int)
    	self.inputCache[(+shiftKey)+"-"+(+altKey)+"-"+(+ctrlKey)+"-"+chr] = {key:chr, shift:shiftKey, alt: altKey, ctrl: ctrlKey};
    	// see game.prototype.input for details

    	// if not limited, process input immediately
    	if (!Config.inputFrameLimited) game.input();
    });

	$('#editTile').click(function(){
		new TileEditor(game);
	});

	$('#settings').click(function(){
		if (!$('#settingsEditor').size()) {
			$e = $('<div id="settingsEditor"></div>')
			.html(
				'<h1>Enterprise settings</h1>'+
				'<ul>'+
					'<li><input class="flyingCarpetMode" type="checkbox"'+(Config.flyingCarpetMode?' checked':'')+'/> Flying carpet</div>'+
					'<li><input class="showCollisionTiles" type="checkbox"'+(Config.showCollisionTiles?' checked':'')+'/> Show collision tiles</div>'+
					'<li><input class="showHealthNumbered" type="checkbox"'+(Config.showHealthNumbered?' checked':'')+'/> Show health bars (numbered)</div>'+
					'<li><input class="inputFrameLimited" type="checkbox"'+(Config.inputFrameLimited?' checked':'')+'/> Frame limit input processing</div>'+
					'<li><br/></li>'+
					'<li><input class="drawRectanglesForActors" type="checkbox"'+(Config.drawRectanglesForActors?' checked':'')+'/> Draw rectangles around actors?</div>'+
					'<li><input class="aiShowTarget" type="checkbox"'+(Config.aiShowTarget?' checked':'')+'/> Show AI movement target</div>'+
					'<li><input class="drawShootLines" type="checkbox"'+(Config.drawShootLines?' checked':'')+'/> Draw bullet target lines</div>'+
					'<li><br/></li>'+
					'<li><input class="godMode" type="checkbox"'+(Config.godMode?' checked':'')+'/> God mode</div>'+
					'<li><input class="invisibleMode" type="checkbox"'+(Config.invisibleMode?' checked':'')+'/> Invisible mode</div>'+
					'<li><input class="infiniteAmmoMode" type="checkbox"'+(Config.infiniteAmmoMode?' checked':'')+'/> Infinite ammo</div>'+
					'<li><input class="noRateOfFire" type="checkbox"'+(Config.noRateOfFire?' checked':'')+'/> Ignore rof weapon throttle</div>'+
				'</ul>'+
				'<a class="close" href="#">close</a>'+
				''
			)
			.appendTo(document.body);
			$e.find('.flyingCarpetMode').click(function(){ this.checked = (Config.flyingCarpetMode = !Config.flyingCarpetMode); });
			$e.find('.showCollisionTiles').click(function(){ this.checked = (Config.showCollisionTiles = !Config.showCollisionTiles); });
			$e.find('.showHealthNumbered').click(function(){ this.checked = (Config.showHealthNumbered = !Config.showHealthNumbered); });
			$e.find('.inputFrameLimited').click(function(){ this.checked = (Config.inputFrameLimited = !Config.inputFrameLimited); });
			$e.find('.aiShowTarget').click(function(){ this.checked = (Config.aiShowTarget = !Config.aiShowTarget); });
			$e.find('.drawRectanglesForActors').click(function(){ this.checked = (Config.drawRectanglesForActors = !Config.drawRectanglesForActors); });
			$e.find('.drawShootLines').click(function(){ this.checked = (Config.drawShootLines = !Config.drawShootLines); });
			$e.find('.godMode').click(function(){ this.checked = (Config.godMode = !Config.godMode); });
			$e.find('.invisibleMode').click(function(){ this.checked = (Config.invisibleMode = !Config.invisibleMode); });
			$e.find('.infiniteAmmoMode').click(function(){ this.checked = (Config.infiniteAmmoMode = !Config.infiniteAmmoMode); });
			$e.find('.noRateOfFire').click(function(){ this.checked = (Config.noRateOfFire = !Config.noRateOfFire); });
			$e.find('.close').click(function(){ $e.remove(); });
		}
	});

	$('.bag').each(function(i,o){
		$(o).click(function(){
			var id = +$(o).parent()[0].id[1] - 1; // get player id, 0~3
			var player = self.game.getPlayerById(id);
			if (player.openedBackpack) return false; // dont open backpack twice (TOFIX: maybe focus on it? setting z-index on top or something)
			player.openedBackpack = true;
			Test.assert(player, "oh hai, player");
			Test.assert(player.backpack, "has backpack");
			Test.assert(player.backpack.area, "is 2d");
			var img = new Image;
			img.src = player.backpack.imgUrl; // should be cached
			img.onload = function(){
				console.log(player.toString(), "opening backpack");
				var $content = $('<div/>') // actual usable backpack area
				.css({ // TOFIX: move to css
					'position':'absolute',
					'left': player.backpack.area.x+'px',
					'top': player.backpack.area.y+'px',
					'width': (player.backpack.area.width*25)+1+'px',
					'height': (player.backpack.area.height*25)+1+'px',
					'background-color':'black',
					'background-image':'url(img/backpacks/grid.png)'
				}).append(
					$('<a/>')
					.css({'position':'absolute', 'top':'-20px', 'width':'20px', 'height':'20px', 'background-color':'red','text-align':'center','cursor':'pointer'}) // TOFIX: move to css
					.html('x')
					.click(function(){
						// $parent is hoisted and will contain the proper element by the time you click...
						// note that $parent will, by this time, have a special method `undraggable`, which
						// you'll not get if you query the object again.
						$parent.undraggable().remove();
						// allow the pack to be opened
						player.openedBackpack = false;
					})
					.draggable()
				);
				
				// add the inventory...
				for (var i=0; i<player.backpack.maxCells; ++i) {
					var ownable = player.backpack.items[i];
					if (ownable) {
						if (ownable.inventoryIcon) {
							$('<img/>')
							.attr('src', ownable.inventoryIcon)
							.css({
								position: 'absolute',
								left: (i%player.backpack.area.width) * 25 + 'px',
								top: Math.floor(i/player.backpack.area.width) * 25 + 'px',
								width: '25px',
								height: '25px'
							})
							.appendTo($content);
							
						} else {
							console.log(ownable.toString(), "has no inventoryIcon set");
						}
					}
				}
				
				var $parent = $('<div/>').css({ // TOFIX: move to css
					'background-image': 'url('+img.src+')',
					'position':'absolute',
					'left':($('#hud').width()+15+player.backpack.x)+'px',
					'top':player.backpack.y+'px',
					'width':img.width,
					'height':img.height
				})
				.append($content)
				.appendTo(document.body);
				
				$parent = $parent.draggable(); // returned object gets specific undraggable method, with closures, to cleanup events.
			};
			
			return false; // prevent selection of character...
		});
	});

	this.startTimer();
}

UI.prototype = {
	game: null,
	mapUI: null,
	mapCanvas: null,

	startTimer: function(){
		var self = this;
		var game = this.game;
	    setInterval(function(){
	    	if (!game.crashTest && !game.paused) {
	    		game.crashTest = true; // false if last iteration caused a crash. i need stack trace :)

				game.frameTimeStart = (Date.now?Date.now():+new Date); // mark frame time start
				self.processKeyboardInput();
				self.processMouseInput();
				game.frame(); // process game logic first
				self.renderFrame(); // show new state (if any)
				self.renderLines(); // draw the lines in game.lines
				self.hud.frame(); // update hud
				game.frameTimeEnd = (Date.now?Date.now():+new Date); // mark frame time end

				game.crashTest = false; // allow timer to fire next time
			} else if (!game.crashMessage && !game.paused) {
				console.log("Paused game, something error happened");
				game.crashMessage = true;
			}
		},50);
	},

    renderFrame: function() {
        this.mapUI.render();
        this.mapUI.emitSounds();
    },
	renderLines: function(){
		this.mapUI.renderLines();
	},

    inputCache: {}, // map to look up keys pressed between frames. each entry should be: inputCache["0-0-0-32"] = {shift:bool, alt:bool, ctrl:bool, key:int}
    lastLeftClick: null, // if left clicked/"single finger single tapped" since last frame, this contains an object {x:float,y:float, shift:bool, alt:bool, ctrl:bool} (xy are cells)
    lastRightClick: null, // if right clicked/"double finger single tapped" since last frame, this contains an object {x:float,y:float, shift:bool, alt:bool, ctrl:bool} (xy are cells, average of the two fingers)
    lastDblClick: null, // if left doubleclicked / "single finger double tapped" since last frame, this contains an object {x:float,y:float, shift:bool, alt:bool, ctrl:bool} (xy are cells)
	lastKnownMousePosition: null, // last mouse move event position...

    processKeyboardInput: function(){
		for (var key in this.inputCache) { // {shift:bool, alt:bool, ctrl:bool, key:int}
			var item = this.inputCache[key];
	        var speed = item.shift ? 200 : 30;
	        switch(item.key) {
				// move map with arrow keys
	            case 37: this.mapUI.scroll.x -= speed; break; // left
	            case 39: this.mapUI.scroll.x += speed; break; // right
	            case 38: this.mapUI.scroll.y -= speed; break; // down
	            case 40: this.mapUI.scroll.y += speed; break; // up

				// nudge players with wasd keys
				case 87: this.game.walkPlayersRelative({x:0, y:-1}); break; // w
				case 65: this.game.walkPlayersRelative({x:-1, y:0}); break; // a
				case 83: this.game.walkPlayersRelative({x:0, y:1}); break; // s
				case 68: this.game.walkPlayersRelative({x:1, y:0}); break; // d

	            // fire rockets at mouse
	            case 32: // spacebar
	                var cell = this.mapUI.screenToCell(
	                	this.mapUI.mouse.x + this.mapUI.scroll.x,
	                    this.mapUI.mouse.y + this.mapUI.scroll.y
	                );
	                this.game.allPlayersFire(cell);
	                break;

				// toggle player
				// TOFIX: toggling should be done through game, visual de/selection through ui. not this .click crap.
				case 49: if (this.game.getPlayerById(0)) $('.character').filter(':nth-child(1)').click(); break; // 1
				case 50: if (this.game.getPlayerById(1)) $('.character').filter(':nth-child(2)').click(); break; // 2
				case 51: if (this.game.getPlayerById(2)) $('.character').filter(':nth-child(3)').click(); break; // 3
				case 52: if (this.game.getPlayerById(3)) $('.character').filter(':nth-child(4)').click(); break; // 4

				//default:console.log(e.keyCode);
	        }
	    }
	    this.inputCache = {};
	},

	processMouseInput: function(){
		if (this.lastDblClick) {
			// iono ("i don't know")
		} else if (this.lastLeftClick) {
	        this.game.walkPlayers(this.lastLeftClick); // passes on the x/y without creating a new object
		} else if (this.lastRightClick) {
			this.game.allPlayersFire(this.lastRightClick); // pass on x/y
		}
		// throw away all events, even if multple
		this.lastDblClick = this.lastLeftClick = this.lastRightClick = null;
	},

	toString: function() {
		return "UI["+this.mapUI+"]";
	},

0:0}
