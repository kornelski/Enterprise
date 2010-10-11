
function UI(game,$container) {
    var self=this;

    this.mapCanvas = $container.find('#map');
    this.mapUI = new MapUI(game,this.mapCanvas);

	// update the active game for the hud
	hud.setGame(game);
    
    
    // FIXME: these should be changed only betwen frames
    this.mapCanvas.mousemove(function(e){
        self.mapUI.mouse = {x: e.offsetX, y:e.offsetY};
    });
    
    this.mapCanvas.mousewheel(function(e){
        if ('wheelDeltaX' in e.originalEvent) {
            self.mapUI.scroll.x -= e.originalEvent.wheelDeltaX;
            self.mapUI.scroll.y -= e.originalEvent.wheelDeltaY;
        }    
    });
    
    this.mapCanvas[0].tabindex=0;
    this.mapCanvas.focus();
    
    // FIXME: speed should depend on fps
    $(document.body).keydown(function(e){  
        var speed = e.shiftKey ? 200 : 30;
        switch(e.keyCode) {
            case 37: self.mapUI.scrollSpeed.x=-speed; break;
            case 39: self.mapUI.scrollSpeed.x=+speed; break;
            case 38: self.mapUI.scrollSpeed.y=-speed; break;
            case 40: self.mapUI.scrollSpeed.y=+speed; break;
        }
    });
    
    $(document.body).keyup(function(e){
        switch(e.keyCode) {
            case 37: case 39: self.mapUI.scrollSpeed.x=0; break;
            case 38: case 40: self.mapUI.scrollSpeed.y=0; break;
        }
    });
    
    setInterval(function(){self.renderFrame()},50);
}

UI.prototype = {
        
    renderFrame: function() {
        this.mapUI.render();
    },
    
	toString: function() {
		return "UI["+this.mapUI+"]";
	},
	
0:0}
