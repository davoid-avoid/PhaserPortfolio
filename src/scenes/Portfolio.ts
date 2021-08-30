import Phaser, { Display, Tilemaps } from "phaser";
import { debugDraw } from "../utils/debugCollide";
import { createCharacterAnims } from "../entities/characterAnims";
import { createArrowAnims } from "../entities/arrowAnims";
import { createBirdAnims } from "../entities/birdAnims";
import AnimatedTiles from "../utils/AnimatedTiles.js";
import findPath from "../utils/findPath";
import { WarpPostFX } from "../utils/warp.js";

import "../entities/character";
import "../entities/arrow";
import "../entities/bird";

export default class Portfolio extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private character!: Phaser.Physics.Arcade.Sprite;
  private t!: number;
  private t2!: number;
  private tIncrement!: number;
  private animatedTiles!: any;
  private characterVert!: number;
  private modalList!: Array<object>;
  private modalObject!: Array<object>;
  private modalsSelected!: Array<string>;
  private uiLayer!: Array<object>;
  private cloudLayer!: any;
  private birds!: Array<object>;
  private birdsList!: Array<object>;

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

    createBirdAnims(this.anims);

    this.modalList = [
      { name: "modal1", x: 3320, y: 500, tint: 0xadd8e6 },
      { name: "modal2", x: 1960, y: 1870, tint: 0xff8b3d },
      { name: "modal3", x: 280, y: 1850, tint: 0x3cb043 },
      { name: "modal4", x: 3800, y: 2020, tint: 0xbe93d4 },
    ];

    //list of birds to draw
    this.birdsList = [
      {
        x: 1950, y: 1200, flockSize: 5
      },
      {
        x: 3600, y: 1880, flockSize: 7
      },
      {
        x: 700, y: 1700, flockSize: 6
      },
      {
        x: 3250, y: 1300, flockSize: 8
      },
    ]

    this.modalObject = [];
    this.modalsSelected = [];

    //create the map, and pull in the tileset for the map
    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("tileset", "tiles", 80, 80, 1, 2);

    //create the underwater layer
    const shaderLayer = map.createStaticLayer("shader1", tileset);
    shaderLayer.alpha = 0.1;

    this.cloudLayer = this.add.tileSprite(0, 0, 12000, 6000, "clouds");
    this.cloudLayer.alpha = 0.2;

    //create the ground layer
    const groundLayer = map.createStaticLayer("GroundLayer", tileset);

    //draw the animated sprites layer
    const waterLayer = map.createDynamicLayer("WaterTiles", tileset);

    //layer of objects for drawing found modal gems
    this.uiLayer = this.add.layer()

    //set the collision map on the ground
    groundLayer.setCollisionByProperty({ collides: true });

    //add in the player character //760, 800
    this.character = this.add.character(760, 800, "characterSprite");

    //debug the collisions on the ground if required
    if (debugDrawEnable) {
      debugDraw(groundLayer, this);
    }

    //create modal gems
    this.modalList.forEach((modal, index) => {
      this.modalObject.push(this.add.arrow(modal.x, modal.y, "arrowSprite"));
      this.modalObject[index].tint = modal.tint;
      this.modalObject[index].setModal(modal.name);
      this.modalObject[index].body.setImmovable();
      this.physics.add.collider(this.character, this.modalObject[index], () =>
        this.modalObject[index].showModal(this.modalsSelected, modal.tint, this.uiLayer)
      );
    }, this);

    //create birds
    this.birds = [];

    this.birdsList.forEach((flock) => {
      let flockSize = flock.flockSize
      for (let i = 0; i < flockSize; i++){
        let randomX = Phaser.Math.Between(-70, 70)
        let targetBird = this.add.bird(flock.x + randomX, flock.y, "birdSprite")
        targetBird.setTriggered();
        this.birds.push(targetBird)
        }
    })


    //draw the tree top layer
    const treetopLayer = map.createStaticLayer("TreeTops", tileset);

    //initialize animations
    this.animatedTiles.init(map);


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
    this.t2 = 0;
    this.tIncrement = 0.05;
    let camera1 = this.cameras.main;
    let camera2 = this.cameras.add();
    camera1.setPostPipeline(WarpPostFX);
    camera1.startFollow(this.character);
    camera2.startFollow(this.character);
    var pipelineInstance = camera1.getPostPipeline(WarpPostFX);
    pipelineInstance.setResizeMode(2);
    pipelineInstance.setProgress(0.1);

    console.log(this.uiLayer)

    camera2.ignore([shaderLayer, this.uiLayer]);
    camera1.ignore([
      this.character,
      groundLayer,
      waterLayer,
      treetopLayer,
      this.modalObject,
      this.uiLayer,
      this.cloudLayer,
      this.birds
    ]);

    let camera3 = this.cameras.add();
    //camera3.startFollow(this.character);

    camera3.ignore([
      this.character,
      groundLayer,
      waterLayer,
      treetopLayer,
      this.modalObject,
      shaderLayer,
      this.cloudLayer,
      this.birds
    ]);
  }

  update(t: number, dt: number) {
    //if character exists, update the character each frame
    if (this.character) {
      this.character.update(this.cursors);
      this.modalObject.forEach((modal) => {
        modal.update(this.character);
      });
      this.birds.forEach((bird) => {
        bird.update(this.character)
      })
    }
    this.t += this.tIncrement;
    if (this.character.y > this.characterVert) {
      this.t -= 0.28;
    }
    if (this.character.y < this.characterVert) {
      this.t += 0.28;
    }
    this.characterVert = this.character.y;
    var pipelineInstance = this.cameras.cameras[0].getPostPipeline(WarpPostFX);
    pipelineInstance.setTime(this.t);

    this.t2 += this.tIncrement;

    this.cloudLayer.tilePositionX = this.t2 * 3;
    this.cloudLayer.tilePositionY = this.t2 * 2;
  }
}
