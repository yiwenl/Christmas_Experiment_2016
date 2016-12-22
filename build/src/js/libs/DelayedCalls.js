define(function (require, exports, module)
{


    var DelayedCalls = function()
    {
      this.delayedCalls = [];
    }

    DelayedCalls.prototype.clear = function(){
      this.delayedCalls = [];
      this.updating = false;
    }

    DelayedCalls.prototype.add = function(func, delay, args)
    {
      var obj = {
        func: func,
        args: args,
        tick: 0,
        delay: delay,
        delete: false
      }
      this.delayedCalls.push(obj)

      if(!this.updating) {
        this.updating = true
      }

      // return the id of the current delay, like that we can track it back if we want from the caller
      return this.delayedCalls.length-1;
    }

    DelayedCalls.prototype.getRemainingTime = function(id){
      var obj = this.delayedCalls[id];

      if(obj && obj.delay){
        return (obj.delay * 60 - obj.tick);
      }
      else {
        return 0;
      }
    }

    DelayedCalls.prototype.update = function()
    {
      if(!this.updating) return;

      for (var i = 0; i < this.delayedCalls.length; i++) {
        var c = this.delayedCalls[i];
        c.tick++;
        if(c.tick > c.delay * 60){
          c.func(c.args);
          c.delete = true;
        }
      }

      for (var i = 0; i < this.delayedCalls.length; i++) {
        var c = this.delayedCalls[i];
        if(c.delete){
          this.delayedCalls.splice(i, 1);
          i--;
        }
      }

      if(this.delayedCalls.length === 0) {
        this.updating = false;
      }
    }

    module.exports = DelayedCalls;
});
