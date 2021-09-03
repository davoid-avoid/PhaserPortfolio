import Phaser from "phaser";

const createStarModalAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "star",
    frames: [
      { key: "starSprite", frame: "star1.png" },
      { key: "starSprite", frame: "star2.png" },
      { key: "starSprite", frame: "star3.png" },
      { key: "starSprite", frame: "star4.png" },
      { key: "starSprite", frame: "star5.png" },
      { key: "starSprite", frame: "star6.png" },
      { key: "starSprite", frame: "star7.png" },
      { key: "starSprite", frame: "star8.png" },
      { key: "starSprite", frame: "star9.png" },
      { key: "starSprite", frame: "star10.png" },
    ],
    repeat: -1,
    frameRate: 8,
  });
};

export { createStarModalAnims };
