/* 	astar.js http://github.com/bgrins/javascript-astar
	Implements the astar search algorithm in javascript using a binary heap
	**Requires graph.js**

	Binary Heap taken from http://eloquentjavascript.net/appendix2.html
	with license: http://creativecommons.org/licenses/by/3.0/

	Example Usage:
		var graph = new Graph([
			[0,0,0,0],
			[1,0,0,1],
			[1,1,0,0]
		]);
		var start = graph.nodes[0][0];
		var end = graph.nodes[1][2];
		astar.search(graph.nodes, start, end);

	See graph.js for a more advanced example
*/
var astar = {
    init: function(grid) {
		// TOFIX: do not use given array...
        for(var y = 0; y < grid.length; y++) {
            var l = grid[y].length;
            for(var x = 0; x < l; x++) {
            	var node = grid[y][x];
            	node.x=x;
            	node.y=y;
                node.estimatedTotalCost = 0;
                node.costFromStart = 0;
                node.estimatedCostToEnd = 0;
                node.visited = false;
                node.closed = node.isWall();
                node.debug = "";
                node.parent = null;
            }
        }
    },
    search: function(grid, startNode, endNode, heuristic) {
		// initialize grid.
        astar.init(grid);
		
		// heuristic determines effectiveness of path. for path finding, distance to walk is the heuristic.
        heuristic = heuristic || astar.manhattan;

		
		var openHeap = new BinaryHeap(function(node){return node.estimatedTotalCost;});
		openHeap.push(startNode);

        while(openHeap.size() > 0) {
        	// Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

		    // End case -- result has been found, return the traced path
		    if(currentNode === endNode) {
			    var curr = currentNode;
			    var ret = [];
			    while(curr.parent) {
				    ret.push(curr);
				    curr = curr.parent;
			    }
			    return ret; //.reverse(); // don't reverse, it will be easier to pop
		    }

		    // Normal case -- move currentNode from open to closed, process each of its neighbors
		    currentNode.closed = true;

		    astar.neighbors(grid, currentNode, function(neighbor, stepCost) {

			    if(neighbor.closed) {
				    // not a valid node to process, skip to next neighbor
				    return;
			    }

			    // g score is the shortest distance from start to current node, we need to check if
			    //   the path we have arrived at this neighbor is the shortest one we have seen yet
			    // 1 is the distance from a node to it's neighbor.  This could be variable for weighted paths.
			    var costFromStartToNeighbour = currentNode.costFromStart + stepCost;
			    var beenVisited = neighbor.visited;

			    if(!beenVisited || costFromStartToNeighbour < neighbor.costFromStart) {

				    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
				    neighbor.visited = true;
				    neighbor.parent = currentNode;
				    neighbor.estimatedCostToEnd = neighbor.estimatedCostToEnd || heuristic(neighbor, endNode);
				    neighbor.costFromStart = costFromStartToNeighbour;
				    neighbor.estimatedTotalCost = neighbor.costFromStart + neighbor.estimatedCostToEnd;
				    neighbor.debug = Math.floor(neighbor.estimatedTotalCost);// + "<br />G: " + neighbor.costFromStart + "<br />H: " + neighbor.estimatedCostToEnd;

				    if (!beenVisited) {
				    	// Pushing to heap will put it in proper place based on the 'f' value.
				    	openHeap.push(neighbor);
				    }
				    else {
				    	// Already seen the node, but since it has been rescored we need to reorder it in the heap
				    	openHeap.rescoreElement(neighbor);
				    }
				}
		    });
        }

        // No result was found -- empty array signifies failure to find path
        return [];
    },

	// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    manhattan: function(pos0, pos1) {
        return Math.abs(pos1.x - pos0.x)+Math.abs(pos1.y - pos0.y);
    },
    distance: function(pos0, pos1) {
        var d1 = pos1.x - pos0.x;
        var d2 = pos1.y - pos0.y;
        return Math.sqrt(d1*d1+d2*d2);
    },

    neighbors: function(grid, node, ret) {
        //Test.assert('x' in node,"node must have x/y" + node);
	    var x = node.x;
	    var y = node.y;
	    //Test.assert(y>=0,"y>=0");
	    //Test.assert(x>=0,"x>=0");

	    if(grid[y-1]) {
    	    if (grid[y-1][x+1]) ret(grid[y-1][x+1], 2);
    	    if (grid[y-1][x-1]) ret(grid[y-1][x-1], 2);
		    ret(grid[y-1][x],1);
	    }
	    if(grid[y+1]) {
	        ret(grid[y+1][x],1);
	        if (grid[y+1][x+1]) ret(grid[y+1][x+1], 2);
	        if (grid[y+1][x-1]) ret(grid[y+1][x-1], 2);
	    }
	    if (grid[y]) {
	    if(grid[y][x-1]) {
		    ret(grid[y][x-1],1);
	    }
	    if(grid[y][x+1]) {
		    ret(grid[y][x+1],1);
	    }}
    }
};


