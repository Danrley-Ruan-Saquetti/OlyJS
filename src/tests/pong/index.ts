import { Game, InputState, Keys, Timer } from '../../index.js'
import { Player } from './entities/player.entity.js'
import { IAPlayer } from './entities/ia-player.entity.js'
import { RacketPlayer } from './entities/player-racket.entity.js'
import { Ball } from './entities/bal.entity.js'
import { Table } from './entities/table.entity.js'
import { FPSView } from './entities/fps.entity.js'

export class PongGame extends Game {

  private players: RacketPlayer[]
  private ball: Ball
  private table: Table

  protected initializeScene() {
    super.initializeScene()

    this.players = [
      new Player(),
      new IAPlayer()
    ]
    this.table = new Table()
    this.ball = new Ball(this.table)

    this.addGameObject(
      this.table,
      ...this.players,
      this.ball,
      new FPSView()
    )
  }

  protected initializeObjects() {
    super.initializeObjects()

    this.players[0].transform.moveTo({
      x: -(this.canvas.width / 2) + 15,
      y: -40,
      z: 0,
    })
    this.players[1].transform.moveTo({
      x: (this.canvas.width / 2) - 30,
      y: -40,
      z: 0,
    })
    this.table.transform.moveTo({
      x: -(this.canvas.width / 2),
      y: -(this.canvas.height / 2),
      z: 0,
    })
  }

  update() {
    if (InputState.isKeyDown(Keys.Escape)) {
      console.clear()
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

async function app() {
  const game = await PongGame.Bootstrap(canvas)
  game.start()

  // @ts-expect-error
  Module().then(instance => {
    const timer = new Timer()
    console.log(instance._fatorial(24))
    timer.next()

    console.log(timer)

    timer.reset()
    console.log(fatorial(24))
    timer.next()

    console.log(timer)
  })
}
app()

function fatorial(value: number) {
  if (value <= 1) {
    return 1
  }

  return value * fatorial(value - 1)
}
