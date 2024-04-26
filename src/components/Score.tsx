import type Phaser from 'phaser';
import { Text } from 'phaser-jsx';

import { Depth } from '../constants';

interface Props {
  text: string;
  ref?: (text: Phaser.GameObjects.Text) => void;
}

export function Score(props: Props) {
  return (
    <Text
      text={props.text}
      x={16}
      y={16}
      style={{
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '24px',
        stroke: 'black',
        strokeThickness: 4,
      }}
      scrollFactorX={0}
      scrollFactorY={0}
      depth={Depth.AboveWorld}
      ref={props.ref}
    />
  );
}
