import Phaser, {FOREVER} from 'phaser';

const createChestAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'chest-open',
        frames: anims.generateFrameNames('chest', {
            start: 0,
            end: 2,
            prefix: 'chest_empty_open_anim_f',
            suffix: '.png'
        }),
        frameRate: 10
    });

    anims.create({
        key: 'chest-closed',
        frames: [{key: 'chest', frame: 'chest_empty_open_anim_f0.png'}]
    });

    anims.create({
        key:'coin-anim',
        frames: anims.generateFrameNames('chest', {
            start: 0,
            end: 3,
            prefix:'coin_anim_f',
            suffix: '.png'
        }),
        frameRate: 15
    });
};

export
{
    createChestAnims
};