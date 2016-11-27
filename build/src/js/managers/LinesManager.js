import ViewLine from '../views/ViewLine'
import Easings from '../libs/Easings';


const STATES = {
  wandering: 0,
  travelling: 1
}

const STATES_LINE = {
  wandering: 0,
	muting: 1,
	leaving: 2,
	travelling: 3,
	dying: 4,
}

class LinesManager {
  constructor(){
    this.state = STATES.wandering;
    this.linesDrawing = [];
    this.linesAvailableForDrawing = [];
    this.lines = [];
    this.tick = 0;

    this.targetPoints = [];
  }

  addLine(){
    let line = new ViewLine(this);
    line.alpha = .3 + Math.random() * .5

    this.lines[this.lines.length] = line;
    this.linesAvailableForDrawing[this.linesAvailableForDrawing.length] = line;
  }

  draw(target){ // not used anymore really, drawing line is now called from moveTo function as a callback

    if(this.linesAvailableForDrawing.length === 0){
      return;
    }

    let indexL = Math.floor(Math.random() * this.linesAvailableForDrawing.length)
    let l = this.linesAvailableForDrawing[indexL];
    l.transformTo(target);


    this.splice(this.linesAvailableForDrawing, indexL);

    this.linesDrawing.push(l);
  }

  moveTo(pt, animal){
    // ignore that
    let freeLines = [];
    for (var i = 0; i < this.lines.length; i++) {
      if(this.lines[i].state !== STATES_LINE.muting){
        freeLines.push(i);
      }
    }


    this.state = STATES.travelling;


    // get one index, it will draw
    let idx = Math.floor(Math.random() * freeLines.length);
    let indexToDraw = 10000; //idx;
    // this.splice(freeLines, idx); // commented that to focus on the movement, not the drawing

    let indexPair1 = null; // some special behaviours for two lines
    let indexPair2 = null;
    if(freeLines.length >= 2){
      indexPair1 = freeLines[0];
      this.splice(freeLines, 0);
      // brain.exe just crashed
      indexPair2 = freeLines[0];
      this.splice(freeLines, 0);
    }


    // get two indexes, we'll try to make them dance together
    // others must be random

    this.objectsToTween = [];
    let index = 0;
    for (var i = 0; i < this.lines.length; i++) {
      let l = this.lines[i];
      if(!this.targetPoints[i]){
        this.targetPoints[i] = []
      }

      if(i === indexPair1 || i === indexPair2){
        this.targetPoints[i][0] = pt[0]
        this.targetPoints[i][1] = -2
        this.targetPoints[i][2] = pt[2]
      }
      else {
        // this.targetPoints[i][0] = pt[0];
        // this.targetPoints[i][1] = -2;
        // this.targetPoints[i][2] = pt[2];
        this.targetPoints[i][0] = pt[0] + Math.random() * 1 - 1/2;
        this.targetPoints[i][1] = -2 - Math.random() * 2 ;
        this.targetPoints[i][2] = pt[2] + Math.random() * 1 - 1/2;
      }

      let duration = (4 + Math.random() * 3);
      if(i === indexToDraw){ // for now will never go into that condition to focus on the displacement
        duration = 3
        l.willDraw = animal;
        l.posToDraw = pt;
      }

      // set the easings
      // this._moveLineTo({
      //   line: l,
      //   pt: this.targetPoints[i],
      //   duration: duration
      // });
      //
      // if(i === indexPair1){
      //   this.lines[i].travel(1);
      // }
      // else if(i === indexPair2) {
      //   this.lines[i].travel(2);
      // }
      // else {
      //   this.lines[i].travel();
      // }

      if(l.state === STATES_LINE.muting){
        let indexL = i;
        let pt = this.targetPoints[indexL]
        l.undraw(()=>{
          // console.log("here");
          let o = this._moveLineTo({
            line: l,
            pt: pt,
            duration: 4,
            ease: this.easeInOutCirc.bind(this)
          });

          this.objectsToTween[indexL] = o;
          l.travel();
        })

      }
      else {
        // LOOK HERE
        let o = this._moveLineTo({
          line: l,
          pt: this.targetPoints[i],
          duration: duration,
          ease: this.easeOutCirc.bind(this)
        });

        this.objectsToTween[i] = o;

        if(i === indexPair1){
          l.travel(1);
        }
        else if(i === indexPair2) {
          l.travel(2);
        }
        else {
          l.travel();
        }
      }

    }
  }

  // this method has been created cause I needed one for the callback after undrawing
  _moveLineTo(data){
    var obj = { "0": data.line.position[0], "1": data.line.position[1], "2": data.line.position[2]}

    // fake tween, just to get the info we want for the tween
    var o = Easings.instance.returnVariable(obj, data.duration, {
      "0": data.pt[0],
      "1": data.pt[1],
      "2": data.pt[2]
    });

    return o;
  }

  undraw(callback){
    console.log("here");
    for (let i = 0; i < this.linesDrawing.length; i++) {
      let l = this.linesDrawing[i];
      l.undraw();
      this.linesAvailableForDrawing.push(l);

      this.splice(this.linesDrawing, i);
      i--;
    }
  }

  moveTargetPoints(index){
    let line = this.lines[index];

    let o = this.objectsToTween[index]
    if(!o.delete){
      for (var k = 0; k < o.props.length; k++) {
        var e = o.props[k];
        o.obj[e.var] = o.ease(o.currentIteration, e.value, e.toValue - e.value, o.duration);

        line.position[e.var] += (o.obj[e.var] - line.position[e.var]) * .08;
      }

      o.currentIteration += 1;// do something here
      if(o.currentIteration > o.duration){
        o.delete = true;

        if(line.willDraw){
          line.transformTo(line.willDraw);
        }
        else {
          line.stop();
        }
      }
    }
  }

  pause(){
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].pause();
    }
  }

  update(){
    // this.tick++;

    // if(this.tick %2===0){

      for (var i = 0; i < this.lines.length; i++) {

        // console.log(i,this.lines[i].line.points.length);
        if(this.state === STATES.travelling && this.lines[i].state === STATES_LINE.travelling){
          this.moveTargetPoints(i);
        }
        this.lines[i].render();
      }
    // }
  }

  easeInCubic(t, b, c, d) {
		t /= d;
		return c*t*t*t + b;
	}

  easeOutSine(t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  }
  easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  }

  easeInOutCirc(t, b, c, d) {
    t /= d/2;
    if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    t -= 2;
    return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
  }

  easeOutCubic(t, b, c, d) {
		t /= d;
		t--;
		return c*(t*t*t + 1) + b;
	}

  splice(arr, index) {
    let len=arr.length;
    if (!len) { return }
    while (index<len) {
      arr[index] = arr[index+1];
      index++
    }

    arr.length--;
}
};

export default LinesManager
