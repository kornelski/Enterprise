
function MapUI(game,$canvas) {
    var self=this;
    
    this.game = game;
    this.map = game.map;
    
    this.context = $canvas[0].getContext('2d');
    
    // FIXE: repeat on resize
    this.width = this.context.canvas.width = $canvas.width();
    this.height = this.context.canvas.height = $canvas.height();
    
    Test.assert(this.width>0, "the map should at least have one tile x");
    Test.assert(this.height>0, "the map should at least have one tile y");

	this.tile = {width:Config.tileWidth, height:Config.tileHeight};
	
	// center map on spawn point
	var centertile = this.cellToScreen(this.map.spawnPoint.x, this.map.spawnPoint.y);
	this.scroll = {
	    x: centertile.x - this.width/2,
	    y: centertile.y - this.height/2
    };
	

}

MapUI.prototype = {
    
    seasick: 1,
    
    framenumber:0, // used by easter egg
    
    // current mouse position
    mouse: {x:0,y:0},
    
    // current map scroll offset
    scroll: {x:0,y:0},
    scrollSpeed: {x:0, y:0},
    
    imageForTile: function(tile) {
        return tile ? this.tileimg : this.tileimg3;
    },
    
    screenToCell: function(screenx, screeny) {
        screeny = (screeny / this.tile.height / 2);
        screenx = (screenx / this.tile.width);
        
        return {x:screenx + screeny, y:screeny - screenx};
    },
    
    cellToScreen: function(cellx, celly) {
        return {
            x: (cellx - celly)*this.tile.width/2, 
            y: (cellx + celly)*this.tile.height
        };
    },
    
    render: function(cells,objects) {
        
        this.framenumber++;
        this.scroll.x += this.scrollSpeed.x;
        this.scroll.y += this.scrollSpeed.y;        
        
        this.context.clearRect(0,0,this.width,this.height);
    
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
        
        var screensubxpiel = this.cellToScreen(cell.x,cell.y);
        y -= screensubxpiel.y;
        
        do {
            var x= ((line&1) ? this.tile.width/2 : 0) - screensubxpiel.x - this.tile.width/2;
            do {
                var cell = this.screenToCell(x+this.scroll.x,y+this.scroll.y);
                cell.x = Math.floor(cell.x);
                cell.y = Math.floor(cell.y);
                
                var img = this.map.getTile(cell).img;
                var elevation = this.seasick ?                 
                    Math.sin((this.framenumber/10)+cell.x/5)*20 - 
                    Math.sin((this.framenumber/12)+cell.y/3)*20 -
                    Math.sin((this.framenumber/2)+cell.y/10)*2 -
                    Math.sin((this.framenumber/2)+cell.x/20)*3 : 0;
                                
                this.context.drawImage(img, 
                    x - img.width/2, 
                    y - img.height + this.tile.height/2                     
                    - elevation
                    );
                
                x += this.tile.width;
            } while(x < this.width);
            
            y += this.tile.height;
            line++;
        } while(y <= belowbottom);
        
        var objects = this.game.objects;
        for(var i=0; i < objects.length; i++) {
            var o = objects[i];
			Test.assert(o, "expecting the object to exist");
            var model = o.model;
			Test.assert(model, "expecting the object to have a model");
			Test.assert(model instanceof Model, "and it should be a model too");
			// check whether an animation is currently going on
			if (model.currentAnimation) {
				// okay an animation is currently playing.
				// the model should have an animation property with the same name
				// its the callback for that animation
				Test.assert(model.currentAnimation in model.animations, "the current animation should have a callback");
				// so lets call it... back :)
				model.animations[model.currentAnimation].call(model); // set context of call to the model
				// its up to the animator to determine whether it should or should not run
			}
			
			// get screen position of this object
            var pos = this.cellToScreen(o.origin.x,o.origin.y);
			Test.assert(model.img, "should have an image");
            // draw the correct sprite at the screen
			this.context.drawImage(model.img,
				model.width*model.currentSprite, 0, model.width, model.height,
				pos.x - this.scroll.x,pos.y - this.scroll.y, model.width, model.height
			);
			
			
			
            //this.context.fillRect(pos.x - this.scroll.x,pos.y - this.scroll.y,20,20);
            
            
        }
    },
    
	toString: function(){
		return "MapUI[mouse "+self.mouse.x+','+self.mouse.y+"; scroll "+self.scroll.x+','+self.scroll.y+"]";
	},
	
0:0}