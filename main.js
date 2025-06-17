class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    // load assets here later
  }

  create() {
    this.add.text(20, 20, "👾 Debugged - Sector 01", {
      font: "20px Courier",
      fill: "#00ffcc",
    });
  }

  update() {
    // game loop logic
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#111122",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 500 }, debug: false },
  },
  scene: MainScene,
};

new Phaser.Game(config);
