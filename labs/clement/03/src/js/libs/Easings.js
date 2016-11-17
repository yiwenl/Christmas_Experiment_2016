define(function (require, exports, module)
{

    var Easings = function()
    {
      this.updating = false;
      this.iterationCount = 0;

      this.tweens = [];

    };

    Easings.prototype.killTweensOf = function(obj){
      for (var i = 0; i < this.tweens.length; i++) {
        var t = this.tweens[i];
        // console.log("trytodelete");
        // same object ?
        if(t.obj=== obj && t.obj.id === obj.id){
          // t.delete = true;
          t = null;
          this.tweens.splice(i, 1);
          i--;
        }
      }
    };

    Easings.prototype.to = function(obj, duration, vars, test){
      var tween = {
        delete: false,
        currentIteration: 0,
        isArray: false,
        obj: obj,
        vars: vars,
        delay: vars.delay * 60 || 0,
        isDelayed: (vars.delay && vars.delay > 0) ?  true: false,
        duration: duration * 60,
        ease: vars.ease || this.easeLinear
      }

      if(obj instanceof Array){

        tween.isArray = true;

        var varToTween = [];
        for (var v in vars) {
          if(v !== "delay" && v !== "duration" && !this.isFunction(vars[v])){

            var object = {
              var: v,
              toValue: vars[v]
            }

            var values = [];
            for (var i = 0; i < obj.length; i++) {
              values.push(obj[i]);
            }
            object.value = values;

            varToTween.push(object);
          }
        }
      }
      else {
        var varToTween = [];

        for (var v in vars) {
          if(v !== "delay" && v !== "duration" && !this.isFunction(vars[v]) && v !== "forceTween"){

            for (var i = 0; i < this.tweens.length; i++) {
              var t = this.tweens[i];

              // same object ?
              if(t.obj === obj){
                for (var k = 0; k < t.props.length; k++) {
                  var variableToTween = t.props[k];
                  if(variableToTween.var === v && (tween.delay === 0 || tween.vars.forceTween)){ // tween the same variable ?
                    t.delete = true;
                    this.tweens.splice(i, 1);

                    i--;
                    // t.props.splice(k, 1);
                    // k--;
                  }
                }
              }
            }

            varToTween.push({
              var: v,
              value: obj[v],
              toValue: vars[v]
            });
          }
        }
      }

      tween.props = varToTween;

      // if(!obj.tweens){
      //   obj.tweens = [
      //     tween
      //   ]
      // }
      // else {
      //   obj.tweens.push(tween);
      // }

      this.tweens.push(tween);
      if(!this.updating) {
        this.updating = true
      }

    };

    Easings.prototype.isFunction = function(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    Easings.prototype.updateArray = function(tween){
      var o = tween;

      if(o.delay > 0){
        o.delay--;
      }
      else {
        for (var i = 0; i < o.obj.length; i++) {
          var currentValue = o.obj[i];

          o.obj[i] = o.ease(o.currentIteration, o.props[0].value[i], o.props[0].toValue[i] - o.props[0].value[i], o.duration);
        }
        o.currentIteration++;
        //
        if(o.currentIteration > o.duration){
          if(o.vars.onComplete){
            o.vars.onComplete();
          }
          o.delete = true;
        }
      }
    };

    Easings.prototype.update = function()
    {

      if(!this.updating) {
        return;
      }
      for (var i = 0; i < this.tweens.length; i++) {
        var o = this.tweens[i];

        if(o.isArray){
          this.updateArray(o);
        }
        else {
          if(o.isDelayed){

            if(o.delay > 0){
              o.delay -= 1;// do something here
            }
            else if(o.delay <= 0){
              o.isDelayed = false;
              for (var k = 0; k < o.props.length; k++) {
                var e = o.props[k];
                e.value = o.obj[e.var];
              }
            }
          }
          else {
            for (var k = 0; k < o.props.length; k++) {
              var e = o.props[k];

              o.obj[e.var] = o.ease(o.currentIteration, e.value, e.toValue - e.value, o.duration);
            }

            if(o.vars.onUpdate){
              o.vars.onUpdate.apply(this, o.vars.onUpdateParams);
            }

            o.currentIteration += 1;// do something here
            if(o.currentIteration > o.duration){
              if(o.vars.onComplete){
                o.vars.onComplete.apply(this, o.vars.onCompleteParams);
              }
              o.delete = true;
            }
          }
        }
      }

      for (var i = 0; i < this.tweens.length; i++) {
        var o = this.tweens[i];
        if(o.delete){
          o = null;
          this.tweens.splice(i, 1);
          i--;
        }
      }

      if(this.tweens.length === 0) {
        this.updating = false;
      }
    };

    Easings.prototype.easeLinear = function(t, b, c, d) {
    	t /= d;
    	return c*t + b;
    };

    Easings.prototype.easeInSine = function (t, b, c, d) {
		  return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	  };

    Easings.prototype.easeOutSine = function(t, b, c, d) {
    	return c * Math.sin(t/d * (Math.PI/2)) + b;
    };

    Easings.prototype.easeInExpo = function (t, b, c, d) {
	    return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
    };

    Easings.prototype.elasticOutSoft = function(t, b, c, d) {
  		var s=1.0158;var p=0;var a=c;
  		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  		if (a < Math.abs(c)) { a=c; var s=p/4; }
  		else var s = p/(2*Math.PI) * Math.asin (c/a);
  		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  	}

    Easings.prototype.easeOutBack = function (t, b, c, d) {
		  // if (s == undefined) s = 1.70158;
		  var s = 1.70158;
		  return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    };

    Easings.prototype.easeOutBackSoft = function (t, b, c, d) {
		  // if (s == undefined) s = 1.70158;
		  var s = 1.30158;
		  return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    };

    Easings.prototype.elasticOut = function(t, b, c, d) {
  		var s=1.70158;var p=0;var a=c;
  		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  		if (a < Math.abs(c)) { a=c; var s=p/4; }
  		else var s = p/(2*Math.PI) * Math.asin (c/a);
  		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  	}

    Easings.prototype.easeInCubic = function(t, b, c, d) {
    	t /= d;
    	return c*t*t*t + b;
    };

    Easings.prototype.easeOutCubic = function (t, b, c, d) {
    	t /= d;
    	t--;
    	return c*(t*t*t + 1) + b;
    };

    Easings.prototype.easeInOutSine = function (t, b, c, d) {
    	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    };

    Easings.prototype.easeInBack = function (x, t, b, c, d, s) {
  		if (s == undefined) s = 1.70158;
  		  return c*(t/=d)*t*((s+1)*t - s) + b;
	   };

    Easings.prototype.easeInOutExpo = function (t, b, c, d) {
    	t /= d/2;
    	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
    	t--;
    	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
    };

    Easings.prototype.easeInOutQuint = function(t, b, c, d) {
    	t /= d/2;
    	if (t < 1) return c/2*t*t*t*t*t + b;
    	t -= 2;
    	return c/2*(t*t*t*t*t + 2) + b;
    };

    Easings.prototype.easeInOutCirc = function(t, b, c, d) {
    	t /= d/2;
    	if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    	t -= 2;
    	return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    };

    Easings.prototype.easeOutCirc = function(t, b, c, d) {
  		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    };

    Easings.instance = new Easings();

    module.exports = Easings;
});
