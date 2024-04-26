import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { Score } from '../components';
import {
  Depth,
  key,
  TilemapLayer,
  TilemapObject,
  TILESET_NAME,
} from '../constants';
import { getLevel, type Level } from '../levels';
import { Player, Spaceman } from '../sprites';

type ArcadeColliderType = Phaser.Types.Physics.Arcade.ArcadeColliderType;

export class Main extends Phaser.Scene {
  private level!: Level;
  private player!: Player;
  private score!: Phaser.GameObjects.Text;
  private spacemanGroup!: Phaser.GameObjects.Group;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private vignette!: Phaser.FX.Vignette;
  private worldLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super(key.scene.main);
  }

  init(data: { level: number }) {
    const level = getLevel(data.level);
    if (level) {
      this.level = level;
    } else {
      this.scene.start(key.scene.win);
    }
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

    this.addPlayer();
    this.addSpaceman();
    this.addVignette();

    render(
      <Score
        text={`Collect ${this.level.powerups} Powerup${this.level.powerups > 1 ? 's' : ''}`}
      />,
      this,
    );

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.pause(key.scene.main);
      this.scene.launch(key.scene.menu);
    });
  }

  private addVignette() {
    this.vignette = this.cameras.main.postFX.addVignette(0.5, 0.5, 1);
    this.time.addEvent({
      delay: this.level.delay,
      callback: () => {
        this.vignette.radius = Phaser.Math.Clamp(
          this.vignette.radius - this.level.radius,
          0,
          1,
        );
      },
      callbackScope: this,
      loop: true,
    });
  }

  private addPlayer() {
    const spawnPoint = this.tilemap.findObject(
      TilemapLayer.Objects,
      ({ name }) => name === TilemapObject.SpawnPoint,
    )!;

    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);
    this.physics.add.collider(this.player, this.worldLayer);
  }

  private addSpaceman() {
    this.spacemanGroup = this.add.group();

    Array(this.level.spacemen)
      .fill(undefined)
      .forEach(() => {
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
        spaceman.destroy();
        this.level.powerups--;
        if (this.level.powerups === 0) {
          this.scene.restart({ level: this.level.level + 1 });
        }
        this.vignette.radius = Phaser.Math.Clamp(
          this.vignette.radius + 0.05,
          0,
          1,
        );
      },
      undefined,
      this,
    );
  }

  update() {
    this.player.update();
    this.spacemanGroup.getChildren().forEach((spaceman) => spaceman.update());
  }
}
