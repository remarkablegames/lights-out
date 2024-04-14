import Phaser from 'phaser';

import { key } from '../constants';

enum Animation {
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
  Down = 'Down',
}

enum Direction {
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
  Down = 'Down',
}

const directions = Object.values(Direction);

const Velocity = {
  Horizontal: 150,
  Vertical: 150,
} as const;

export class Cat extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  direction = Direction.Left;
  nextUpdateDirectionTime = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = key.atlas.cat,
    frame = 'misa-front',
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    // The image has a bit of whitespace so use setSize and
    // setOffset to control the size of the player's body
    this.setSize(32, 42).setOffset(0, 22);

    this.setCollideWorldBounds(true);
    this.setTint(0xff0000);
    this.createAnimations();
  }

  private createAnimations() {
    const anims = this.scene.anims;

    // Create left animation
    if (!anims.exists(Animation.Left)) {
      anims.create({
        key: Animation.Left,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-left-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Create right animation
    if (!anims.exists(Animation.Right)) {
      anims.create({
        key: Animation.Right,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-right-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Create up animation
    if (!anims.exists(Animation.Up)) {
      anims.create({
        key: Animation.Up,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-back-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Create down animation
    if (!anims.exists(Animation.Down)) {
      anims.create({
        key: Animation.Down,
        frames: anims.generateFrameNames(key.atlas.player, {
          prefix: 'misa-front-walk.',
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  private getDirection() {
    const { now } = this.scene.time;
    if (now > this.nextUpdateDirectionTime) {
      this.direction = Phaser.Utils.Array.GetRandom(directions);
      this.nextUpdateDirectionTime = now + Phaser.Math.Between(500, 2500);
    }
    return this.direction;
  }

  update() {
    const { anims, body } = this;

    const direction = this.getDirection();

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
