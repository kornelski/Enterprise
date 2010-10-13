
function vector(a,b,length) {
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
vector.distance = function(a,b){
	return vector(a,b).length;
};