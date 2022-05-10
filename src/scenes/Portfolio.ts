import Phaser, { Display, Scene, Tilemaps } from "phaser";
import { debugDraw } from "../utils/debugCollide";
import { createCharacterAnims } from "../entities/characterAnims";
import { createArrowAnims } from "../entities/arrowAnims";
import { createBirdAnims } from "../entities/birdAnims";
import { createFlameAnims } from "../entities/flameAnims";
import { createStarModalAnims } from "../entities/starAnims";
import { createInfoModalAnims } from "../entities/infoAnims";
import { createAudioIconAnims } from "../entities/audioAnims";
import AnimatedTiles from "../utils/AnimatedTiles.js";
import findPath from "../utils/findPath";
import { WarpPostFX } from "../utils/warp.js";
import { birdsList, modalList, flameList } from "../configs/lists.js";

import "../entities/character";
import "../entities/arrow";
import "../entities/bird";
import "../entities/flame";
import "../entities/starModal";
import "../entities/infoModal";
import "../entities/audio";

export default class Portfolio extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private character!: Phaser.Physics.Arcade.Sprite;
  private t!: number;
  private t2!: number;
  private tIncrement!: number;
  private animatedTiles!: any;
  private characterVert!: number;
  private modalObject!: Array<Phaser.Physics.Arcade.Sprite>;
  private modalsSelected!: Array<string>;
  private uiLayer!: Phaser.GameObjects.Layer;
  private groundLayer!: any;
  private cloudLayer!: any;
  private birds!: Array<Phaser.Physics.Arcade.Sprite>;
  private flames!: Array<Phaser.Physics.Arcade.Sprite>;
  private star!: Phaser.Physics.Arcade.Sprite;
  private secret!: Boolean;
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

    createFlameAnims(this.anims);

    createStarModalAnims(this.anims);

    createInfoModalAnims(this.anims);
    
    createAudioIconAnims(this.anims);

    //create modal object listing, and selected modal listing
    this.modalObject = [];
    this.modalsSelected = [];

    //secret passage
    this.secret = false;

    //create ignore listings for cameras
    const camera1Ignore: any[] = [];
    const camera2Ignore: any[] = [];
    const camera3Ignore: any[] = [];

    //create the map, and pull in the tileset for the map
    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("tileset", "tiles", 80, 80, 1, 2);

    //create the underwater layer
    const shaderLayer = map.createLayer("shader1", tileset);
    shaderLayer.alpha = 0.1;

    camera2Ignore.push(shaderLayer);
    camera3Ignore.push(shaderLayer);

    this.cloudLayer = this.add.tileSprite(0, 0, 16000, 6000, "clouds");
    this.cloudLayer.alpha = 0.2;

    camera1Ignore.push(this.cloudLayer);
    camera3Ignore.push(this.cloudLayer);

    //create the ground layer
    this.groundLayer = map.createLayer("GroundLayer", tileset);

    camera1Ignore.push(this.groundLayer);
    camera3Ignore.push(this.groundLayer);

    //draw the animated sprites layer
    const waterLayer = map.createLayer("WaterTiles", tileset);

    camera1Ignore.push(waterLayer);
    camera3Ignore.push(waterLayer);

    //layer of objects for drawing found modal gems
    this.uiLayer = this.add.layer();

    camera1Ignore.push(this.uiLayer);
    camera2Ignore.push(this.uiLayer);

    //set the collision map on the ground
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.flames = [];

    flameList.forEach((flame, index) => {
      let targetFlame = this.add.flame(flame.x, flame.y, "flameSprite");
      targetFlame.setIndex(index);
      this.flames.push(targetFlame);
    });

    camera1Ignore.push(this.flames);
    camera3Ignore.push(this.flames);

    //add in the player character //760, 800
    this.character = this.add.character(880, 820, "characterSprite");

    camera1Ignore.push(this.character);
    camera3Ignore.push(this.character);

    //debug the collisions on the ground if required
    if (debugDrawEnable) {
      debugDraw(this.groundLayer, this);
    }

    //create modal gems
    modalList.forEach((modal, index) => {
      this.modalObject.push(this.add.arrow(modal.x, modal.y, "arrowSprite"));
      this.modalObject[index].tint = modal.tint;
      this.modalObject[index].setModal(modal.name);
      this.modalObject[index].body.setImmovable();
      this.physics.add.collider(this.character, this.modalObject[index], () =>
        this.modalObject[index].showModal(
          this.modalsSelected,
          modal.tint,
          this.uiLayer
        )
      );
    }, this);

    camera1Ignore.push(this.modalObject);
    camera3Ignore.push(this.modalObject);

    //create Star
    this.star = this.add.starModal(4316, 390, "starSprite")

    this.star.tint = 0xffef00;
    this.star.setStarModal("modal5");
    this.star.body.setImmovable();
    this.physics.add.collider(this.character, this.star, () =>
    this.star.showModal()
    )

    
    camera1Ignore.push(this.star);
    camera3Ignore.push(this.star);

    let audioConf = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }
    let music = this.sound.add("music", audioConf);

    let self = this
    window.addEventListener('closedStart', function() {
      music.play()
    })


    let info = this.uiLayer.add(this.add.infoModal(<number>this.game.config.width - 80, 45, "infoSprite")).setInteractive();
    info.setInfoModal('modal0');

    info.on("pointerdown", function () {
      console.log('clicked info')
      info.showModal();
    });

    let audioUIIcon = this.uiLayer.add(this.add.audioIcon(<number>this.game.config.width - 160, 45, "audioSprite")).setInteractive();
    //info.setInfoModal('modal0');

    audioUIIcon.on("pointerdown", function () {
      console.log('clicked info2')
      if (music.isPlaying) {
        music.pause()
      } else if (music.isPaused) {
        music.resume()
      }
      audioUIIcon.setAudioState(music.isPlaying)
    });



    //create birds
    this.birds = [];

    birdsList.forEach((flock) => {
      let flockSize = flock.flockSize;
      for (let i = 0; i < flockSize; i++) {
        let randomX = Phaser.Math.Between(-70, 70);
        let targetBird = this.add.bird(
          flock.x + randomX,
          flock.y,
          "birdSprite"
        );
        targetBird.setTriggered();
        this.birds.push(targetBird);
      }
    });

    camera1Ignore.push(this.birds);
    camera3Ignore.push(this.birds);

    //draw the tree top layer
    const treetopLayer = map.createLayer("TreeTops", tileset);

    camera1Ignore.push(treetopLayer);
    camera3Ignore.push(treetopLayer);

    //initialize animations
    this.animatedTiles.init(map);

    //set collisions for player and ground layer
    this.physics.add.collider(this.character, this.groundLayer);

    this.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        const { worldX, worldY } = pointer;

        const startVec = this.groundLayer.worldToTileXY(
          this.character.body.x,
          this.character.body.y
        );
        const targetVec = this.groundLayer.worldToTileXY(worldX, worldY);

        // generate the path
        const path = findPath(startVec, targetVec, this.groundLayer);

        // give it to the player to use
        this.character.moveAlong(path);
      }
    );

    this.t = 0; // time variable for the distor shader
    this.t2 = 0;
    this.tIncrement = 0.05;
    let camera1 = this.cameras.main; //shader driven layer
    let camera2 = this.cameras.add(); //most game objects
    let camera3 = this.cameras.add(); //top ui layer - modal objects
    camera1.setPostPipeline(WarpPostFX);
    camera1.startFollow(this.character);
    camera2.startFollow(this.character);
    var pipelineInstance = camera1.getPostPipeline(WarpPostFX);
    //pipelineInstance.setResizeMode(2);
    //pipelineInstance.setProgress(0.1);

    camera1.ignore(camera1Ignore);
    camera2.ignore(camera2Ignore);
    camera3.ignore(camera3Ignore);

    showModal('modal0');

    function showModal(modal){
      let modalContent = document.getElementsByClassName("modal-content");
        Array.prototype.forEach.call(modalContent, function (el) {
          el.style.display = "none";
        });
        let targetContent = document.getElementById(modal + "-content");
        targetContent?.style.display = "inline-block";
        let modalDOM = document.getElementById("modal");
        modalDOM?.style.display = "inline-block";
        <number>document?.getElementById("modal-interior")?.scrollTop = 0;
    }
  }



  update(t: number, dt: number) {
    //if character exists, update the character each frame
    if (this.character) {
      this.character.update(this.cursors);
      this.modalObject.forEach((modal) => {
        modal.update(this.character);
      });
      this.birds.forEach((bird) => {
        bird.update(this.character);
      });
      this.flames.forEach((flame) => {
        flame.update(this.modalsSelected);
      });
      this.star.update(this.character);
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
    if (
      this.secret === false &&
      this.modalsSelected.length === modalList.length
    ) {
      this.secret = true;
      this.groundLayer.layer.data.forEach((layer) => {
        layer.forEach((tile) => {
          if (tile.index === 170) {
            tile.index = 18;
            tile.properties.collides = false;
            tile.setCollision(false);
          }
          if (tile.index === 169) {
            tile.index = 18;
            tile.properties.collides = false;
            tile.setCollision(false);
          }
        });
      });
    }
  }
}
