size = {
	width: 1920,
	height: 1080,
};

const levels = [
	// Tutorial Level
	{
		platforms: [
			{ x: size.width * 0.2, y: size.height * 0.9 },
			{ x: size.width * 0.3, y: size.height * 0.8 },
			{ x: size.width * 0.4, y: size.height * 0.7 },
			{ x: size.width * 0.5, y: size.height * 0.6 },
			{ x: size.width * 0.6, y: size.height * 0.5 },
			{ x: size.width * 0.7, y: size.height * 0.4 },
			{ x: size.width * 0.8, y: size.height * 0.3 },
		],
		terminal: { x: size.width * 0.8, y: size.height * 0.25 },
		playerStart: { x: 100, y: 900 },
		successMessage: "Tutorial completed!",
		puzzle: {
			prompt: `/* 
Tutorial: Write a function returnTrue() that returns true.

if you want to exit press escape, but if you solve the 
puzzle you can continue to the next level, and the terminal 
will close automatically. 
*/
function returnTrue() {
  // your code here...
}`,
			test: function (userCode) {
				try {
					const fn = new Function(userCode + "\nreturn returnTrue();");
					return fn() === true;
				} catch {
					return false;
				}
			},
		},
		setup: function (scene) {
			scene.add.text(20, 20, "👾 Debugged - Tutorial", {
				font: "20px Courier",
				fill: "#00ffcc",
			});

			scene.add.text(
				20,
				60,
				"Use the arrows or WAD to move to get to the terminal.",
				{
					font: "20px Courier",
					fill: "#00ffcc",
				}
			);

			scene.add.text(
				20,
				100,
				"Interact with the terminal and solve the puzzle to fix the world and remove the glitch effect.",
				{
					font: "20px Courier",
					fill: "#00ffcc",
				}
			);

			scene.add.text(
				20,
				140,
				"I recommend fullscreen mode for the best experience.",
				{
					font: "20px Courier",
					fill: "#00ffcc",
				}
			);

			scene.add.text(20, 180, "Press F11 to enter fullscreen!", {
				font: "24px Courier",
				fill: "#ffff00",
			});
			scene.add.text(
				20,
				220,
				"Note: The game becomes increasingly difficult.",
				{
					font: "24px Courier",
					fill: "#ff0000",
				}
			);
		},

		onPuzzleSuccess: function (scene) {
			scene.puzzleSolved();
		},
	},
	// Level 1
	{
		platforms: [
			{ x: 400, y: 1000 },
			{ x: 700, y: 900 },
			{ x: 1000, y: 800 },
			{ x: 1300, y: 700 },
			{ x: 1600, y: 600 },
		],
		terminal: { x: 1600, y: 550 },
		playerStart: { x: 100, y: 900 },
		winBlock: { x: 1000, y: 400 },
		successMessage: "Level 1 completed!",
		puzzle: {
			prompt: `/*
Level 1: Write a function add(a, b) that returns the sum of a and b.
*/
function add(a, b) {
  // your code here...
}`,
			test: function (userCode) {
				try {
					const fn = new Function(userCode + "\nreturn add(2, 3);");
					const fn2 = new Function(userCode + "\nreturn add(5, 5);");
					const fn3 = new Function(userCode + "\nreturn add(-2, 44563);");
					return fn() === 5 && fn2() === 10 && fn3() === 44561;
				} catch {
					return false;
				}
			},
		},
		setup: function (scene) {
			scene.add.text(20, 20, "👾 Debugged - Level 1", {
				font: "20px Courier",
				fill: "#00ffcc",
			});

			scene.add.text(
				20,
				60,
				"In this level you will need to collect some data",
				{
					font: "24px Courier",
					fill: "#00ffcc",
				}
			);

			const level = levels[scene.levelIndex];
			const winBlock = scene.physics.add.staticSprite(
				level.winBlock.x,
				level.winBlock.y,
				"data"
			);

			// Add an overlap check. When player touches it, call puzzleSolved.
			scene.physics.add.overlap(
				scene.player,
				winBlock,
				() => {
					scene.puzzleSolved();
					winBlock.destroy();
				},
				null,
				scene
			);
		},
		onPuzzleSuccess: function (scene) {
			scene.closeTerminal();

			const platform = scene.platforms
				.create(1300, 500, "platform")
				.setTint(0x00ff00)
				.refreshBody();
			platform.originalTint = platform.tintTopLeft;
		},
	},
	// Level 2
	{
		platforms: [
			{ x: 300, y: 1000 },
			{ x: 600, y: 900 },
			{ x: 900, y: 800 },
			{ x: 1200, y: 700 },
			{ x: 1500, y: 600 },
		],
		playerStart: { x: 100, y: 900 },
		winBlock: { x: 1500, y: 550 },
		terminal: { x: 1500, y: 975 },
		successMessage: "Level 2 completed! Platforms stabilized.",
		puzzle: {
			prompt: `/*
Level 2: Unstable Ground
Nyx taunts: "The platforms are tied to a data stream. If you can't calculate the correct checksum, they'll stay unstable forever!"
Puzzle: Write a function calculateChecksum(data) that takes an array of numbers and returns their sum.
*/
function calculateChecksum(data) {
  // your code here...
}`,
			test: function (userCode) {
				try {
					const code = userCode;
					const fn1 = new Function(
						code + "\nreturn calculateChecksum([10, 25, 5, 60]);"
					)();
					const fn2 = new Function(
						code + "\nreturn calculateChecksum([1, 2, 3, 4, 5]);"
					)();
					const fn3 = new Function(
						code + "\nreturn calculateChecksum([-10, 10, -5, 5, 0]);"
					)();

					return fn1 === 100 && fn2 === 15 && fn3 === 0;
				} catch {
					return false;
				}
			},
		},
		setup: function (scene) {
			scene.add.text(20, 20, "👾 Debugged - Level 2", {
				font: "20px Courier",
				fill: "#00ffcc",
			});
			scene.add.text(20, 60, "The platforms are unstable!", {
				font: "24px Courier",
				fill: "#ff0000",
			});

			const level = levels[scene.levelIndex];
			const winBlock = scene.physics.add.staticSprite(
				level.winBlock.x,
				level.winBlock.y,
				"data"
			);

			// Add an overlap check. When player touches it, call puzzleSolved.
			scene.physics.add.overlap(
				scene.player,
				winBlock,
				() => {
					scene.puzzleSolved();
					winBlock.destroy();
				},
				null,
				scene
			);
		},

		onPuzzleSuccess: function (scene) {
			scene.closeTerminal();
			scene.platforms.getChildren().forEach((platform) => {
				if (platform.flickerTimer) {
					platform.flickerTimer.remove();
					platform.flickerTimer = null;
					platform.setVisible(true);
					platform.enableBody(true, platform.x, platform.y, true, true);
					platform.setTint(0x00ccff);
				}
			});
		},
	},

	// TODO add more levels
];

