import Phaser, { Display, Tilemaps } from "phaser";
import { debugDraw } from "../utils/debugCollide";
import { createCharacterAnims } from "../entities/characterAnims";
import { createArrowAnims } from "../entities/arrowAnims";
import AnimatedTiles from "../utils/AnimatedTiles.js";
import findPath from "../utils/findPath";

import "../entities/character";
import "../entities/arrow";

export default class Portfolio extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private character!: Phaser.Physics.Arcade.Sprite;
  private modal1!: Phaser.Physics.Arcade.Sprite;
  private modal2!: Phaser.Physics.Arcade.Sprite;
  private modal3!: Phaser.Physics.Arcade.Sprite;

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

    createArrowAnims(this.anims);

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

    //add in the player character //800, 800
    this.character = this.add.character(800, 800, "characterSprite");

    this.modal1 = this.add.arrow(920, 1310, "arrowSprite");
    this.modal1.setModal("modal1");

    this.physics.add.collider(
      this.character,
      this.modal1,
      () =>
      this.modal1.showModal()
    );

    this.modal2 = this.add.arrow(1960, 1870, "arrowSprite");
    this.modal2.setModal("modal2");

    this.physics.add.collider(
      this.character,
      this.modal2,
      () =>
      this.modal2.showModal()
    );

    this.modal3 = this.add.arrow(320, 1850, "arrowSprite");
    this.modal3.setModal("modal3");

    this.physics.add.collider(
      this.character,
      this.modal3,
      () =>
      this.modal3.showModal()
    );

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

        // generate the path
        const path = findPath(startVec, targetVec, groundLayer);

        // give it to the player to use
        this.character.moveAlong(path);
      }
    );
  }

  update(t: number, dt: number) {
    //if character exists, update the character each frame
    if (this.character) {
      this.character.update(this.cursors);
      this.modal1.update(this.character);
      this.modal2.update(this.character);
      this.modal3.update(this.character);
    }
  }
}
