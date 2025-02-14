import { Buttons, DeltaTime, Game, Input, Timeout } from '../../index.js'
import { Ball } from './entities/ball.js'
import { CameraFollowMouse } from './entities/camera-follow-mouse.entity.js'
import { Enemy } from './entities/enemy.js'
import { Floor } from './entities/floor.js'
import { FPSView } from './entities/fps.entity.js'
import { Player } from './entities/player.js'

class PothioGame extends Game {

  private player: Player
  private cooldown = 500
  private isCooldown = false

  protected initializeScene() {
    super.initializeScene()

    this.player = new Player()

    this.addGameObject(
      new Floor(this.canvas),
      new FPSView(),
      this.player,
      new CameraFollowMouse(this.player, this.cameraGameObject),
      ...Array.from({ length: 5 }).map(() => new Enemy(this.player))
    )
  }

  start() {
    super.start()

    Timeout.setInterval(() => {
      this.addGameObject(
        new Enemy(this.player)
      )
    }, 1_000)
  }

  update(deltaTime: DeltaTime) {
    if (Input.mouse.isButtonDown(Buttons.LEFT)) {
      if (!this.isCooldown) {
        this.addGameObject(
          new Ball(this.player.transform.position.clone(), Input.mouse.positionReal.clone())
        )

        this.isCooldown = true
        Timeout.setTimeout(() => {
          this.isCooldown = false
        }, this.cooldown)
      }
    }
  }
}

const canvas = document.querySelector<HTMLCanvasElement>('canvas#canvas-game')!

window.addEventListener('resize', resizeCanvas)

resizeCanvas()
app()

function resizeCanvas() {
  const displayWidth = window.innerWidth
  const displayHeight = window.innerHeight

  const scale = 1

  canvas.style.width = displayWidth + 'px'
  canvas.style.height = displayHeight + 'px'
  canvas.width = displayWidth * scale
  canvas.height = displayHeight * scale
}

async function app() {
  const game = await PothioGame.Bootstrap(canvas)

  game.start()
}
