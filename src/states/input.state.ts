import { Buttons, Keys } from '../enums/index.js'
import { InputManager } from '../managers/index.js'

export class InputState {

  static get lastPositionWindow() { return InputManager.mouse.lastPositionWindow }
  static get offset() { return InputManager.mouse.offset }
  static get offsetWindow() { return InputManager.mouse.offsetWindow }
  static get positionWindow() { return InputManager.mouse.positionWindow }
  static get position() { return InputManager.mouse.position }
  static get isMouseMoving() { return InputManager.mouse.isMouseMoving }
  static get isDoubleClick() { return InputManager.mouse.isDoubleClick }
  static get isWheelUp() { return InputManager.mouse.isWheelUp }
  static get isWheelDown() { return InputManager.mouse.isWheelDown }

  static isButtonDown(button: Buttons) {
    return InputManager.mouse.isButtonDown(button)
  }

  static isKeyDown(...keys: Keys[]) {
    return InputManager.keyboard.isKeyDown(...keys)
  }

  static getKeysPressed() {
    return InputManager.keyboard.getKeysPressed()
  }
}
