import Phaser from 'phaser';
import Lizard from '../enemies/lizard';
import '../characters/fauna';
import Fauna from '../characters/fauna';
import {sceneEvents} from '../events/EventsCenter'

import {debugDraw} from '../utils/debug';


export default class Game extends Phaser.Scene
{
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private fauna!: Fauna;
    private lizards!: Phaser.Physics.Arcade.Group;
    private knives!: Phaser.Physics.Arcade.Group;

    // currently not being used
    private playerLizardCollider?: Phaser.Physics.Arcade.Collider; 
    
	constructor()
	{
		super('game')
	}

    create()
    {
        //ui setup
        this.scene.run('game-ui');

        //map setup
        const map = this.make.tilemap({key: 'dungeon'});
        const tileSet = map.addTilesetImage('Dungeon', 'tiles');
        map.createLayer('ground', tileSet);
        const wallLayer = map.createLayer('walls', tileSet);
        wallLayer.setCollisionByProperty({collides: true});

        //debugDraw(wallLayer, this);

        // create player character
        this.fauna = this.add.fauna(128, 128, 'fauna');

        // create the lizard character group
        // TODO: this may be able to have collision handled in the lizard class 
        this.lizards = this.physics.add.group({
            classType: Lizard,
            createCallback: (go) => {
                const lizGo = go as Lizard;
                lizGo.body.onCollide = true;
            }
        });
        this.lizards.get(200, 160, 'lizMan');

        //create a knives group
        this.knives = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image
        });
        this.fauna.setKnives(this.knives);

        // create keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // create colliders
        this.physics.add.collider(this.fauna, wallLayer);
        this.physics.add.collider(this.lizards, wallLayer);
        this.playerLizardCollider = this.physics.add.collider(this.fauna, this.lizards, this.handleLizardPlayerCol, undefined, this);
        this.physics.add.collider(this.knives, wallLayer, this.handleKnifeWallCollision, undefined, this);
        this.physics.add.collider(this.knives, this.lizards, this.handleKnifeLizardCollision, undefined, this);

        // create camera
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

        sceneEvents.emit('player-health-damaged', this.fauna.health);

        // Now handles this within the player class by disabling sprite body
        // if (this.fauna.health <= 0)
        // {
        //     this.playerLizardCollider?.destroy();
        // }
    }

    private handleKnifeWallCollision(knife: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject)
    {
        this.knives.killAndHide(knife);
    }

    private handleKnifeLizardCollision(knife: Phaser.GameObjects.GameObject, lizard: Phaser.GameObjects.GameObject)
    {
        this.knives.killAndHide(knife);
        this.lizards.killAndHide(lizard);
    }
}