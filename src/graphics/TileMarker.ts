import Phaser from 'phaser';

import { TilemapTile } from '../constants';

export class TileMarker extends Phaser.GameObjects.Graphics {
  private map!: Phaser.Tilemaps.Tilemap;
  private worldLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    worldLayer: Phaser.Tilemaps.TilemapLayer,
  ) {
    super(scene);
    this.map = map;
    this.worldLayer = worldLayer;

    this.lineStyle(5, 0xffffff, 1);
    this.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    this.lineStyle(3, 0xff4f78, 1);
    this.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    scene.add.existing(this);
  }

  update() {
    const worldPoint = this.scene.input.activePointer.positionToCamera(
      this.scene.cameras.main,
    ) as Phaser.Math.Vector2;

    const pointerTileXY = this.map.worldToTileXY(worldPoint.x, worldPoint.y)!;
    const snappedWorldPoint = this.map.tileToWorldXY(
      pointerTileXY.x,
      pointerTileXY.y,
    )!;
    this.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);

    const { activePointer } = this.scene.input.manager;

    // left-click draws tile
    if (activePointer.leftButtonDown()) {
      try {
        this.worldLayer
          .putTileAtWorldXY(TilemapTile.Rock, worldPoint.x, worldPoint.y)
          .setCollision(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // don't draw tile if outside of game world
      }
      // right-click removes tile
    } else if (activePointer.rightButtonDown()) {
      this.worldLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
    }
  }
}
