import Keyboard from '../libs/Keyboard';

class Controller {
  constructor(owner){

    this.owner = owner;
    this.keyboard = new Keyboard();

    this.keyboard.onKeyPress('1', this.transformPress.bind(this));
    this.keyboard.onKeyPress('2', this.undrawPress.bind(this));
    this.keyboard.onKeyPress('a', this.pause.bind(this));

    this.aPressed = false;
    this.dPressed = false;
    this.spacePressed = false;

    window.addEventListener("click", this.onClick.bind(this), false);
  }

  pause(e){
      this.owner.pause();
      console.log("pause");
  }

  undrawPress(e){
    // console.log("undraw");
    this.owner.undraw();
  }

  transformPress(e){
    // this.owner.transform();
  }

  onClick(e){
    // this.owner.onClick({x:e.clientX, y:e.clientY});
  }

  update(){
    this.aPressed = this.keyboard.isPressed('a');
    this.dPressed = this.keyboard.isPressed('d');
    this.spacePressed = this.keyboard.isPressed('space');
  }
}

export default Controller;
