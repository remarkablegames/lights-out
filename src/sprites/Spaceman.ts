import Phaser from 'phaser';

import { Direction, key } from '../constants';

enum Animation {
  Left = 'spaceman_left',
  Right = 'spaceman_right',
  Up = 'spaceman_up',
  Down = 'spaceman_down',
}

const Velocity = {
  Horizontal: 100,
  Vertical: 100,
} as const;

export class Spaceman extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  direction = Direction.Left;
  nextUpdateDirectionTime = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = key.image.spaceman,
    frame = 0,
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setCollideWorldBounds(true);
    this.createAnimations();
    this.createMovement();
  }

  private createAnimations() {
    const anims = this.scene.anims;

    if (!anims.exists(Animation.Left)) {
      anims.create({
        key: Animation.Left,
        frames: anims.generateFrameNumbers(key.image.spaceman, {
          start: 8,
          end: 9,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Right)) {
      anims.create({
        key: Animation.Right,
        frames: anims.generateFrameNumbers(key.image.spaceman, {
          start: 1,
          end: 2,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Up)) {
      anims.create({
        key: Animation.Up,
        frames: anims.generateFrameNumbers(key.image.spaceman, {
          start: 11,
          end: 13,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Down)) {
      anims.create({
        key: Animation.Down,
        frames: anims.generateFrameNumbers(key.image.spaceman, {
          start: 4,
          end: 6,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  private createMovement() {
    this.scene.time.addEvent({
      callback: () => {
        this.direction = Phaser.Utils.Array.GetRandom(Object.values(Direction));
      },
      delay: Phaser.Math.Between(500, 2500),
      loop: true,
    });
  }

  update() {
    const { anims, body, direction } = this;

    // Horizontal movement
    switch (direction) {
      case Direction.Left:
        body.setVelocityX(-Velocity.Horizontal);
        anims.play(Animation.Left, true);
        break;

      case Direction.Right:
        body.setVelocityX(Velocity.Horizontal);
        anims.play(Animation.Right, true);
        break;
    }

    // Vertical movement
    switch (direction) {
      case Direction.Up:
        body.setVelocityY(-Velocity.Vertical);
        anims.play(Animation.Up, true);
        break;

      case Direction.Down:
        body.setVelocityY(Velocity.Vertical);
        anims.play(Animation.Down, true);
        break;
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    body.velocity.normalize().scale(Velocity.Horizontal);
  }
}
