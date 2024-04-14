import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { TilemapDebug, Typewriter } from '../components';
import {
  Depth,
  key,
  TilemapLayer,
  TilemapObject,
  TILESET_NAME,
} from '../constants';
import { TileMarker } from '../graphics';
import { Player } from '../sprites';
import { Spaceman } from '../sprites';
import { state } from '../state';

interface Sign extends Phaser.Physics.Arcade.StaticBody {
  text?: string;
}

export class Main extends Phaser.Scene {
  private player!: Player;
  private sign!: Sign;
  private tileMarker!: TileMarker;
  private spacemanGroup!: Phaser.GameObjects.Group;

  constructor() {
    super(key.scene.main);
  }

  create() {
    const map = this.make.tilemap({ key: key.tilemap.tuxemon });
    const tileset = map.addTilesetImage(TILESET_NAME, key.image.tuxemon)!;

    map.createLayer(TilemapLayer.BelowPlayer, tileset);
    const worldLayer = map.createLayer(TilemapLayer.World, tileset)!;
    const aboveLayer = map.createLayer(
      TilemapLayer.AbovePlayer,
      tileset,
      0,
      0,
    )!;

    worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = worldLayer.width;
    this.physics.world.bounds.height = worldLayer.height;

    aboveLayer.setDepth(Depth.AbovePlayer);

    const spawnPoint = map.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === TilemapObject.SpawnPoint,
    )!;

    const sign = map.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === TilemapObject.Sign,
    )!;

    this.sign = this.physics.add.staticBody(
      sign.x!,
      sign.y!,
      sign.width,
      sign.height,
    );
    this.sign.text = sign.properties[0].value;

    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);
    this.enablePlayerSignInteraction();
    this.physics.add.collider(this.player, worldLayer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    render(<TilemapDebug tilemapLayer={worldLayer} />, this);

    this.tileMarker = new TileMarker(this, map, worldLayer!);

    this.spacemanGroup = this.add.group();
    Array.from(Array(10).keys()).forEach(() => {
      this.spacemanGroup.add(
        new Spaceman(
          this,
          Phaser.Math.RND.between(0, worldLayer.width - 1),
          Phaser.Math.RND.between(0, worldLayer.height - 1),
        ),
      );
    });
    this.physics.add.collider(this.spacemanGroup, worldLayer);
    this.physics.add.collider(this.spacemanGroup, this.player);
    this.physics.add.collider(this.spacemanGroup, this.spacemanGroup);

    state.isTypewriting = true;
    render(
      <Typewriter
        text="WASD or arrow keys to move."
        onEnd={() => (state.isTypewriting = false)}
      />,
      this,
    );

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.pause(key.scene.main);
      this.scene.launch(key.scene.menu);
    });
  }

  private enablePlayerSignInteraction() {
    type ArcadeColliderType = Phaser.Types.Physics.Arcade.ArcadeColliderType;

    this.physics.add.overlap(
      this.sign as unknown as ArcadeColliderType,
      this.player.selector as unknown as ArcadeColliderType,
      (sign) => {
        if (this.player.cursors.space.isDown && !state.isTypewriting) {
          state.isTypewriting = true;

          render(
            <Typewriter
              text={(sign as unknown as Sign).text!}
              onEnd={() => (state.isTypewriting = false)}
            />,
            this,
          );
        }
      },

      undefined,
      this,
    );
  }

  update() {
    this.player.update();
    this.tileMarker.update();
    this.spacemanGroup.getChildren().forEach((spaceman) => spaceman.update());
  }
}
