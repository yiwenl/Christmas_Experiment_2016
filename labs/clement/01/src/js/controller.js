import Keyboard from './libs/Keyboard';

class Controller {
  constructor(owner){

    this.owner = owner;
    this.keyboard = new Keyboard();

    this.aPressed = false;
    this.dPressed = false;
    this.spacePressed = false;

    window.addEventListener("click", this.onClick.bind(this), false);
  }

  onClick(e){
    this.owner.onClick({x:e.clientX, y:e.clientY});
  }

  update(){
    this.aPressed = this.keyboard.isPressed('a');
    this.dPressed = this.keyboard.isPressed('d');
    this.spacePressed = this.keyboard.isPressed('space');
  }
}

export default Controller;
