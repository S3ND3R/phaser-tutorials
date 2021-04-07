import Phaser from 'phaser'

enum Direction 
{
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export default class Lizard extends Phaser.Physics.Arcade.Sprite
{
    private direction: Direction = Direction.RIGHT;
    private moveEvent: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        this.anims.play('lizard-idle');

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);

        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(1500, 2000),
            callback: () => {
                this.direction = this.getNewDirection(this.direction);
            },
            loop: true 
        });
    }

    preUpdate(t: number, dt: number)
    {
        super.preUpdate(t, dt);

        const speed: number = 50;

        switch(this.direction)
        {
            case Direction.UP:
                this.setVelocity(0, -speed);
                break;
            case Direction.DOWN:
                this.setVelocity(0, speed);
                break;
            case Direction.LEFT:
                this.setVelocity(-speed, 0);
                break;
            case Direction.RIGHT:
                this.setVelocity(speed, 0);
                break;
        }
    }

    destroy()
    {
        this.moveEvent.destroy();

        // wasn't able to use the paramater used in the tutorial
        // TODO: check if it was deprecated
        super.destroy();
    }

    private getNewDirection(exclude: Direction)
    {
        let newDirection = Phaser.Math.Between(0,3);

        for (let count = 0; newDirection === exclude && count < 5; count++) {
            newDirection = Phaser.Math.Between(0,3);
        }
        return newDirection;
    }

    private handleTileCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile)
    {
        if(go !== this)
        {
            return
        }
        this.direction = this.getNewDirection(this.direction);;
    }
}
