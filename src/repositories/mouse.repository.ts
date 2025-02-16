import { IVector2 } from './../interfaces/index.js'
import { Buttons, WheelType } from '../enums/index.js'
import { Vector2 } from '../utils/index.js'

export type WheelEvent = {
  type?: WheelType
}

export class MouseRepository {

  private _buttons = new Map<Buttons, boolean>()
  private _lastPosition = new Vector2()
  private _lastPositionWindow = new Vector2()
  private _position = new Vector2()
  private _positionWindow = new Vector2()
  private _isMouseMoving = false
  private _isDoubleClick = false
  private _wheel: WheelEvent | null = null

  get lastPositionWindow() { return this._lastPositionWindow }
  get offsetWindow() { return Vector2.subtraction(this._positionWindow, this._lastPositionWindow) }
  get offset() { return Vector2.subtraction(this._position, this._lastPosition) }
  get positionWindow() { return this._positionWindow }
  get position() { return this._position }
  get isMouseMoving() { return this._isMouseMoving }
  get isDoubleClick() { return this._isDoubleClick }
  get isWheelUp() { return this._wheel?.type == 'UP' }
  get isWheelDown() { return this._wheel?.type == 'DOWN' }

  mouseMove(positionWindow: IVector2, position: IVector2 = positionWindow) {
    this._isMouseMoving = true
    this._lastPositionWindow = this._positionWindow.clone()
    this._lastPosition = this._position.clone()
    this._positionWindow.x = positionWindow.x
    this._positionWindow.y = positionWindow.y
    this._position.x = position.x
    this._position.y = position.y
  }

  dispose() {
    this._isDoubleClick = false
    this._wheel = null
    this.mouseStop()
  }

  mouseStop() {
    this._isMouseMoving = false
    this._lastPositionWindow = this._positionWindow.clone()
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
}
