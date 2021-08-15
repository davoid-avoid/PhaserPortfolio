import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor(){
        super('preloader')
    }

    preload(){
        this.load.image('tiles', 'tiles/tilemaplargeextrude.png')
        this.load.tilemapTiledJSON('tilemap', 'tiles/tilemap.json')
        
        this.load.atlas('characterSprite', 'sprites/character.png', 'sprites/character.json')
        this.load.atlas('arrowSprite', 'sprites/arrow.png', 'sprites/arrow.json')
    }
    create(){
        this.scene.start('portfolio')
    }
}