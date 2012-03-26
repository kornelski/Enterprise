var Storage = {
	get: function(key){
		return window.localStorage && localStorage.getItem(key);
	},
	set: function(key, value){
		window.localStorage && localStorage.setItem(key, value);
	}
};
