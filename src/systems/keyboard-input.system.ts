import { Keys } from '../enums/index.js'
import { Input } from '../utils/index.js'
import { GameSystem } from './system.js'

export class KeyboardSystem extends GameSystem {

  start() {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('blur', this.onWindowFocusOut)
  }

  stop() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('blur', this.onWindowFocusOut)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    Input.keyboard.press(Keys[event.code])
  }

  private onKeyUp = (event: KeyboardEvent) => {
    Input.keyboard.release(Keys[event.code])
  }

  private onWindowFocusOut = () => {
    Input.keyboard.clear()
  }
}