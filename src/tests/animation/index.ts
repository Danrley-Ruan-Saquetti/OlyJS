import { DeltaTime, Game, Input, Keys } from '../../index.js'
import { FloorEntity } from './entities/floor.entity.js'
import { FPSView } from './entities/fps.entity.js'
import { Player } from './entities/player.entity.js'

export class AnimationGame extends Game {

  player: Player
  playerSpriteImage: HTMLImageElement

  protected async loadAssets() {
    const playerSpriteImage = new Image()
    playerSpriteImage.src = '../../../assets/player-sprite.png'

    await new Promise(resolve => playerSpriteImage.addEventListener('load', resolve))

    this.playerSpriteImage = playerSpriteImage
  }

  protected initializeScene() {
    super.initializeScene()

    this.player = new Player(this.playerSpriteImage)

    this.addGameObject(
      new FPSView(),
      new FloorEntity(),
      this.player,
    )
  }

  protected initializeObjects() {
    super.initializeObjects()

    this.cameraGameObject.follow(this.player.transform.position)
  }

  update(deltaTime: DeltaTime): void {
    if (Input.keyboard.isKeyDown(Keys.Escape)) {
      console.clear()
    }
  }
}

const canvas = document.querySelector<HTMLCanvasElement>('canvas#canvas-game')!

async function app() {
  const game = await AnimationGame.Bootstrap(canvas)
  game.start()
}

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
