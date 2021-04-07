import Phaser, { FOREVER } from 'phaser';
import {createLizardAnims} from '../anims/enemyAnims';
import {createFaunaAnim} from '../anims/characterAnims';

export default class Preloader extends Phaser.Scene
{
    constructor()
	{
		super('preloader')
	}

	preload()
    {
        this.load.image('tiles', 'tiles/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon', 'dungeons/dungeon-01.json');
        this.load.atlas('fauna', 'character/fauna.png', 'character/fauna.json');
        this.load.atlas('lizMan', 'enemies/lizard.png', 'enemies/lizard.json');
    }

    create()
    {
        this.scene.start('game');
        createFaunaAnim(this.anims);
        createLizardAnims(this.anims);
    }
}