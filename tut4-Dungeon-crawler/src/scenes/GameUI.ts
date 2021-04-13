import Phaser from 'phaser';
import {sceneEvents} from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene
{
    private health!: Phaser.GameObjects.Group;
    constructor()
    {
        super({key: 'game-ui'});
    }

    create()
    {
       this.health = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.health.createMultiple({
            key: 'uiHeartFull',
            setXY: {
                x: 10,
                y: 10,
                stepX: 16
            },
            quantity: 3
        });

        sceneEvents.on('player-health-damaged', this.handlePlayerDamaged, this)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-damaged', this.handlePlayerDamaged, this);
        });
    }

    private handlePlayerDamaged(health: number)
    {
        this.health.children.each((go, indx) => {
            const heart = go as Phaser.GameObjects.Image;

            if (indx < health)
            {
                heart.setTexture('uiHeartFull');
            }
            else
            {
                heart.setTexture('uiHeartEmpty');
            }
        })
    }
}