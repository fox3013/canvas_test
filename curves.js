

Curves = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },

	easeInSine: function (t) {
		return 1 - Math.cos(t * (Math.PI/2));
	},
	easeOutSine: function (t) {
		return Math.sin(t * (Math.PI/2));
	},
	easeInOutSine: function (t) {
		return -1/2 * (Math.cos(Math.PI*t) - 1);
	},
	easeInExpo: function (t) {
		return (t==0) ? 0 : Math.pow(2, 10 * (t - 1));
	},
	easeOutExpo: function (t) {
		return (t==1) ? 1 : (-Math.pow(2, -10 * t) + 1);
	},
	easeInOutExpo: function (t) {
		if (t==0) return 0;
		if (t==1) return 1;
		if (t>1/2) return 1/2 * Math.pow(2, 10 * (2*t - 1));
		return 1/2 * (-Math.pow(2, -10 * (2*t-1)) + 2);
	},
	easeInCirc: function (t) {
		return (Math.sqrt(t*t));
	},
	easeOutCirc: function (t) {
		return Math.sqrt(1 - t*t);
	},
	easeInOutCirc: function (t) {
    if (t==0.5) return 0.5;
    if (t<0.5) return -(Math.sqrt(1-2*t)-1)/2.0;
    return Math.sqrt(2*t-1)/2 + 0.5;
	},
	easeInElastic: function (t) {
		var s=1.70158;var p=0;var a=1;
		if (t==0) return 0;  if (t==1) return 1;  if (!p) p=1*.3;
		if (a < Math.abs(1)) { a=1; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (1/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
	},
	easeOutElastic: function (t) {
		var s=1.70158;var p=0;var a=1;
		if (t==0) return 0;  if (t==1) return 1;  if (!p) p=1*.3;
		if (a < Math.abs(1)) { a=1; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (1/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t-s)*(2*Math.PI)/p ) + 1;
	},
	easeInOutElastic: function (t) {
		var s=1.70158;var p=0;var a=1;
		if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
		if (a < Math.abs(1)) { a=1; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (1/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p )*.5 + 1;
	},
	easeInBack: function (t, s=1.70158) {
    if ( t == 1) return 1;
		return t*t*((s+1)*t - s);
	},
	easeOutBack: function (t, s= 1.70158) {
    if (t == 0) return 0;
		return ((t=t/1-1)*t*((s+1)*t + s) + 1);
	},
	easeInOutBack: function (t, s= 1.70158) {
		if ((t/=1/2) < 1) return 1/2*(t*t*(((s*=(1.525))+1)*t - s));
		return 1/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
	},
	easeInBounce: function (t) {
		return 1 - Curves.easeOutBounce (1-t);
	},
	easeOutBounce: function (t) {
		if (t < (1/2.75)) {
			return 7.5625*t*t;
		} else if (t < (2/2.75)) {
			return (7.5625*(t-=(1.5/2.75))*t + .75);
		} else if (t < (2.5/2.75)) {
			return (7.5625*(t-=(2.25/2.75))*t + .9375);
		} else {
			return (7.5625*(t-=(2.625/2.75))*t + .984375);
		}
	},
	easeInOutBounce: function (t) {
		if (t < 1/2) return Curves.easeInBounce (t*2) * .5;
		return Curves.easeOutBounce (t*2-1) * .5 + .5;
	}
};
