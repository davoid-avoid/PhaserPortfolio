import Phaser from "phaser";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      audioIcon(x: number, y: number, texture: string, frame?: string | number);
    }
  }
}

export default class AudioIcon extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    console.log(this.anims)
    this.anims.play("audio-play");

    this.audioPaused = false;
  }

  private audioPaused: Boolean;

  setAudioState(audioState: boolean) {
    this.audioPaused = audioState
    if (this.audioPaused) {
      this.anims.play("audio-play")
    } else {
      this.anims.play("audio-pause")
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "audioIcon",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    var sprite = new AudioIcon(this.scene, x, y, texture, frame);

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
