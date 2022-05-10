import Phaser from "phaser";

const createAudioIconAnims = (anims: Phaser.Animations.AnimationManager) => {
      anims.create({
        key: "audio-play",
        frames: [{ key: "audioSprite", frame: "audio2.png" }],
        repeat: -1,
        frameRate: 0,
      });

      anims.create({
        key: "audio-pause",
        frames: [{ key: "audioSprite", frame: "audio1.png" }],
        repeat: -1,
        frameRate: 0,
      });
};

export { createAudioIconAnims };
