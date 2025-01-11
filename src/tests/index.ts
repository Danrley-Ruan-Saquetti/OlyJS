import { Game } from '../core/game.js'
import { IGameObject } from '../interfaces/game-object.interface.js'

class Play implements IGameObject {

  start() {
  }

  update() {
  }
}

export class OlyGame extends Game {

  initComponents() {
    this.addGameObject(new Play())
  }
}

new OlyGame().start()