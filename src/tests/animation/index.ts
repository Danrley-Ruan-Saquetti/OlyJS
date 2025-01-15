import { Game } from '../../index.js'
import { Player } from './entities/player.entity.js'

export class AnimationGame extends Game {

  player: Player
  playerSpriteImage: HTMLImageElement

  async bootstrap() {
    await super.bootstrap()

    const playerSpriteImage = new Image()
    playerSpriteImage.src = '../../../assets/player-sprite.png'

    await new Promise(resolve => playerSpriteImage.addEventListener('load', resolve))

    this.playerSpriteImage = playerSpriteImage
  }

  protected initializeScene() {
    super.initializeScene()

    this.player = new Player(this.playerSpriteImage)

    this.addGameObject(this.player)
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
  const game = await AnimationGame.Bootstrap(canvas)
  game.start()
}

app()
