import Phaser from "phaser";

const createInfoModalAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "info",
    frames: [
      { key: "infoSprite", frame: "info1.png" },
    ],
    repeat: -1,
    frameRate: 8,
  });
};

export { createInfoModalAnims };
