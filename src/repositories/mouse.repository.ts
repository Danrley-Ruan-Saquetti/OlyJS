import { Buttons } from "../enums/index.js";
import { IVector2 } from "../interfaces/index.js";

export class MouseRepository {

  private position: IVector2 = { x: 0, y: 0 }
  private offset: IVector2 = { x: 0, y: 0 }

  private buttonsPressed = new Map<Buttons, true>()
  private buttonsClicked = new Map<Buttons, true>()

  private _isDoubleClick = false

  private _wheel = 0

  get horizontal() { return this.offset.x }
  get vertical() { return this.offset.y }

  get isDoubleClick() { return this._isDoubleClick }

  get wheel() { return this._wheel }

  dispose() {
    this.buttonsPressed.clear()
    this._isDoubleClick = false
    this._wheel = 0
  }

  move({ x, y }: IVector2) {
    this.offset = {
      x: this.position.x - x,
      y: this.position.y - y,
    }

    this.position = { x, y }
  }

  buttonDown(button: Buttons) {
    this.buttonsClicked.set(button, true)
  }

  buttonUp(button: Buttons) {
    this.buttonsClicked.delete(button)
  }

  buttonPressed(button: Buttons) {
    this.buttonsPressed.set(button, true)
  }

  doubleClick() {
    this._isDoubleClick = true
  }

  scroll(value: number) {
    this._wheel = Math.sign(value)
  }

  isButtonPressed(button: Buttons) {
    return !!this.buttonsPressed.get(button)
  }

  isButtonDown(button: Buttons) {
    return !!this.buttonsClicked.get(button)
  }
}