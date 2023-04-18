import Phaser from "phaser";

class NumberlineGameScene extends Phaser.Scene {
  constructor() {
    super("NumberlineGameScene");
  }

  preload() {
    this.load.image("background", "./../../assets/images/StartSceneBG.jpg");
    // this.load.image("character", "./../../assets/images/character_mv.png");
    this.load.spritesheet(
      "character",
      "./../../assets/images/character_mv.png",
      {
        frameWidth: 88,
        frameHeight: 115,
      }
    );

    this.load.image("forward", "./../../assets/images/joystick_rt.png");
    this.load.image("reverse", "./../../assets/images/joystick_left.png");
    this.load.image("space", "./../../assets/images/joystick_center.png");
  }

  create() {

    const scW = this.sys.game.config.width ;
    const scH = this.sys.game.config.height ;

    const background = this.add
      .image(0, 0, "background")
      .setScale(0.6, 0.6)
      .setOrigin(0, 0);

    const maxValue = this.minValue + 20; // Adjust the range as needed

    this.stepX = 50;
    this.minValue = Phaser.Math.Between(0, 5); // Adjust the range as needed
    this.characterJumping = false;
    this.correctAnswers = 0;
    // Add answer input field
    this.answerInput = null;

    this.numberLineElements = [];

    // sprite character
    this.anims.create({
      key: "character_move",
      frames: this.anims.generateFrameNumbers("character", {
        start: 0,
        end: 0,
      }),
      frameRate: 15,
      repeat: 0,
    });

    this.feedbackText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "",
      {
        fontSize: "32px",
        color: "#FFF",
        fontStyle: "bold",
      }
    );
    this.feedbackText.setOrigin(0.5, 0.5); // Center-align the text
    this.feedbackText.setVisible(false); // Hide the text initially

    // Draw number line
    this.createNumberLine(this.minValue, maxValue, 50, this.scale.height - 50);

    // Add main character
    // this.character = this.add.sprite(50, this.scale.height - 100, "character");
    this.character = this.add.sprite(50, this.scale.height - 100, "character");

    this.character.setScale(1);

    // Create a text object to display the math problem
    this.problemText = this.add.text(0, 10, "", {
      fontSize: "32px",
      color: "#fff",
      fontStyle: "bold", // Set the text style to bold
    });

    // Center the text horizontally
    this.problemText.setX((this.scale.width - this.problemText.width) / 2);

    this.instructionText = this.add.text(0, 50, "", {
      fontSize: "24px",
      color: "#FFF",
      fontStyle: "bold",
    });

    this.generateMathProblem();

