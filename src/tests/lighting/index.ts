import { Buttons, DeltaTime, Game, Input } from '../../index.js'
import { Box } from './entities/box.js'
import { FPSView } from './entities/fps.entity.js'
import { Light } from './entities/light.js'

class LightingGame extends Game {

  boxes: Box[] = []
  boxSelected: Box | null = null

  protected initializeScene() {
    super.initializeScene()

    this.boxes = Array
      .from({ length: 5 })
      .map(() => new Box())

    this.addGameObject(
      new FPSView(),
      ...this.boxes,
      new Light()
    )
  }

  update(deltaTime: DeltaTime) {
    if (Input.mouse.isButtonDown(Buttons.LEFT)) {
      if (!this.boxSelected) {
        this.boxSelected = this.getBoxSelected()
      }
    } else {
      this.boxSelected = null
    }

    this.boxSelected?.dragging(deltaTime)
  }

  getBoxSelected() {
    for (let i = 0; i < this.boxes.length; i++) {
      if (this.boxes[i].checkCollision(Input.mouse.position)) {
        return this.boxes[i]
      }
    }

    return null
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
  const game = await LightingGame.Bootstrap(canvas)

  game.start()
}
