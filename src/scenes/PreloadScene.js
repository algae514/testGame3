import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Load all game assets here
    // Example: this.load.image('background', 'assets/background.png');
    // this.load.image('background', './../../assets/images/StartSceneBG.jpg');
    // this.load.image('buttonDF', 'assets/images/button_df.png');
    // this.load.image('bouncingImage', 'assets/images/yb.png');
    // this.load.image('buttonNumberline', 'assets/images/buttonNL.png');
    
    
    // this.load.image("dropZone", "assets/images/basket.png");
    // this.load.image("done", "assets/images/done_b.png");
    // this.load.image("reset", "assets/images/reset_b.png");


  }

  create() {
    // Proceed to the Start Scene after loading assets
    this.scene.start('StartScene');
  }
}

export default PreloadScene;
