import Phaser from 'phaser';

export default class Chest extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        this.play('chest-closed');
    }

    open(): number
    {
        
        if (this.anims.currentAnim.key === 'chest-open')
        {
            return 0;
        }
        this.play('chest-open');
        return Phaser.Math.Between(10, 100);
    }
}