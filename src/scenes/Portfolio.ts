import Phaser, { Display, Tilemaps } from "phaser";
import { debugDraw } from "../utils/debugCollide";
import { createCharacterAnims } from "../entities/characterAnims";
import { createArrowAnims } from "../entities/arrowAnims";
import AnimatedTiles from "../utils/AnimatedTiles.js";
import findPath from "../utils/findPath";
import { DistortPipeline } from "../utils/pipeline.js";
import { WarpPostFX } from '../utils/warp.js';

import "../entities/character";
import "../entities/arrow";

export default class Portfolio extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private character!: Phaser.Physics.Arcade.Sprite;
  private modal1!: Phaser.Physics.Arcade.Sprite;
  private modal2!: Phaser.Physics.Arcade.Sprite;
  private modal3!: Phaser.Physics.Arcade.Sprite;
  private t!: number;
  private tIncrement!: number;
  private distortPipeline!: Phaser.Renderer.WebGL.Pipelines.SinglePipeline;
  private animatedTiles!: any;
  private characterVert!: number;

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
    const shaderLayer = map.createStaticLayer("shader1", tileset);
    shaderLayer.alpha = 0.1

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

    this.physics.add.collider(this.character, this.modal1, () =>
      this.modal1.showModal()
    );

    this.modal2 = this.add.arrow(1960, 1870, "arrowSprite");
    this.modal2.setModal("modal2");

    this.physics.add.collider(this.character, this.modal2, () =>
      this.modal2.showModal()
    );

    this.modal3 = this.add.arrow(280, 1850, "arrowSprite");
    this.modal3.setModal("modal3");

    this.physics.add.collider(this.character, this.modal3, () =>
      this.modal3.showModal()
    );

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

    // ### Set up pipelines ###
    this.t = 0; // time variable for the distor shader
    this.tIncrement = 0.05;
    //this.distortPipeline = this.game.renderer.pipelines.add(
    //  "Distort",
    //  new DistortPipeline(this.game)
    //);
    // Pass the game resolution to the shader to use for position-based computations
    //this.distortPipeline.set2f(
    //  "resolution",
    //  this.game.config.width,
    //  this.game.config.height
    //);
    //this.cameras.main.setRenderToTexture(this.distortPipeline);
    let camera2 = this.cameras.add();
    camera2.setPostPipeline(WarpPostFX);
    camera2.startFollow(this.character);
    //camera2.setFollowOffset(-200, -200);
    var pipelineInstance = camera2.getPostPipeline(WarpPostFX);
    console.log(shaderLayer)
    //pipelineInstance.setTexture(shaderLayer.texture.key, 1);
    pipelineInstance.setResizeMode(2);
    pipelineInstance.setProgress(0.1); 

    this.cameras.main.ignore(shaderLayer);
    camera2.ignore([this.character, groundLayer, waterLayer, treetopLayer, this.modal1, this.modal2, this.modal3])
  }

  update(t: number, dt: number) {
    //if character exists, update the character each frame
    if (this.character) {
      this.character.update(this.cursors);
      this.modal1.update(this.character);
      this.modal2.update(this.character);
      this.modal3.update(this.character);
    }
    this.t += this.tIncrement;
    if (this.character.y > this.characterVert){
      this.t -= this.game.config.height / 4500
    }
    if (this.character.y < this.characterVert){
      this.t += this.game.config.height / 4500
    }
    this.characterVert = this.character.y;
    //this.distortPipeline.set1f("time", this.t);
    var pipelineInstance = this.cameras.cameras[1].getPostPipeline(WarpPostFX);
    pipelineInstance.setTime(this.t)

  }
}
