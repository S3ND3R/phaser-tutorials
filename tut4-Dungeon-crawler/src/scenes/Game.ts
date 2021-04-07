import Phaser from 'phaser';
import Lizard from '../enemies/lizard';

import {debugDraw} from '../utils/debug';

export default class Game extends Phaser.Scene
{
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private fauna!: Phaser.Physics.Arcade.Sprite;
    private lizards!: Phaser.Physics.Arcade.Group;
    
	constructor()
	{
		super('game')
	}

    create()
    {
        const map = this.make.tilemap({key: 'dungeon'});
        const tileSet = map.addTilesetImage('Dungeon', 'tiles');
        map.createLayer('ground', tileSet);
        const wallLayer = map.createLayer('walls', tileSet);

        wallLayer.setCollisionByProperty({collides: true});

        //debugDraw(wallLayer, this);

        this.fauna = this.physics.add.sprite(128, 128, 'fauna', 'walk-down-3.png');
        this.fauna.body.setSize(this.fauna.height * 0.5, this.fauna.width * 0.8);
        this.fauna.play('fauna-idle-down');

        this.lizards = this.physics.add.group({
            classType: Lizard,
            createCallback: (go) => {
                const lizGo = go as Lizard;
                lizGo.body.onCollide = true;
            }
        });

        this.lizards.get(200, 160, 'lizMan');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.fauna, wallLayer);
        this.physics.add.collider(this.lizards, wallLayer);

        this.cameras.main.startFollow(this.fauna, true);

    }

    update(t: number, dt: number)
    {
        const speed = 100;

        // check that fauna and cursors have been defined
        if(!this.cursors || !this.fauna)
        {
            return;
        }

        if(this.cursors.up?.isDown)
        {
            this.fauna.setVelocity(0, -speed);
            this.fauna.play('fauna-run-up', true);
        }
        else if(this.cursors.down?.isDown)
        {
            this.fauna.setVelocity(0, speed);
            this.fauna.play('fauna-run-down', true);
        }
        else if(this.cursors.right?.isDown)
        {
            this.fauna.setVelocity(speed, 0);
            this.fauna.play('fauna-run-side', true);
            this.fauna.scaleX = 1;
            this.fauna.body.offset.x = 8;
        }
        else if(this.cursors.left?.isDown)
        {
            this.fauna.setVelocity(-speed, 0);
            this.fauna.play('fauna-run-side', true);
            this.fauna.scaleX = -1;
            this.fauna.body.offset.x = 24;

        }
        else
        {
            const parts: string[] = this.fauna.anims.currentAnim.key.split('-');
            parts[1] = 'idle'
            this.fauna.play(parts.join('-')).setVelocity(0,0);
        }
    }
}