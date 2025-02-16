import { Buttons, Keys } from '../enums/index.js'
import { InputManager } from '../managers/index.js'

export class InputState {

  static get lastPosition() { return InputManager.mouse.lastPosition }
  static get offset() { return InputManager.mouse.offset }
  static get offsetReal() { return InputManager.mouse.offsetReal }
  static get position() { return InputManager.mouse.position }
  static get positionReal() { return InputManager.mouse.positionReal }
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
