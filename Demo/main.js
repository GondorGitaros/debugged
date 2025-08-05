class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.isWorldGlitched = true;
  }

  preload() {
    this.load.image("player", "../assets/player.png");
    this.load.image("terminal", "../assets/terminal.png");
  }

  create() {
    this.add.text(20, 20, "👾 Debugged - Tutorial", {
      font: "20px Courier",
      fill: "#00ffcc",
    });

    this.add.text(
      20,
      60,
      "Use the arrows or WAD to move to get to the terminal.",
      {
        font: "20px Courier",
        fill: "#00ffcc",
      }
    );

    this.add.text(
      20,
      100,
      "Interact with the terminal and solve the puzzle to fix the world and remove the glitch effect.",
      {
        font: "20px Courier",
        fill: "#00ffcc",
      }
    );

    this.add.text(
      20,
      140,
      "I recommend fullscreen mode for the best experience.",
      {
        font: "20px Courier",
        fill: "#00ffcc",
      }
    );

    // Create the "Enter Fullscreen" button text
    this.add.text(20, 180, "Press F11 to enter fullscreen!", {
      font: "20px Courier",
      fill: "#ffff00",
    });

    this.player = this.physics.add
      .sprite(100, size.height - 150, "player")
      .setCollideWorldBounds(true);

    // Create the ground
    const ground = this.add.rectangle(
      size.width / 2,
      size.height - 20,
      size.width,
      40,
      0xa5c9ff
    );
    this.physics.add.existing(ground, true);
    this.physics.add.collider(this.player, ground);

    // Create cursors and keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // Create platforms
    const gfx = this.add.graphics();
    gfx.fillStyle(0x8888ff, 1);
    gfx.fillRect(0, 0, 200, 20);
    gfx.generateTexture("platform", 200, 20);
    gfx.destroy();

    this.platforms = this.physics.add.staticGroup();
    const coords = [
      { x: size.width * 0.2, y: size.height * 0.9 }, // Example relative positioning
      { x: size.width * 0.3, y: size.height * 0.8 },
      { x: size.width * 0.4, y: size.height * 0.7 },
      { x: size.width * 0.5, y: size.height * 0.6 },
      { x: size.width * 0.6, y: size.height * 0.5 },
      { x: size.width * 0.7, y: size.height * 0.4 },
      { x: size.width * 0.8, y: size.height * 0.3 },
    ];
    coords.forEach(({ x, y }) => {
      const platform = this.platforms
        .create(x, y, "platform")
        .setTint(Phaser.Display.Color.RandomRGB().color)
        .refreshBody();
      platform.originalTint = platform.tintTopLeft;
    });
    this.physics.add.collider(this.player, this.platforms);

    // Terminal setup
    this.terminal = this.physics.add.staticSprite(
      size.width * 0.8,
      size.height * 0.25,
      "terminal"
    );
    this.physics.add.overlap(this.player, this.terminal, () => {
      this.canInteract = true;
    });

    this.interactText = this.add
      .text(0, 0, "Press E to interact", { font: "16px Courier", fill: "#fff" })
      .setVisible(false);

    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.inTerminal = false;
    this.codeMirror = null;

    // allow Esc key to close terminal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.inTerminal) {
        this.closeTerminal();
      }
    });
  }
  update() {
    // Handle player movement and interaction
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

    if (this.physics.overlap(this.player, this.terminal) && !this.inTerminal) {
      this.canInteract = true;
    } else {
      this.canInteract = false;
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

    // glitch effect
    if (this.isWorldGlitched) {
      this.platforms.getChildren().forEach((platform) => {
        // Flicker tint rapidly for a glitchy effect
        if (Phaser.Math.RND.frac() < 0.1) {
          platform.setTint(Phaser.Display.Color.RandomRGB().color);
        }
      });
    }
  }

  // Open the terminal UI
  openTerminal() {
    this.inTerminal = true;
    this.scene.pause();
    this.input.keyboard.removeCapture("W,A,S,D,E,SPACE,UP,DOWN,LEFT,RIGHT");
    document.getElementById("terminal-container").style.display = "block";

    if (!this.codeMirror) {
      document.getElementById("terminal-editor").value = `
// Puzzle: Write a function returnTrue()
// that returns true.
// Do not change the function name or signature.
// if you want to exit the terminal, press Escape.

function returnTrue() {
// your code here...
}
      `.trim();

      this.codeMirror = CodeMirror.fromTextArea(
        document.getElementById("terminal-editor"),
        { mode: "javascript", theme: "dracula", lineNumbers: true }
      );
      this.codeMirror.focus();

      document.getElementById("run-btn").onclick = () => {
        const userCode = this.codeMirror.getValue();
        let success = false;
        try {
          // wrap user code and force a return from returnTrue()
          const fn = new Function(userCode + "\nreturn returnTrue();");
          success = fn();
        } catch (err) {
          alert("Error in your code:\n" + err.message);
          return;
        }

        if (success === true) {
          this.puzzleSolved();
        } else {
          alert("Not quite—returnTrue() returned " + success);
        }
      };
    }
  }
  closeTerminal() {
    document.getElementById("terminal-container").style.display = "none";
    this.scene.resume();
    this.inTerminal = false;
    this.canInteract = false;
    this.input.keyboard.addCapture("W,A,S,D,E,SPACE,UP,DOWN,LEFT,RIGHT");
  }
  puzzleSolved() {
    // hide terminal UI
    document.getElementById("terminal-container").style.display = "none";
    this.scene.resume();
    this.inTerminal = false;
    this.canInteract = false;
    this.closeTerminal();
    this.terminal.setTint(0x00ff00);
    this.cameras.main.flash(300, 0, 255, 0);

    // Fix the world!
    this.isWorldGlitched = false;
    this.platforms.getChildren().forEach((platform) => {
      platform.setTint(0x00ccff);
    });

    // Show success message
    this.add.text(40, 300, "🎉 Puzzle solved! The world is fixed! 🎉", {
      font: "40px Courier",
      fill: "#00ffcc",
    });
  }
}

size = {
  width: 1920,
  height: 1080,
};

function startGame() {
  const gameContainer = document.getElementById("game-container");
  if (gameContainer) {
    gameContainer.innerHTML = "";
  }

  const config = {
    type: Phaser.AUTO,
    backgroundColor: "#111122",
    physics: {
      default: "arcade",
      arcade: { gravity: { y: 500 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      parent: "game-container",
      width: size.width,
      height: size.height,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: MainScene,
  };
  new Phaser.Game(config);
}
startGame();
