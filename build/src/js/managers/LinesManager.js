import ViewLine from '../views/ViewLine'

class LinesManager {
  constructor(){
    this.linesDrawing = [];
    this.linesAvailableForDrawing = [];
    this.lines = [];
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

  splice(arr, index) {
     let len=arr.length;
     if (!len) { return }
     while (index<len) {
       arr[index] = arr[index+1];
			 index++
		 }

     arr.length--;
  };

  undraw(){
    for (let i = 0; i < this.linesDrawing.length; i++) {
      let l = this.linesDrawing[i];
      l.undraw();
      this.linesAvailableForDrawing.push(l);

      this.splice(this.linesDrawing, i);
      i--;
    }
  }

  update(){
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].render();
    }
  }
}

export default LinesManager
