import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Portfolio from "./scenes/Portfolio";

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: window.innerWidth,
  height: window.innerHeight,
  zoom: 1,
  pixelArt: true,
  roundPixels: true,
  scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
	  debug: false
    },
  },
  scene: [Preloader, Portfolio],
  debug: true,
};

export default new Phaser.Game(config);

