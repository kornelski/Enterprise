
function MapUI(game,$canvas) {
    var self=this;
    
    this.game = game;
    this.map = game.map;
    
    this.context = $canvas[0].getContext('2d');
    
    this.selectionImage = new Image();
    this.selectionImage.src = 'img/characters/selected.png'
    
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

    this.context.save();    
    this.setZoom(1.0);
}

MapUI.prototype = {
    
    setZoom: function(z) {
        this.zoom = z;
        this.context.restore();
        this.context.scale(z,z);
        this.context.save();        
    },
    
    crazylevel: 0,
    seasick: $('#sea')[0].checked,
    
    framenumber:0, // used by easter egg
    
    // current mouse position
    mouse: {x:0,y:0},
    
    // current map scroll offset
    scroll: {x:0,y:0},
    scrollSpeed: {x:0, y:0},
    
    screenToCell: function(screenx, screeny) {
        screeny = (screeny / this.tile.height / 2);
        screenx = (screenx / this.tile.width);
        
        return {x:screenx + screeny, y:screeny - screenx};
    },
    
    cellToScreen: function(cellx, celly) {
        return {
            x: Math.round((cellx - celly)*this.tile.width/2), 
            y: Math.round((cellx + celly)*this.tile.height)
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
		
		if (this.map.getTile(cell).name == 'water')
		{
            return (                 
                Math.sin((anim/10.1)+cell.x/2)*9* Math.sin((anim/9.1)+cell.y/1.3) - 
                Math.sin((anim/4.2)+cell.y/3)*7 -
                Math.sin((anim/11)+cell.y/17)*5 -
                Math.sin((anim/6)-cell.x/11)*3) - 10;
        }		
        var anim = this.crazylevel > 0.01 ? this.framenumber : 0;
		
        return this.crazylevel * (30+                 
            Math.sin((anim/10)+cell.x/5)*15 - 
            Math.sin((anim/12)+cell.y/3)*15 -
            Math.sin((anim/2)+cell.y/10)*2 -
            Math.sin((anim/2)+cell.x/20)*3);
    },
    
    render: function(cells,objects) {
		// TOFIX: jquery not here etc
		var crazy = this.seasick||$('#sea')[0].checked;

		this.crazylevel = (this.crazylevel*10 + (crazy ? 1.5 : 0.0))/11;
        
        this.framenumber++;
        this.scroll.x += this.scrollSpeed.x;
        this.scroll.y += this.scrollSpeed.y;        
        
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
        
        var screensubxpiel = this.cellToScreen(cell.x,cell.y);
        y -= screensubxpiel.y;
        
        
        this.game.objects.sort(function(a,b){
            return a.screenZIndex - b.screenZIndex;
        })
        var lastObjectIndex=0;
        
        do {
            var x= ((line&1) ? Math.floor(this.tile.width/2) : 0) - screensubxpiel.x - Math.floor(this.tile.width/2);
            do {
                var cell = this.screenToCell(x+this.scroll.x,y+this.scroll.y);
                cell.x = Math.floor(cell.x);
                cell.y = Math.floor(cell.y);
                
                var img = this.map.getTile(cell).img;
                var elevation = this.elevationForCell(cell);
                                
                this.context.globalAlpha = 10.0/(10.0+Math.max(0,-elevation));
                this.context.drawImage(img, 
                    Math.floor(x - Math.floor(img.width/2)), 
                    Math.floor(y - img.height + Math.floor(this.tile.height/2)                     
                    - elevation)
                    );
                
                x += this.tile.width;
            } while(x < this.width/this.zoom);
            
            lastObjectIndex = this.drawObjectsUpTo(lastObjectIndex,y);
            
            y += this.tile.height;
            line++;
        } while(y <= belowbottom/this.zoom);
            
        lastObjectIndex = this.drawObjectsUpTo(lastObjectIndex,y);                
    },
    
    drawObjectsUpTo: function(i,maxY) {
        
        var objects = this.game.objects;
        for(; i < objects.length; i++) {
            var o = objects[i];
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
            var pos = this.cellToScreen(o.origin.x,o.origin.y);
            pos.x -= this.scroll.x;
            pos.y -= this.scroll.y;

            if (pos.y > maxY) break;
            
            var cell = {x:Math.round(o.origin.x),y:Math.round(o.origin.y)}
            var elevation = this.elevationForCell(cell);
			Test.assert(model.img, "should have an image");
			
			// show selected characters
			if (this.game.isSelected(o)) {
			    var s = this.selectionImage;
    			this.context.drawImage(s,
    				Math.floor(pos.x - s.width/2),
    				Math.floor(pos.y - elevation - s.height)
    			);
			}	            
			
            // draw the correct sprite at the screen
            this.context.globalAlpha = o.opacity;
			this.context.drawImage(model.img,
				model.width*model.currentSprite, 0, model.width, model.height,
				Math.floor(pos.x - model.width/2),
				Math.floor(pos.y - elevation - model.height), 
				model.width, model.height
			);
       }    
       return i;
    },
    
	toString: function(){
		return "MapUI[mouse "+self.mouse.x+','+self.mouse.y+"; scroll "+self.scroll.x+','+self.scroll.y+"]";
	},
	
0:0}