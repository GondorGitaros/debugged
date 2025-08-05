size = {
  width: 1920,
  height: 1080,
};

const levels = [
  // there will be 16 levels in total with increasing difficulty
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
      scene.add.text(20, 20, "👾 Debugged - Level 1/16", {
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

      // STORY

      scene.add.text(20, 100, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });

      scene.add.text(
        20,
        140,
        "Nyx has corrupted the world, and you need to fix it by solving puzzles.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );

      scene.add.text(
        20,
        180,
        "Nyx taunts: 'There is a block missing... I don't think you can fix it!'",
        {
          font: "24px Courier",
          fill: "#44ff44",
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
Nyx taunts: "The platforms are tied to a data stream. 
If you can't calculate the correct checksum, 
they'll stay unstable forever!"
Puzzle: Write a function calculateChecksum(data) 
that takes an array of numbers and returns their sum.
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
      scene.add.text(20, 20, "👾 Debugged - Level 2/16", {
        font: "20px Courier",
        fill: "#00ffcc",
      });

      // STORY

      scene.add.text(20, 60, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });

      scene.add.text(
        20,
        100,
        "Nyx has corrupted the platforms, making them unstable.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );

      scene.add.text(
        20,
        140,
        "Nyx taunts: 'The platforms are tied to a data stream.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );

      scene.add.text(
        20,
        165,
        "If you can't calculate the correct checksum, they'll stay unstable forever!'",
        {
          font: "24px Courier",
          fill: "#44ff44",
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
  // level 3
  {
    platforms: [
      { x: 200, y: 1000 },
      { x: 500, y: 900 },
      { x: 800, y: 800 },
      { x: 1100, y: 700 },
      { x: 1400, y: 600 },
      { x: 1700, y: 500 },
    ],
    playerStart: { x: 100, y: 900 },
    winBlock: { x: 1700, y: 450 },
    terminal: { x: 400, y: 995 },
    successMessage: "Level 3 completed!.",
    puzzle: {
      prompt: `/*
Level 3: Glitchy World
Nyx taunts: "The world is glitching! Write a function 
fixGlitch(data) that takes an array of numbers and
returns a new array with all negative numbers 
replaced by their absolute values."
*/
function fixGlitch(data) {
  // your code here...
}`,
      test: function (userCode) {
        try {
          const code = userCode;
          const fn1 = new Function(
            code + "\nreturn fixGlitch([-1, -2, 3, 4]);"
          )();
          const fn2 = new Function(
            code + "\nreturn fixGlitch([5, -6, 7, -8]);"
          )();
          const fn3 = new Function(
            code + "\nreturn fixGlitch([-10, 0, 10]);"
          )();
          return (
            JSON.stringify(fn1) === JSON.stringify([1, 2, 3, 4]) &&
            JSON.stringify(fn2) === JSON.stringify([5, 6, 7, 8]) &&
            JSON.stringify(fn3) === JSON.stringify([10, 0, 10])
          );
        } catch {
          return false;
        }
      },
    },
    setup: function (scene) {
      scene.add.text(20, 20, "👾 Debugged - Level 3/16", {
        font: "20px Courier",
        fill: "#00ffcc",
      });

      // STORY

      scene.add.text(20, 60, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });

      scene.add.text(
        20,
        100,
        "Nyx has corrupted the world, the data is blocked.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );

      scene.add.text(20, 140, "Nyx taunts: 'Ain't no way you can fix it!'", {
        font: "24px Courier",
        fill: "#44ff44",
      });

      const level = levels[scene.levelIndex];
      const winBlock = scene.physics.add.staticSprite(
        level.winBlock.x,
        level.winBlock.y,
        "data"
      );

      // Create a barrier to prevent jumping over the winBlock
      scene.barrier = scene.physics.add.staticSprite(
        level.winBlock.x - 120,
        level.winBlock.y,
        "platform"
      );
      scene.barrier.setTintFill(0xff0000);
      scene.barrier.setScale(0.05, 6).refreshBody();
      scene.physics.add.collider(scene.player, scene.barrier);

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

      // Remove the barrier
      if (scene.barrier) {
        scene.barrier.destroy();
      }
    },
  },
  // level 4
  {
    // harder jumps
    platforms: [
      { x: 800, y: 1000 },
      { x: 900, y: 880 },
      { x: 800, y: 757 },
      { x: 900, y: 640 },
      { x: 1300, y: 600 },
      { x: 1700, y: 500 },
    ],
    playerStart: { x: 100, y: 900 },
    winBlock: { x: 1700, y: 450 },
    terminal: { x: 400, y: 995 },
    successMessage: "Level 4 completed!.",
    puzzle: {
      prompt: `/*
Level 4: Data Stream
Nyx taunts: "The data stream is corrupted!
Write a function filterData(data) that takes an 
array of numbers and returns a new array with only the even numbers."
*/
function filterData(data) {
  // your code here...
}`,
      test: function (userCode) {
        try {
          const code = userCode;
          const fn1 = new Function(
            code + "\nreturn filterData([1, 2, 3, 4]);"
          )();
          const fn2 = new Function(
            code + "\nreturn filterData([5, 6, 7, 8]);"
          )();
          const fn3 = new Function(
            code + "\nreturn filterData([-10, 0, 10]);"
          )();
          return (
            JSON.stringify(fn1) === JSON.stringify([2, 4]) &&
            JSON.stringify(fn2) === JSON.stringify([6, 8]) &&
            JSON.stringify(fn3) === JSON.stringify([-10, 0, 10])
          );
        } catch {
          return false;
        }
      },
    },
    setup: function (scene) {
      scene.add.text(20, 20, "👾 Debugged - Level 4/16", {
        font: "20px Courier",
        fill: "#00ffcc",
      });

      // STORY

      scene.add.text(20, 60, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });

      scene.add.text(
        20,
        100,
        "Nyx has corrupted the data stream, making it unstable.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );

      scene.add.text(20, 140, "Nyx taunts: 'You can't filter the data!'", {
        font: "24px Courier",
        fill: "#44ff44",
      });

      const level = levels[scene.levelIndex];
      const winBlock = scene.physics.add.staticSprite(
        level.winBlock.x,
        level.winBlock.y,
        "data"
      );

      // Create a barrier to prevent jumping over the winBlock
      scene.barrier = scene.physics.add.staticSprite(
        level.winBlock.x - 120,
        level.winBlock.y,
        "platform"
      );
      scene.barrier.setTintFill(0xff0000);
      scene.barrier.setScale(0.05, 6).refreshBody();
      scene.physics.add.collider(scene.player, scene.barrier);

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
      // Remove the barrier
      if (scene.barrier) {
        scene.barrier.destroy();
      }
    },
  },
  // level 5
  {
    platforms: [
      { x: 600, y: 1000 },
      { x: 900, y: 900 },
      { x: 1200, y: 777 },
      { x: 900, y: 680 },
      { x: 1300, y: 600 },
      { x: 1700, y: 500 },
    ],
    playerStart: { x: 100, y: 900 },
    winBlock: { x: 1700, y: 450 },
    terminal: { x: 400, y: 995 },
    successMessage: "Level 5 completed!.",
    puzzle: {
      prompt: `/*
Level 5: Complex Data
Nyx taunts: "The data is too complex!
Write a function processData(data) that 
takes an array of numbers and returns a 
new array with each number squared."
*/
function processData(data) {
  // your code here...
}`,
      test: function (userCode) {
        try {
          const code = userCode;
          const fn1 = new Function(code + "\nreturn processData([1, 2, 3]);")();
          const fn2 = new Function(code + "\nreturn processData([4, 5, 6]);")();
          const fn3 = new Function(
            code + "\nreturn processData([-1, -2, -3]);"
          )();
          return (
            JSON.stringify(fn1) === JSON.stringify([1, 4, 9]) &&
            JSON.stringify(fn2) === JSON.stringify([16, 25, 36]) &&
            JSON.stringify(fn3) === JSON.stringify([1, 4, 9])
          );
        } catch {
          return false;
        }
      },
    },
    setup: function (scene) {
      scene.add.text(20, 20, "👾 Debugged - Level 5/16", {
        font: "20px Courier",
        fill: "#00ffcc",
      });

      // STORY

      scene.add.text(20, 60, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });

      scene.add.text(
        20,
        100,
        "Nyx has corrupted the data, making it too complex.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );

      scene.add.text(20, 140, "Nyx taunts: 'You can't process this data!'", {
        font: "24px Courier",
        fill: "#44ff44",
      });

      const level = levels[scene.levelIndex];
      const winBlock = scene.physics.add.staticSprite(
        level.winBlock.x,
        level.winBlock.y,
        "data"
      );

      // Create a barrier to prevent jumping over the winBlock
      scene.barrier = scene.physics.add.staticSprite(
        level.winBlock.x - 120,
        level.winBlock.y,
        "platform"
      );
      scene.barrier.setTintFill(0xff0000);
      scene.barrier.setScale(0.05, 6).refreshBody();
      scene.physics.add.collider(scene.player, scene.barrier);

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
      // Remove the barrier
      if (scene.barrier) {
        scene.barrier.destroy();
      }
    },
  },
  // level 6
  {
    platforms: [
      { x: 780, y: 1000 },
      { x: 900, y: 900 },
      { x: 900, y: 800 },
      { x: 1500, y: 600 },
    ],
    playerStart: { x: 100, y: 900 },
    winBlock: { x: 1500, y: 550 },
    terminal: { x: 300, y: 975 },
    successMessage: "Level 2 completed! Platforms stabilized.",
    puzzle: {
      prompt: `/*
Level 6: Advanced Filtering
Nyx taunts: "The data is too messy!
Write a function cleanData(data) that takes an array of numbers
and returns a new array with all non-positive numbers removed."
*/
function cleanData(data) {
  // your code here...
}`,
      test: function (userCode) {
        try {
          const code = userCode;
          const fn1 = new Function(code + "\nreturn cleanData([-1, 2, 3]);")();
          const fn2 = new Function(code + "\nreturn cleanData([0, 5, -6]);")();
          const fn3 = new Function(
            code + "\nreturn cleanData([-10, 0, 10]);"
          )();

          return (
            JSON.stringify(fn1) === JSON.stringify([2, 3]) &&
            JSON.stringify(fn2) === JSON.stringify([5]) &&
            JSON.stringify(fn3) === JSON.stringify([10])
          );
        } catch {
          return false;
        }
      },
    },
    setup: function (scene) {
      scene.add.text(20, 20, "👾 Debugged - Level 6/16", {
        font: "20px Courier",
        fill: "#00ffcc",
      });
      // STORY
      scene.add.text(20, 60, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });
      scene.add.text(
        20,
        100,
        "Nyx has corrupted the data, making it too messy.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );
      scene.add.text(20, 140, "Nyx taunts: 'You can't clean this data!'", {
        font: "24px Courier",
        fill: "#44ff44",
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

      const platform = scene.platforms
        .create(1200, 700, "platform")
        .setTint(0x00ff00)
        .refreshBody();
      platform.originalTint = platform.tintTopLeft;
    },
  },
  // level 7
  {
    platforms: [],
    playerStart: { x: 100, y: 900 },
    winBlock: { x: 1700, y: 975 },
    terminal: { x: 400, y: 995 },
    successMessage: "Level 7 completed!.",
    // leetcode style puzzle
    puzzle: {
      prompt: `/*Level 7: findMax
Nyx taunts: "The data is too complex!
Write a function findMax(data) that takes an array of numbers
and returns the maximum number."
*/
function findMax(data) {
  // your code here...
}`,
      test: function (userCode) {
        try {
          const code = userCode;
          const fn1 = new Function(code + "\nreturn findMax([1, 2, 3]);")();
          const fn2 = new Function(code + "\nreturn findMax([4, 5, 6]);")();
          const fn3 = new Function(code + "\nreturn findMax([-1, -2, -3]);")();
          return fn1 === 3 && fn2 === 6 && fn3 === -1;
        } catch {
          return false;
        }
      },
    },
    setup: function (scene) {
      scene.add.text(20, 20, "👾 Debugged - Level 7/16", {
        font: "20px Courier",
        fill: "#00ffcc",
      });
      // STORY
      scene.add.text(20, 60, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });
      scene.add.text(
        20,
        100,
        "Nyx has corrupted the data, making it too complex.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );
      scene.add.text(20, 140, "Nyx taunts: 'You can't find the maximum!'", {
        font: "24px Courier",
        fill: "#44ff44",
      });
      const level = levels[scene.levelIndex];
      const winBlock = scene.physics.add.staticSprite(
        level.winBlock.x,
        level.winBlock.y,
        "data"
      );

      // surround the player with 3 barriers to prevent jumping over the winBlock
      scene.barrier1 = scene.physics.add.staticSprite(500, 900, "platform");
      scene.barrier1.setTintFill(0xff0000);
      scene.barrier1.setScale(100, 1).refreshBody();
      scene.physics.add.collider(scene.player, scene.barrier1);
      scene.barrier2 = scene.physics.add.staticSprite(1000, 900, "platform");
      scene.barrier2.setTintFill(0xff0000);
      scene.barrier2.setScale(1, 100).refreshBody();
      scene.barrier2.refreshBody();
      scene.physics.add.collider(scene.player, scene.barrier2);

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
      // Remove the barriers
      if (scene.barrier1) {
        scene.barrier1.destroy();
      }
      if (scene.barrier2) {
        scene.barrier2.destroy();
      }
    },
  },
  // level 8
  {
    platforms: [
      { x: 300, y: 1000 },
      { x: 600, y: 900 },
      { x: 600, y: 800 },
      { x: 1000, y: 700 },
      { x: 1000, y: 650 },
      { x: 1400, y: 550 },
      { x: 1400, y: 500 },
      { x: 1700, y: 400 },
    ],
    playerStart: { x: 100, y: 900 },
    winBlock: { x: 1700, y: 350 },
    terminal: { x: 600, y: 990 },
    successMessage: "Level 8 completed! Objects mastered.",
    puzzle: {
      prompt: `/*
Level 8: Object Manipulation
Nyx taunts: "Objects are too complex for you!
Write a function getProperty(obj, key) that takes an object
and a key, and returns the value of that property.
If the property doesn't exist, return undefined."
*/
function getProperty(obj, key) {
  // your code here...
}`,
      test: function (userCode) {
        try {
          const code = userCode;
          const fn1 = new Function(
            code + "\nreturn getProperty({name: 'Alice', age: 25}, 'name');"
          )();
          const fn2 = new Function(
            code + "\nreturn getProperty({x: 10, y: 20}, 'y');"
          )();
          const fn3 = new Function(
            code + "\nreturn getProperty({a: 1, b: 2}, 'c');"
          )();
          const fn4 = new Function(
            code + "\nreturn getProperty({}, 'missing');"
          )();
          return fn1 === 'Alice' && fn2 === 20 && fn3 === undefined && fn4 === undefined;
        } catch {
          return false;
        }
      },
    },
    setup: function (scene) {
      scene.add.text(20, 20, "👾 Debugged - Level 8/16", {
        font: "20px Courier",
        fill: "#00ffcc",
      });
      // STORY
      scene.add.text(20, 60, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });
      scene.add.text(
        20,
        100,
        "Nyx has corrupted the object system, making properties inaccessible.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );
      scene.add.text(20, 140, "Nyx taunts: 'Objects are beyond your comprehension!'", {
        font: "24px Courier",
        fill: "#44ff44",
      });

      const level = levels[scene.levelIndex];
      const winBlock = scene.physics.add.staticSprite(
        level.winBlock.x,
        level.winBlock.y,
        "data"
      );

      // Create multiple barriers for increased difficulty
      scene.barrier1 = scene.physics.add.staticSprite(
        level.winBlock.x - 120,
        level.winBlock.y,
        "platform"
      );
      scene.barrier1.setTintFill(0xff0000);
      scene.barrier1.setScale(0.05, 8).refreshBody();
      scene.physics.add.collider(scene.player, scene.barrier1);

      scene.barrier2 = scene.physics.add.staticSprite(
        level.winBlock.x + 120,
        level.winBlock.y,
        "platform"
      );
      scene.barrier2.setTintFill(0xff0000);
      scene.barrier2.setScale(0.05, 8).refreshBody();
      scene.physics.add.collider(scene.player, scene.barrier2);

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
      // Remove the barriers
      if (scene.barrier1) {
        scene.barrier1.destroy();
      }
      if (scene.barrier2) {
        scene.barrier2.destroy();
      }
    },
  },
  // level 9
  {
    platforms: [
      { x: 350, y: 950 },
      { x: 650, y: 850 },
      { x: 950, y: 750 },
      { x: 1250, y: 650 },
      { x: 1550, y: 550 },
      { x: 1850, y: 450 },
    ],
    playerStart: { x: 100, y: 900 },
    winBlock: { x: 1850, y: 400 },
    terminal: { x: 200, y: 995 },
    successMessage: "Level 9 completed! Algorithm mastery achieved.",
    puzzle: {
      prompt: `/*
Level 9: Recursive Challenge
Nyx taunts: "Recursion will break your mind!
Write a function factorial(n) that calculates the factorial of n.
Factorial of n is n * (n-1) * (n-2) * ... * 1
Example: factorial(5) = 5 * 4 * 3 * 2 * 1 = 120
Note: factorial(0) = 1 by definition"
*/
function factorial(n) {
  // your code here...
}`,
      test: function (userCode) {
        try {
          const code = userCode;
          const fn1 = new Function(code + "\nreturn factorial(0);")();
          const fn2 = new Function(code + "\nreturn factorial(1);")();
          const fn3 = new Function(code + "\nreturn factorial(5);")();
          const fn4 = new Function(code + "\nreturn factorial(6);")();
          const fn5 = new Function(code + "\nreturn factorial(3);")();
          return (
            fn1 === 1 && 
            fn2 === 1 && 
            fn3 === 120 && 
            fn4 === 720 &&
            fn5 === 6
          );
        } catch {
          return false;
        }
      },
    },
    setup: function (scene) {
      scene.add.text(20, 20, "👾 Debugged - Level 9/16", {
        font: "20px Courier",
        fill: "#00ffcc",
      });
      // STORY
      scene.add.text(20, 60, "Story:", {
        font: "24px Courier",
        fill: "#00ffcc",
      });
      scene.add.text(
        20,
        100,
        "Nyx has corrupted the mathematical core, breaking all calculations.",
        {
          font: "24px Courier",
          fill: "#44ff44",
        }
      );
      scene.add.text(20, 140, "Nyx taunts: 'Recursion will consume you!'", {
        font: "24px Courier",
        fill: "#44ff44",
      });

      const level = levels[scene.levelIndex];
      const winBlock = scene.physics.add.staticSprite(
        level.winBlock.x,
        level.winBlock.y,
        "data"
      );

      // Create a barrier to prevent accessing the data block
      scene.barrier = scene.physics.add.staticSprite(
        level.winBlock.x - 120,
        level.winBlock.y,
        "platform"
      );
      scene.barrier.setTintFill(0xff0000);
      scene.barrier.setScale(0.05, 6).refreshBody();
      scene.physics.add.collider(scene.player, scene.barrier);

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
      
      // Stabilize all platforms with a simple green tint
      scene.platforms.getChildren().forEach((platform) => {
        platform.setTint(0x00ff00);
      });

      // Remove the barrier
      if (scene.barrier) {
        scene.barrier.destroy();
      }
    },
  },

  // TODO add more levels
];

class StoryScene extends Phaser.Scene {
  constructor() {
    super("StoryScene");
  }

  init(data) {
    this.progress = data;
  }

  preload() {
    this.load.image("story-bg", "/assets/story_background.png");
  }

  create() {
    if (this.progress && this.progress.levelIndex > 0) {
      this.scene.start("MainScene", this.progress);
      return;
    }
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
      if (this.isTyping) {
        timedEvent.remove();
        textObject.text = fullStoryText;
        this.isTyping = false;
      } else {
        this.scene.start("MainScene", this.progress);
      }
    });
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.isWorldGlitched = true;
  }

  init(data) {
    this.levelIndex = data.levelIndex || 0;
    this.totalTime = data.totalTime || 0;
    this.isWorldGlitched = true;
  }

  preload() {
    this.load.image("player", "/assets/player.png");
    this.load.image("terminal", "/assets/terminal.png");
    this.load.image("data", "/assets/data.png");
  }

  create() {
    this.testWorker = null;
    const level = levels[this.levelIndex];
    this.player = this.physics.add
      .sprite(level.playerStart.x, level.playerStart.y, "player")
      .setCollideWorldBounds(true);

    if (level.setup) {
      level.setup(this);
    }

    this.timerText = this.add
      .text(size.width - 250, 20, `Time: ${this.totalTime}s`, {
        font: "24px Courier",
        fill: "#ffffff",
      })
      .setScrollFactor(0);

    // Use a regular setInterval that won't be affected by scene pause
    this.gameTimer = setInterval(() => {
      this.totalTime++;
      this.timerText.setText(`Time: ${this.totalTime}s`);
    }, 1000);

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
      .text(0, 0, "Press E to interact", {
        font: "16px Courier",
        fill: "#fff",
      })
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
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
      this.codeMirror = null;
    }
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

      const runButton = document.getElementById("run-btn");
      let isTesting = false;

      runButton.onclick = () => {
        if (isTesting) {
          return;
        }

        if (!this.testWorker) {
          this.testWorker = new Worker("test-runner.js");
        }

        const userCode = this.codeMirror.getValue();
        const level = levels[this.levelIndex];

        // testing...
        isTesting = true;
        runButton.textContent = "Testing...";
        runButton.disabled = true;

        const cleanup = () => {
          isTesting = false;
          runButton.textContent = "Run ▶️";
          runButton.disabled = false;
        };

        // timeout handler
        const timeoutId = setTimeout(() => {
          this.testWorker.terminate();
          console.log("Test worker terminated due to timeout.");
          this.testWorker = null;
          alert(
            "Execution timed out! Your code might have an infinite loop. Please check your code for efficiency."
          );
          runButton.textContent = "Penalty (its 10s)";
          runButton.disabled = true;
          setTimeout(() => {
            cleanup(); // Reset after penalty
          }, 10000);
        }, 4000);

        this.testWorker.onmessage = (event) => {
          clearTimeout(timeoutId);
          const { success, error } = event.data;
          if (success) {
            if (level.onPuzzleSuccess) {
              level.onPuzzleSuccess(this);
            }
          } else {
            alert("Not quite—try again! " + (error || ""));
          }
          cleanup();
        };

        this.testWorker.onerror = (event) => {
          clearTimeout(timeoutId);
          alert("An error occurred in the test runner: " + event.message);
          cleanup();
        };

        this.testWorker.postMessage({
          userCode: userCode,
          levelTestString: level.puzzle.test.toString(),
        });
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
    document.getElementById("terminal-container").style.display = "none";
    this.scene.resume();
    this.inTerminal = false;
    this.canInteract = false;
    this.closeTerminal();
    this.terminal.setTint(0x00ff00);
    this.cameras.main.flash(300, 0, 255, 0);

    // Save progress before advancing
    const user = localStorage.getItem("currentUser");
    const nextLevelIndex = this.levelIndex + 1;
    if (user && nextLevelIndex < levels.length) {
      fetch("saveProgress.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          level: nextLevelIndex,
          time: this.totalTime,
        }),
      });
    }

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
      this.time.delayedCall(2000, () => {
        this.scene.restart({
          levelIndex: this.levelIndex + 1,
          totalTime: this.totalTime,
        });
      });
    } else {
      if (this.gameTimer) {
        clearInterval(this.gameTimer);
      }
      this.add.text(
        40,
        400,
        `🏆 All levels complete! Final Time: ${this.totalTime}s 🏆`,
        {
          font: "40px Courier",
          fill: "#ffff00",
        }
      );
    }
  }
}

async function startGame() {
  const gameContainer = document.getElementById("game-container");
  if (gameContainer) {
    gameContainer.innerHTML = "";
  }

  let progress = { levelIndex: 0, totalTime: 0 };
  const user = localStorage.getItem("currentUser");
  if (user) {
    try {
      const res = await fetch(`getProgress.php?username=${user}`);
      const data = await res.json();
      if (data.success) {
        progress.levelIndex = data.level || 0;
        progress.totalTime = data.time || 0;
      }
    } catch (err) {
      console.error("Could not fetch progress, starting from scratch.", err);
    }
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
  const game = new Phaser.Game(config);
  game.scene.start("StoryScene", progress);
}
startGame();
