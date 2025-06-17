class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("player", "assets/player.png");
  }

  create() {
    this.add.text(20, 20, "👾 Debugged - Sector 01", {
      font: "20px Courier",
      fill: "#00ffcc",
    });

    this.player = this.physics.add
      .sprite(100, 450, "player")
      .setCollideWorldBounds(true);

    const ground = this.add.rectangle(
      0,
      size.height - 10,
      size.width * 2,
      20,
      0x444444
    );
    this.physics.add.existing(ground, true);
    this.physics.add.collider(this.player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    const gfx = this.add.graphics();
    gfx.fillStyle(0x8888ff, 1);
    gfx.fillRect(0, 0, 200, 20);
    gfx.generateTexture("platform", 200, 20);
    gfx.destroy();

    this.platforms = this.physics.add.staticGroup();
    const coords = [
      { x: size.width / 4, y: size.height - 100 },
      { x: size.width / 2, y: size.height - 200 },
      { x: (size.width / 4) * 3, y: size.height - 300 },
    ];
    coords.forEach(({ x, y }) => {
      this.platforms
        .create(x, y, "platform")
        .setTint(Phaser.Display.Color.RandomRGB().color)
        .refreshBody();
    });

    this.physics.add.collider(this.player, this.platforms);

    // a) generate a 48×48 “terminal” texture
    const tGfx = this.add.graphics();
    tGfx.fillStyle(0x222222, 1);
    tGfx.fillRect(0, 0, 48, 48);
    tGfx.generateTexture("terminal", 48, 48);
    tGfx.destroy();

    // b) place it and enable overlap
    this.terminal = this.physics.add.staticSprite(500, 520, "terminal");
    this.physics.add.overlap(this.player, this.terminal, () => {
      this.canInteract = true;
    });

    // c) “Press E” hint
    this.interactText = this.add
      .text(0, 0, "Press E to interact", { font: "16px Courier", fill: "#fff" })
      .setVisible(false);

    // d) capture E
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.inTerminal = false;
    this.codeMirror = null;
  }

  update() {
    const speed = 200;
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;

    if (left) {
      this.player.setVelocityX(-speed);
    } else if (right) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (up && this.player.body.touching.down) {
      this.player.setVelocityY(-350);
    }

    if (this.canInteract && !this.inTerminal) {
      this.interactText
        .setPosition(this.player.x - 50, this.player.y - 60)
        .setVisible(true);

      if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
        this.openTerminal();
      }
    } else {
      this.interactText.setVisible(false);
    }
  }

  openTerminal() {
    this.inTerminal = true;
    this.scene.pause();
    document.getElementById("terminal-container").style.display = "block";

    if (!this.codeMirror) {
      this.codeMirror = CodeMirror.fromTextArea(
        document.getElementById("terminal-editor"),
        { mode: "javascript", lineNumbers: true }
      );
      document.getElementById("run-btn").onclick = () => {
        const userCode = this.codeMirror.getValue();
        console.log("User wrote:", userCode);
        // we’ll validate this next
      };
    }
  }
}

const size = {
  width: 1000,
  height: 750,
};

const config = {
  type: Phaser.AUTO,
  width: size.width,
  height: size.height,
  backgroundColor: "#111122",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 500 }, debug: false },
  },
  scene: MainScene,
};

new Phaser.Game(config);
