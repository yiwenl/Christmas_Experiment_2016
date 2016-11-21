import alfrid, { GL } from 'alfrid';

import vs from '../../shaders/ptLine.vert';
import fs from '../../shaders/ptLine.frag';

class PtLine extends alfrid.View {
  constructor(position, drawMode = GL.TRIANGLES){

    super(vs, fs);

    this.position = [];

    this.position[0] = position[0];
    this.position[1] = position[1];
    this.position[2] = 0;

    this.pt = new alfrid.Geom.sphere(.1, 10);
    // this.circle();
  }

  process(avoid){
  }

  render(){
    this.shader.bind();
    this.shader.uniform("uPosition", "vec3", this.position);
    GL.draw(this.pt);
  }
}

export default PtLine;
