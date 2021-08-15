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

  private movePath: Phaser.Math.Vector2[] = [];
  private moveToTarget?: Phaser.Math.Vector2;

  moveAlong(path: Phaser.Math.Vector2[]) {
    if (!path || path.length <= 0) {
      return;
    }

    this.movePath = path;
    this.moveTo(this.movePath.shift()!);
  }

  moveTo(target: Phaser.Math.Vector2) {
    this.moveToTarget = target;
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors) {
      return;
    }

    const speed = 120;

    //if any cursor key is down, interrupt pathfinding movement
    if (
      cursors.left?.isDown ||
      cursors.right?.isDown ||
      cursors.up?.isDown ||
      cursors.down?.isDown
    ) {
      if (cursors.left?.isDown) {
        this.anims.play("character-walk-left", true);
        this.setVelocity(-speed, 0);
        this.moveToTarget = undefined;
      } else if (cursors.right?.isDown) {
        this.anims.play("character-walk-right", true);
        this.setVelocity(speed, 0);
        this.moveToTarget = undefined;
      } else if (cursors.down?.isDown) {
        this.anims.play("character-walk-down", true);
        this.setVelocity(0, speed);
        this.moveToTarget = undefined;
      } else if (cursors.up?.isDown) {
        this.anims.play("character-walk-up", true);
        this.setVelocity(0, -speed);
        this.moveToTarget = undefined;
      }
    } else {
      let dx = 0;
      let dy = 0;

      if (this.moveToTarget) {
        dx = this.moveToTarget.x - this.x;
        dy = this.moveToTarget.y - this.y;

        if (Math.abs(dx) < 5) {
          dx = 0;
        }
        if (Math.abs(dy) < 5) {
          dy = 0;
        }

        if (dx === 0 && dy === 0) {
          if (this.movePath.length > 0) {
            this.moveTo(this.movePath.shift()!);
            return;
          }

          this.moveToTarget = undefined;
        }
      }

      // this logic is the same except we determine
      // if a key is down based on dx and dy
      const leftDown = dx < 0;
      const rightDown = dx > 0;
      const upDown = dy < 0;
      const downDown = dy > 0;

      if (leftDown) {
        this.anims.play("character-walk-left", true);
        this.setVelocity(-speed, 0);
      } else if (rightDown) {
        this.anims.play("character-walk-right", true);
        this.setVelocity(speed, 0);
      } else if (downDown) {
        this.anims.play("character-walk-down", true);
        this.setVelocity(0, speed);
      } else if (upDown) {
        this.anims.play("character-walk-up", true);
        this.setVelocity(0, -speed);
      } else {
        this.anims.play("character-idle", true);
        this.setVelocity(0, 0);
      }
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
