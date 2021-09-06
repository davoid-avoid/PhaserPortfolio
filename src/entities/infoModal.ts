import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      infoModal(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class InfoModal extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("info");

    this.infoDisabled = false;
    this.modalSet = "";
  }

  private modalSet: string;
  private infoDisabled: Boolean;

  setInfoModal(modal: string) {
    this.modalSet = modal;
    this.infoDisabled = false;
  }

  showModal() {
    let modalContent = document.getElementsByClassName("modal-content");
    Array.prototype.forEach.call(modalContent, function (el) {
      el.style.display = "none";
    });
    let targetContent = document.getElementById(this.modalSet + "-content");
    targetContent?.style.display = "inline-block";
    let modalDOM = document.getElementById("modal");
    modalDOM?.style.display = "inline-block";
    document.getElementById("modal-interior").scrollTop = 0;
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "infoModal",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new InfoModal(this.scene, x, y, texture, frame);

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
