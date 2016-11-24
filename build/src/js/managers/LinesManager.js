import ViewLine from '../views/ViewLine'
import Easings from '../libs/Easings';


const STATES = {
  wandering: 0,
  travelling: 1
}

class LinesManager {
  constructor(){
    this.state = STATES.wandering;
    this.linesDrawing = [];
    this.linesAvailableForDrawing = [];
    this.lines = [];

    this.targetPoints = [];
  }

  addLine(){
    let line = new ViewLine(this);
    line.alpha = .3 + Math.random() * .5

    this.lines[this.lines.length] = line;
    this.linesAvailableForDrawing[this.linesAvailableForDrawing.length] = line;
  }

  draw(target){

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
    // this.undraw();

    this.state = STATES.travelling;

    // Im tired but Im gonna try something
    let freeLines = [];
    for (var i = 0; i < this.lines.length; i++) {
      freeLines.push(i);
    }

    // get one index, it will draw
    let idx = Math.floor(Math.random() * this.lines.length);
    let indexToDraw = freeLines[idx];
    this.splice(freeLines, idx);

    let indexPair1 = null;
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
        this.targetPoints[i][1] = pt[1]
        this.targetPoints[i][2] = pt[2]
      }
      else {
        this.targetPoints[i][0] = pt[0] + Math.random() * 8 - 8/2;
        this.targetPoints[i][1] = pt[1] - Math.random() * 2 ;
        this.targetPoints[i][2] = pt[2] + Math.random() * 8 - 8/2;
      }

      let duration = (6 + Math.random() * 10);
      if(i === indexToDraw){
        duration = 2
        l.willDraw = animal;
      }
      // set the easings
      var obj = { "0": l.position[0], "1": l.position[1], "2": l.position[2]}

      // fake tween, just to get the info we want for the tween
      // let duration = (i === indexToDraw ? 2 : (6 + Math.random() * 10))
      var o = Easings.instance.returnVariable(obj, duration, {
        "0": this.targetPoints[i][0],
        "1": this.targetPoints[i][1],
        "2": this.targetPoints[i][2]
      });

      this.objectsToTween[index++] = o;

      if(i === indexPair1){
        this.lines[i].travel(1);
      }
      else if(i === indexPair2) {
        this.lines[i].travel(2);
      }
      else {
        this.lines[i].travel();
      }
    }
  }


  undraw(){
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
        o.obj[e.var] = this.easeOutCubic(o.currentIteration, e.value, e.toValue - e.value, o.duration);

        line.position[e.var] += (o.obj[e.var] - line.position[e.var]) * .08;
      }

      o.currentIteration += 1;// do something here
      if(o.currentIteration > o.duration){
        o.delete = true;

        if(line.willDraw){
          line.transformTo(line.willDraw);
        }
        else {
          line.wander();
        }
      }
    }
  }

  update(){

    for (var i = 0; i < this.lines.length; i++) {
      if(this.state === STATES.travelling && this.lines[i].state === 3){
        this.moveTargetPoints(i);
      }

      this.lines[i].render();
    }
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
