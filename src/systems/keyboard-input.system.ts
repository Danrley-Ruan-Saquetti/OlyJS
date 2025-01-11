import { Keys } from '../enums/index.js'
import { Input } from '../states/input.state.js'
import { GameSystem } from './system.js'

export class KeyboardSystem extends GameSystem {

  constructor() {
    super()
  }

  start() {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  stop() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    Input.keyboard.press(Keys[event.code])
  }

  private onKeyUp = (event: KeyboardEvent) => {
    Input.keyboard.release(Keys[event.code])
  }
}