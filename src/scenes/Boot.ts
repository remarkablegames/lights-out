import { Scene } from 'phaser';

import * as assets from '../assets';
import { key } from '../constants';

export class Boot extends Scene {
  constructor() {
    super(key.scene.boot);
  }

  preload() {
    this.load.spritesheet(key.image.spaceman, assets.sprites.spaceman, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image(key.image.tuxemon, assets.tilemaps.tuxemonTileset);
    this.load.tilemapTiledJSON(
      key.tilemap.tuxemon,
      assets.tilemaps.tuxemonTilemap,
    );
    this.load.atlas(
      key.atlas.player,
      assets.atlas.playerImage,
      assets.atlas.playerData,
    );
    this.load.atlas(key.atlas.cat, assets.atlas.catImage, assets.atlas.catData);
  }

  create() {
    this.scene.start(key.scene.main);
  }
}
