import { GameObject } from '../components/game-object.js'
import { Game } from '../core/game.js'

class Play extends GameObject {

}

export class OlyGame extends Game {

  initComponents() {
    this.addGameObject(new Play())
  }
}

new OlyGame().start()