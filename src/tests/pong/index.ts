import { Game, Input, Keys } from '../../index.js'
import { Player } from './entities/player.entity.js'
import { IAPlayer } from './entities/ia-player.js'
import { RacketPlayer } from './entities/player-racket.entity.js'

export class PongGame extends Game {

  private players: RacketPlayer[]

  protected prepareObjects() {
    super.prepareObjects()

    this.players = [
      new Player(),
      new IAPlayer()
    ]

    this.addGameObject(
      ...this.players
    )
  }

  protected initializeObjects() {
    super.initializeObjects()

    this.players[0].transform.moveTo({
      x: -(this.canvas.width / 2) + 10,
      y: -10,
      z: 0
    })
    this.players[1].transform.moveTo({
      x: (this.canvas.width / 2) - 20,
      y: -10,
      z: 0
    })
  }

  update(): void {
    if (Input.keyboard.isKeyDown(Keys.Escape)) {
      console.log(this)
    }
  }
}
const game = new PongGame(
  document.querySelector<HTMLCanvasElement>('canvas#canvas-game')!
)

game.start()