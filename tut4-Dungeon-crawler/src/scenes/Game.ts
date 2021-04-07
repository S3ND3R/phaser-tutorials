import Phaser from 'phaser';
import Lizard from '../enemies/lizard';
import '../characters/fauna';
import Fauna from '../characters/fauna';

import {debugDraw} from '../utils/debug';


export default class Game extends Phaser.Scene
{
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private fauna!: Fauna;
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

        this.fauna = this.add.fauna(128, 128, 'fauna');

        // TODO: this may be able to have collision handled in the lizard class 
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
        this.physics.add.collider(this.fauna, this.lizards, this.handleLizardPlayerCol, undefined, this);

        this.cameras.main.startFollow(this.fauna, true);

    }

    update(t: number, dt: number)
    {
        if (this.fauna)
        {
            this.fauna.update(this.cursors);
        }

    }

    /**
     * handler method for lizard and player collision
     */
    private handleLizardPlayerCol(player: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject)
    {
        const lizard = enemy as Lizard;

        const dx = this.fauna.x - lizard.x;
        const dy = this.fauna.y - lizard.y;

        const bounceDir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

        this.fauna.handleDamage(bounceDir);
    }
}