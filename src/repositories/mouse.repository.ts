import { IVector2 } from './../interfaces/index.js'
import { Buttons, WheelType } from '../enums/index.js'
import { Vector2 } from '../utils/index.js'

export type WheelEvent = {
  type?: WheelType
}

export class MouseRepository {

  private _buttons = new Map<Buttons, boolean>()
  private _lastPosition = new Vector2()
  private _position = new Vector2()
  private _isMouseMoving = false
  private _isDoubleClick = false
  private _wheel: WheelEvent | null = null

  get lastPosition() { return this._lastPosition }
  get offset() { return Vector2.subtraction(this._position, this._lastPosition) }
  get position() { return this._position }
  get isMouseMoving() { return this._isMouseMoving }
  get isDoubleClick() { return this._isDoubleClick }

  mouseMove({ x, y }: IVector2) {
    this._isMouseMoving = true
    this._lastPosition = this._position.clone()
    this._position.x = x
    this._position.y = y
  }

  dispose() {
    this._isDoubleClick = false
    this._wheel = null
  }

  mouseStop() {
    this._isMouseMoving = false
    this._lastPosition = this._position.clone()
  }

  doubleClick() {
    this._isDoubleClick = true
  }

  wheel(type: WheelType) {
    this._wheel = {
      type
    }
  }

  buttonPressed(button: Buttons) {
    this._buttons.set(button, true)
  }

  buttonReleased(button: Buttons) {
    this._buttons.delete(button)
  }

  isButtonDown(button: Buttons) {
    return this._buttons.get(button) || false
  }

  isWheelUp() {
    return this._wheel?.type == 'UP'
  }

  isWheelDown() {
    return this._wheel?.type == 'DOWN'
  }
}
