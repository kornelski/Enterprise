
function vector2d(a,b,length) {
    if (!length) length=1;

    var vect = {
        x:b.x - a.x,
        y:b.y - a.y
    }
    var fulllength = vect.length = Math.sqrt(vect.x*vect.x + vect.y*vect.y);
    vect.x = vect.x/fulllength * length;
    vect.y = vect.y/fulllength * length;
    return vect;
}

function vector(a,b,length) {
    if (!length) length=1;
    Test.reject(isNaN(a.z),"NaN vector a")
    Test.reject(isNaN(b.z),"NaN vector b")

    var vect = {
        x:b.x - a.x,
        y:b.y - a.y,
        z:b.z - a.z
    }
    var fulllength = vect.length = Math.pow(vect.x*vect.x + vect.y*vect.y + vect.z*vect.z, 1/3);
    Test.reject(isNaN(fulllength),"NaN vector");

    vect.x = vect.x/fulllength * length;
    vect.y = vect.y/fulllength * length;
    vect.z = vect.z/fulllength * length;
    return vect;
}


vector.distance = function(a,b){
	return vector2d(a,b).length;
};
