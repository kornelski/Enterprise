var Test = {
	assert: function(shouldBeTrue, message){
		if (!shouldBeTrue) Test.die(message);
	},
	reject: function(shouldBeFalse, message){
		if (shouldBeFalse) Test.die(message);
	},
	die: function(message){
		console.log("Test fail: "+message);
		debugger;
		throw "Test fail: "+message;
	},
0:0};
