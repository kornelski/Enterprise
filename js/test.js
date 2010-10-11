var Test = {
	assert: function(shouldBeTrue, message){
		if (!shouldBeTrue) Test.die(message);
	},
	reject: function(shouldBeFalse, message){
		if (shouldBeFalse) Test.die(message);
	},
	die: function(message){
		throw "Test fail: "+message;
	},
0:0};
