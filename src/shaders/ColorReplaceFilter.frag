precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform vec3 findColor1;
uniform vec3 replaceWithColor1;
uniform vec3 findColor2;
uniform vec3 replaceWithColor2;
uniform vec3 findColor3;
uniform vec3 replaceWithColor3;
uniform vec3 findColor4;
uniform vec3 replaceWithColor4;
uniform float range;
void main(void) {
  vec4 currentColor = texture2D(texture, vTextureCoord);
  if(currentColor.rgb == findColor1){
    gl_FragColor = vec4(replaceWithColor1, currentColor.a);
  }
  else if(currentColor.rgb == findColor2){
    gl_FragColor = vec4(replaceWithColor2, currentColor.a);
  }
  else if(currentColor.rgb == findColor3){
    gl_FragColor = vec4(replaceWithColor3, currentColor.a);
  }
  else if(currentColor.rgb == findColor4){
    gl_FragColor = vec4(replaceWithColor4, currentColor.a);
  }
  else{
    gl_FragColor = currentColor;
  }
  //gl_FragColor = vec4(replaceWithColor, currentColor.a);
}