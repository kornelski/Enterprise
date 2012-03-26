// a loadqueue accepts an array of files and fires a callback when all of them loaded succesfully
// groups should be an array with objects with a name and files property, files contains the actual paths to load
var LoadQueue = function(groups, callbacks, maxLoading){
	Test.assert(groups instanceof Array, "groups is an array");
	Test.assert(groups.length, "you are loading at least one group");
	this.groups = groups;
	this.cbInit = callbacks.init;
	this.cbLoading = callbacks.loading;
	this.cbLoaded = callbacks.loaded;
	this.cbFinished = callbacks.finished;

	this.toLoad = 0;
	this.loading = 0;
	this.loaded = 0;
	this.finished = false;
	this.maxLoading = maxLoading;
	for (var i=0; i<groups.length; ++i) {
		var group = groups[i];
		Test.assert(group.name, "group should have a name");
		Test.assert(group.files, "group should have files");
		Test.assert(group.files instanceof Array, "files is an array");
		Test.assert(group.files.length, "this group should be loading files");
		group.loading = false;
		group.loaded = false;
		this.toLoad += group.files.length;
		if (i<(maxLoading||1)) this.next(group);
	}
	if (this.cbInit) this.cbInit(this.toLoad);
};
LoadQueue.imageCache = {}; // global image cache
LoadQueue.prototype = {
	next: function(group){
		if (!group.loaded && !group.loading && this.loading < this.maxLoading) {
			var file = group.files.shift();
			if (file) {
				var self = this;
				var cb = function(){
					//console.log("loaded file: ["+group.name+"] : "+file);
					--self.loading;
					++self.loaded;

					if (self.cbLoaded) self.cbLoaded(group, file);
					group.loading = false;
					if (group.files.length == 0) group.loaded = true;

					// if finished, call the callback
					if (self.loaded == self.toLoad && self.cbFinished) self.cbFinished();
					else {
						// run through all groups
						for (var i=0; i<self.groups.length; ++i) {
							self.next(self.groups[i]);
						}
					}
				};
				
				// simulate download lag
				setTimeout(function(){
					if (file.substr(-3) == '.js') self.loadScript(file, cb); // purist in me says substr is not formally part of the language ;)
					else if (['.png','.jpg','.gif'].indexOf(file.substr(-4)) >= 0) self.loadImg(file, cb); // purist in me says substr is not formally part of the language ;)
					else Test.die("Unsupported resource type to load: "+file, cb);
				}, 0);
				++self.loading;
				group.loading = true;
				if (self.cbLoading) self.cbLoading(group, file);
			}
		}
	},
	loadImg: function(file, cb){
		//console.log("loading an image");
		var img = new Image;
		img.onload = function(){
			LoadQueue.imageCache[file] = img;
			Test.assert(cb, "callback should exist");
			cb();
			img.onload = null; // clear onload event function
		};
		img.src = file+'?'+Math.random();
	},
	loadScript: function(file, cb){
		//console.log("loading a script");
		var s = document.createElement('script');
		var self = this;
		s.onload = function(){
			document.body.removeChild(this); // remove script header tag
			cb();
		};
		s.src = file+'?'+Math.random();
		document.body.appendChild(s); // (use body, head is not stable xbrowser, and seriously, it doesnt matter.
	},
0:0};
