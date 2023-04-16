import Phaser from 'phaser';

class NumberlineGameScene extends Phaser.Scene {
  constructor() {
    super('NumberlineGameScene');
  }

  preload() {
    this.load.image("background", "./../../assets/images/StartSceneBG.jpg");
    this.load.image("character", "./../../assets/images/character.png");

  }

  create() {

    const background = this.add.image(0, 0, 'background').setScale(0.6,0.6).setOrigin(0, 0);

    this.stepX = 50;
  this.minValue = Phaser.Math.Between(0, 5); // Adjust the range as needed
  const maxValue = this.minValue + 20; // Adjust the range as needed
  
  this.numberLineElements = [];

    // Draw number line
    this.createNumberLine(this.minValue, maxValue, 50, this.scale.height - 50);

    // Add main character
    this.character = this.add.sprite(50, this.scale.height - 100, 'character');
    this.character.setScale(0.5);

    // Create a text object to display the math problem
    this.problemText = this.add.text(10, 10, '', { fontSize: '32px', color: '#000' });
    this.generateMathProblem();

    // Enable keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.checkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if (this.cursors.left.isDown && !this.moveCooldown) {
      this.startMoveCooldown();
      this.jumpCharacter(-1* this.stepX);
    } else if (this.cursors.right.isDown && !this.moveCooldown) {
      this.startMoveCooldown();
      this.jumpCharacter(this.stepX);
    }
  
    if (Phaser.Input.Keyboard.JustDown(this.checkKey)) {
      this.checkAnswer();
    }
  }
    
  startMoveCooldown() {
    this.moveCooldown = true;
    this.time.delayedCall(300, () => { // Adjust this value to set the cooldown duration in milliseconds
      this.moveCooldown = false;
    });
  }

  jumpCharacter(distance) {
    const targetX = this.character.x + distance;
    const peakY = this.character.y - this.stepX;
  
    // Check if the target position is within the range of the number line
    const targetPosition = this.minValue + Math.round((targetX - 50) / this.stepX);
    if (targetPosition >= this.minValue && targetPosition <= this.minValue + 20) { // Adjust the range as needed
      this.tweens.timeline({
        targets: this.character,
        tweens: [
          {
            x: targetX,
            y: peakY,
            duration: 100, // Adjust this value to control the speed of the jump
            ease: 'Cubic'
          },
          {
            y: this.character.y,
            duration: 100, // Adjust this value to control the speed of the jump
            ease: 'Cubic'
          }
        ]
      });
  
      // Set the jump direction property based on the distance
      this.jumpDirection = distance > 0 ? 'right' : 'left';
    }
  }
  
  
  
  

  createNumberLine(min, max, startX, y) {
    // Remove previous number line elements
    this.numberLineElements.forEach(element => element.destroy());
    this.numberLineElements = [];
  
    // Create a new number line
    for (let i = min; i <= max; i++) {
      const x = (startX - (min * this.stepX)) + i * this.stepX;
  
      // Adjust lineStyle for a thicker and bolder line
      const line = this.add.line(0, 0, x, y, x, y - 20, 0x000000, 1).setLineWidth(4);
      this.numberLineElements.push(line);
  
      // Increase fontSize for the number text
      const numberText = this.add.text(x - 5, y + 5, i, { fontSize: '24px', color: '#fff' });
      this.numberLineElements.push(numberText);
    }
  
    // Update the minValue property
    this.minValue = min;
  }
  
  

  generateMathProblem() {
    const operation = Math.random() < 0.5 ? 'add' : 'subtract'; // Randomly choose between addition and subtraction
  
    // Ensure that firstNumber is greater than or equal to secondNumber for subtraction
    let firstNumber, secondNumber;
    do {
      firstNumber = Phaser.Math.Between(1, 10);
      secondNumber = Phaser.Math.Between(1, 10);
    } while (operation === 'subtract' && firstNumber < secondNumber);
  
    // Calculate the currentAnswer based on the selected operation
    if (operation === 'add') {
      this.currentAnswer = firstNumber + secondNumber;
    } else {
      this.currentAnswer = firstNumber - secondNumber;
    }
  
    const minLineValue = Math.max(1, Math.min(firstNumber, this.currentAnswer) - 1);
    const maxLineValue = Math.max(firstNumber, this.currentAnswer) + 2;
  
    // Update the character's x-coordinate relative to the minLineValue
    this.character.x = 50 + (firstNumber - minLineValue) * this.stepX;
    this.createNumberLine(minLineValue, maxLineValue, 50, this.scale.height - 50);
  
    // Update the problemText to display the correct operation
    if (operation === 'add') {
      this.problemText.text = `${firstNumber} + ${secondNumber} = ?`;
    } else {
      this.problemText.text = `${firstNumber} - ${secondNumber} = ?`;
    }
  }
    
  

  checkAnswer() {
    const characterPosition = this.minValue + Math.round((this.character.x - 50) / this.stepX);
    const firstNumber = parseInt(this.problemText.text.split(" ")[0]);
    let expectedJumpDirection;
  
    if (this.problemText.text.includes("+")) {
      expectedJumpDirection = "right";
    } else if (this.problemText.text.includes("-")) {
      expectedJumpDirection = "left";
    }
  
    if (characterPosition === this.currentAnswer && this.jumpDirection === expectedJumpDirection) {
      // Answer is correct, provide feedback and generate a new problem
      // You may also add logic to transition to the next level or increase difficulty
      this.generateMathProblem();
    }
  
    // Reset the jumpDirection
    this.jumpDirection = null;
  }
  

}

export default NumberlineGameScene;
