import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    let wRatio;
    let offsetRatio;
    let offsetRatioText;
    let offsetRatioMobileRect;
    if (window.innerWidth > 400) {
      wRatio = window.innerWidth / 5;
      offsetRatio = 120;
      offsetRatioText = 0;
      offsetRatioMobileRect = 0;
    } else {
      wRatio = 30;
      offsetRatio = 100;
      offsetRatioText = window.innerWidth / 2;
      offsetRatioMobileRect = 140;
    }
    const text1 = this.add.text(wRatio, 220, "LOADING SYSTEM", {
      fontFamily: "Helvetica",
      fontStyle: "bold",
      color: "#ff6600",
      fontSize: 30,
    });
    let progressBars = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 3; j++) {
        let x = wRatio * (j + 1) + j * offsetRatioText + 100;
        let y = 270 + i * 30 + i * 10;
        let w = wRatio - offsetRatio + offsetRatioMobileRect;
        let h = 30;
        var progressBox = this.add.rectangle(x, y, w, h, 0xff0000);
        progressBox.setOrigin(0, 0);
        progressBox.setData("loadValue", i / 10);
        progressBox.setData("loaded", false);
        console.log(progressBox);
        var text = this.add.text(
          wRatio * (j + 1) + j * offsetRatioText,
          276 + i * 30 + i * 10,
          "LDSYS-" + j + "-" + i,
          { fontFamily: "Helvetica", fontStyle: "bold", color: "#ff6600" }
        );
        progressBars.push(progressBox);
      }
    }
    this.load.image("tiles", "tiles/tilemaplargeextrudetest.png");
    this.load.image("clouds", "tiles/clouds.png");
    this.load.tilemapTiledJSON("tilemap", "tiles/tilemap.json");

    this.load.atlas(
      "characterSprite",
      "sprites/character.png",
      "sprites/character.json"
    );
    this.load.atlas("arrowSprite", "sprites/arrow.png", "sprites/arrow.json");
    this.load.atlas("birdSprite", "sprites/bird.png", "sprites/bird.json");
    this.load.atlas("flameSprite", "sprites/flame.png", "sprites/flame.json");
    this.load.atlas("starSprite", "sprites/star.png", "sprites/star.json");

    this.load.on("progress", function (value) {
      progressBars.forEach((bar) => {
        if (bar.getData("loadValue") < value) {
          bar.setFillStyle(0x249225);
        }
      });
    });

    this.load.on("fileprogress", function (file) {
      console.log(file.src);
    });

    let self = this;
    this.load.on("complete", function () {
      console.log("complete");
      /*text1.text = "LOAD COMPLETE";
      let flashes = 0;
      let flashInterval = setInterval(function () {
        text1.alpha = !text1.alpha;
        flashes++;
        if (flashes > 16) {
          self.scene.start("portfolio");
          clearInterval(flashInterval);
          text1.destroy();
          progressBars.forEach((bar) => {
            bar.destroy();
          });
        }
      }, 100);*/
    });
  }
  create() {
    this.scene.start("portfolio");
  }
}
