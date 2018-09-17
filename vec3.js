function vec3(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}
vec3.prototype = {
	length: function(){
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	},
	length_2: function(){
		return this.x*this.x + this.y*this.y + this.z*this.z;
	},
	dist: function(v){
		return this.subtract(v).length();
	},
	dist_2: function(v){
		return this.subtract(v).length_2();		
	},
	normalise: function(){
		var l = 1/this.length();
		return new vec3(this.x*l, this.y*l, this.z*l);
	},
	sNormalise: function(){
		var l = 1/this.length();
		this.x *= l;
		this.y *= l;
		this.z *= l;
		return this;
	},
	scale: function(s){
		return new vec3(this.x*s, this.y*s, this.z*s);
	},
	sScale: function(s){
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	},
	setLength: function(s){
		this.sScale( s/this.length() );
		return this;
	},
	add: function(v){
		return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
	},
	sAdd: function(v){
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	},
	subtract: function(v){
		return new vec3(this.x - v.x, this.y - v.y, this.z - v.z);
	},
	sSubtract: function(v){
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	},
	mult: function(v){
		return new vec3(this.x*v.x, this.y*v.y, this.z*v.z);
	},
	sMult: function(v){
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
	},
	divide: function(v){
		return new vec3(this.x/v.x, this.y/v.y, this.z/v.z);
	},
	sDivide: function(v){
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
	},
	angle: function(v){
		return Math.acos(this.dot(v)/( this.length()*v.length() ));
	},
	equals: function(v){
		return this.x === v.x && this.y === v.y && this.z === v.z;
	},
	set: function(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	},
	c: function(){
		return new vec3(this.x, this.y, this.z);
	},
	clone: function(){
		return new vec3(this.x, this.y, this.z);
	},
	swizzle: function(str){
		var arr = str.split('').map((c) => {return this[c];});
		arr = arr.filter((item) => {return typeof item !== 'undefined'});
		switch(arr.length){
			case 2:
				return new vec2(arr[0], arr[1]);
			case 3:
				return new vec3(arr[0], arr[1], arr[2]);
			default:
				return new vecn(arr);
				//bestaat nog niet
		}
	},
	dot: function(v){
		return this.x*v.x + this.y*v.y + this.z*v.z;
	},
	cross: function(v){
		return new vec3(
			this.y*v.z - this.z*v.y,
			this.z*v.x - this.x*v.z,
			this.x*v.y - this.y*v.x
		);
	},
	projectOn: function(v){
		return v.scale(this.dot(v)/v.length_2());
	},
};
vec3.fromPolar = function(theta=0, phi=0, r=1){
	return new vec3(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
};
vec3.random = function(){
	return new vec3(Math.random(), Math.random(), Math.random());
};
vec3.random2 = function(){
	return new vec3(Math.random()*2 - 1, Math.random()*2 - 1, Math.random()*2 - 1);
};
vec3.randomUnit = function(thetamin=0, thetamax=2*Math.PI, phimin=0, phimax=2*Math.PI){
	var theta = Math.random()*2*Math.PI;
	var cos_phi = Math.random()*2 - 1;
	var sin_phi = Math.sqrt(1 - cos_phi*cos_phi);
	
	return new vec3(sin_phi*Math.cos(theta), sin_phi*Math.sin(theta), cos_phi);
}
vec3.make = function(){
	var arr = [];
	for(var i=0; i<arguments.length && arr.length < 3; i++){
		//includes vector like objects
		if(typeof arguments[i].x !== 'undefined'){
			arr.push(arguments[i].x);
			if(typeof arguments[i].y !== 'undefined'){
				arr.push(arguments[i].y);
				if(arguments[i].z){
					arr.push(arguments[i].z);
				}
			}
		}else if(arguments[i] instanceof Array){
			//includes arrays
			arr = arr.concat(arguments[i]);
		}else{
			//includes numbers
			arr.push(arguments[i]);
		}
	}
	arr = arr.filter((item) => {return typeof(item) === 'number' && isFinite(item);});
	if(arr.length == 0){
		arr[0] = 0;
	}
	while(arr.length < 3){
		arr[arr.length] = arr[arr.length - 1];
	}
	return new vec3(arr[0], arr[1], arr[2]);
};
function drawArrow(ctx, startPos, endPos, arrowHeadLength, arrowAngle){
	var arrowHeadLength = (typeof arrowHeadLength=="undefined")? 15 : arrowHeadLength;
	var l = endPos.subtract(startPos).length();
	arrowHeadLength = Math.min(arrowHeadLength, l*.5);
	var arrowAngle = (typeof arrowAngle=="undefined")? .4 : arrowAngle;
	var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.moveTo(startPos.x, startPos.y);
	ctx.lineTo(endPos.x, endPos.y);
	ctx.stroke();
	ctx.lineTo(endPos.x + arrowHeadLength*Math.cos(Math.PI + angle - arrowAngle), endPos.y + arrowHeadLength*Math.sin(Math.PI + angle - arrowAngle));
	ctx.lineTo(endPos.x + arrowHeadLength*Math.cos(Math.PI + angle + arrowAngle), endPos.y + arrowHeadLength*Math.sin(Math.PI + angle + arrowAngle));
	ctx.lineTo(endPos.x, endPos.y);
	ctx.fill();
}