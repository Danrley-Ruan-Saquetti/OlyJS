import { Keys } from '../enums/index.js'
import { InputManager } from '../managers/index.js'

export class Input {

  static isKeyDown(...keys: Keys[]) {
    return InputManager.keyboard.isKeyDown(...keys)
  }

  static getKeysPressed() {
    return InputManager.keyboard.getKeysPressed()
  }
}