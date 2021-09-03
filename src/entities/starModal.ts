import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      starModal(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class StarModal extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("star");

    this.starDisabled = false;
    this.modalSet = ""
  }

  private modalSet: string;
  private starDisabled: Boolean;

  setStarModal(modal: string) {
    this.modalSet = modal;
    this.starDisabled = false;
  }

  showModal() {
    if (this.starDisabled === false) {
      let modalContent = document.getElementsByClassName("modal-content");
      Array.prototype.forEach.call(modalContent, function (el) {
        el.style.display = "none";
      });
      let targetContent = document.getElementById(this.modalSet + "-content");
      targetContent?.style.display = "inline-block";
      let modalDOM = document.getElementById("modal");
      modalDOM?.style.display = "inline-block";
      this.alpha = 0.5;
      this.disableBody();
      this.starDisabled = true;

    }
  }

  resetStar() {
    this.starDisabled = false;
    this.alpha = 1;
    this.body.setSize(this.width * 0.55, this.height * 0.7);
    this.body.offset.y = 28;
    this.enableBody();
  }

  update(character) {
    if (this.starDisabled === true) {
      let distance = Phaser.Math.Distance.Between(
        character.x,
        character.y,
        this.x,
        this.y
      );
      if (distance > 100) {
        this.resetStar();
      }
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "starModal",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new StarModal(this.scene, x, y, texture, frame);

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
