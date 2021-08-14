import Phaser from 'phaser'

const debugDraw = (layer: Phaser.Tilemaps.StaticTileLayer, scene: Phaser.Scene) => {
    const debugGraphics = scene.add.graphics().setAlpha(0.7);
    layer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    });
}

export { debugDraw }