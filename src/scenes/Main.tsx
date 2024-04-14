import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { Score, TilemapDebug, Typewriter } from '../components';
import {
  Depth,
  key,
  TilemapLayer,
  TilemapObject,
  TILESET_NAME,
} from '../constants';
import { TileMarker } from '../graphics';
import { Player, Spaceman } from '../sprites';
import { state } from '../state';

type ArcadeColliderType = Phaser.Types.Physics.Arcade.ArcadeColliderType;

interface Sign extends Phaser.Physics.Arcade.StaticBody {
  text?: string;
}

export class Main extends Phaser.Scene {
  private player!: Player;
  private power = 0;
  private score!: Phaser.GameObjects.Text;
  private sign!: Sign;
  private spacemanGroup!: Phaser.GameObjects.Group;
  private tileMarker!: TileMarker;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private worldLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super(key.scene.main);
  }

  create() {
    this.tilemap = this.make.tilemap({ key: key.tilemap.tuxemon });
    const tileset = this.tilemap.addTilesetImage(
      TILESET_NAME,
      key.image.tuxemon,
    )!;

    this.tilemap.createLayer(TilemapLayer.BelowPlayer, tileset);
    this.worldLayer = this.tilemap.createLayer(TilemapLayer.World, tileset)!;
    const aboveLayer = this.tilemap.createLayer(
      TilemapLayer.AbovePlayer,
      tileset,
      0,
      0,
    )!;

    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.worldLayer.width;
    this.physics.world.bounds.height = this.worldLayer.height;

    aboveLayer.setDepth(Depth.AbovePlayer);

    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
    );

    render(<TilemapDebug tilemapLayer={this.worldLayer} />, this);

    this.tileMarker = new TileMarker(this, this.tilemap, this.worldLayer);

    this.addPlayer();
    this.addSpaceman();

    render(
      <Score text="Power: 0" ref={(score) => (this.score = score)} />,
      this,
    );

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

  private addPlayer() {
    const spawnPoint = this.tilemap.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === TilemapObject.SpawnPoint,
    )!;

    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);
    this.physics.add.collider(this.player, this.worldLayer);

    this.addPlayerSignInteraction();
  }

  private addSpaceman() {
    this.spacemanGroup = this.add.group();

    Array.from(Array(10).keys()).forEach(() => {
      this.spacemanGroup.add(
        new Spaceman(
          this,
          Phaser.Math.RND.between(0, this.worldLayer.width - 1),
          Phaser.Math.RND.between(0, this.worldLayer.height - 1),
        ),
      );
    });

    this.physics.add.collider(this.spacemanGroup, this.player);
    this.physics.add.collider(this.spacemanGroup, this.spacemanGroup);
    this.physics.add.collider(this.spacemanGroup, this.worldLayer);

    this.physics.add.overlap(
      this.spacemanGroup as unknown as ArcadeColliderType,
      this.player.selector as unknown as ArcadeColliderType,
      (spaceman) => {
        if (this.player.cursors.space.isDown) {
          spaceman.destroy();
          this.power++;
          this.score.setText(`Power: ${this.power}`);
        }
      },
      undefined,
      this,
    );
  }

  private addPlayerSignInteraction() {
    const sign = this.tilemap.findObject(
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
