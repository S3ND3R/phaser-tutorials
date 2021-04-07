import Phaser from 'phaser';

const debugDraw = (layer: Phaser.Tilemaps.TilemapLayer, scene: Phaser.Scene) => {
    const debugGraphics = scene.add.graphics().setAlpha(0.75);
        layer.renderDebug(debugGraphics, {
            // Color of non-colliding tiles
            tileColor: null, 
            // Color of colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            // Color of colliding face edges
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });
};

export {debugDraw};