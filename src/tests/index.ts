import { GameObject } from '../components/game-object.js'
import { Game } from '../core/game.js'

class Play extends GameObject {

}

export class OlyGame extends Game {

  initComponents() {
    super.initComponents()

    this.addGameObject(new Play())
  }
}

new OlyGame().start()