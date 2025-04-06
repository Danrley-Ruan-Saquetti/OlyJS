import {
  Buttons,
  DeltaTime,
  Game,
  GameObject,
  Input,
  Keys,
  RectangleComponent
} from '../../index.js'
import { getCanvas } from '../common.js'

class Player extends GameObject {

  start() {
    this.addComponent(RectangleComponent)
  }

  update(deltaTime: DeltaTime) {
  }
}

class OlyGame extends Game {

  protected initializeScene() {
    this.instantiate(Player)

    this.camera.scale.x = this.canvas.width
    this.camera.scale.y = this.canvas.height
  }

  update() {
    super.update()

    if (Input.isKeyDown(Keys.Escape)) {
      console.clear()
    }
    if (Input.isButtonPressed(Buttons.MIDDLE)) {
      console.log(this)
    }
  }
}

async function app() {
  const game = new OlyGame(getCanvas('canvas#canvas-game'))
  await game.bootstrap()
  game.run()
}

app()
