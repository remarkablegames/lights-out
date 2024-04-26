import Phaser from 'phaser';

import {
  Depth,
  key,
  TilemapLayer,
  TilemapObject,
  TILESET_NAME,
} from '../constants';
import { Player, Spaceman } from '../sprites';

type ArcadeColliderType = Phaser.Types.Physics.Arcade.ArcadeColliderType;

export class Main extends Phaser.Scene {
  private player!: Player;
  private spacemanGroup!: Phaser.GameObjects.Group;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private worldLayer!: Phaser.Tilemaps.TilemapLayer;
  private vignette!: Phaser.FX.Vignette;

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

    this.addPlayer();
    this.addSpaceman();
    this.addVignette();

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.pause(key.scene.main);
      this.scene.launch(key.scene.menu);
    });
  }

  private addVignette() {
    this.vignette = this.cameras.main.postFX.addVignette(0.5, 0.5, 1);
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.vignette.radius = Phaser.Math.Clamp(
          this.vignette.radius - 0.01,
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

    Array(10)
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
