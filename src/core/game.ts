import MainScene from "../scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
  // type: Phaser.AUTO,
  // width: window.innerWidth,
  // height: window.innerHeight,
  backgroundColor: `#222`,

  scale: {
    mode: Phaser.Scale.RESIZE, // important
    // autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: "arcade", // set Arcade Physics
    arcade: {
      // gravity: { y: 300 }, // vertical gravity
      debug: false, // show colliders for debugging
    },
  },

  scene: MainScene,
};

export let game: Phaser.Game = {} as any;

export function createNewGame() {
  game = new Phaser.Game(config);
  game.scene.start("MainScene"); // switch scene
}

document.addEventListener(`contextmenu`, (e) => e.preventDefault());
createNewGame();
