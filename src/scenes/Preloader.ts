import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor(){
        super('preloader')
    }

    preload(){
        this.load.image('tiles', 'tiles/tilemaplargeextrudetest.png')
        this.load.image('clouds', 'tiles/clouds.png')
        this.load.tilemapTiledJSON('tilemap', 'tiles/tilemap.json')
        
        this.load.atlas('characterSprite', 'sprites/character.png', 'sprites/character.json')
        this.load.atlas('arrowSprite', 'sprites/arrow.png', 'sprites/arrow.json')
        this.load.atlas('birdSprite', 'sprites/bird.png', 'sprites/bird.json')
        this.load.atlas('flameSprite', 'sprites/flame.png', 'sprites/flame.json')
        this.load.atlas('starSprite', 'sprites/star.png', 'sprites/star.json')
    }
    create(){
        this.scene.start('portfolio')
    }
}