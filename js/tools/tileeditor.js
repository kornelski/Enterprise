// TOFIX: this ugly center hack.
jQuery.prototype.center = function () {
    this.css("position","absolute");
    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
};

var TileEditor = function(game){
	this.game = game;
	this.spawn();
};
TileEditor.prototype = {
	game:null,
	$container:null,
	spawn: function(){
		var self = this;
		this.game.paused = true;
		var img = this.game.lastTileHover.img;
		Test.assert(img.width, "image width is set");
		Test.assert(img.height, "image height is set");
		var c = $('<canvas id="cnvs"></canvas>');
		// set w/h of canvas
		c.width(c[0].width = img.width * 9).height(c[0].height = img.height * 9).css('margin','10px 0 0 10px');
		// enable stylesheet
		$('head').append('<link rel="stylesheet" href="css/tileeditor.css" type="text/css" />');
		// show panel
		this.$container = $('<div id="tileEditor"></div>').width(c[0].width+20).height(c[0].height+20).append(c).appendTo(document.body).center();
		var ctx = c[0].getContext('2d');
		ctx.drawImage(img, 0, 0, img.width * 9, img.height * 9);

		setInterval(function(){
			if (img != self.game.lastTileHover.img) {
				img = self.game.lastTileHover.img;
				ctx.drawImage(img, 0, 0, img.width * 9, img.height * 9);
			}
		}, 200);
	},
0:0};
