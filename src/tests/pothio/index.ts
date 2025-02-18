import { Buttons, CameraFollowSystem, DeltaTime, Game, InputState, Timeout } from '../../index.js'
import { Ball } from './entities/ball.js'
import { Enemy } from './entities/enemy.js'
import { Floor } from './entities/floor.js'
import { Player } from './entities/player.js'
import { FPSView } from './entities/fps.entity.js'
import { Coin } from './entities/coin.js'
import { MouseAim } from './entities/mouse-aim.js'

class PothioGame extends Game {

  private cameraFollowSystem = new CameraFollowSystem()

  private player: Player

  private enemies: Enemy[] = []
  private balls: Ball[] = []
  private coins: Coin[] = []

  get isPlayerAlive() { return this.player.health.isAlive }

  protected initializeScene() {
    super.initializeScene()

    this.player = new Player()

    this.addGameObject(
      new Floor(this.canvas),
      new FPSView(),
      this.player,
      new MouseAim(),
    )

    this.cameraFollowSystem.setCameraGameObject(this.cameraGameObject)
    this.cameraFollowSystem.setTarget(this.player)
  }

  protected initializeEngine() {
    super.initializeEngine()

    this.addGameSystem(
      this.cameraFollowSystem
    )
  }

  start() {
    super.start()

    Timeout.setInterval(() => {
      this.addEnemy()
    }, 1_000)

    Timeout.setInterval(() => {
      this.addCoin()
    }, 1_000)
  }

  update(deltaTime: DeltaTime) {
    if (this.isPlayerAlive) {
      this.updateGame()
    }
    else {
      this.updateGameOver()
    }
  }

  updateGame() {
    if (InputState.isButtonDown(Buttons.LEFT)) {
      if (this.player.canShoot()) {
        this.player.shoot()
        this.addBall()
      }
    }

    this.checkCollisionBallEnemy()
    this.checkCollisionPlayerCoin()
    this.checkCollisionPlayerEnemy()
  }

  updateGameOver() {
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
          this.player.killEnemy()

          ball.destroy()
          enemy.destroy()

          this.balls.splice(i, 1)
          this.enemies.splice(j, 1)
          break
        }
      }
    }
  }

  checkCollisionPlayerCoin() {
    for (let j = 0; j < this.coins.length; j++) {
      const coin = this.coins[j]

      const bounds = coin.getBounds()

      if (this.player.isIntersecting({
        ...bounds,
        x: bounds.left,
        y: bounds.top
      })) {
        this.player.collectCoin()
        coin.destroy()

        this.coins.splice(j, 1)
        break
      }
    }
  }

  checkCollisionPlayerEnemy() {
    for (let j = 0; j < this.enemies.length; j++) {
      const enemy = this.enemies[j]

      const bounds = enemy.getBounds()

      if (this.player.isIntersecting({
        ...bounds,
        x: bounds.left,
        y: bounds.top
      })) {
        this.player.takeDamageEnemy()
        enemy.destroy()

        this.enemies.splice(j, 1)
        break
      }
    }
  }

  private addEnemy() {
    if (this.enemies.length > 15) {
      return
    }

    const enemy = new Enemy(this.player)
    this.addGameObject(enemy)

    this.enemies.push(enemy)
  }

  private addBall() {
    const ball = new Ball(this.player.transform.position.clone(), InputState.position.clone())
    this.addGameObject(ball)

    this.balls.push(ball)
  }

  private addCoin() {
    if (this.coins.length > 25) {
      return
    }

    const coin = new Coin()
    this.addGameObject(coin)

    this.coins.push(coin)
  }
}

const canvas = document.querySelector<HTMLCanvasElement>('canvas#canvas-game')!

canvas.style.cursor = 'none'

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
