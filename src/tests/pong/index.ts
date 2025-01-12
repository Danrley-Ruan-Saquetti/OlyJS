import { Game, Input, Keys } from '../../index.js'
import { Player } from './entities/player.entity.js'
import { IAPlayer } from './entities/ia-player.entity.js'
import { RacketPlayer } from './entities/player-racket.entity.js'
import { Ball } from './entities/bal.entity.js'
import { Table } from './entities/table.entity.js'

export class PongGame extends Game {

  private players: RacketPlayer[]
  private ball: Ball
  private table: Table

  protected prepareObjects() {
    super.prepareObjects()

    this.players = [
      new Player(),
      new IAPlayer()
    ]
    this.ball = new Ball()
    this.table = new Table()

    this.addGameObject(
      this.table,
      ...this.players,
      this.ball,
    )
  }

  protected initializeObjects() {
    super.initializeObjects()

    this.players[0].transform.moveTo({
      x: -(this.canvas.width / 2) + 15,
      y: -40,
      z: 0
    })
    this.players[1].transform.moveTo({
      x: (this.canvas.width / 2) - 30,
      y: -40,
      z: 0
    })
    this.table.transform.moveTo({
      x: -(this.canvas.width / 2),
      y: -(this.canvas.height / 2),
      z: 0,
    })
  }

  update() {
    if (Input.keyboard.isKeyDown(Keys.Escape)) {
      console.log(this)
    }
  }
}

const canvas = document.querySelector<HTMLCanvasElement>('canvas#canvas-game')!

const displayWidth = 800
const displayHeight = 400
const scale = 1

canvas.style.width = displayWidth + 'px'
canvas.style.height = displayHeight + 'px'
canvas.width = displayWidth * scale
canvas.height = displayHeight * scale

const game = new PongGame(canvas)

game.start()