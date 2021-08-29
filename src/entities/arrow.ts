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

  showModal(selected, tint, uiLayer) {
    if (this.arrowDisabled === false) {
      let modalContent = document.getElementsByClassName("modal-content");
      Array.prototype.forEach.call(modalContent, function (el) {
        el.style.display = "none";
      });
      let targetContent = document.getElementById(this.modalSet + "-content");
      targetContent?.style.display = "inline-block";
      let modalDOM = document.getElementById("modal");
      modalDOM?.style.display = "inline-block";
      this.alpha = 0;
      this.setVelocity(0, 0);
      this.body.setSize(0, 0);
      this.arrowDisabled = true;

      if (!selected.includes(tint)) {
        selected.push(tint)
        let found = uiLayer.add(
          uiLayer.scene.add.arrow((selected.length * this.width), 40, "arrowSprite"))
          .setInteractive();
        found.tint = tint;
        found.setModal(this.modalSet);
        found.anims.stop();

        let self = this;

        found.on("pointerdown", function () {
          found.showModalUI(self.modalSet);
        });
      }
    }
  }

  showModalUI(name) {
    let modalContent = document.getElementsByClassName("modal-content");
    Array.prototype.forEach.call(modalContent, function (el) {
      el.style.display = "none";
    });
    let targetContent = document.getElementById(name + "-content");
    targetContent?.style.display = "inline-block";
    let modalDOM = document.getElementById("modal");
    modalDOM?.style.display = "inline-block";
  }

  resetArrow() {
    this.arrowDisabled = false;
    this.alpha = 0.5;
    this.body.setSize(this.width * 0.55, this.height * 0.7);
    this.body.offset.y = 28;
  }

  update(character) {
    /*this.setVelocity(0, 0);
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
    }*/
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
