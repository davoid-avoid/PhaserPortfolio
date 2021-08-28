import Phaser, { Display, Tilemaps } from "phaser";
import { debugDraw } from "../utils/debugCollide";
import { createCharacterAnims } from "../entities/characterAnims";
import { createArrowAnims } from "../entities/arrowAnims";
import AnimatedTiles from "../utils/AnimatedTiles.js";
import findPath from "../utils/findPath";
import { WarpPostFX } from "../utils/warp.js";

import "../entities/character";
import "../entities/arrow";

export default class Portfolio extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private character!: Phaser.Physics.Arcade.Sprite;
  private t!: number;
  private tIncrement!: number;
  private animatedTiles!: any;
  private characterVert!: number;
  private modalList!: Array<object>;
  private modalObject!: Array<object>;

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

    this.modalList = [
      { name: "modal1", x: 920, y: 1310, tint: 0xADD8E6 },
      { name: "modal2", x: 1960, y: 1870, tint: 0xFF8B3D },
      { name: "modal3", x: 280, y: 1850, tint: 0x3CB043 },
    ];

    this.modalObject = [];

    //create the map, and pull in the tileset for the map
    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("tileset", "tiles", 80, 80, 1, 2);

    //create the underwater layer
    const shaderLayer = map.createStaticLayer("shader1", tileset);
    shaderLayer.alpha = 0.1;
    
    //create the ground layer
    const groundLayer = map.createStaticLayer("GroundLayer", tileset);

    //draw the animated sprites layer
    const waterLayer = map.createDynamicLayer("WaterTiles", tileset);

    //set the collision map on the ground
    groundLayer.setCollisionByProperty({ collides: true });

    
    //add in the player character //800, 800
    this.character = this.add.character(760, 800, "characterSprite");

    //debug the collisions on the ground if required
    if (debugDrawEnable) {
      debugDraw(groundLayer, this);
    }
    this.modalList.forEach((modal, index) => {
      this.modalObject.push(this.add.arrow(modal.x, modal.y, "arrowSprite"));
      this.modalObject[index].tint = modal.tint
      this.modalObject[index].setModal(modal.name);
      this.modalObject[index].body.setImmovable();
      this.physics.add.collider(this.character, this.modalObject[index], () =>
        this.modalObject[index].showModal()
      );
    }, this);

    //draw the tree top layer
    const treetopLayer = map.createStaticLayer("TreeTops", tileset);

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
          this.character.body.x,
          this.character.body.y
        );
        const targetVec = groundLayer.worldToTileXY(worldX, worldY);

        // generate the path
        const path = findPath(startVec, targetVec, groundLayer);

        // give it to the player to use
        this.character.moveAlong(path);
      }
    );

    this.t = 0; // time variable for the distor shader
    this.tIncrement = 0.05;
    let camera2 = this.cameras.add();
    camera2.setPostPipeline(WarpPostFX);
    camera2.startFollow(this.character);
    var pipelineInstance = camera2.getPostPipeline(WarpPostFX);
    pipelineInstance.setResizeMode(2);
    pipelineInstance.setProgress(0.1);

    this.cameras.main.ignore(shaderLayer);
    camera2.ignore([
      this.character,
      groundLayer,
      waterLayer,
      treetopLayer,
      this.modalObject
    ]);
  }

  update(t: number, dt: number) {
    //if character exists, update the character each frame
    if (this.character) {
      this.character.update(this.cursors);
      this.modalObject.forEach((modal) => {
        modal.update(this.character);
      })
    }
    this.t += this.tIncrement;
    if (this.character.y > this.characterVert) {
      this.t -= 0.25;
    }
    if (this.character.y < this.characterVert) {
      this.t += 0.25;
    }
    this.characterVert = this.character.y;
    var pipelineInstance = this.cameras.cameras[1].getPostPipeline(WarpPostFX);
    pipelineInstance.setTime(this.t);
  }
}
