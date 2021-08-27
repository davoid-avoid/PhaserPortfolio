const fragShader = `
#define SHADER_NAME WARP_FS
precision mediump float;
      uniform float     time;
      uniform vec2      resolution;
      uniform sampler2D uMainSampler;
      varying vec2 outTexCoord;

      void main( void ) {
        vec2 uv = outTexCoord;
        uv.x += (sin((uv.y + (time * 0.01)) * 30.03) * 0.004);
        vec4 texColor = texture2D(uMainSampler, uv);
        gl_FragColor = texColor;
      }
`;
class WarpPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game) {
    super({
      game,
      name: "WarpPostFX",
      fragShader
    });
    this.progress = 0;
    this.resizeMode = 1;
    this.toRatio = 0;
    this.smoothness = 0.5;
    this.time = 0;
    this.direction = new Phaser.Math.Vector2(-1, 1);
  }
  onBoot() {
    this.setTexture();
  }
  setResizeMode(mode = 1) {
    this.resizeMode = mode;
    return this;
  }
  setTexture(texture = "__DEFAULT", resizeMode) {
    let phaserTexture = this.game.textures.getFrame(texture);
    if (!phaserTexture) {
      phaserTexture = this.game.textures.getFrame("__DEFAULT");
    }
    this.toRatio = phaserTexture.width / phaserTexture.height;
    this.targetTexture = phaserTexture.glTexture;
    if (resizeMode !== void 0) {
      this.resizeMode = resizeMode;
    }
    this.set1i("uMainSampler2", 1);
    this.set1f("toRatio", this.toRatio);
    return this;
  }
  setProgress(value = 0) {
    this.progress = Phaser.Math.Clamp(value, 0, 1);
    return this;
  }
  setSmoothness(value = 0.5) {
    this.smoothness = value;
    return this;
  }
  setDirection(x = -1, y = 1) {
    this.direction.set(x, y);
    return this;
  }
  setTime(timeSet) {
      this.time = timeSet;
  }
  onPreRender() {
    this.set1f("progress", this.progress);
    this.set1i("resizeMode", this.resizeMode);
    this.set1f("smoothness", this.smoothness);
    this.set1f("time", this.time)
    this.set2f("direction", this.direction.x, this.direction.y);
  }
  onDraw(renderTarget) {
    this.set1f("fromRatio", renderTarget.width / renderTarget.height);
    this.bindTexture(this.targetTexture, 1);
    this.bindAndDraw(renderTarget);
  }
}
export {
  WarpPostFX
};