import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      flame(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class Flame extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    let random = Phaser.Math.Between(1, 2000);
    this.anims.playAfterDelay("flame", random);
    this.alpha = 0;

    this.tinted = false;
    this.indexVal = -1;
  }

  private tinted: Boolean;
  private indexVal: number;

  created(){
  }

  setIndex(num: number){
    this.indexVal = num;
    this.tinted = false;
  }

  update(selected) {
    if (selected.length >= this.indexVal + 1 && this.tinted === false){
      this.tint = selected[this.indexVal];
      this.tinted = true;
      this.alpha = 1;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "flame",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new Flame(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    return sprite;
  }
);
