import { Scene } from 'phaser';
import { render, Text } from 'phaser-jsx';

import { Button } from '../components';
import { key } from '../constants';

export class Win extends Scene {
  constructor() {
    super(key.scene.win);
  }

  create() {
    const { centerX, centerY } = this.cameras.main;

    render(
      <>
        <Text
          text="You Win!"
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
          x={centerX}
          y={centerY + 100}
          onClick={() => this.scene.start(key.scene.main, { level: 0 })}
        >
          Restart
        </Button>
      </>,
      this,
    );
  }
}
