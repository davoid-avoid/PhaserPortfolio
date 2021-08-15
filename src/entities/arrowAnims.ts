import Phaser from "phaser";

const createArrowAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "arrow",
    frames: [
      { key: "arrowSprite", frame: "arrow1.png" },
      { key: "arrowSprite", frame: "arrow2.png" },
      { key: "arrowSprite", frame: "arrow3.png" },
      { key: "arrowSprite", frame: "arrow4.png" },
      { key: "arrowSprite", frame: "arrow5.png" },
      { key: "arrowSprite", frame: "arrow6.png" },
    ],
    repeat: -1,
    frameRate: 5,
  });
};

export { createArrowAnims };
