import Phaser, {FOREVER} from 'phaser';

const createLizardAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'lizard-idle',
        frames: anims.generateFrameNames('lizMan', {
            start: 0,
            end: 3,
            prefix: 'lizard_m_idle_anim_f',
            suffix: '.png' 
        }),
        repeat: FOREVER,
        frameRate: 15
    });

    anims.create({
        key: 'lizard-run',
        frames: anims.generateFrameNames('lizMan', {
            start: 0,
            end: 3,
            prefix: 'lizard_m_run_anim_f',
            suffix: '.png' 
        }),
        repeat: FOREVER,
        frameRate: 15
    });

};

export {
    createLizardAnims
};