class StoryScene extends Phaser.Scene {
	constructor() {
		super("StoryScene");
	}

	preload() {
		this.load.image("story-bg", "/assets/story_background.png");
	}

	create() {
		this.add
			.image(size.width / 2, size.height / 2, "story-bg")
			.setDisplaySize(size.width, size.height);

		const storyLines = [
			"You are Zero, a programmer whose virtual world has been corrupted by a rival hacker, Nyx.",
			"The world glitches, its fundamental laws breaking down.",
			"You must dive into the code, solve the puzzles, and purge the corruption.",
			"",
			"Click anywhere to begin...",
		];
		const fullStoryText = storyLines.join("\n");

		const textObject = this.add.text(60, (size.height / 4) * 3, "", {
			font: "32px Courier",
			fill: "#000000",
			align: "center",
			backgroundColor: "#dcdcdc",
			padding: { x: 20, y: 20 },
			wordWrap: { width: size.width - 200 },
		});

		this.isTyping = true;
		let charIndex = 0;
		const timedEvent = this.time.addEvent({
			delay: 40,
			callback: () => {
				textObject.text += fullStoryText[charIndex];
				charIndex++;
				if (charIndex >= fullStoryText.length) {
					this.isTyping = false;
					timedEvent.remove();
				}
			},
			repeat: fullStoryText.length - 1,
		});
		this.input.on("pointerdown", () => {
			if (!this.isTyping) {
				timedEvent.remove();
				textObject.text = fullStoryText;
				this.isTyping = false;
			} else {
				this.scene.start("MainScene", { levelIndex: 0 });
			}
		});

		this.input.once("pointerdown", () => {
			this.scene.start("MainScene", { levelIndex: 0 });
		});
	}
}

