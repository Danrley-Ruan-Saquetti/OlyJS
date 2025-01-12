import { IVector2 } from './../interfaces/index.js'
import { Buttons } from '../enums/index.js'
import { Vector2 } from '../utils/index.js'

export class MouseRepository {

  private _buttons = new Map<Buttons, boolean>()
  private _lastPosition: IVector2 = { x: 0, y: 0 }
  private _position = new Vector2()
  private _isMouseMoving = false
  private _isDoubleClick = false

  get lastPosition() { return this._lastPosition }
  get displacement() { return Vector2.subtraction(this._lastPosition, this._position) }
  get position() { return this._position }
  get isMouseMoving() { return this._isMouseMoving }
  get isDoubleClick() { return this._isDoubleClick }

  mouseMove({ x, y }: IVector2) {
    this._isMouseMoving = true
    this._lastPosition = this._position.toJSON()
    this._position.x = x
    this._position.y = y
  }

  dispose() {
    this._isDoubleClick = false
  }

  mouseStop() {
    this._isMouseMoving = false
  }

  doubleClick() {
    this._isDoubleClick = true
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