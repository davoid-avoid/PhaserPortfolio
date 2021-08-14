import Phaser from 'phaser'

const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "character-idle",
        frames: [{ key: "characterSprite", frame: "idle1.png" }],
      });
  
      anims.create({
        key: "character-walk-down",
        frames: [
          { key: "characterSprite", frame: "idle1.png" },
          { key: "characterSprite", frame: "walkdown1.png" },
          { key: "characterSprite", frame: "idle1.png" },
          { key: "characterSprite", frame: "walkdown2.png" },
        ],
        repeat: -1,
        frameRate: 5,
      });
  
      anims.create({
        key: "character-walk-up",
        frames: [
          { key: "characterSprite", frame: "walkup1.png" },
          { key: "characterSprite", frame: "walkup2.png" },
          { key: "characterSprite", frame: "walkup1.png" },
          { key: "characterSprite", frame: "walkup3.png" },
        ],
        repeat: -1,
        frameRate: 5,
      });
  
      anims.create({
        key: "character-walk-right",
        frames: [
          { key: "characterSprite", frame: "walkright1.png" },
          { key: "characterSprite", frame: "walkright2.png" },
        ],
        repeat: -1,
        frameRate: 5,
      });
  
      anims.create({
        key: "character-walk-left",
        frames: [
          { key: "characterSprite", frame: "walkleft1.png" },
          { key: "characterSprite", frame: "walkleft2.png" },
        ],
        repeat: -1,
        frameRate: 5,
      });
}

export { createCharacterAnims }