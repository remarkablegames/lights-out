import { Scene } from 'phaser';
import { render, Text } from 'phaser-jsx';

import { Button } from '../components';
import { key } from '../constants';

export class Lose extends Scene {
  constructor() {
    super(key.scene.lose);
  }

  create() {
    const { centerX, centerY } = this.cameras.main;

    render(
      <>
        <Text
          text="You Lose!"
          x={centerX}
          y={centerY - 100}
          style={{
            color: 'white',
            fontSize: '36px',
          }}
          originX={0.5}
          originY={0.5}
        />

        <Button
          center
          fixed
          onClick={() => this.scene.start(key.scene.main, { level: 0 })}
          text="Restart"
          x={centerX}
          y={centerY + 100}
        />
      </>,
      this,
    );
  }
}
