import Phaser from "phaser";

const createFlameAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "flame",
    frames: [
      { key: "flameSprite", frame: "flame1.png" },
      { key: "flameSprite", frame: "flame2.png" },
      { key: "flameSprite", frame: "flame3.png" },
      { key: "flameSprite", frame: "flame4.png" },
      { key: "flameSprite", frame: "flame5.png" },
      { key: "flameSprite", frame: "flame6.png" },
      { key: "flameSprite", frame: "flame7.png" },
      { key: "flameSprite", frame: "flame8.png" },
    ],
    repeat: -1,
    frameRate: 8,
  });
};

export { createFlameAnims };
