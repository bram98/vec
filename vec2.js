function vec2(x, y){
	this.x = x;
	this.y = y;
}
vec2.prototype = {
	length: function(){
		return Math.sqrt(this.x*this.x + this.y*this.y);
	},
	length_2: function(){
		return this.x*this.x + this.y*this.y;
	},
	dist: function(v){
		return this.subtract(v).length();
	},
	dist_2: function(v){
		return this.subtract(v).length_2();		
	},
	normalise: function(){
		var l = 1/this.length();
		return new vec2(this.x*l, this.y*l);
	},
	sNormalise: function(){
		var l = 1/this.length();
		this.x *= l;
		this.y *= l;
		return this;
	},
	setLength: function(s){
		this.sScale( s/this.length() );
		return this;
	},
	add: function(v){
		return new vec2(this.x + v.x, this.y + v.y);
	},
	sAdd: function(v){
		this.x += v.x;
		this.y += v.y;
		return this;
	},
	subtract: function(v){
		return new vec2(this.x - v.x, this.y - v.y);
	},
	sSubtract: function(v){
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},
	scale: function(s){
		return new vec2(this.x*s, this.y*s);
	},
	sScale: function(s){
		this.x *= s;
		this.y *= s;
		return this;
	},
	mult: function(v){
		return new vec2(this.x*v.x, this.y*v.y);
	},
	sMult: function(v){
		this.x *= v.x;
		this.y *= v.y;
	},
	divide: function(v){
		return new vec2(this.x/v.x, this.y/v.y);
	},
	sDivide: function(v){
		this.x /= v.x;
		this.y /= v.y;
	},
	rotate: function(angle){
		var cosa = Math.cos(angle);
		var sina = Math.sin(angle);
		return new vec2(this.x*cosa - this.y*sina, this.x*sina + this.y*cosa);
	},
	sRotate: function(angle){
		var cosa = Math.cos(angle);
		var sina = Math.sin(angle);
		var oldx = this.x;
		this.x = this.x*cosa - this.y*sina;
		this.y =   oldx*sina + this.y*cosa;
		return this;
	},
	angleWith: function(v){
		return Math.acos(this.dot(v)/( this.length()*v.length() ));
	},
	angle: function(){
		return Math.atan2( this.y, this.x );
	},
	equals: function(v){
		return this.x === v.x && this.y === v.y;
	},
	set: function(x, y){
		this.x = x;
		this.y = y;
		return this;
	},
	c: function(){
		return new vec2(this.x, this.y);
	},
	clone: function(){
		return new vec2(this.x, this.y);
	},
	swizzle: function(str){
		var arr = str.split('').map((c) => {return this[c];});
		arr = arr.filter((item) => {typeof item !== 'undefined'});
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
	addPolar: function(theta, r){
		return this.add(vec2.fromPolar(theta, r));
	},
	dot: function(v){
		return this.x*v.x + this.y*v.y;
	},
	cross: function(v){
		return this.x*v.y - this.y*v.x;
	},
	crossWithZ(z){
		return new vec2(this.y*z, -this.x*z);
	},
	projectOn: function(v){
		return v.scale(this.dot(v)/v.length_2());
	},
	rejectOn: function(v){
		return this.subtract( this.projectOn(v) );
	},
	draw: function(ctx, startPos, scale, arrowHeadLength, arrowAngle){
		var scale = (typeof scale == 'undefined')? 1 : scale;
		var v = this.scale(scale);
		var endPos = startPos.add(v);
		var arrowHeadLength = (typeof arrowHeadLength=="undefined")? 15 : arrowHeadLength;
		var l = v.length();
		arrowHeadLength = Math.min(arrowHeadLength, l*.5);
		var arrowAngle = (typeof arrowAngle=="undefined")? .4 : arrowAngle;
		var angle = Math.atan2(v.y, v.x);
		
		ctx.beginPath();
		ctx.moveTo(startPos.x, startPos.y);
		ctx.lineTo(endPos.x, endPos.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(endPos.x, endPos.y);
		ctx.lineTo(endPos.x + arrowHeadLength*Math.cos(Math.PI + angle - arrowAngle), endPos.y + arrowHeadLength*Math.sin(Math.PI + angle - arrowAngle));
		ctx.lineTo(endPos.x + arrowHeadLength*Math.cos(Math.PI + angle + arrowAngle), endPos.y + arrowHeadLength*Math.sin(Math.PI + angle + arrowAngle));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
};
vec2.fromPolar = function(theta, r){
	var r = (typeof r != 'undefined')? r : 1;
	return new vec2(r*Math.cos(theta), r*Math.sin(theta));
};
vec2.random = function(){
	return new vec2(Math.random(), Math.random());
};
vec2.random2 = function(){
	return new vec2(Math.random()*2 - 1, Math.random()*2 - 1);
};
vec2.randomUnit = function(thetaMin=0, thetaMax=2*Math.PI){
	return vec2.fromPolar(Math.random()*thetaMax + thetaMin);
};
vec2.make = function(){
	var arr = [];
	for(var i=0; i<arguments.length && arr.length < 2; i++){
		if(typeof arguments[i].x !== 'undefined' && typeof arguments[i].y !== 'undefined'){
			arr.push(arguments[i].x, arguments[i].y);
		}else if(arguments[i].length > 1){
			arr.push(arguments[i][0], arguments[i][1]);
		}else if(typeof arguments[i] == 'number'){
			arr.push(arguments[i]);
		}
	}
	if(arr.length == 0){
		arr[0] = 0;
	}
	if(arr.length < 2){
		arr[1] = arr[0];
	}
	return new vec2(arr[0], arr[1]);
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