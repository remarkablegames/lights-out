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
  Horizontal: 175,
  Vertical: 175,
} as const;

export class Cat extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;

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
    return Phaser.Utils.Array.GetRandom(directions);
  }

  update() {
    const { anims, body } = this;
    const prevVelocity = body.velocity.clone();

    // Stop any previous movement from the last frame
    body.setVelocity(0);

    const direction = this.getDirection();

    // Horizontal movement
    switch (true) {
      case direction === Direction.Left:
        body.setVelocityX(-Velocity.Horizontal);
        break;

      case direction === Direction.Right:
        body.setVelocityX(Velocity.Horizontal);
        break;
    }

    // Vertical movement
    switch (true) {
      case direction === Direction.Down:
        body.setVelocityY(-Velocity.Vertical);
        break;

      case direction === Direction.Up:
        body.setVelocityY(Velocity.Vertical);
        break;
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    body.velocity.normalize().scale(Velocity.Horizontal);

    anims.stop();

    // If we were moving, pick an idle frame to use
    switch (true) {
      case prevVelocity.x < 0:
        this.setTexture(key.atlas.player, 'misa-left');
        break;
      case prevVelocity.x > 0:
        this.setTexture(key.atlas.player, 'misa-right');
        break;
      case prevVelocity.y < 0:
        this.setTexture(key.atlas.player, 'misa-back');
        break;
      case prevVelocity.y > 0:
        this.setTexture(key.atlas.player, 'misa-front');
        break;
    }
  }
}
