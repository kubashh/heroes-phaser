import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super(`MainScene`);
  }

  create() {
    const graphics = this.add.graphics();

    graphics.fillStyle(0x66aaff);
    graphics.fillCircle(300, 200, 100);
  }
}
