import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      character(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("character-idle");
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys){
    if (!cursors) {
        return;
      }
  
      const speed = 120;
  
      if (cursors.left?.isDown) {
        this.anims.play("character-walk-left", true);
        this.setVelocity(-speed, 0);
      } else if (cursors.right?.isDown) {
        this.anims.play("character-walk-right", true);
        this.setVelocity(speed, 0);
      } else if (cursors.down?.isDown) {
        this.anims.play("character-walk-down", true);
        this.setVelocity(0, speed);
      } else if (cursors.up?.isDown) {
        this.anims.play("character-walk-up", true);
        this.setVelocity(0, -speed);
      } else {
        this.anims.play("character-idle", true);
        this.setVelocity(0, 0);
      }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "character",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new Character(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    sprite.body.setSize(sprite.width * 0.55, sprite.height * 0.4);
    sprite.body.offset.y = 48;

    return sprite;
  }
);
