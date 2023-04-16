import Phaser from 'phaser';
import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import EqualGroupingScene from './scenes/EqualGroupingScene.js';
import NumberlineGameScene from './scenes/NumberlineGameScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene';
import PreloadScene from './scenes/PreloadScene';
import GameOverScene from './scenes/GameOverScene.js';


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  plugins: {
    global: [{ key: 'Tween', plugin: Phaser.Tweens.TweenPlugin, start: true }]
  },
  scene: [StartScene, GameScene, EqualGroupingScene, NumberlineGameScene, LevelCompleteScene, PreloadScene, GameOverScene],
};

const game = new Phaser.Game(config);

function preload() {
    console.log(' preload ');
}

function create() {
    this.scene.start('StartScene')

}

function update() {}