    // Enable keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on("keydown-LEFT", () => {
      this.moveCharacter("left");
    });

    this.input.keyboard.on("keydown-RIGHT", () => {
      this.moveCharacter("right");
    });

    this.checkKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Create the forward button
    const forwardButton = this.add
      .sprite(scW - 75, scH - 300, "forward")
      .setInteractive();
    forwardButton.on("pointerdown", () => {
      this.moveCharacter("right");
    });

        // Create the space button
  this.spaceButton = this.add.sprite(scW - 150, scH - 300, 'space').setInteractive();


    // Create the reverse button
    const reverseButton = this.add
      .sprite(scW - 225, scH - 300, "reverse")
      .setInteractive();
    reverseButton.on("pointerdown", () => {
      this.moveCharacter("left");
    });

 
  // Set a flag to track the button press state
  this.spaceButtonDown = false;
  this.spaceButtonExecuted = false;

  // Add the event listeners
  this.spaceButton.on('pointerdown', () => {
    this.spaceButtonDown = true;
  });
  this.spaceButton.on('pointerup', () => {
    this.spaceButtonDown = false;
  });

  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.checkKey)) {
      this.checkAnswer();
    }

    if (this.spaceButtonDown && !this.spaceButtonExecuted) {
      this.checkAnswer();
  
      // Set the executed flag to true
      this.spaceButtonExecuted = true;
    } else if (!this.spaceButtonDown && this.spaceButtonExecuted) {
      // Reset the executed flag when the button is released
      this.spaceButtonExecuted = false;
    }

    // if (this.answerInput.node.value !== '') {
    //   const inputValue = parseInt(this.answerInput.node.value);
    //   // Do something with the inputValue
    //   this.answerInput.node.value = '';
    // }
  }

  updateInstructionText(operation) {
    if (operation === "add") {
      this.instructionText.text = "Help the character find the sum!";
    } else {
      this.instructionText.text = "Help the character find the difference!";
    }
    // Center the instruction text
    this.instructionText.setX(
      (this.scale.width - this.instructionText.width) / 2
    );
  }

  startMoveCooldown() {
    this.moveCooldown = true;
    this.time.delayedCall(300, () => {
      // Adjust this value to set the cooldown duration in milliseconds
      this.moveCooldown = false;
    });
  }

  moveCharacter(direction) {
    if (this.characterJumping) return; // Prevent multiple jumps at the same time

    // Update the stepX based on the available screen width
    this.stepX =
      (this.scale.width - 100) / (this.numberLineElements.length / 2 - 1);

    // Move the character based on the direction and updated stepX
    if (direction === "right") {
      this.jumpCharacter(this.stepX);
    } else if (direction === "left") {
      this.jumpCharacter(-this.stepX);
    }

    // Set the characterJumping property to true and add a small delay before resetting it to false
    this.characterJumping = true;
    this.time.delayedCall(200, () => {
      this.characterJumping = false;
    });
  }

  jumpCharacter(distance) {
    const targetX = this.character.x + distance;
    const peakY = this.character.y - this.stepX;

    // Check if the target position is within the range of the number line
    const targetPosition =
      this.minValue + Math.round((targetX - 50) / this.stepX);
    if (
      targetPosition >= this.minValue &&
      targetPosition <= this.minValue + 20
    ) {
      // Adjust the range as needed
      this.tweens.timeline({
        targets: this.character,
        tweens: [
          {
            x: targetX,
            y: peakY,
            duration: 100, // Adjust this value to control the speed of the jump
            ease: "Cubic",
          },
          {
            y: this.character.y,
            duration: 100, // Adjust this value to control the speed of the jump
            ease: "Cubic",
          },
        ],
      });

      // Set the jump direction property based on the distance
      this.jumpDirection = distance > 0 ? "right" : "left";
      if (distance > 0) {
        this.character.setFlipX(false); // Face the character right
      } else {
        this.character.setFlipX(true); // Face the character left
      }
      // this.character.anims.play("character_move", true);
    }
  }

  createNumberLine(min, max, startX, y) {
    // Remove previous number line elements
    this.numberLineElements.forEach((element) => element.destroy());
    this.numberLineElements = [];

    // Calculate stepX based on the available screen width
    this.stepX = (this.scale.width - 100) / (max - min);

    // Create a new number line
    for (let i = min; i <= max; i++) {
      const x = startX - min * this.stepX + i * this.stepX;

      // Adjust lineStyle for a thicker and bolder line
      const line = this.add
        .line(0, 0, x, y, x, y - 20, 0xffffff, 1)
        .setLineWidth(4);
      this.numberLineElements.push(line);

      // Center the number text with respect to the line
      const numberText = this.add.text(0, y + 5, i, {
        fontSize: "24px",
        color: "#fff",
      });
      numberText.x = x - numberText.width / 2;
      this.numberLineElements.push(numberText);
    }

    // Update the minValue property
    this.minValue = min;
  }

  generateMathProblem() {
    const operation = Math.random() < 0.5 ? "add" : "subtract"; // Randomly choose between addition and subtraction

    // Ensure that firstNumber is greater than or equal to secondNumber for subtraction
    let firstNumber, secondNumber;
    do {
      firstNumber = Phaser.Math.Between(1, 10);
      secondNumber = Phaser.Math.Between(1, 10);
    } while (operation === "subtract" && firstNumber < secondNumber);

    // Calculate the currentAnswer based on the selected operation
    if (operation === "add") {
      this.currentAnswer = firstNumber + secondNumber;
    } else {
      this.currentAnswer = firstNumber - secondNumber;
    }

    const minLineValue = Math.max(
      0,
      Math.min(firstNumber, this.currentAnswer) - 1
    );
    const maxLineValue = Math.max(firstNumber, this.currentAnswer) + 2;

    this.minValue = minLineValue;

    this.createNumberLine(
      minLineValue,
      maxLineValue,
      50,
      this.scale.height - 50
    );

    // Update the character's x-coordinate relative to the minLineValue
    this.character.x = 50 + (firstNumber - this.minValue) * this.stepX;

    // Update the problemText to display the correct operation
    if (operation === "add") {
      this.problemText.text = `${firstNumber} + ${secondNumber} = ?`;
    } else {
      this.problemText.text = `${firstNumber} - ${secondNumber} = ?`;
    }

    this.problemText.setX((this.scale.width - this.problemText.width) / 2);
    this.updateInstructionText(operation);
  }

  checkAnswer() {
    const characterPosition =
      this.minValue + Math.round((this.character.x - 50) / this.stepX);

    if (characterPosition === this.currentAnswer) {
      // Answer is correct
      this.showFeedbackMessage("Yay!");
      this.correctAnswers++;

      // if (this.correctAnswers >= 1) {
      //   this.moveToNextLevel();
      // } else {
      //   this.generateMathProblem();
      // }
      console.log(' YAY --- ')
      this.generateMathProblem();
    } else {
      // Answer is incorrect
      this.showFeedbackMessage("Try again!");
      console.log(' RY AGAIN  --- ')
    }
  }

  showFeedbackMessage(message) {
    this.feedbackText.setText(message);
    this.feedbackText.setVisible(true);

    // Hide the feedback message after a short duration
    this.time.delayedCall(1000, () => {
      this.feedbackText.setVisible(false);
    });
  }

  moveToNextLevel() {
    // Add a submit button and listen for a click event
    // const submitButton = this.add.text(
    //   this.scale.width / 2 - 30,
    //   130,
    //   "Submit",
    //   {
    //     fontSize: "24px",
    //     color: "#FFF",
    //     backgroundColor: "#000",
    //   }
    // );
    // submitButton.setInteractive();
    // submitButton.on("pointerdown", () => {
    //   // Check if the user-entered answer matches the current answer
    //   const enteredAnswer = parseInt(this.answerInput.node.value, 10);
    //   if (enteredAnswer === this.currentAnswer) {
    //     this.showFeedbackMessage("Correct!");
    //     // Hide the input field and button
    //     this.answerInput.setVisible(false);
    //     submitButton.setVisible(false);
    //     // Reset correctAnswers and move to the next level or generate new problem
    //     this.correctAnswers = 0;
    //     this.generateMathProblem();
    //   } else {
    //     this.showFeedbackMessage("Try again!");
    //   }
    // });

  }
}

export default NumberlineGameScene;
