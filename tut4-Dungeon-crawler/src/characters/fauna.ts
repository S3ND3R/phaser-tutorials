import Phaser from 'phaser'

declare global
{
    namespace Phaser.GameObjects
    {
        interface GameObjectFactory
        {
            fauna(x: number, y: number, texture: string, frame?: string | number): Fauna;
        }
    }

}

enum HealthState
{
    SAFE,
    DAMAGE,
    DEAD
}

export default class Fauna extends Phaser.Physics.Arcade.Sprite
{
    private healthState: HealthState = HealthState.SAFE;
    private damageTime: number;
    private _health: number;
    private knives?: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame);

        this.play('fauna-idle-down');
        this.damageTime = 0;
        this._health = 3;
    }

    preUpdate(t: number, dt: number)
    {
        super.preUpdate(t, dt);
        switch(this.healthState)
        {
            case HealthState.SAFE:
                break;
            case HealthState.DAMAGE:
                this.damageTime += dt;
                if (this.damageTime >= 250)
                {
                    this.healthState = HealthState.SAFE;
                    this.setTint(0xffffff);
                    this.damageTime = 0;
                }
                break;
        };

    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        const speed = 100;

        if (this.healthState === HealthState.DAMAGE)
        {
            return;
        }

        if (this.healthState === HealthState.DEAD)
        {
            return;
        }


        // check that cursors have been defined
        if(!cursors)
        {
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space))
        {
            this.throwKnife();
            return;
        }

        if(
            cursors.up?.isDown)
        {
            
            this.setVelocity(0, -speed);
            
            this.play('fauna-run-up', true);
        }
        else if(
            cursors.down?.isDown)
        {
            
            this.setVelocity(0, speed);
            
            this.play('fauna-run-down', true);
        }
        else if(
            cursors.right?.isDown)
        {
            
            this.setVelocity(speed, 0);
            
            this.play('fauna-run-side', true);
            
            this.scaleX = 1;
            
            this.body.offset.x = 8;
        }
        else if(
            cursors.left?.isDown)
        {
            
            this.setVelocity(-speed, 0);
            
            this.play('fauna-run-side', true);
            
            this.scaleX = -1;
            
            this.body.offset.x = 24;

        }
        else
        {
            const parts: string[] = 
            this.anims.currentAnim.key.split('-');
            parts[1] = 'idle'
            
            this.play(parts.join('-')).setVelocity(0,0);
        }

    }

    private throwKnife() : void
    {
        if(!this.knives)
        {
            return;
        }

        const vec = new Phaser.Math.Vector2(0,0);
        const parts = this.anims.currentAnim.key.split('-');
        const dir = parts[2];

        switch(dir)
        {
            case 'up':
                vec.y = -1;
                break;
            case 'down':
                vec.y = 1;
                break;
            default:
            case 'side':
                if (this.scaleX < 0)
                {
                    vec.x = -1;
                }
                else
                {
                    vec.x = 1;
                }
                break;
        }

        const angle = vec.angle();
        const knife = this.knives.get(this.x, this.y, 'knife') as Phaser.Physics.Arcade.Image;

        knife.x += vec.x * 16;
        knife.y += vec.y * 16;

        knife.setActive(true);
        knife.setVisible(true);
        knife.setRotation(angle);
        knife.setVelocity(vec.x * 300, vec.y * 300);
    }

    get health(): number
    {
        return this._health;
    }

    setKnives(knives: Phaser.Physics.Arcade.Group): void
    {
        this.knives = knives;
    }

    handleDamage(dir: Phaser.Math.Vector2): void
    {
        if (this.healthState === HealthState.DEAD)
        {
            return;
        }
        if (this.healthState === HealthState.DAMAGE)
        {
            return;
        }
        this.setVelocity(dir.x, dir.y);
        this.setTint(0xff0000);
        this.healthState = HealthState.DAMAGE;
        --this._health;
        if (this._health <= 0)
        {
            this.healthState = HealthState.DEAD;
            this.body.enable = false;
            this.play('fauna-faint', true);
            this.setVelocity(0,0);
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('fauna', function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    
    var sprite = new Fauna(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

    sprite.body.setSize(sprite.height * 0.5, sprite.width * 0.8);

    return sprite;
});