

function UI(game, $container) {
    var self=this;

    this.mapCanvas = $container.find('#map');
    this.mapUI = new MapUI(game,this.mapCanvas);

	// update the active game for the hud
	hud.setGame(game);
    
    
    // FIXME: these should be changed only betwen frames
    this.mapCanvas.mousemove(function(e){
        self.mapUI.mouse = {x: e.offsetX/self.mapUI.zoom, y:e.offsetY/self.mapUI.zoom};
    });
    
    this.mapCanvas.mousewheel(function(e){
        if ('wheelDeltaX' in e.originalEvent) {
            self.mapUI.scroll.x -= e.originalEvent.wheelDeltaX;
            self.mapUI.scroll.y -= e.originalEvent.wheelDeltaY;
        }    
    });
    
    this.mapCanvas[0].tabindex=0;
    this.mapCanvas.focus();
    
    this.mapCanvas.click(function(e){        
		var cell = self.mapUI.screenToCell(self.mapUI.mouse.x + self.mapUI.scroll.x,self.mapUI.mouse.y + self.mapUI.scroll.y)
		
        if (e.button > 0 || e.shiftKey) {
            game.fire(cell);
        }
        else {
		    game.walkPlayers(cell);
	    }
		return false;
	});
	
	this.mapCanvas.mousemove(function(e){
		var cell = self.mapUI.screenToCell(self.mapUI.mouse.x + self.mapUI.scroll.x,self.mapUI.mouse.y + self.mapUI.scroll.y)
		$('#coord').html(cell.x.toPrecision(4)+" x "+cell.y.toPrecision(4));
	});
	
	this.mapCanvas[0].oncontextmenu = function(){return false}
    
    
    // FIXME: speed should depend on fps
    $(document.body).keydown(function(e){  
        var speed = e.shiftKey ? 200 : 30;
        switch(e.keyCode) {
			// move map with arrow keys
            case 37: self.mapUI.scrollSpeed.x=-speed; break; // left
            case 39: self.mapUI.scrollSpeed.x=+speed; break; // right
            case 38: self.mapUI.scrollSpeed.y=-speed; break; // down
            case 40: self.mapUI.scrollSpeed.y=+speed; break; // up
            
			// nudge players with wasd keys
			case 87: game.walkPlayersRelative({x:0,y:-1}); break; // w
			case 65: game.walkPlayersRelative({x:-1,y:0}); break; // a
			case 83: game.walkPlayersRelative({x:0,y:1}); break; // s
			case 68: game.walkPlayersRelative({x:1,y:0}); break; // d
			
            case 32: 
                var cell = self.mapUI.screenToCell(self.mapUI.mouse.x + self.mapUI.scroll.x,
                    self.mapUI.mouse.y + self.mapUI.scroll.y);
                game.fire(cell); 
                break;
            
			case 49: $('.character').filter(':nth-child(1)').click(); break; // 1
			case 50: if (game.map.squadSize > 1) $('.character').filter(':nth-child(2)').click(); break; // 2
			case 51: if (game.map.squadSize > 2) $('.character').filter(':nth-child(3)').click(); break; // 3
			case 52: if (game.map.squadSize > 3) $('.character').filter(':nth-child(4)').click(); break; // 4
			
			
			//default:console.log(e.keyCode);
        }
    });
    
    $(document.body).keyup(function(e){
        switch(e.keyCode) {
            case 37: case 39: self.mapUI.scrollSpeed.x=0; break;
            case 38: case 40: self.mapUI.scrollSpeed.y=0; break;
        }
    });
    
    setInterval(function(){
        if (!game.paused) {
			game.frame(); // process game logic first
			self.renderFrame(); // show new state (if any)
			hud.frame(); // update hud
	    }
	},50);
}

UI.prototype = {
        
    renderFrame: function() {
        this.mapUI.render();
    },
    
	toString: function() {
		return "UI["+this.mapUI+"]";
	},
	
0:0}
