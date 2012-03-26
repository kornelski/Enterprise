
var MapUI = function(game,$canvas, ui) {
    var self=this;

    this.game = game;
    this.map = game.map;
    this.ui = ui;

    this.context = $canvas[0].getContext('2d');

    this.selectionImage = new Image();
    this.selectionImage.src = 'img/characters/selected.png'

    // FIXE: repeat on resize
    this.width = this.context.canvas.width = $canvas.width();
    this.height = this.context.canvas.height = $canvas.height();

    Test.assert(this.width>0, "the map should at least have one tile x");
    Test.assert(this.height>0, "the map should at least have one tile y");

	this.tile = {
	    width:Config.tileWidth,
	    height:Config.tileHeight,
	    z: Config.tileHeight}; // y*px offset for things 1*cellunit above the ground.

	// center map on spawn point
	var centertile = this.cell2dToScreen(this.map.spawnPoint.x, this.map.spawnPoint.y, false);
	this.scroll = {
	    x: centertile.x - this.width/2,
	    y: centertile.y - this.height/2
    };

    this.context.save();
    this.setZoom(1.0);
}

MapUI.prototype = {
	ui: null, // parent UI

    crazylevel: 0, // wave effect counter

    framenumber:0, // used by easter egg

    // current mouse position
    mouse: {x:0,y:0},

    // current map scroll offset
    scroll: {x:0,y:0},

    setZoom: function(z) {
        this.zoom = z;
        this.context.restore();
        this.context.scale(z,z);
        this.context.save();
    },

    screenToCell: function(screenx, screeny) {
        screeny = (screeny / this.tile.height / 2);
        screenx = (screenx / this.tile.width);

        return {x:screenx + screeny, y:screeny - screenx};
    },

	// subScroll: subtract the scroll offsets? (you usually want this to convert cell to screen)
    cell2dToScreen: function(cellx, celly, subScroll) {
        return this.cellToScreen({x:cellx,y:celly,z:0},subScroll);
    },

    // also shifts things up for the map z-axis
    cellToScreen: function(point, subScroll) {
		Test.assert(typeof point == 'object', "cell to screen expects an object");
        Test.assert('x' in point,"cellToScreen now takes object");
        Test.assert('z' in point,"we're 3d now!");
        Test.reject(isNaN(point.z),"no imaginary z please " + point.z);
        return {
            x: Math.round((point.x - point.y)*this.tile.width/2) - (subScroll?this.scroll.x:0),
            y: Math.round((point.x + point.y)*this.tile.height) - (point.z*this.tile.z) - (subScroll?this.scroll.y:0)
        };
    },


    elevationForCell: function(cell) {
        // var selectedtile = this.screenToCell(this.mouse.x + this.scroll.x,this.mouse.y+this.scroll.y);
        // selectedtile.x = Math.floor(selectedtile.x);
        // selectedtile.y = Math.floor(selectedtile.y);
        //
        // var extra=0;
        // if (cell.x==selectedtile.x && cell.y==selectedtile.y) {
        //     extra = 10;
        // }

        var anim = this.framenumber;

		if (this.map.getTile(cell).name == 'water') {
            return (
                Math.sin((anim/10.1)+cell.x/2)*9* Math.sin((anim/9.1)+cell.y/1.3) -
                Math.sin((anim/4.2)+cell.y/3)*7 -
                Math.sin((anim/11)+cell.y/17)*5 -
                Math.sin((anim/6)-cell.x/11)*3
            ) - 10;
        }

		// no need to compute anything if not in carpet mode
        if (!this.crazylevel) return 0;

        var anim = this.crazylevel > 0.01 ? this.framenumber : 0;

        return this.crazylevel * (30+
            Math.sin((anim/10)+cell.x/5)*15 -
            Math.sin((anim/12)+cell.y/3)*15 -
            Math.sin((anim/2)+cell.y/10)*2 -
            Math.sin((anim/2)+cell.x/20)*3);
    },

    render: function() {
		var crazy = Config.flyingCarpetMode;

		this.crazylevel = (this.crazylevel*10 + (crazy ? 1.5 : 0.0))/11; // TOFIX: no magic numbers please...

        this.framenumber++;

        this.context.fillStyle = '#14b'
        this.context.fillRect(0,0,this.width,this.height);
//        this.context.setTransform(1,0,1,0,0,0);

        Test.assert(this.tile.width>0,"loop must end");
        Test.assert(this.tile.height>0,"loop must end");

        var belowbottom = this.height + this.tile.height*7; // line partially offscreen (highest tile)

        var y=-this.tile.height/2; // start with partially offscreen line
        var line=0; // odd lines are shifted

        // scroll corrected by less than one tile
        var cell = this.screenToCell(0+this.scroll.x,y+this.scroll.y);
        cell.x -= Math.floor(cell.x);
        cell.y -= Math.floor(cell.y);
        Test.assert(cell.x<1,"only fractional part");

        var screensubpixel = this.cell2dToScreen(cell.x,cell.y,false);
        y -= screensubpixel.y;


        this.game.actors.sort(function(a,b){
            return a.screenZIndex - b.screenZIndex;
        })
        var lastActorIndex=0;

		var mouse = this.ui.lastKnownMousePosition;
        do {
            var x= ((line&1) ? Math.floor(this.tile.width/2) : 0) - screensubpixel.x - Math.floor(this.tile.width/2);
            var cell = this.screenToCell(x+this.scroll.x,y+this.scroll.y);
            cell.x = Math.floor(cell.x);
            cell.y = Math.floor(cell.y);
            do {

                var img = this.map.getTile(cell).img;
                var elevation = this.elevationForCell(cell);

                this.context.globalAlpha = 10.0/(10.0+Math.max(0,-elevation));
                this.context.drawImage(img,
                    Math.floor(x - Math.floor(img.width/2)),
                    Math.floor(y - img.height + Math.floor(this.tile.height/2)
			- elevation)
                );

		        if (mouse && Math.round(mouse.x) == cell.x && Math.round(mouse.y) == cell.y) {
				var hoverImg = new Image;
				hoverImg.src = "img/hover_blue.png";
	                this.context.drawImage(hoverImg,
	                    Math.floor(x - Math.floor(hoverImg.width/2)),
	                    Math.floor(y - hoverImg  .height + Math.floor(this.tile.height/2)
				- elevation)
	                );
		        }

                x += this.tile.width;
                cell.x += 1;
                cell.y -= 1;
            } while(x < this.width/this.zoom);

            lastActorIndex = this.drawActorsUpTo(lastActorIndex,y);

            y += this.tile.height;
            line++;
        } while(y <= belowbottom/this.zoom);

        lastActorIndex = this.drawActorsUpTo(lastActorIndex,y);
    },

	// expects lines in cell units ({x:float,y:float,color:string=red})
	renderLines: function(){
		for (var i=0; i<this.game.linesToDraw.length; ++i) {
			var line = this.game.linesToDraw[i];
			Test.assert(line, "line exists");
			Test.assert(line.start, "start exists");
			Test.assert(line.end, "end exists");
			var start = this.cell2dToScreen(line.start.x, line.start.y, true);
			var end = this.cell2dToScreen(line.end.x, line.end.y, true);
			this.context.strokeStyle = line.color || 'red';
			this.context.beginPath();
			this.context.moveTo(start.x, start.y);
			this.context.lineTo(end.x, end.y);
			this.context.closePath();
			this.context.stroke();
		}
		// clear array
		this.game.linesToDraw.length = 0;
	},

    drawActorsUpTo: function(i,maxY) {
		var config = Config; // cache global
        var actors = this.game.actors;
	var mouse = this.ui.lastKnownMousePosition;
        for(; i < actors.length; i++) {
            var o = actors[i];
            o.frame(); // compute what's next

			Test.assert(o, "expecting the object to exist");
            var model = o.model;
			Test.assert(model, "expecting the object to have a model");
			Test.assert(model instanceof Model, "and it should be a model too");
			// check whether an animation is currently going on
			if (model.currentAnimator) {
				// okay an animator is currently playing.
				// the model should have an animator property with the same name
				// its the callback for that animation
				Test.assert(model.currentAnimator in model.animators, "the current animation should have an animator");
				// so lets call it... back :)
				model.animators[model.currentAnimator].call(model); // set context of call to the model
            }

			// get screen position of this object
            var pos = this.cellToScreen(o.origin,true);

            if (pos.y > maxY) break;

            var cell = {x:Math.round(o.origin.x),y:Math.round(o.origin.y)}
            var elevation = this.elevationForCell(cell);
			Test.assert(model.img, "should have an image");

			// show selected characters
			if (o instanceof Actor.Player && this.game.isSelected(o)) {
			    var s = this.selectionImage;
			this.context.drawImage(s,
				Math.floor(pos.x - s.width/2),
				Math.floor(pos.y - elevation - s.height) // FIXME: draw at origin.z=0
			);
			}

			// mouse position
	        if (mouse && Math.round(mouse.x) == cell.x && Math.round(mouse.y) == cell.y) {
			var hoverImg = new Image;
			hoverImg.src = "img/hover_red.png";
			this.context.drawImage(hoverImg,
				Math.floor(pos.x - hoverImg.width/2),
				Math.floor(pos.y - elevation - hoverImg.height) // FIXME: draw at origin.z=0
			);
	        }

			Test.assert(model.img, "expecting an image here");
			Test.assert(model.img.width, "images should have content... "+model.img.src);

            // draw the correct sprite at the screen
            this.context.globalAlpha = o.opacity;
            Test.assert(model.img,"model must have an image");
            Test.assert(model.img.width,"model must be loaded");
            Test.assert(model.currentSprite>=0,"sprite >= 0");
            Test.assert(model.currentSprite>=0,"sprite >= 0");
			this.context.drawImage(model.img,
				model.width*model.currentSprite, 0,
				model.width, model.height,
				Math.floor(pos.x - model.width/2),
				Math.floor(pos.y - elevation - model.height),
				model.width,
				model.height
			);

			if (config.drawRectanglesForActors) {
				// draw box around actors to search for spriteless actors...
				this.context.strokeRect(
					Math.floor(pos.x - model.width/2),
					Math.floor(pos.y - elevation - model.height),
					model.width,
					model.height
				);
			}

			// show target for AI
			if (Config.aiShowTarget && o instanceof Actor.Enemy) {
				var target;
				if (o.enemyState == 'agressive') target = o.lastKnownClosestPlayerLocation;
				else {
					Test.assert(o.enemyState == 'normal', "We only use two enemy states at the time of writing, normal and agressive");
					if (o.enemyType == 'patrol') target = o.waypoints[o.currentWaypoint];
					else if (o.enemyType == 'sentry') target = o.waypoints[0];
					else if (o.enemyType == 'random') target = o.lastKnownClosestPlayerLocation;
					else Test.die("Unknown enemy type: "+o.enemyType);
				}
				// push line on draw stack (will be drawn after everything else is drawn to ensure it's not overlapped by enemies or tiles)
				if (target && Config.drawShootLines) {
					this.game.linesToDraw.push({start:{x:o.origin.x,y:o.origin.y},end:{x:target.x, y:target.y}});
				}
			}

			// draws walking path, but also crashes Safari :)
			if (o instanceof Actor.Player) {
				if (o.walkPath.length) {
				//console.log(target.x, target.y, targetScreen.x, targetScreen.y);
					var plast = {x:o.origin.x,y:o.origin.y};
					for(var pathi=0; pathi<o.walkPath.length; pathi++) {
    					var pnow = o.walkPath[pathi];
    					this.game.linesToDraw.push({start:plast, end:pnow, color:'yellow'});
    					plast = pnow;
				    }
				}
			}

			// draw health
			if (o.health && Config.showHealthNumbered) {
				this.context.fillStyle = 'black';
				this.context.fillRect(
					pos.x - (o.model.width/2),
					pos.y - elevation - o.model.height - 15,
					o.model.width,
					30
				);
				this.context.fillStyle = 'white';
				this.context.font = '11px Verdana';
				this.context.textAlign = 'center';
				this.context.fillText(
					o.health.toFixed(1),
					pos.x,
					pos.y - elevation - o.model.height - 5
				);
				this.context.fillText(
					o.origin.x.toFixed(0)+"x"+o.origin.y.toFixed(0),
					pos.x,
					pos.y - elevation - o.model.height + 10
				);
			}
       }
       return i;
    },

    emitSounds: function() {
        if (!this.game.sounds.length) return;

        for(var i=0; i < this.game.sounds.length; i++) {
            var snd = this.game.sounds[i];
            // FIXME: this needs cache of Audio objects, as volume etc. is per-Audio
            // and browsers are pretty bad at caching sounds.
            if (!snd.preset.audio) {
                snd.preset.audio = new Audio(snd.src);
            }
            snd.preset.audio.play();
        }
    },

	toString: function(){
		return "MapUI[mouse "+self.mouse.x+','+self.mouse.y+"; scroll "+self.scroll.x+','+self.scroll.y+"]";
	},

0:0}
