import Phaser from "phaser";

const createBirdAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "bird",
    frames: [
      { key: "birdSprite", frame: "bird1.png" },
      { key: "birdSprite", frame: "bird2.png" },
      { key: "birdSprite", frame: "bird3.png" },
      { key: "birdSprite", frame: "bird4.png" },
      { key: "birdSprite", frame: "bird5.png" },
      { key: "birdSprite", frame: "bird6.png" },
      { key: "birdSprite", frame: "bird7.png" },
      { key: "birdSprite", frame: "bird8.png" },
      { key: "birdSprite", frame: "bird9.png" },
    ],
    repeat: -1,
    frameRate: 8,
  });
};

export { createBirdAnims };
