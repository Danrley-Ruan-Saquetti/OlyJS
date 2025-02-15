import { Buttons, DeltaTime, Game, Input, Timeout } from '../../index.js'
import { Ball } from './entities/ball.js'
import { Enemy } from './entities/enemy.js'
import { Floor } from './entities/floor.js'
import { Player } from './entities/player.js'
import { FPSView } from './entities/fps.entity.js'
import { CameraFollowMouse } from './entities/camera-follow-mouse.entity.js'
import { UIGame } from './entities/ui.js'

class PothioGame extends Game {

  private player: Player

  private enemies: Enemy[] = []
  private balls: Ball[] = []

  protected initializeScene() {
    super.initializeScene()

    this.player = new Player()

    this.addGameObject(
      new Floor(this.canvas),
      new FPSView(),
      this.player,
      new CameraFollowMouse(this.player, this.cameraGameObject),
      new UIGame(this.player, this.canvas)
    )
  }

  start() {
    super.start()

    Timeout.setInterval(() => {
      this.addEnemy()
    }, 1_000)
  }

  update(deltaTime: DeltaTime) {
    if (Input.mouse.isButtonDown(Buttons.LEFT)) {
      if (this.player.canShoot()) {
        this.player.shoot()
        this.addBall()
      }
    }

    this.checkCollisionBallEnemy()
  }

  checkCollisionBallEnemy() {
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i]

      for (let j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j]

        const enemyBounds = enemy.getBounds()

        if (ball.isIntersecting({
          ...enemyBounds,
          x: enemyBounds.left,
          y: enemyBounds.top
        })) {
          ball.destroy()
          enemy.destroy()

          this.balls.splice(i, 1)
          this.enemies.splice(j, 1)
          break
        }
      }
    }
  }

  private addEnemy() {
    const enemy = new Enemy(this.player)
    this.addGameObject(enemy)

    this.enemies.push(enemy)
  }

  private addBall() {
    const ball = new Ball(this.player.transform.position.clone(), Input.mouse.positionReal.clone())
    this.addGameObject(ball)

    this.balls.push(ball)
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
