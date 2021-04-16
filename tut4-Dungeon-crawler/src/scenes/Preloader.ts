import Phaser, { FOREVER } from 'phaser';
import {createLizardAnims} from '../anims/enemyAnims';
import {createFaunaAnim} from '../anims/characterAnims';
import {createChestAnims} from '../anims/chestAnims';

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
        this.load.atlas('chest', 'items/treasure.png', 'items/treasure.json');
        this.load.image('uiHeartFull', 'ui/ui_heart_full.png');
        this.load.image('uiHeartEmpty', 'ui/ui_heart_empty.png');
        this.load.image('knife', 'weapons/weapon_knife.png');
    }

    create()
    {
        this.scene.start('game');
        createFaunaAnim(this.anims);
        createLizardAnims(this.anims);
        createChestAnims(this.anims);
    }
}