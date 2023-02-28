import { scoreTextStyling } from "./styling.css";

export const createDropZone = (x, y, imageKey, index,_this) => {
  // console.log(' createDropZone at '+x+', '+y)
    let zw = 200, zh = 100;
    const zone = _this.physics.add.image(x, y, imageKey).setOrigin(0, 0);
    zone.setInteractive();
    zone.data = { bIndex: index };
    zone.data.objects =  [];
    _this.dropZones.add(zone);

    // console.log(' zone '+zone.height+ ' '+zone.width)

  }

export const createObject = (x, y, imageKey, index, _this) => {
    const obj = _this.physics.add.image(x, y, imageKey).setScale(0.5);
    obj.setInteractive();
    obj.data = { oIndex: index };

    _this.input.setDraggable(obj);
    // Add a drag event listener to the sprite
    _this.input.on("drag", (pointer, obj, dragX, dragY) => {
      // Update the position of the sprite during drag
      obj.x = dragX;
      obj.y = dragY;
      _this.children.bringToTop(obj);
      updateOverlap(_this.objects,_this.dropZones,_this)
    });

    _this.objects.add(obj);
  }

  export const updateOverlap = (objects,dropZones, _this) => {

    objects.children.iterate((ball) => {
      dropZones.children.iterate((basket) => {
        const overlap = _this.physics.overlap(basket, ball);
          updateZoneObjects(ball,basket,overlap)
      });
    });

    // dropZones.children.iterate(basket => console.log(' basket len '+basket.data.bIndex+'  '+basket.data.objects.length))
    
  }

  export const updateZoneObjects = (ball,basket,overlap) => {

    if(overlap){

      if(!basket.data.objects.includes(ball)){
        basket.data.objects.push(ball)
      } 

    }else {

      if(basket.data.objects.includes(ball)){
        const toBeR = ball.data.oIndex
        basket.data.objects = basket.data.objects.filter(item=> item.data.oIndex != toBeR )
      } 

    }
  
  }

  export const checkScore = (dropzones, totalObjects, numOfGroups) =>{
    let correctZones = 0;
    const countPerZone = totalObjects / dropzones.children.size;
    console.log(' countPerZone '+countPerZone+ ' dropzones.length '+dropzones.children.size + ' ',dropzones)

    dropzones.children.iterate(zone => {
      console.log(' zone.data.objects.length '+zone.data.objects.length)
      if(zone.data.objects.length === countPerZone){
        correctZones++;
      }else{
        zone.data.isWrong = true;
      }
    })

    console.log(' correctZones '+correctZones+ ' dropzones.children.size '+dropzones.children.size+ ' ')

    if( (correctZones === dropzones.children.size)){
      return ' you won !'
    }else{
      return ' Try again !'
    }
    

  }


  export const createScorBoard = (_this,scW, scH, resultBoardImage, testToBeDisplayed) =>{
    // show score or level 
        // const scoreText = this.add.text(resultBoardImage.width/2 - 50, resultBoardImage.height/2 + 35, 'Sorry Try again !', scoreTextStyling);
        const scoreText = _this.add.text(0, 0, testToBeDisplayed, scoreTextStyling);
        const scoreBoard = _this.add.container(scW/2 - resultBoardImage.width/2, scH/2 - resultBoardImage.height/2, [resultBoardImage, scoreText]);
        scoreBoard.setVisible(false); // You can set it visible here if you want
        _this.add.existing(scoreBoard); 

        const resultBoardBounds = resultBoardImage.getBounds();
        const scoreTextBounds = scoreText.getBounds();
        scoreText.setX(resultBoardBounds.width/2 - scoreTextBounds.width / 2);
        scoreText.setY(resultBoardBounds.height*2/3 );

        return {scoreBoard , scoreText};
  }

  
  export const showScoreBoardResult = (scoreBoardContainer, resultBoardImage, testToBeDisplayed) =>{
    console.log(' testToBeDisplayed ',testToBeDisplayed)
    scoreBoardContainer.scoreText.text = testToBeDisplayed;
    const resultBoardBounds = resultBoardImage.getBounds();
    const scoreTextBounds = scoreBoardContainer.scoreText.getBounds();
    
    scoreBoardContainer.scoreText.setX(resultBoardBounds.width/2 - scoreTextBounds.width / 2);
    scoreBoardContainer.scoreText.setY(resultBoardBounds.height*2/3 );
    scoreBoardContainer.scoreBoard.bringToTop();
    scoreBoardContainer.scoreBoard.setVisible(true); // You can set it visible here if you want
  }

export const winEmmiter = (_this) => {
  const particles = _this.add.particles(['particle']);
  // const particles = _this.add.particles(['particle']);
  
  const emitter = particles.createEmitter({
    x: 400,
    y: 300,
    frames: ['particle'],
    speed: 150,
    angle: { min: 0, max: 360 },
    // gravityY: 100,
    lifespan: 1200,
    blendMode: 'ADD',
    frequency: 200,
    quantity: 10,
    scale: { start: 1, end: 0 },
    alpha: { start: 1, end: 0.5 },
    rotate: { start: 0, end: 360 },
    on: false
});

emitter.start({on: true});

  // stop emitter after 3 seconds
setTimeout(() => {
  emitter.stop();
}, 3000);


}