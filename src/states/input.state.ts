import { Keys, Buttons } from '../enums/index.js'
import { InputManager } from '../managers/index.js'

export class Input {

  static get horizontal() { return InputManager.mouse.horizontal }
  static get vertical() { return InputManager.mouse.vertical }

  static get isDoubleClick() { return InputManager.mouse.isDoubleClick }

  static get wheel() { return InputManager.mouse.wheel }

  static isKeyDown(key: Keys) {
    return InputManager.keyboard.isKeyDown(key)
  }

  static isButtonDown(button: Buttons) {
    return InputManager.mouse.isButtonDown(button)
  }

  static isButtonPressed(button: Buttons) {
    return InputManager.mouse.isButtonPressed(button)
  }
}