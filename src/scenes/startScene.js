import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {

    this.load.image('background', './../../assets/images/StartSceneBG.jpg');
    this.load.image('buttonDF', 'assets/images/button_df.png');
    this.load.image('bouncingImage', 'assets/images/yb.png');
    this.load.image('button_nl', 'assets/images/button_nl.png');
    

  }

  create() {

    // this.scene.start('StartScene');

    // Add the background image
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);


    // Add the "Start" button
    const buttonDF = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 3,
      'buttonDF'
    );

    // Add the "Start" button
    const buttonNumberline = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 3 + 200,
      'button_nl'
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
    buttonDF.setInteractive();
    buttonNumberline.setInteractive();

    // Add an event listener to the button
    buttonDF.on('pointerup', () => {
      // When the button is clicked, start the game
      console.log(' start EqualGroupingScene ')
      this.scene.start('EqualGroupingScene');
    });

    buttonNumberline.on('pointerup', () => {
      // When the button is clicked, start the game
      console.log(' start NumberlineGameScene ')
      this.scene.start('NumberlineGameScene');
    });


  }
}
