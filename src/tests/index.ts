import { GameObject } from '../entities/index.js'
import { Game } from '../core/game.js'
import { DeltaTime } from '../utils/delta-time.js'
import { Input } from '../states/input.state.js'
import { Keys } from '../enums/key.enum.js'

class Player extends GameObject {

  update(deltaTime: DeltaTime): void {
    if (Input.keyboard.isKeyDown(Keys.KeyW)) {
      console.log('DOWN')
    }
  }
}

export class OlyGame extends Game {

  private player: Player

  initComponents() {
    super.initComponents()

    this.player = new Player()

    this.addGameObject(this.player)
  }
}

new OlyGame().start()