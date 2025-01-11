import { GameObject } from '../entities/index.js'
import { Game } from '../core/game.js'

class Player extends GameObject {

}

export class OlyGame extends Game {

  private player = new Player()

  initComponents() {
    super.initComponents()

    this.addGameObject(this.player)
  }
}

new OlyGame().start()