class MainScene extends Phaser.Scene {
	constructor() {
		super("MainScene");
		this.isWorldGlitched = true;
	}

	init(data) {
		this.levelIndex = data.levelIndex || 2;
		this.isWorldGlitched = true;
	}

	preload() {
		this.load.image("player", "/assets/player.png");
		this.load.image("terminal", "/assets/terminal.png");
		this.load.image("data", "/assets/data.png");
	}

	create() {
		const level = levels[this.levelIndex];
		this.player = this.physics.add
			.sprite(level.playerStart.x, level.playerStart.y, "player")
			.setCollideWorldBounds(true);

		if (level.setup) {
			level.setup(this);
		}

		const gfx = this.add.graphics();
		gfx.fillStyle(0x8888ff, 1);
		gfx.fillRect(0, 0, 200, 20);
		gfx.generateTexture("platform", 200, 20);
		gfx.destroy();

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
		this.platforms = this.physics.add.staticGroup();
		level.platforms.forEach(({ x, y }) => {
			const platform = this.platforms
				.create(x, y, "platform")
				.setTint(Phaser.Display.Color.RandomRGB().color)
				.refreshBody();
			platform.originalTint = platform.tintTopLeft;

			if (this.levelIndex === 2 && this.isWorldGlitched) {
				platform.flickerTimer = this.time.addEvent({
					delay: Phaser.Math.Between(500, 2500),
					callback: () => {
						if (!platform.body) return;
						platform.setVisible(!platform.visible);
						if (platform.visible) {
							platform.enableBody(true, platform.x, platform.y, true, true);
							platform.flickerTimer.delay = Phaser.Math.Between(250, 600);
						} else {
							platform.disableBody(true, true);
							platform.flickerTimer.delay = Phaser.Math.Between(2000, 4000);
						}
					},
					loop: true,
				});
			}
		});
		this.physics.add.collider(this.player, this.platforms);

		// Terminal setup
		this.terminal = this.physics.add.staticSprite(
			level.terminal.x,
			level.terminal.y,
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

		this.events.on("shutdown", this.shutdown, this);
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

	shutdown() {
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
			this.codeMirror = null;
		}
	}

	openTerminal() {
		this.inTerminal = true;
		this.scene.pause();
		this.input.keyboard.removeCapture("W,A,S,D,E,SPACE,UP,DOWN,LEFT,RIGHT");
		document.getElementById("terminal-container").style.display = "block";

		if (!this.codeMirror) {
			// Use the level's puzzle prompt
			document.getElementById("terminal-editor").value =
				levels[this.levelIndex].puzzle.prompt;

			this.codeMirror = CodeMirror.fromTextArea(
				document.getElementById("terminal-editor"),
				{ mode: "javascript", theme: "dracula", lineNumbers: true }
			);
			this.codeMirror.focus();

			document.getElementById("run-btn").onclick = () => {
				const userCode = this.codeMirror.getValue();
				let success = false;
				try {
					success = levels[this.levelIndex].puzzle.test(userCode);
				} catch (err) {
					alert("Error in your code:\n" + err.message);
					return;
				}

				if (success) {
					const level = levels[this.levelIndex];
					if (level.onPuzzleSuccess) {
						level.onPuzzleSuccess(this);
					}
				} else {
					alert("Not quite—try again!");
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
		const level = levels[this.levelIndex];
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
		this.add.text(40, 300, level.successMessage, {
			font: "40px Courier",
			fill: "#00ffcc",
		});
		// After showing success, advance to next level if available
		if (this.levelIndex + 1 < levels.length) {
			setTimeout(() => {
				this.scene.restart({ levelIndex: this.levelIndex + 1 });
			}, 2000);
		} else {
			this.add.text(40, 400, "🏆 All levels complete! 🏆", {
				font: "40px Courier",
				fill: "#ffff00",
			});
		}
	}
}

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
		scene: [StoryScene, MainScene],
	};
	new Phaser.Game(config);
}
startGame();
