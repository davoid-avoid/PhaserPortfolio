import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      arrow(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class Arrow extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("arrow");
  }

  private modalSet: string;
  private arrowDisabled: Boolean;

  setModal(modal: string) {
    this.modalSet = modal;
    this.arrowDisabled = false;
  }

  showModal() {
    if (this.arrowDisabled === false) {
      let modalDOM = document.getElementById("modal");
      modalDOM?.style.display = "inline-block";
      this.alpha = 0;
      this.setVelocity(0, 0);
      this.body.setSize(0, 0);
      this.arrowDisabled = true;
    }
  }

  resetArrow() {
    this.arrowDisabled = false;
    this.alpha = 1;
    this.body.setSize(this.width * 0.55, this.height * 0.7);
  }

  update(character) {
    if (this.arrowDisabled === true) {
      let distance = Phaser.Math.Distance.Between(
        character.x,
        character.y,
        this.x,
        this.y
      );
      if (distance > 100) {
        this.resetArrow();
      }
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "arrow",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new Arrow(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width * 0.55, sprite.height * 0.7);
    sprite.body.offset.y = 28;

    return sprite;
  }
);
