import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      bird(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

  }

  private triggered: Boolean;
  private XSpeed: number;
  private YSpeed: number;

  setTriggered() {
    this.triggered = false;
    this.XSpeed = Phaser.Math.FloatBetween(-3, 3);
    this.YSpeed = Phaser.Math.FloatBetween(2, 4);
    
    let random = Phaser.Math.Between(1, 2000);
    this.anims.playAfterDelay("bird", random);
    this.alpha = 0;
  }

  update(character) {
    if (this.triggered === false && this.y > -20) {
      let distance = Phaser.Math.Distance.Between(
        character.x,
        character.y,
        this.x,
        this.y
      );
      if (distance < 250) {
        this.triggered = true;
      }
    } else {
      this.flyBird();
    }
  }

  flyBird() {
    this.alpha = 1;
    this.x += this.XSpeed;
    this.y -= this.YSpeed;
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "bird",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new Bird(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    return sprite;
  }
);
