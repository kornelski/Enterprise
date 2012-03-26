//<map version="1.0" orientation="isometric" width="20" height="15" tilewidth="52" tileheight="26">
//<tileset firstgid="22" name="oo" tilewidth="52" tileheight="26">
//  <image source="Develop/Enterprise/img/hr-sort/office-a2.png"/>
// </tileset>
//<tile gid="0"/>
$(function() {
	var json = {map: {}, tiles: []};
	var form = $('form');
	var submit = $('input[type=button]');
	submit.click(function() {
		var xml = $('#xml').val();
		var obj = $(xml);
		var map = obj.siblings('map');
		var mapWidth = Math.floor(map.attr('width'));
		var mapHeight = Math.floor(map.attr('height'));
		json.map.width = mapWidth;
		json.map.height = mapHeight;
		var tiles = obj.find('tile');
		var tilesLength = tiles.size();
		for(var i=0; i<tilesLength; i++) {
			var current = tiles.eq(i);
			var row = Math.floor(i / mapWidth);
			if (i % mapWidth == 0) {
				json.tiles[row] = [];
			}
			json.tiles[row].push(Math.floor(current.attr('gid')));
		}
		$('#json').val(JSON.stringify(json));
	});


});
