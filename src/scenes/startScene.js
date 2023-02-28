import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {
    this.load.image('background', './../../assets/images/StartSceneBG.jpg');
    this.load.image('button', 'assets/images/button.png');
    this.load.image('bouncingImage', 'assets/images/yb.png');
  }

  create() {
    // Add the background image
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Add the "Start" button
    const button = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'button'
    );

    // Add a bouncing image
    const bouncingImage = this.physics.add
      .image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 100,
        'bouncingImage'
      )
      .setScale(0.5)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    // Make the button interactive
    button.setInteractive();

    // Add an event listener to the button
    button.on('pointerup', () => {
      // When the button is clicked, start the game
      this.scene.start('EqualGroupingScene');
    });
  }
}
