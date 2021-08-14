import Phaser, { Display } from "phaser";
import { debugDraw } from "../utils/debugCollide";
import { createCharacterAnims } from "../entities/characterAnims";
import AnimatedTiles from '../utils/AnimatedTiles.js'

import "../entities/character";

export default class Portfolio extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private character!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("portfolio");
  }

  preload() {
    //create keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    //load the animated tiles plugin
    this.load.scenePlugin({
      key: "AnimatedTiles",
      url: AnimatedTiles,
      sceneKey: "animatedTiles",
    });
  }

  create() {
    const debugDrawEnable = false;

    //create the character animation set
    createCharacterAnims(this.anims);

    //create the map, and pull in the tileset for the map
    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("tileset", "tiles", 80, 80, 1, 2);

    //create the ground layer
    const groundLayer = map.createStaticLayer("GroundLayer", tileset);

    //draw the animated sprites layer
    const waterLayer = map.createDynamicLayer("WaterTiles", tileset);

    //set the collision map on the ground
    groundLayer.setCollisionByProperty({ collides: true });

    //debug the collisions on the ground if required
    if (debugDrawEnable) {
      debugDraw(groundLayer, this);
    }

    //add in the player character
    this.character = this.add.character(800, 800, "characterSprite");

    //draw the tree top layer
    map.createStaticLayer("TreeTops", tileset);

        
    //initialize animations
    this.animatedTiles.init(map);

    //start following the player
    this.cameras.main.startFollow(this.character);

    //set collisions for player and ground layer
    this.physics.add.collider(this.character, groundLayer);

    this.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        const { worldX, worldY } = pointer;

        const startVec = groundLayer.worldToTileXY(
          this.character.x,
          this.character.y
        );
        const targetVec = groundLayer.worldToTileXY(worldX, worldY);

        // use startVec and targetVec
      }
    );

    console.log(groundLayer);
  }

  update(t: number, dt: number) {
    //if character exists, update the character each frame
    if (this.character) {
      this.character.update(this.cursors);
    }
  }
}
