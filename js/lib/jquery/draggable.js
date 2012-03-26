/*
Simple jQuery draggable "plugin" by Peter van der Zee.
Usage:

var $el = $('#target').draggable();
$el.click($el.undraggable().remove());

Note that you only get the undraggable function on the returned object. 
Something to do with closures and shit.
*/
jQuery.prototype.draggable = function(){
	var 
		$obj = this,
		dragging = false,
		startMouseX,
		startMouseY,
		startObjectX,
		startObjectY;
	
		ondragstart = function(e){
			dragging = true;
			startMouseX = e.pageX;
			startMouseY = e.pageY;
			var pos = $obj.offset();
			startObjectX = pos.left;
			startObjectY = pos.top;
		},
		ondragging = move = function(e){
			if (dragging) {
				$obj.css({
					left:startObjectX+(e.pageX-startMouseX)+'px',
					top:startObjectY+(e.pageY-startMouseY)+'px'
				});
			}
		},
		ondragstop = function(){
			dragging = false;
		};
	
	// hook events
	this.mousedown(ondragstart);
	$(document)
	.mousemove(ondragging)
	.mouseup(ondragstop);
	
	// unhook events, function is attached to returned object...
	$obj.undraggable = function(){
		$obj.unbind('mousedown',ondragstart);
		$(document)
		.unbind('mousemove',ondragging)
		.unbind('mouseup',ondragstop);
		delete $obj.undraggable;
		ondragstart = ondragstop = ondragging = null;
		return $obj;
	};
	
	return $obj;
};
