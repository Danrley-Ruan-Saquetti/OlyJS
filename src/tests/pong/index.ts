import { Game } from '../../index.js'
import { Player } from './entities/player.entity.js'

export class OlyGame extends Game {

  private players: Player[]

  initComponents() {
    super.initComponents()

    this.players = []

    this.players.push(new Player())
    this.players.push(new Player())

    this.addGameObject(...this.players)
  }
}

new OlyGame().start()