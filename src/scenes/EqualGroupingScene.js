import { scoreTextStyling } from '../objectsCreators/styling.css';
import { createDropZone, createObject, createScorBoard, showScoreBoardResult, checkScore, winEmmiter } from './../objectsCreators/EqualGroupingObjectCreator';
import { getRandomInt } from './../misc/util';

export default class EqualGroupingScene extends Phaser.Scene {
  constructor() {
    super({ key: "EqualGroupingScene" });
  }
  

  preload() {
    this.load.image("background", "./../../assets/images/StartSceneBG.jpg");
    // this.load.image("object", "assets/images/yb.png");
    this.load.image("fr1", "assets/images/fr1.png");
    this.load.image("fr2", "assets/images/fr2.png");
    this.load.image("fr3", "assets/images/fr3.png");
    this.load.image("fr4", "assets/images/fr4.png");
    this.load.image("fr5", "assets/images/fr5.png");
    this.load.image("fr6", "assets/images/fr6.png");
    // this.load.image("object", "assets/images/fr6.png");

    this.load.image("dropZone", "assets/images/basket.png");
    this.load.image("done", "assets/images/done_b.png");
    this.load.image("reset", "assets/images/reset_b.png");
    this.load.image("resultBoardImage", "assets/images/resultBoardImage.png");

    this.load.image("particle", "assets/images/leaf1.png");

    this.load.audio('click', 'assets/sounds/click.wav');
    this.load.audio('errorclick', 'assets/sounds/errorclick.wav');

  }

  create() {

    const scW = this.cameras.main.width;
    const scH = this.cameras.main.height;

    let numOfGroups = getRandomInt(5);
    let totalObjects = numOfGroups * getRandomInt(3) ;

    // background
    const background = this.add.image(0, 0, 'background').setScale(0.5,0.5).setOrigin(0, 0);
    const resultBoardImage = this.add.image(0, 0, 'resultBoardImage').setOrigin(0, 0);

    const scoreBoardContainer =  createScorBoard(this, scW, scH, resultBoardImage);

    // done button 
        const done = this.add.image(
          this.cameras.main.width *4 / 5,
          this.cameras.main.height *9 / 10,
          'done'
        ).setScale(0.5,0.5).setInteractive();


            // Add an event listener to the button
    done.on('pointerup', () => {
      scoreBoardContainer.scoreBoard.depth = 2;
      const restulText = checkScore(this.dropZones ,  totalObjects, numOfGroups)
      console.log(' restulText ',restulText)
      if(scoreBoardContainer.scoreBoard.visible){
        scoreBoardContainer.scoreBoard.setVisible(false)
      } else{
        if(restulText.toLocaleLowerCase().indexOf('won') != -1 ){
          winEmmiter(this);
          reset.input.enabled = true;
          reset.setAlpha(1);
        } else {
          reset.input.enabled = false;
          reset.setAlpha(0.5);
        }
        showScoreBoardResult(scoreBoardContainer,resultBoardImage,restulText)
      }

      
      this.sound.play('click');

    });


    // reset button 
        const reset = this.add.image(
          0,
          0,
          'reset'
        ).setScale(0.5,0.5).setInteractive();

        const buttonContainer = this.add.container(this.cameras.main.width *5 / 10,
        this.cameras.main.height *9 / 10, [reset]);
        buttonContainer.setSize(reset.width+20, reset.height+20);
        buttonContainer.setInteractive();

      // Add an event listener to the button
      reset.on('pointerup', () => {

        // this.scene.restart();
      this.dropZones.children.iterate(item => item.data = null)
      this.objects.children.iterate(item => item.data = null)
      const gameScene = this.scene.get('EqualGroupingScene');
      gameScene.scene.restart();

    });


    buttonContainer.on('pointerdown', () => {
      // this.sound.play('click');

      console.log(' cleed ')

      if(reset.input.enabled){
        this.sound.play('click');
      }else {
        this.sound.play('errorclick');
      }

    });




    // Create object and drop zone groups
    this.dropZones = this.add.group();
    this.objects = this.add.group();

    // Set gravity to 0
    this.physics.world.gravity.y = 0;

    this.createObjects(totalObjects);
    this.createDropZones(numOfGroups);
    this.writeText();

  }

  update() {
    // Update the game state, such as checking if the player has won the level
  }

  updateScore() {

  }

  checkOverlap(object, dropZone) {
    // console.log( " object, dropZone collided ??" + object.data["oIndex"] + "  " + dropZone.data["bIndex"] );
    let obs = dropZone.data.objects;
    if(!obs.includes(object)){
      obs.push(object);
      dropZone.data.objects = obs;
      console.log(dropZone.data.bIndex+' includes.data.set '+dropZone.data.objects.length)
    }
    
  }

  createDropZones(numOfGroups) {
    var zoneWidth = 200;
    // var zoneHeight = 200;
    // const numObjects = 4;
    
    const scW = this.cameras.main.width;
    const scH = this.cameras.main.height;

    const totalWIdthOccupied = zoneWidth * numOfGroups;
    const leftWidth = scW - totalWIdthOccupied;
    const spacePer = (leftWidth/numOfGroups);

    // console.log(' totalWIdthOccupied '+totalWIdthOccupied+' leftWidth '+leftWidth+' spacePer '+spacePer )

    for (let index = 0; index < numOfGroups; index++) {
      const newX = zoneWidth * index + spacePer * index;
    createDropZone( newX, 300, "dropZone", index, this);
    }



  }


  createObjects(totalObjects) {
    console.log(' creating totalObjects objects '+totalObjects)
    for (let index = 1; index <= totalObjects; index++) {
      createObject(50 * index, 100, "fr"+getRandomInt(6), index,this);
    }
  }


  writeText() {
    // Create the instructions and score text
    this.instructionsText = this.add.text(
      50,
      470,
      "Drag and drop the objects into equal groups",
      // { fontSize: "24px", fill: "#000" }
      scoreTextStyling
    );
  }
}
